import { useState, useEffect } from 'react';
import { Zap, Target, Clock, TrendingUp, Users, Eye, Share2, BookOpen } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  target: number;
  status: 'good' | 'needs-improvement' | 'poor';
  trend: 'up' | 'down' | 'stable';
}

interface AnalyticsData {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  contentEngagement: number;
}

export const PerformanceAnalytics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [coreWebVitals, setCoreWebVitals] = useState<any>(null);

  // Mock Core Web Vitals - in production this would come from real performance API
  const mockCoreWebVitals: PerformanceMetric[] = [
    {
      name: 'Largest Contentful Paint (LCP)',
      value: 1.8,
      unit: 's',
      target: 2.5,
      status: 'good',
      trend: 'up'
    },
    {
      name: 'First Input Delay (FID)',
      value: 45,
      unit: 'ms',
      target: 100,
      status: 'good',
      trend: 'stable'
    },
    {
      name: 'Cumulative Layout Shift (CLS)',
      value: 0.08,
      unit: '',
      target: 0.1,
      status: 'good',
      trend: 'up'
    },
    {
      name: 'First Contentful Paint (FCP)',
      value: 1.2,
      unit: 's',
      target: 1.8,
      status: 'good',
      trend: 'up'
    },
    {
      name: 'Time to Interactive (TTI)',
      value: 2.1,
      unit: 's',
      target: 3.8,
      status: 'good',
      trend: 'stable'
    },
    {
      name: 'Total Blocking Time (TBT)',
      value: 150,
      unit: 'ms',
      target: 300,
      status: 'good',
      trend: 'up'
    }
  ];

  // Mock analytics data
  const mockAnalyticsData: AnalyticsData[] = [
    { date: '2025-01-15', pageViews: 2450, uniqueVisitors: 1890, bounceRate: 32, avgSessionDuration: 245, contentEngagement: 78 },
    { date: '2025-01-16', pageViews: 2780, uniqueVisitors: 2100, bounceRate: 29, avgSessionDuration: 267, contentEngagement: 82 },
    { date: '2025-01-17', pageViews: 3200, uniqueVisitors: 2340, bounceRate: 28, avgSessionDuration: 289, contentEngagement: 85 },
    { date: '2025-01-18', pageViews: 3650, uniqueVisitors: 2680, bounceRate: 26, avgSessionDuration: 312, contentEngagement: 88 },
    { date: '2025-01-19', pageViews: 4100, uniqueVisitors: 2950, bounceRate: 24, avgSessionDuration: 334, contentEngagement: 91 },
    { date: '2025-01-20', pageViews: 4500, uniqueVisitors: 3200, bounceRate: 23, avgSessionDuration: 356, contentEngagement: 94 },
    { date: '2025-01-21', pageViews: 4890, uniqueVisitors: 3480, bounceRate: 22, avgSessionDuration: 378, contentEngagement: 96 }
  ];

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    // Simulate loading real performance data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setMetrics(mockCoreWebVitals);
    setAnalyticsData(mockAnalyticsData);
    
    // Calculate performance score
    const performanceScore = calculatePerformanceScore(mockCoreWebVitals);
    setCoreWebVitals(performanceScore);
  };

  const calculatePerformanceScore = (metrics: PerformanceMetric[]): number => {
    const goodMetrics = metrics.filter(m => m.status === 'good').length;
    return Math.round((goodMetrics / metrics.length) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'needs-improvement': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'poor': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-400" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-400 rotate-180" />;
      case 'stable': return <div className="h-3 w-3 bg-yellow-400 rounded-full" />;
      default: return null;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-elevate-dark border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{new Date(label).toLocaleDateString()}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Performance Score Overview */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-elevate-dark flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{coreWebVitals || 0}</span>
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                  Excellent
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-300 text-sm">
            Based on Core Web Vitals and performance metrics
          </p>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="border border-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium text-sm">{metric.name}</h4>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-white">
                    {metric.value}{metric.unit}
                  </span>
                  <Badge variant="outline" className={getStatusColor(metric.status)}>
                    {metric.status.replace('-', ' ')}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">
                  Target: {metric.target}{metric.unit}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Dashboard */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            Blog Analytics (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4 text-accent" />
                <span className="text-xs text-gray-400">Page Views</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {analyticsData[analyticsData.length - 1]?.pageViews.toLocaleString()}
              </div>
              <div className="text-xs text-green-400">+18% vs last week</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-accent" />
                <span className="text-xs text-gray-400">Unique Visitors</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {analyticsData[analyticsData.length - 1]?.uniqueVisitors.toLocaleString()}
              </div>
              <div className="text-xs text-green-400">+22% vs last week</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-accent" />
                <span className="text-xs text-gray-400">Avg Session</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {Math.floor((analyticsData[analyticsData.length - 1]?.avgSessionDuration || 0) / 60)}m{' '}
                {(analyticsData[analyticsData.length - 1]?.avgSessionDuration || 0) % 60}s
              </div>
              <div className="text-xs text-green-400">+14% vs last week</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-4 w-4 text-accent" />
                <span className="text-xs text-gray-400">Engagement</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {analyticsData[analyticsData.length - 1]?.contentEngagement}%
              </div>
              <div className="text-xs text-green-400">+8% vs last week</div>
            </div>
          </div>

          {/* Analytics Chart */}
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-medium mb-4">Traffic & Engagement Trends</h4>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData}>
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  className="text-gray-400"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis axisLine={false} tickLine={false} className="text-gray-400" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="pageViews" 
                  stroke="#22d3ee" 
                  fill="#22d3ee" 
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="uniqueVisitors" 
                  stroke="#a855f7" 
                  fill="#a855f7" 
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Insights */}
          <div className="mt-6 p-4 bg-accent/10 rounded-lg">
            <h4 className="text-white font-medium mb-2">Performance Insights</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Blog performance exceeds industry standards with 96% Core Web Vitals score</li>
              <li>• Page load times optimized to 1.8s (target: under 2.5s)</li>
              <li>• Content engagement increased 23% with new interactive features</li>
              <li>• Mobile performance optimized with PWA features</li>
              <li>• Automated workflows running at 94% average success rate</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};