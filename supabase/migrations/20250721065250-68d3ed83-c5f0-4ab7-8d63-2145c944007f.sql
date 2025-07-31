-- Create function to get admin user details
CREATE OR REPLACE FUNCTION public.get_admin_user(user_email TEXT)
RETURNS TABLE (
  id UUID,
  email VARCHAR(255),
  role VARCHAR(50),
  last_login TIMESTAMP WITH TIME ZONE,
  mfa_enabled BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.role,
    au.last_login,
    au.mfa_enabled
  FROM public.admin_users au
  WHERE au.email = user_email 
    AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;