import { useState, useEffect } from 'react';
import { TrendingUp, Users, Clock, Eye, Share2, Heart } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataVisualizationProps {
  type: 'engagement' | 'growth' | 'industry';
  category?: string;
}

export const DataVisualization = ({ type, category = 'All' }: DataVisualizationProps) => {
  const [activeChart, setActiveChart] = useState<'line' | 'bar' | 'pie'>('line');

  // Engagement Data
  const engagementData = [
    { month: 'Jul', views: 12500, shares: 340, likes: 890, comments: 156 },
    { month: 'Aug', views: 15200, shares: 420, likes: 1120, comments: 198 },
    { month: 'Sep', views: 18800, shares: 580, likes: 1450, comments: 267 },
    { month: 'Oct', views: 22100, shares: 720, likes: 1780, comments: 334 },
    { month: 'Nov', views: 28900, shares: 950, likes: 2340, comments: 445 },
    { month: 'Dec', views: 35600, shares: 1240, likes: 2890, comments: 567 },
    { month: 'Jan', views: 42300, shares: 1580, likes: 3450, comments: 689 }
  ];

  // Growth Data by Industry
  const industryGrowthData = [
    { industry: 'Healthcare', growth: 86, market: 80.38, adoption: 'High' },
    { industry: 'Finance', growth: 82, market: 18.4, adoption: 'Very High' },
    { industry: 'Real Estate', growth: 76, market: 303.06, adoption: 'Medium' },
    { industry: 'Manufacturing', growth: 71, market: 89.2, adoption: 'High' },
    { industry: 'Retail', growth: 68, market: 45.7, adoption: 'Medium' }
  ];

  // Market Share Data
  const marketShareData = [
    { name: 'Healthcare', value: 35, color: '#22d3ee' },
    { name: 'Finance', value: 28, color: '#a855f7' },
    { name: 'Real Estate', value: 20, color: '#f59e0b' },
    { name: 'Manufacturing', value: 12, color: '#10b981' },
    { name: 'Other', value: 5, color: '#6b7280' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-elevate-dark border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium mb-2">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderEngagementChart = () => {
    switch (activeChart) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} className="text-gray-400" />
              <YAxis axisLine={false} tickLine={false} className="text-gray-400" />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="views" stroke="#22d3ee" strokeWidth={3} dot={{ fill: '#22d3ee', strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="shares" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', strokeWidth: 2, r: 3 }} />
              <Line type="monotone" dataKey="likes" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={industryGrowthData}>
              <XAxis dataKey="industry" axisLine={false} tickLine={false} className="text-gray-400" />
              <YAxis axisLine={false} tickLine={false} className="text-gray-400" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="growth" fill="#22d3ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={marketShareData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                className="text-white text-sm"
              >
                {marketShareData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const getChartTitle = () => {
    switch (type) {
      case 'engagement':
        return 'Content Engagement Analytics';
      case 'growth':
        return '2025 Industry Growth Metrics';
      case 'industry':
        return 'Market Share Distribution';
      default:
        return 'Data Visualization';
    }
  };

  const getMetrics = () => {
    const latest = engagementData[engagementData.length - 1];
    return [
      { label: 'Total Views', value: latest.views.toLocaleString(), icon: Eye, change: '+32%' },
      { label: 'Shares', value: latest.shares.toLocaleString(), icon: Share2, change: '+28%' },
      { label: 'Likes', value: latest.likes.toLocaleString(), icon: Heart, change: '+45%' },
      { label: 'Engagement Rate', value: '8.4%', icon: Users, change: '+12%' }
    ];
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            {getChartTitle()}
          </CardTitle>
          <div className="flex items-center gap-2">
            {['line', 'bar', 'pie'].map((chartType) => (
              <button
                key={chartType}
                onClick={() => setActiveChart(chartType as any)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  activeChart === chartType
                    ? 'bg-accent text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {getMetrics().map((metric, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <metric.icon className="h-4 w-4 text-accent" />
                <span className="text-xs text-gray-400">{metric.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-white">{metric.value}</span>
                <span className="text-xs text-green-400">{metric.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white/5 rounded-lg p-4">
          {renderEngagementChart()}
        </div>

        {/* Insights */}
        <div className="mt-6 p-4 bg-accent/10 rounded-lg">
          <h4 className="text-white font-medium mb-2">Key Insights</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• Content engagement increased 45% month-over-month</li>
            <li>• Healthcare automation content shows highest engagement rates</li>
            <li>• Peak reading times: Tuesday-Thursday, 9-11 AM EST</li>
            <li>• Social shares increased 28% with improved content curation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};