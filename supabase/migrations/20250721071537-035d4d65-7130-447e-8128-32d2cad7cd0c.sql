
-- Add raj.dalal@xlevatetech.com as a super admin user
INSERT INTO public.admin_users (email, role, is_active, mfa_enabled)
VALUES ('raj.dalal@xlevatetech.com', 'super_admin', true, false)
ON CONFLICT (email) DO UPDATE SET
  role = 'super_admin',
  is_active = true,
  mfa_enabled = false;
