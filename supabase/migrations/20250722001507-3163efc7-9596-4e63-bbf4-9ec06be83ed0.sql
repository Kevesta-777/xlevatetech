
-- Fix infinite recursion in admin_users RLS policies
-- Step 1: Create a security definer function to safely get current admin user
CREATE OR REPLACE FUNCTION public.get_current_admin_user()
RETURNS TABLE(id uuid, email varchar, role varchar, is_active boolean)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT au.id, au.email, au.role, au.is_active
  FROM public.admin_users au
  WHERE au.email = auth.jwt()->>'email'
  AND au.is_active = true
  LIMIT 1;
END;
$$;

-- Step 2: Create helper function to check if current user is super admin
CREATE OR REPLACE FUNCTION public.is_current_user_super_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM public.admin_users
  WHERE email = auth.jwt()->>'email'
  AND is_active = true;
  
  RETURN COALESCE(user_role = 'super_admin', false);
END;
$$;

-- Step 3: Drop existing problematic policies
DROP POLICY IF EXISTS "Admin users can view their own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;
DROP POLICY IF EXISTS "admin_access_policy" ON public.admin_users;

-- Step 4: Create new non-recursive policies
CREATE POLICY "admin_users_select_own" ON public.admin_users
FOR SELECT USING (
  email = auth.jwt()->>'email'
);

CREATE POLICY "admin_users_select_all_by_super_admin" ON public.admin_users
FOR SELECT USING (
  public.is_current_user_super_admin()
);

CREATE POLICY "admin_users_manage_by_super_admin" ON public.admin_users
FOR ALL USING (
  public.is_current_user_super_admin()
);

-- Step 5: Fix other tables that reference admin_users to prevent cascading recursion
-- Update log_admin_action function to use the new helper
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action VARCHAR(100),
  p_resource_type VARCHAR(50) DEFAULT NULL,
  p_resource_id VARCHAR(255) DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_admin_id uuid;
BEGIN
  -- Use the security definer function to get admin ID
  SELECT id INTO current_admin_id 
  FROM public.get_current_admin_user() 
  LIMIT 1;
  
  IF current_admin_id IS NOT NULL THEN
    INSERT INTO public.admin_audit_log (
      admin_user_id, action, resource_type, resource_id, details
    ) VALUES (
      current_admin_id, p_action, p_resource_type, p_resource_id, p_details
    );
  END IF;
END;
$$;

-- Step 6: Update admin sessions policy to use the helper function
DROP POLICY IF EXISTS "Admin users can view their own sessions" ON public.admin_sessions;
CREATE POLICY "admin_sessions_select_own" ON public.admin_sessions
FOR SELECT USING (
  admin_user_id IN (SELECT id FROM public.get_current_admin_user())
);
