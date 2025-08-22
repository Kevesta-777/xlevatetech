# Leads Security Implementation

## Overview

This document outlines the comprehensive security measures implemented for the leads system to protect sensitive PII (Personally Identifiable Information) and ensure compliance with data protection regulations.

## Security Features Implemented

### 1. Row Level Security (RLS)

#### RLS Policies

- **Admin Users**: Full access to all leads (unmasked data)

  - Policy: `admin_users_can_view_all_leads`
  - Policy: `admin_users_can_manage_leads`
  - Roles: `super_admin`, `admin`

- **Service Role**: Full access for API/chatbot operations

  - Policy: `service_role_can_manage_leads`
  - Used for: Chatbot lead capture, API integrations

- **Authenticated Users**: Limited access to masked data only
  - Policy: `authenticated_users_can_view_masked_leads`
  - Access: Masked view only, no PII exposure

#### Policy Enforcement

```sql
-- Admin users can view all leads (unmasked)
CREATE POLICY "admin_users_can_view_all_leads" ON public.leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.email = auth.jwt() ->> 'email'
      AND au.is_active = true
      AND au.role IN ('super_admin', 'admin')
    )
  );
```

### 2. PII Masking Functions

#### Email Masking

- **Format**: `j***n@example.com`
- **Logic**: Shows first and last character of local part, masks middle
- **Function**: `public.mask_email(email text)`

#### Phone Masking

- **Format**: `+1***1234`
- **Logic**: Keeps country code and last 4 digits, masks middle
- **Function**: `public.mask_phone(phone text)`

#### Name Masking

- **Format**: `J***n`
- **Logic**: Shows first letter, masks the rest
- **Function**: `public.mask_name(name text)`

### 3. Secure Views

#### Masked View: `leads_masked`

- Automatically applies PII masking to sensitive fields
- Available to authenticated users without admin privileges
- Maintains data structure while protecting privacy

```sql
CREATE OR REPLACE VIEW public.leads_masked AS
SELECT
  id,
  created_at,
  public.mask_name(first_name) as first_name,
  public.mask_name(last_name) as last_name,
  public.mask_email(email) as email,
  public.mask_phone(phone) as phone,
  -- ... other non-sensitive fields
FROM public.leads;
```

### 4. Audit Logging

#### Access Logging

- **Function**: `public.log_lead_access()`
- **Trigger**: `log_lead_access_trigger`
- **Logs**: All lead access operations (SELECT, INSERT, UPDATE, DELETE)
- **Details**: User, timestamp, IP address, operation type

#### Security Event Detection

- **Function**: `public.detect_suspicious_lead_access()`
- **Detection**: Rapid access patterns (>100 requests/minute)
- **Action**: Logs security events for investigation
- **Severity**: High priority alerts

### 5. Data Retention

#### Automatic Archiving

- **Function**: `public.archive_old_leads()`
- **Criteria**: Leads older than 2 years with no activity
- **Action**: Sets `opt_out = true` and adds archive note
- **Compliance**: GDPR data retention requirements

### 6. Performance Optimizations

#### Security Indexes

```sql
-- Admin access optimization
CREATE INDEX idx_leads_admin_access ON public.leads(created_at)
  WHERE EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = auth.jwt() ->> 'email'
    AND au.is_active = true
  );

-- Audit trail optimization
CREATE INDEX idx_leads_audit ON public.leads(id, created_at, stage);
```

## Implementation in Frontend

### AdminLeads Component

```typescript
// Check admin status for proper data access
const isAdmin = useMemo(() => {
  return adminUser && ["super_admin", "admin"].includes(adminUser.role || "");
}, [adminUser]);

// Use appropriate table/view based on user role
const tableName = isAdmin ? "leads" : "leads_masked";
```

### Security Considerations

1. **Role-Based Access**: Different data views based on user role
2. **Error Handling**: Secure error messages without data exposure
3. **Query Optimization**: Efficient queries with security indexes
4. **Audit Trail**: Complete logging of all data access

## Compliance Features

### GDPR Compliance

- **Data Minimization**: PII masking for non-admin users
- **Right to be Forgotten**: Archive function for old data
- **Access Logging**: Complete audit trail
- **Data Retention**: Automatic archiving after 2 years

### Security Best Practices

- **Principle of Least Privilege**: Users only see what they need
- **Defense in Depth**: Multiple security layers
- **Audit Trail**: Complete access logging
- **Suspicious Activity Detection**: Automated threat detection

## Monitoring and Alerts

### Security Events

- **Rapid Access Detection**: >100 requests/minute
- **Unauthorized Access Attempts**: Failed policy checks
- **Data Export Attempts**: Bulk data access patterns

### Audit Logs

- **Location**: `admin_audit_log` table
- **Retention**: 7 years for compliance
- **Access**: Admin users only

## Migration Instructions

### Running the Security Migration

1. **Apply Migration**:

   ```bash
   supabase db push
   ```

2. **Verify Policies**:

   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'leads';
   ```

3. **Test Masking Functions**:

   ```sql
   SELECT public.mask_email('john.doe@example.com');
   SELECT public.mask_phone('+1234567890');
   SELECT public.mask_name('John');
   ```

4. **Verify View Access**:
   ```sql
   SELECT * FROM leads_masked LIMIT 5;
   ```

## Troubleshooting

### Common Issues

1. **Access Denied Errors**

   - Check user role in `admin_users` table
   - Verify RLS policies are active
   - Check user authentication status

2. **Masked Data Not Showing**

   - Ensure using `leads_masked` view for non-admin users
   - Verify masking functions are working
   - Check user permissions

3. **Performance Issues**
   - Verify security indexes are created
   - Check query execution plans
   - Monitor audit log table size

### Security Checklist

- [ ] RLS policies are active on `leads` table
- [ ] Masking functions are working correctly
- [ ] Audit logging is capturing all access
- [ ] Security events are being detected
- [ ] Data retention policy is active
- [ ] Performance indexes are optimized
- [ ] User roles are properly assigned
- [ ] Error handling is secure

## Future Enhancements

### Planned Security Features

1. **Encryption at Rest**: Field-level encryption for sensitive data
2. **Data Loss Prevention**: Automated detection of data exfiltration
3. **Advanced Analytics**: Machine learning for threat detection
4. **Compliance Reporting**: Automated GDPR compliance reports
5. **Data Classification**: Automatic PII detection and classification

### Monitoring Improvements

1. **Real-time Alerts**: Instant notification of security events
2. **Dashboard Integration**: Security metrics in admin dashboard
3. **Automated Response**: Automatic blocking of suspicious activities
4. **Compliance Audits**: Regular automated compliance checks
