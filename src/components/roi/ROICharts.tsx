import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ROIChartsProps {
  industry: string;
  timeSavings: number;
  costSavings: number;
  errorReduction: number;
  roi: number;
  currentCosts: number;
  projectedCosts: number;
}

const ROICharts = ({ 
  industry, 
  timeSavings, 
  costSavings, 
  errorReduction, 
  roi,
  currentCosts,
  projectedCosts 
}: ROIChartsProps) => {
  // Bar chart data - Before vs After comparison
  const barData = [
    {
      metric: 'Processing Time (hrs/week)',
      before: Math.round(timeSavings / 0.5), // Reverse calculate original time
      after: Math.round(timeSavings / 0.5) - timeSavings / 52,
    },
    {
      metric: 'Error Rate (%)',
      before: 15,
      after: Math.round(15 * (1 - errorReduction / 100)),
    },
    {
      metric: 'Labor Costs ($K/year)',
      before: Math.round(currentCosts / 1000),
      after: Math.round(projectedCosts / 1000),
    }
  ];

  // Line chart data - ROI over time
  const lineData = [
    { month: 'Month 1', investment: -50000, savings: 5000, netROI: -45000 },
    { month: 'Month 3', investment: -75000, savings: 20000, netROI: -55000 },
    { month: 'Month 6', investment: -100000, savings: 45000, netROI: -55000 },
    { month: 'Month 9', investment: -100000, savings: 70000, netROI: -30000 },
    { month: 'Month 12', investment: -100000, savings: costSavings, netROI: costSavings - 100000 },
  ];

  // Pie chart data - Cost breakdown
  const pieData = [
    { name: 'Labor Savings', value: costSavings * 0.6, color: '#70EDFF' },
    { name: 'Error Reduction', value: costSavings * 0.25, color: '#4A90E2' },
    { name: 'Efficiency Gains', value: costSavings * 0.15, color: '#00C9A7' },
  ];

  const chartColors = {
    primary: '#70EDFF',
    secondary: '#4A90E2', 
    accent: '#00C9A7',
    warning: '#FFA500',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0'
  };

  return (
    <div className="roi-charts-container grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {/* Bar Chart - Before vs After */}
      <div className="roi-chart-card bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="roi-chart-title text-white font-semibold mb-4 text-center">Before vs After Automation</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData} margin={{ top: 20, right: 10, left: 10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="metric" 
              tick={{ fill: chartColors.textSecondary, fontSize: 9 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fill: chartColors.textSecondary, fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.9)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend wrapperStyle={{ color: chartColors.text }} />
            <Bar dataKey="before" fill={chartColors.warning} name="Before" />
            <Bar dataKey="after" fill={chartColors.primary} name="After" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - ROI Timeline */}
      <div className="roi-chart-card bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="roi-chart-title text-white font-semibold mb-4 text-center">ROI Timeline</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={lineData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: chartColors.textSecondary, fontSize: 9 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            <YAxis 
              tick={{ fill: chartColors.textSecondary, fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.9)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Line 
              type="monotone" 
              dataKey="netROI" 
              stroke={chartColors.primary} 
              strokeWidth={3}
              dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: chartColors.primary, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Savings Breakdown */}
      <div className="roi-chart-card bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="roi-chart-title text-white font-semibold mb-4 text-center">Savings Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              label={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(0,0,0,0.2)', 
                border: '1px solid rgba(255,255,255,0.9)',
                borderRadius: '8px',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}      // Text color for value
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ 
                fontSize: '12px',
                color: chartColors.textSecondary,
                paddingTop: '10px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ROICharts;