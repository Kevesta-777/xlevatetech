import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  last_login: string;
  mfa_enabled: boolean;
}

interface SecurityMonitoringProps {
  adminUser: AdminUser | null;
}

export const SecurityMonitoring: React.FC<SecurityMonitoringProps> = ({ adminUser }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Security Monitoring</h2>
        <p className="text-muted-foreground">
          Security events and threat detection
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Security monitoring dashboard will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};