-- Test script for leads security implementation
-- Run this script to verify all security features are working

-- 1. Test PII masking functions
SELECT 'Testing PII masking functions...' as test_step;

SELECT 
  'Email masking' as test_type,
  public.mask_email('john.doe@example.com') as masked_email,
  'j***e@example.com' as expected;

SELECT 
  'Phone masking' as test_type,
  public.mask_phone('+1234567890') as masked_phone,
  '+1***7890' as expected;

SELECT 
  'Name masking' as test_type,
  public.mask_name('John') as masked_name,
  'J***n' as expected;

-- 2. Test masked view
SELECT 'Testing masked view...' as test_step;

-- This should show masked data
SELECT 
  id,
  first_name,
  last_name,
  email,
  phone
FROM leads_masked 
LIMIT 3;

-- 3. Test RLS policies
SELECT 'Testing RLS policies...' as test_step;

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'leads';

-- Check existing policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'leads';

-- 4. Test audit logging function
SELECT 'Testing audit logging...' as test_step;

-- Test the logging function (will only work if user is admin)
DO $$
BEGIN
  -- This will only log if the current user is an admin
  PERFORM public.log_lead_access(
    gen_random_uuid(),
    'TEST',
    'test@example.com'
  );
  RAISE NOTICE 'Audit logging function test completed';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Audit logging test failed (expected for non-admin users): %', SQLERRM;
END $$;

-- 5. Test security event detection
SELECT 'Testing security event detection...' as test_step;

-- Check if security events table exists
SELECT 
  schemaname,
  tablename
FROM pg_tables 
WHERE tablename = 'admin_security_events';

-- 6. Test data retention function
SELECT 'Testing data retention function...' as test_step;

-- Check if archive function exists
SELECT 
  proname,
  prosrc
FROM pg_proc 
WHERE proname = 'archive_old_leads';

-- 7. Test indexes
SELECT 'Testing security indexes...' as test_step;

-- Check if security indexes exist
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'leads' 
AND indexname LIKE '%admin%' OR indexname LIKE '%audit%';

-- 8. Test permissions
SELECT 'Testing permissions...' as test_step;

-- Check grants on masked view
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'leads_masked';

-- Check function permissions
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name LIKE 'mask_%'
AND routine_schema = 'public';

-- 9. Summary report
SELECT 'Security implementation summary:' as summary;

SELECT 
  'RLS Enabled' as feature,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE tablename = 'leads' AND rowsecurity = true
    ) THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status

UNION ALL

SELECT 
  'Masking Functions' as feature,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname IN ('mask_email', 'mask_phone', 'mask_name')
    ) THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status

UNION ALL

SELECT 
  'Masked View' as feature,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_views 
      WHERE viewname = 'leads_masked'
    ) THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status

UNION ALL

SELECT 
  'Audit Logging' as feature,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'log_lead_access'
    ) THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status

UNION ALL

SELECT 
  'Security Events' as feature,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE tablename = 'admin_security_events'
    ) THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status

UNION ALL

SELECT 
  'Data Retention' as feature,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'archive_old_leads'
    ) THEN '✅ PASS'
    ELSE '❌ FAIL'
  END as status;

-- 10. Recommendations
SELECT 'Security recommendations:' as recommendations;

SELECT 
  'Run this test as admin user to verify full functionality' as recommendation
UNION ALL
SELECT 
  'Monitor admin_audit_log table for access patterns' as recommendation
UNION ALL
SELECT 
  'Set up automated alerts for security events' as recommendation
UNION ALL
SELECT 
  'Regularly review and update RLS policies' as recommendation
UNION ALL
SELECT 
  'Test data retention policies periodically' as recommendation; 