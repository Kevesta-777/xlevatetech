import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  last_login: string;
  mfa_enabled: boolean;
}

interface AdminAuthProps {
  onAuthSuccess: (user: AdminUser) => void;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, check if user exists in admin_users table
      const { data: adminUserData, error: adminError } = await supabase
        .rpc('get_admin_user', { user_email: email });

      if (adminError) {
        console.error('Admin check error:', adminError);
        throw new Error('Database error occurred');
      }

      if (!adminUserData || adminUserData.length === 0) {
        throw new Error('Access denied: Not an admin user');
      }

      // If admin user exists, proceed with authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (authData.user) {
        const adminUser: AdminUser = {
          id: adminUserData[0].id,
          email: adminUserData[0].email,
          role: adminUserData[0].role as 'super_admin' | 'admin' | 'editor' | 'viewer',
          last_login: adminUserData[0].last_login || new Date().toISOString(),
          mfa_enabled: adminUserData[0].mfa_enabled,
        };

        // Update last login timestamp
        try {
          await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', adminUser.id);

          // Log successful login
          await supabase.rpc('log_admin_action', {
            p_action: 'login_success',
            p_resource_type: 'auth',
            p_details: { ip_address: 'client' }
          });
        } catch (updateError) {
          console.warn('Failed to update login timestamp or log action:', updateError);
          // Don't block login for logging failures
        }
        
        onAuthSuccess(adminUser);
      }
    } catch (error: any) {
      // Log failed login attempt
      try {
        await supabase.rpc('log_admin_action', {
          p_action: 'login_failed',
          p_resource_type: 'auth',
          p_details: { email, error: error.message }
        });
      } catch (logError) {
        console.warn('Failed to log failed login attempt:', logError);
      }

      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <CardDescription>
            Secure access to Xlevate Tech admin dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@xlevatetech.com"
                required
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email || !password}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Security Notice</p>
                <p className="text-muted-foreground">
                  This is a secure admin portal. All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};