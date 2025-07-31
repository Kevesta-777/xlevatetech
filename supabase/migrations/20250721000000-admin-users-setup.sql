-- Create admin users table for secure admin access
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE,
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_secret TEXT,
  is_active BOOLEAN DEFAULT true,
  ip_whitelist TEXT[],
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create admin sessions table for secure session management
CREATE TABLE IF NOT EXISTS public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin audit log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(255),
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create admin security events table
CREATE TABLE IF NOT EXISTS public.admin_security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  ip_address INET,
  metadata JSONB DEFAULT '{}'::jsonb,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_security_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admin users can view their own profile" ON public.admin_users
  FOR SELECT USING (auth.email() = email);

CREATE POLICY "Super admins can view all admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email() AND role = 'super_admin' AND is_active = true
    )
  );

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email() AND role = 'super_admin' AND is_active = true
    )
  );

-- RLS Policies for admin_sessions
CREATE POLICY "Users can view their own sessions" ON public.admin_sessions
  FOR SELECT USING (
    admin_user_id IN (
      SELECT id FROM public.admin_users WHERE email = auth.email()
    )
  );

-- RLS Policies for admin_audit_log
CREATE POLICY "Admins can view audit logs" ON public.admin_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email() AND role IN ('super_admin', 'admin') AND is_active = true
    )
  );

-- RLS Policies for admin_security_events
CREATE POLICY "Admins can view security events" ON public.admin_security_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.email() AND role IN ('super_admin', 'admin') AND is_active = true
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON public.admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_timestamp ON public.admin_audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_admin_security_events_created ON public.admin_security_events(created_at);

-- Insert default super admin (you should change this email and set a secure password)
INSERT INTO public.admin_users (email, role, is_active) 
VALUES ('admin@xlevatetech.com', 'super_admin', true)
ON CONFLICT (email) DO NOTHING;

-- Create function to clean expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_admin_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.admin_sessions 
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action VARCHAR(100),
  p_resource_type VARCHAR(50) DEFAULT NULL,
  p_resource_id VARCHAR(255) DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::jsonb
)
RETURNS void AS $$
DECLARE
  v_admin_user_id UUID;
BEGIN
  -- Get admin user ID from current session
  SELECT id INTO v_admin_user_id 
  FROM public.admin_users 
  WHERE email = auth.email();
  
  IF v_admin_user_id IS NOT NULL THEN
    INSERT INTO public.admin_audit_log (
      admin_user_id, action, resource_type, resource_id, details
    ) VALUES (
      v_admin_user_id, p_action, p_resource_type, p_resource_id, p_details
    );
  END IF;
END;
$$ LANGUAGE plpgsql;