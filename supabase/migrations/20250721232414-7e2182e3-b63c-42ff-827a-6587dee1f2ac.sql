
-- Fix RLS policies to prevent infinite recursion
-- The issue is that admin_users policies reference themselves when other tables query admin_users

-- Drop existing problematic policies on admin_users
DROP POLICY IF EXISTS "Admin users can view their own profile" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin users" ON public.admin_users;

-- Create new admin_users policies that don't cause recursion
-- These use direct auth.jwt() claims instead of querying admin_users table
CREATE POLICY "Admin users can view their own profile" ON public.admin_users
  FOR SELECT USING (email = (auth.jwt() ->> 'email')::text);

CREATE POLICY "Super admins can view all admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.email = (auth.jwt() ->> 'email')::text 
      AND au.role = 'super_admin' 
      AND au.is_active = true
    )
  );

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.email = (auth.jwt() ->> 'email')::text 
      AND au.role = 'super_admin' 
      AND au.is_active = true
    )
  );

-- Verify posts and resources policies are correct for public access
-- These should work for anonymous users
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Resources are viewable by everyone" ON public.resources;

CREATE POLICY "Posts are viewable by everyone" 
  ON public.posts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Resources are viewable by everyone" 
  ON public.resources 
  FOR SELECT 
  USING (true);

-- Recreate admin policies for posts and resources with better structure
DROP POLICY IF EXISTS "Admin users can manage posts" ON public.posts;
DROP POLICY IF EXISTS "Admin users can manage resources" ON public.resources;

CREATE POLICY "Admin users can manage posts" 
  ON public.posts 
  FOR ALL 
  USING (
    CASE 
      WHEN auth.jwt() IS NULL THEN false
      ELSE EXISTS (
        SELECT 1 FROM public.admin_users au 
        WHERE au.email = (auth.jwt() ->> 'email')::text 
        AND au.is_active = true 
        AND au.role IN ('super_admin', 'admin')
      )
    END
  );

CREATE POLICY "Admin users can manage resources" 
  ON public.resources 
  FOR ALL 
  USING (
    CASE 
      WHEN auth.jwt() IS NULL THEN false
      ELSE EXISTS (
        SELECT 1 FROM public.admin_users au 
        WHERE au.email = (auth.jwt() ->> 'email')::text 
        AND au.is_active = true 
        AND au.role IN ('super_admin', 'admin')
      )
    END
  );
