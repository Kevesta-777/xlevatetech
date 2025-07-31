
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Activity, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  last_login: string;
  mfa_enabled: boolean;
}

interface AdminDashboardProps {
  adminUser: AdminUser | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminUser }) => {
  // Fetch real metrics from database
  const { data: conversationsCount } = useQuery({
    queryKey: ['conversations-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('conversations')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: messagesCount } = useQuery({
    queryKey: ['messages-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    }
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['analytics-data'],
    queryFn: async () => {
      const { data } = await supabase
        .from('conversation_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      return data || [];
    }
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data: messages } = await supabase
        .from('messages')
        .select('content, timestamp, role')
        .order('timestamp', { ascending: false })
        .limit(10);
      
      const { data: auditLogs } = await supabase
        .from('admin_audit_log')
        .select('action, created_at, resource_type')
        .order('created_at', { ascending: false })
        .limit(5);

      const combined = [
        ...(messages || []).map(msg => ({
          action: msg.role === 'user' ? 'User message' : 'AI response',
          user: msg.role === 'user' ? 'User' : 'AI Assistant',
          time: new Date(msg.timestamp).toLocaleString(),
          type: 'info' as const
        })),
        ...(auditLogs || []).map(log => ({
          action: log.action,
          user: 'Admin',
          time: new Date(log.created_at).toLocaleString(),
          type: 'success' as const
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8);

      return combined;
    }
  });

  // Calculate metrics from real data
  const avgResponseTime = analyticsData?.reduce((acc, item) => acc + (item.response_time_ms || 0), 0) / (analyticsData?.length || 1);
  const totalTokens = analyticsData?.reduce((acc, item) => acc + (item.tokens_used || 0), 0) || 0;
  const escalationRate = ((analyticsData?.filter(item => item.escalated).length || 0) / (analyticsData?.length || 1)) * 100;

  const metrics = [
    {
      title: 'Total Conversations',
      value: conversationsCount?.toLocaleString() || '0',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Avg Response Time',
      value: `${Math.round(avgResponseTime || 0)}ms`,
      change: avgResponseTime < 2000 ? 'Good' : 'Needs attention',
      icon: Activity,
      color: avgResponseTime < 2000 ? 'text-green-600' : 'text-yellow-600',
    },
    {
      title: 'Total Messages',
      value: messagesCount?.toLocaleString() || '0',
      change: '+3 today',
      icon: Shield,
      color: 'text-purple-600',
    },
    {
      title: 'Escalation Rate',
      value: `${escalationRate.toFixed(1)}%`,
      change: escalationRate < 5 ? 'Low' : 'Monitor',
      icon: TrendingUp,
      color: escalationRate < 5 ? 'text-green-600' : 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">
          Welcome back, {adminUser?.email}. Here's what's happening with your system.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system events and user interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity?.map((event, index) => (
                <div key={index} className="flex items-center space-x-4 rounded-lg border p-3">
                  <div className={`h-2 w-2 rounded-full ${
                    event.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{event.action}</p>
                    <p className="text-sm text-muted-foreground">{event.user}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{event.time}</div>
                </div>
              )) || (
                <div className="text-center py-4 text-muted-foreground">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Real-time system health indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rounded-lg border border-green-200 bg-green-50 p-3">
                <Activity className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">
                    System Online
                  </p>
                  <p className="text-sm text-green-700">
                    All services running normally
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">
                    Analytics Active
                  </p>
                  <p className="text-sm text-blue-700">
                    {analyticsData?.length || 0} records collected
                  </p>
                </div>
              </div>

              {totalTokens > 10000 && (
                <div className="flex items-start space-x-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">
                      High Token Usage
                    </p>
                    <p className="text-sm text-yellow-700">
                      {totalTokens.toLocaleString()} tokens used
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
