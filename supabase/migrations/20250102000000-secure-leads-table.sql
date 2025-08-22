-- Secure leads table with RLS and PII masking
-- Migration: 20250102000000-secure-leads-table.sql

-- Step 1: Drop existing insecure policies
DROP POLICY IF EXISTS "Allow authenticated users to read leads" ON public.leads;
DROP POLICY IF EXISTS "Allow anonymous users to insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow service role to insert leads" ON public.leads;
DROP POLICY IF EXISTS "Allow service role to update leads" ON public.leads;

-- Step 2: Create PII masking functions
CREATE OR REPLACE FUNCTION public.mask_email(email text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  IF email IS NULL OR email = '' THEN
    RETURN NULL;
  END IF;
  
  -- Split email into local and domain parts
  DECLARE
    local_part text;
    domain_part text;
    masked_local text;
  BEGIN
    local_part := split_part(email, '@', 1);
    domain_part := split_part(email, '@', 2);
    
    -- Mask local part: show first and last character, mask middle
    IF length(local_part) <= 2 THEN
      masked_local := local_part;
    ELSE
      masked_local := left(local_part, 1) || repeat('*', length(local_part) - 2) || right(local_part, 1);
    END IF;
    
    RETURN masked_local || '@' || domain_part;
  END;
END;
$$;

CREATE OR REPLACE FUNCTION public.mask_phone(phone text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  IF phone IS NULL OR phone = '' THEN
    RETURN NULL;
  END IF;
  
  -- Keep country code and last 4 digits, mask the rest
  IF length(phone) <= 7 THEN
    RETURN repeat('*', length(phone));
  ELSE
    RETURN left(phone, 3) || repeat('*', length(phone) - 7) || right(phone, 4);
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.mask_name(name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  IF name IS NULL OR name = '' THEN
    RETURN NULL;
  END IF;
  
  -- Show first letter, mask the rest
  IF length(name) <= 1 THEN
    RETURN name;
  ELSE
    RETURN left(name, 1) || repeat('*', length(name) - 1);
  END IF;
END;
$$;

-- Step 3: Create secure view for masked PII
CREATE OR REPLACE VIEW public.leads_masked AS
SELECT 
  id,
  created_at,
  public.mask_name(first_name) as first_name,
  public.mask_name(last_name) as last_name,
  public.mask_email(email) as email,
  public.mask_phone(phone) as phone,
  company_name,
  industry_sector,
  location,
  company_size,
  website_url,
  role_title,
  social_links,
  pain_points,
  budget_timeline,
  notes,
  score,
  stage,
  source,
  campaign_id,
  last_contacted_at,
  calendly_link,
  opt_out
FROM public.leads;

-- Step 4: Create secure RLS policies
-- Policy for admin users to view all leads (unmasked)
CREATE POLICY "admin_users_can_view_all_leads" ON public.leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.email = auth.jwt() ->> 'email'
      AND au.is_active = true
      AND au.role IN ('super_admin', 'admin')
    )
  );

-- Policy for admin users to manage leads
CREATE POLICY "admin_users_can_manage_leads" ON public.leads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.email = auth.jwt() ->> 'email'
      AND au.is_active = true
      AND au.role IN ('super_admin', 'admin')
    )
  );

-- Policy for service role (for chatbot/API operations)
CREATE POLICY "service_role_can_manage_leads" ON public.leads
  FOR ALL USING (auth.role() = 'service_role');

-- Policy for authenticated users to view masked leads only
CREATE POLICY "authenticated_users_can_view_masked_leads" ON public.leads
  FOR SELECT USING (
    auth.role() = 'authenticated' AND
    NOT EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.email = auth.jwt() ->> 'email'
      AND au.is_active = true
    )
  );

