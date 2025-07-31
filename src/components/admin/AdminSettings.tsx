import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  last_login: string;
  mfa_enabled: boolean;
}

interface AdminSettingsProps {
  adminUser: AdminUser | null;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ adminUser }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin Settings</h2>
        <p className="text-muted-foreground">
          Configure admin portal settings
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Admin settings will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};