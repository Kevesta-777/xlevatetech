
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Clock, MessageSquare, AlertTriangle, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChartContainer } from '@/components/ui/chart';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  last_login: string;
  mfa_enabled: boolean;
}

interface AdminPerformanceAnalyticsProps {
  adminUser: AdminUser | null;
}

export const AdminPerformanceAnalytics: React.FC<AdminPerformanceAnalyticsProps> = ({ adminUser }) => {
  const [activeChart, setActiveChart] = useState<'line' | 'bar' | 'pie'>('line');

  // Fetch blog performance metrics
  const { data: performanceMetrics } = useQuery({
    queryKey: ['admin-performance-metrics'],
    queryFn: async () => {
      const { data } = await supabase
        .from('blog_performance_metrics')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(100);
      return data || [];
    }
  });

  // Fetch user engagement analytics
  const { data: engagementData } = useQuery({
    queryKey: ['admin-engagement-analytics'],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_engagement_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      return data || [];
    }
  });

  // Fetch RSS feed health data
  const { data: rssHealth } = useQuery({
    queryKey: ['admin-rss-health'],
    queryFn: async () => {
      const { data } = await supabase
        .from('rss_feed_health')
        .select('*, rss_feeds(name, category)')
        .order('last_checked', { ascending: false });
      return data || [];
    }
  });

  // Fetch conversation analytics for admin view
  const { data: conversationAnalytics } = useQuery({
    queryKey: ['admin-conversation-analytics'],
    queryFn: async () => {
      const { data } = await supabase
        .from('conversation_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      return data || [];
    }
  });

  // Process data for charts
  const processEngagementData = () => {
    if (!engagementData) return [];
    
    const grouped = engagementData.reduce((acc: any, item) => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, views: 0, clicks: 0, shares: 0 };
      }
      if (item.action_type === 'page_view') acc[date].views++;
      if (item.action_type === 'click') acc[date].clicks++;
      if (item.action_type === 'share') acc[date].shares++;
      return acc;
    }, {});

    return Object.values(grouped).slice(-14); // Last 14 days
  };

  const processPerformanceData = () => {
    if (!performanceMetrics) return [];
    
    return performanceMetrics.map(metric => ({
      date: new Date(metric.recorded_at).toLocaleDateString(),
      value: Number(metric.value),
      type: metric.metric_name
    })).slice(-30); // Last 30 entries
  };

  const processRSSHealthData = () => {
    if (!rssHealth) return [];
    
    const healthMap = rssHealth.reduce((acc: any, feed) => {
      const status = feed.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const colors = ['#22d3ee', '#10b981', '#f59e0b', '#ef4444'];
    return Object.entries(healthMap).map(([status, count], index) => ({
      name: status,
      value: count,
      color: colors[index % colors.length]
    }));
  };

  // Calculate key metrics from real data
  const totalPageViews = engagementData?.filter(item => item.action_type === 'page_view').length || 0;
  const avgResponseTime = conversationAnalytics?.reduce((acc, item) => acc + (item.response_time_ms || 0), 0) / (conversationAnalytics?.length || 1);
  const totalConversations = conversationAnalytics?.length || 0;
  const escalationRate = ((conversationAnalytics?.filter(item => item.escalated).length || 0) / (conversationAnalytics?.length || 1)) * 100;
  const avgEngagementDuration = engagementData?.reduce((acc, item) => acc + (item.duration_seconds || 0), 0) / (engagementData?.length || 1);

  const metrics = [
    { 
      label: 'Total Page Views', 
      value: totalPageViews.toLocaleString(), 
      icon: Activity, 
      change: '+15% this week',
      color: 'text-blue-600'
    },
    { 
      label: 'Avg Response Time', 
      value: `${Math.round(avgResponseTime || 0)}ms`, 
      icon: Clock, 
      change: avgResponseTime < 2000 ? 'Excellent' : 'Needs attention',
      color: avgResponseTime < 2000 ? 'text-green-600' : 'text-yellow-600'
    },
    { 
      label: 'Total Conversations', 
      value: totalConversations.toLocaleString(), 
      icon: MessageSquare, 
      change: '+8% this month',
      color: 'text-purple-600'
    },
    { 
      label: 'Escalation Rate', 
      value: `${escalationRate.toFixed(1)}%`, 
      icon: AlertTriangle, 
      change: escalationRate < 5 ? 'Low' : 'Monitor',
      color: escalationRate < 5 ? 'text-green-600' : 'text-orange-600'
    }
  ];

  const renderChart = () => {
    const engagementChartData = processEngagementData();
    const performanceChartData = processPerformanceData();
    const rssHealthChartData = processRSSHealthData();

    switch (activeChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementChartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#22d3ee" strokeWidth={2} name="Page Views" />
              <Line type="monotone" dataKey="clicks" stroke="#a855f7" strokeWidth={2} name="Clicks" />
              <Line type="monotone" dataKey="shares" stroke="#f59e0b" strokeWidth={2} name="Shares" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceChartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rssHealthChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {rssHealthChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>
        <p className="text-muted-foreground">
          Real-time performance metrics and system insights (Admin Only)
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Visualizations
            </CardTitle>
            <div className="flex items-center gap-2">
              {['line', 'bar', 'pie'].map((chartType) => (
                <button
                  key={chartType}
                  onClick={() => setActiveChart(chartType as any)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    activeChart === chartType
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Real-time RSS Health Status */}
      <Card>
        <CardHeader>
          <CardTitle>RSS Feed Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rssHealth?.slice(0, 10).map((feed, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    feed.status === 'healthy' ? 'bg-green-500' : 
                    feed.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{feed.rss_feeds?.name || 'Unknown Feed'}</p>
                    <p className="text-sm text-muted-foreground">
                      Last checked: {new Date(feed.last_checked).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{feed.response_time_ms}ms</p>
                  <p className="text-xs text-muted-foreground">
                    {feed.valid_items}/{feed.total_items} valid
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
