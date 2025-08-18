-- Fix security vulnerability: Secure newsletter table with proper RLS policies
-- Ensure RLS is enabled on the newsletter table
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- Drop existing duplicate INSERT policies and create proper security policies
DROP POLICY IF EXISTS "Enable insert for newsletter" ON public.newsletter;
DROP POLICY IF EXISTS "Newsletter can be inserted via API" ON public.newsletter;

-- Allow public INSERT for newsletter signups (preserves functionality)
CREATE POLICY "Allow public newsletter signups"
ON public.newsletter
FOR INSERT
WITH CHECK (true);

-- Restrict SELECT access to admin users only (protects customer emails)
CREATE POLICY "Admin users can view newsletter subscribers"
ON public.newsletter
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.email = (auth.jwt() ->> 'email')
    AND au.is_active = true
  )
);

-- Allow admin users to manage newsletter data (UPDATE/DELETE)
CREATE POLICY "Admin users can manage newsletter data"
ON public.newsletter
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.email = (auth.jwt() ->> 'email')
    AND au.is_active = true
    AND au.role IN ('super_admin', 'admin')
  )
);

CREATE POLICY "Admin users can delete newsletter data"
ON public.newsletter
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.email = (auth.jwt() ->> 'email')
    AND au.is_active = true
    AND au.role IN ('super_admin', 'admin')
  )
);