-- Fix security vulnerability: Restrict escalation_logs access to admin users only
-- Drop the existing public SELECT policy
DROP POLICY IF EXISTS "Escalation logs viewable by admins" ON public.escalation_logs;

-- Create a new policy that properly restricts access to admin users
CREATE POLICY "Admin users can view escalation logs"
ON public.escalation_logs
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.email = (auth.jwt() ->> 'email')
    AND au.is_active = true
  )
);

-- Also fix the conversation_analytics table that has the same issue
DROP POLICY IF EXISTS "Analytics viewable by admins" ON public.conversation_analytics;

CREATE POLICY "Admin users can view conversation analytics"
ON public.conversation_analytics
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.email = (auth.jwt() ->> 'email')
    AND au.is_active = true
  )
);