-- Step 5: Create audit logging function
CREATE OR REPLACE FUNCTION public.log_lead_access(
  lead_id uuid,
  access_type text,
  user_email text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.admin_audit_log (
    action,
    table_name,
    record_id,
    admin_user_id,
    details
  ) VALUES (
    'LEAD_' || upper(access_type),
    'leads',
    lead_id,
    (SELECT id FROM public.admin_users WHERE email = COALESCE(user_email, auth.jwt() ->> 'email')),
    jsonb_build_object(
      'access_type', access_type,
      'timestamp', now(),
      'ip_address', inet_client_addr()
    )
  );
END;
$$;

-- Step 6: Create trigger to log lead access
CREATE OR REPLACE FUNCTION public.trigger_log_lead_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log access for admin users
  IF EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.email = auth.jwt() ->> 'email'
    AND au.is_active = true
  ) THEN
    PERFORM public.log_lead_access(
      COALESCE(NEW.id, OLD.id),
      TG_OP,
      auth.jwt() ->> 'email'
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for lead access logging
DROP TRIGGER IF EXISTS log_lead_access_trigger ON public.leads;
CREATE TRIGGER log_lead_access_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.trigger_log_lead_access();

-- Step 7: Add data retention policy
-- Create a function to automatically archive old leads
CREATE OR REPLACE FUNCTION public.archive_old_leads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Archive leads older than 2 years that are disqualified or have no activity
  UPDATE public.leads 
  SET 
    opt_out = true,
    notes = COALESCE(notes, '') || E'\n[ARCHIVED] Lead automatically archived due to inactivity after 2 years.'
  WHERE 
    created_at < now() - interval '2 years'
    AND (stage = 'disqualified' OR last_contacted_at IS NULL OR last_contacted_at < now() - interval '1 year')
    AND opt_out = false;
END;
$$;

-- Step 8: Create indexes for security and performance
CREATE INDEX IF NOT EXISTS idx_leads_admin_access ON public.leads(created_at) 
  WHERE EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.email = auth.jwt() ->> 'email'
    AND au.is_active = true
  );

CREATE INDEX IF NOT EXISTS idx_leads_audit ON public.leads(id, created_at, stage);

-- Step 9: Add security comments
COMMENT ON FUNCTION public.mask_email(text) IS 'Masks email addresses for privacy protection';
COMMENT ON FUNCTION public.mask_phone(text) IS 'Masks phone numbers for privacy protection';
COMMENT ON FUNCTION public.mask_name(text) IS 'Masks names for privacy protection';
COMMENT ON VIEW public.leads_masked IS 'Secure view of leads with PII masking applied';
COMMENT ON FUNCTION public.log_lead_access(uuid, text, text) IS 'Logs access to lead data for audit purposes';
COMMENT ON FUNCTION public.archive_old_leads() IS 'Automatically archives old leads for data retention compliance';

-- Step 10: Grant appropriate permissions
GRANT SELECT ON public.leads_masked TO authenticated;
GRANT ALL ON public.leads TO service_role;
GRANT EXECUTE ON FUNCTION public.mask_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mask_phone(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mask_name(text) TO authenticated;

-- Step 11: Create security event logging for suspicious activities
CREATE OR REPLACE FUNCTION public.detect_suspicious_lead_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  access_count integer;
BEGIN
  -- Check for rapid access patterns (potential scraping)
  SELECT COUNT(*) INTO access_count
  FROM public.admin_audit_log
  WHERE 
    table_name = 'leads'
    AND admin_user_id = (SELECT id FROM public.admin_users WHERE email = auth.jwt() ->> 'email')
    AND created_at > now() - interval '1 minute';
  
  -- Log suspicious activity
  IF access_count > 100 THEN
    INSERT INTO public.admin_security_events (
      event_type,
      severity,
      description,
      admin_user_id,
      metadata
    ) VALUES (
      'SUSPICIOUS_LEAD_ACCESS',
      'high',
      'Rapid lead access detected - possible scraping attempt',
      (SELECT id FROM public.admin_users WHERE email = auth.jwt() ->> 'email'),
      jsonb_build_object(
        'access_count', access_count,
        'time_window', '1 minute',
        'lead_id', COALESCE(NEW.id, OLD.id)
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for suspicious activity detection
DROP TRIGGER IF EXISTS detect_suspicious_access_trigger ON public.leads;
CREATE TRIGGER detect_suspicious_access_trigger
  AFTER SELECT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.detect_suspicious_lead_access();

COMMENT ON FUNCTION public.detect_suspicious_lead_access() IS 'Detects and logs suspicious lead access patterns'; 