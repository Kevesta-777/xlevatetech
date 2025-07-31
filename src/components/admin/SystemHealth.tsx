
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Database, Zap, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  last_login: string;
  mfa_enabled: boolean;
}

interface SystemHealthProps {
  adminUser: AdminUser | null;
}

export const SystemHealth: React.FC<SystemHealthProps> = ({ adminUser }) => {
  // Check database connectivity
  const { data: dbHealth, isLoading: dbLoading } = useQuery({
    queryKey: ['db-health'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('count')
          .limit(1);
        
        return { status: 'healthy', error: null, responseTime: Date.now() };
      } catch (error) {
        return { status: 'error', error: error.message, responseTime: null };
      }
    },
    refetchInterval: 30000 // Check every 30 seconds
  });

  // Check recent errors
  const { data: recentErrors } = useQuery({
    queryKey: ['recent-errors'],
    queryFn: async () => {
      const { data } = await supabase
        .from('escalation_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);
      
      return data || [];
    }
  });

  // Check system performance
  const { data: performanceData } = useQuery({
    queryKey: ['system-performance'],
    queryFn: async () => {
      const { data } = await supabase
        .from('conversation_analytics')
        .select('response_time_ms, tokens_used, created_at')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });
      
      const avgResponseTime = data?.reduce((acc, item) => acc + (item.response_time_ms || 0), 0) / (data?.length || 1);
      const totalTokens = data?.reduce((acc, item) => acc + (item.tokens_used || 0), 0) || 0;
      
      return {
        avgResponseTime: Math.round(avgResponseTime || 0),
        totalTokens,
        conversationCount: data?.length || 0
      };
    }
  });

  const healthChecks = [
    {
      name: 'Database Connection',
      status: dbLoading ? 'checking' : dbHealth?.status === 'healthy' ? 'healthy' : 'error',
      description: dbLoading ? 'Checking connection...' : dbHealth?.status === 'healthy' ? 'Connected successfully' : 'Connection failed',
      icon: Database
    },
    {
      name: 'API Response Time',
      status: (performanceData?.avgResponseTime || 0) < 2000 ? 'healthy' : 'warning',
      description: `Average: ${performanceData?.avgResponseTime || 0}ms`,
      icon: Zap
    },
    {
      name: 'Error Rate',
      status: (recentErrors?.length || 0) < 5 ? 'healthy' : 'warning',
      description: `${recentErrors?.length || 0} errors in last 24h`,
      icon: AlertTriangle
    },
    {
      name: 'Token Usage',
      status: (performanceData?.totalTokens || 0) < 100000 ? 'healthy' : 'warning',
      description: `${performanceData?.totalTokens?.toLocaleString() || 0} tokens used today`,
      icon: Activity
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Health</h2>
        <p className="text-muted-foreground">
          Monitor system performance and uptime
        </p>
      </div>

      {/* Health Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {healthChecks.map((check, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{check.name}</CardTitle>
              <check.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {getStatusIcon(check.status)}
                <span className="text-sm font-medium capitalize">{check.status}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{check.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Health Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthChecks.map((check, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(check.status)}`}>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(check.status)}
                    <div>
                      <p className="font-medium">{check.name}</p>
                      <p className="text-sm text-muted-foreground">{check.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium capitalize">{check.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentErrors?.length > 0 ? (
                recentErrors.slice(0, 5).map((error, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-red-200 bg-red-50">
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">{error.escalation_reason}</p>
                      <p className="text-xs text-red-600 mt-1">
                        {new Date(error.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-2" />
                  <p>No recent issues detected</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Metrics (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {performanceData?.avgResponseTime || 0}ms
              </div>
              <p className="text-sm text-muted-foreground">Average Response Time</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {performanceData?.conversationCount || 0}
              </div>
              <p className="text-sm text-muted-foreground">Conversations</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {performanceData?.totalTokens?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-muted-foreground">Tokens Processed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
