import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, BarChart3, Settings, FileText, AlertTriangle, Activity, LogOut, Globe, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AdminAuth } from '@/components/admin/AdminAuth';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ContentManagement } from '@/components/admin/ContentManagement';
import { RSSFeedManagement } from '@/components/admin/RSSFeedManagement';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { SystemHealth } from '@/components/admin/SystemHealth';
import { UserManagement } from '@/components/admin/UserManagement';
import { SecurityMonitoring } from '@/components/admin/SecurityMonitoring';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminPerformanceAnalytics } from '@/components/admin/AdminPerformanceAnalytics';
import { AdminDocumentation } from '@/components/admin/AdminDocumentation';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  last_login: string;
  mfa_enabled: boolean;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // For now, allow any authenticated user as admin (you should implement proper admin checking)
      // This is a basic implementation - in production, you'd check against an admin users table
      const mockAdminUser: AdminUser = {
        id: session.user.id,
        email: session.user.email || '',
        role: 'admin',
        last_login: new Date().toISOString(),
        mfa_enabled: false
      };

      setAdminUser(mockAdminUser);
      setIsAuthenticated(true);
        
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setAdminUser(null);
      navigate('/');
      toast({
        title: "Logged Out",
        description: "You have been securely logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAuthSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setIsAuthenticated(true);
    toast({
      title: "Welcome Back",
      description: `Logged in as ${user.email}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'content', label: 'Content Management', icon: FileText },
    { id: 'rss', label: 'RSS Management', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'system', label: 'System Health', icon: Activity },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'documentation', label: 'Documentation', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-xl font-semibold">Xlevate Admin Portal</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {adminUser?.email} ({adminUser?.role})
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="w-64 border-r bg-card min-h-[calc(100vh-73px)]">
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
              <TabsList className="grid w-full grid-cols-1 h-auto bg-transparent">
                {navigationItems.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="w-full justify-start px-4 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </nav>

        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="dashboard" className="mt-0">
              <AdminDashboard adminUser={adminUser} />
            </TabsContent>
            
            <TabsContent value="content" className="mt-0">
              <ContentManagement adminUser={adminUser} />
            </TabsContent>
            
            <TabsContent value="rss" className="mt-0">
              <RSSFeedManagement adminUser={adminUser} />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <AnalyticsDashboard adminUser={adminUser} />
            </TabsContent>
            
            <TabsContent value="performance" className="mt-0">
              <AdminPerformanceAnalytics adminUser={adminUser} />
            </TabsContent>
            
            <TabsContent value="system" className="mt-0">
              <SystemHealth adminUser={adminUser} />
            </TabsContent>
            
            <TabsContent value="users" className="mt-0">
              <UserManagement adminUser={adminUser} />
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <SecurityMonitoring adminUser={adminUser} />
            </TabsContent>
            
            <TabsContent value="documentation" className="mt-0">
              <AdminDocumentation adminUser={adminUser} />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <AdminSettings adminUser={adminUser} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Admin;
