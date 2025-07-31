
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Clock, MessageSquare, AlertTriangle } from 'lucide-react';
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

interface AnalyticsDashboardProps {
  adminUser: AdminUser | null;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ adminUser }) => {
  const [activeChart, setActiveChart] = useState<'line' | 'bar' | 'pie'>('line');

  // Fetch analytics data
  const { data: analyticsData } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => {
      const { data } = await supabase
        .from('conversation_analytics')
        .select('*')
        .order('created_at', { ascending: false });
      return data || [];
    }
  });

  // Fetch conversation trends
  const { data: conversationTrends } = useQuery({
    queryKey: ['conversation-trends'],
    queryFn: async () => {
      const { data } = await supabase
        .from('conversations')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(30);
      
      // Group by date
      const groupedByDate = (data || []).reduce((acc: any, conv) => {
        const date = new Date(conv.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(groupedByDate).map(([date, count]) => ({
        date,
        conversations: count
      })).sort((a, b) => a.date.localeCompare(b.date));
    }
  });

  // Fetch response time data
  const { data: responseTimeData } = useQuery({
    queryKey: ['response-time-data'],
    queryFn: async () => {
      const { data } = await supabase
        .from('conversation_analytics')
        .select('response_time_ms, created_at')
        .not('response_time_ms', 'is', null)
        .order('created_at', { ascending: false })
        .limit(50);
      
      return (data || []).map(item => ({
        time: new Date(item.created_at).toLocaleTimeString(),
        response_time: item.response_time_ms
      }));
    }
  });

  // Fetch question types distribution
  const { data: questionTypes } = useQuery({
    queryKey: ['question-types'],
    queryFn: async () => {
      const { data } = await supabase
        .from('conversation_analytics')
        .select('question_type')
        .not('question_type', 'is', null);
      
      const typeCount = (data || []).reduce((acc: any, item) => {
        acc[item.question_type] = (acc[item.question_type] || 0) + 1;
        return acc;
      }, {});

      const colors = ['#22d3ee', '#a855f7', '#f59e0b', '#10b981', '#ef4444'];
      return Object.entries(typeCount).map(([type, count], index) => ({
        name: type,
        value: count,
        color: colors[index % colors.length]
      }));
    }
  });

  // Calculate key metrics
  const avgResponseTime = analyticsData?.reduce((acc, item) => acc + (item.response_time_ms || 0), 0) / (analyticsData?.length || 1);
  const totalTokens = analyticsData?.reduce((acc, item) => acc + (item.tokens_used || 0), 0) || 0;
  const escalationCount = analyticsData?.filter(item => item.escalated).length || 0;
  const totalConversations = conversationTrends?.reduce((acc, item) => acc + (item.conversations as number), 0) || 0;

  const metrics = [
    { 
      label: 'Avg Response Time', 
      value: `${Math.round(avgResponseTime || 0)}ms`, 
      icon: Clock, 
      change: avgResponseTime < 2000 ? 'Good' : 'Needs attention' 
    },
    { 
      label: 'Total Conversations', 
      value: totalConversations.toLocaleString(), 
      icon: MessageSquare, 
      change: '+12% this week' 
    },
    { 
      label: 'Tokens Used', 
      value: totalTokens.toLocaleString(), 
      icon: TrendingUp, 
      change: `${Math.round(totalTokens / (analyticsData?.length || 1))} avg` 
    },
    { 
      label: 'Escalations', 
      value: escalationCount.toString(), 
      icon: AlertTriangle, 
      change: `${((escalationCount / (analyticsData?.length || 1)) * 100).toFixed(1)}% rate` 
    }
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={responseTimeData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="response_time" 
                stroke="#22d3ee" 
                strokeWidth={2}
                dot={{ fill: '#22d3ee', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversationTrends}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="conversations" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={questionTypes}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {questionTypes?.map((entry, index) => (
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
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Real-time performance metrics and insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
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
              Analytics Visualizations
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

      {/* Recent Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Analytics Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData?.slice(0, 10).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.escalated ? 'bg-red-500' : 'bg-green-500'}`} />
                  <div>
                    <p className="font-medium">{item.question_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.response_time_ms}ms</p>
                  <p className="text-xs text-muted-foreground">{item.tokens_used} tokens</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
