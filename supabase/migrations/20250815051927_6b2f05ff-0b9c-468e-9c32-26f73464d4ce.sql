-- Add SELECT policy for admin users on leads table
CREATE POLICY "Admin users can view all leads" 
ON public.leads 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE email = auth.jwt()->>'email' 
    AND is_active = true
  )
);