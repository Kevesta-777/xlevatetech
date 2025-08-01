import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const careerData = [
  {
    year: 2012,
    company: 'Leasing & Management',
    processOpt: 25,
    aiAutomation: 5,
    dataAnalysis: 30,
    systemInt: 20,
    projMgmt: 35,
    timeSaved: 0,
    moneySaved: 0,
    roi: 0
  },
  {
    year: 2015,
    company: 'Bswift',
    processOpt: 60,
    aiAutomation: 40,
    dataAnalysis: 70,
    systemInt: 55,
    projMgmt: 65,
    timeSaved: 1000,
    moneySaved: 85000,
    roi: 120
  },
  {
    year: 2019,
    company: 'Bounteous',
    processOpt: 85,
    aiAutomation: 75,
    dataAnalysis: 90,
    systemInt: 80,
    projMgmt: 88,
    timeSaved: 3000,
    moneySaved: 250000,
    roi: 320
  },
  {
    year: 2025,
    company: 'XlevateTech',
    processOpt: 95,
    aiAutomation: 90,
    dataAnalysis: 95,
    systemInt: 88,
    projMgmt: 92,
    timeSaved: 5000,
    moneySaved: 520000,
    roi: 520
  }
];

const companyColors = {
  'Leasing & Management': '#3B82F6',
  'Bswift': '#6366F1', 
  'Bounteous': '#8B5CF6',
  'XlevateTech': '#00D9FF'
};

export const CareerTimelineChart = () => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      if (data) {
        return (
          <div className="bg-elevate-dark/95 border border-elevate-accent/30 rounded-lg p-4 shadow-xl">
            <p className="text-white font-semibold mb-3">{data.company} ({label})</p>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300 text-sm">Process Optimization:</p>
                  <p className="text-elevate-accent font-semibold">{data.processOpt}%</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">AI Automation:</p>
                  <p className="text-elevate-accent font-semibold">{data.aiAutomation}%</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">Data Analysis:</p>
                  <p className="text-elevate-accent font-semibold">{data.dataAnalysis}%</p>
                </div>
                <div>
                  <p className="text-gray-300 text-sm">System Integration:</p>
                  <p className="text-elevate-accent font-semibold">{data.systemInt}%</p>
                </div>
              </div>
              {data.timeSaved > 0 && (
                <div className="pt-2 border-t border-elevate-accent/20">
                  <p className="text-gray-300 text-sm">Time Saved: <span className="text-elevate-accent font-semibold">{data.timeSaved.toLocaleString()} hrs</span></p>
                  <p className="text-gray-300 text-sm">Value: <span className="text-elevate-accent font-semibold">${data.moneySaved.toLocaleString()}</span></p>
                  <p className="text-gray-300 text-sm">ROI: <span className="text-elevate-accent font-semibold">{data.roi}%</span></p>
                </div>
              )}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  const CustomLegend = ({ payload }: { payload?: Array<{ color: string; value: string }> }) => {
    return (
      <div className="grid grid-cols-2 justify-items-start lg:grid-cols-4 lg:justify-items-center gap-2 mt-4">
        {payload?.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-white text-sm whitespace-nowrap text-wrap">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 rounded-2xl p-4 md:p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Career Timeline
        </h3>
        <p className="text-gray-300 mb-6">
          Evolution of expertise across key skill areas and measurable impact
        </p>
      </div>

      <div className="h-80 md:h-96 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={careerData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="processOptGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00D9FF" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="aiAutomationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="dataAnalysisGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="systemIntGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#95A5A6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#95A5A6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="year" 
              tick={{ fill: '#ffffff', fontSize: 12 }}
              axisLine={{ stroke: '#ffffff' }}
            />
            <YAxis 
              tick={{ fill: '#ffffff', fontSize: 12 }}
              axisLine={{ stroke: '#ffffff' }}
              label={{ value: 'Proficiency %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#ffffff' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            <Area
              type="monotone"
              dataKey="processOpt"
              stackId="1"
              stroke="#00D9FF"
              fill="url(#processOptGradient)"
              strokeWidth={2}
              name="Process Optimization"
            />
            <Area
              type="monotone"
              dataKey="aiAutomation"
              stackId="2"
              stroke="#FF6B6B"
              fill="url(#aiAutomationGradient)"
              strokeWidth={2}
              name="AI Automation"
            />
            <Area
              type="monotone"
              dataKey="dataAnalysis"
              stackId="3"
              stroke="#4ECDC4"
              fill="url(#dataAnalysisGradient)"
              strokeWidth={2}
              name="Data Analysis"
            />
            <Area
              type="monotone"
              dataKey="systemInt"
              stackId="4"
              stroke="#95A5A6"
              fill="url(#systemIntGradient)"
              strokeWidth={2}
              name="System Integration"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Company Timeline */}
      <div className="relative">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white">Career Progression</h4>
        </div>
        
        <div className="relative h-[272px] md:h-[208px]">
          {/* Timeline line */} 
          <div className="absolute inset-0 top-1/2 z-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 to-cyan-400 rounded-full transform -translate-y-1/2"></div>
          
          {/* Company markers */}
          <div className="relative grid grid-flow-col h-full items-center sm:py-8">
            {careerData.map((item, index) => (
              <div key={item.year} className="flex flex-col items-center group cursor-pointer relative flex-1 justify-between h-36 md:h-36">
                <div 
                  className="w-8 h-8 rounded-full border-4 border-white shadow-lg transform hover:scale-110 transition-all duration-300 z-10 relative"
                  style={{ backgroundColor: companyColors[item.company as keyof typeof companyColors] }}
                ></div>
                <div className="absolute inset-0 flex top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                  <div className="bg-elevate-dark/95 border border-elevate-accent/30 rounded-lg p-3 shadow-xl whitespace-nowrap text-center">
                    <p className="text-white font-semibold text-sm text-wrap">{item.company}</p>
                    <p className="text-elevate-accent text-xs">{item.year}</p>
                    {item.roi > 0 && (
                      <p className="text-gray-300 text-xs mt-1">{item.roi}% ROI</p>
                    )}
                  </div>
                </div>
                
                {/* Always visible labels */}
                <div className="mt-4 text-center">
                  <p className="text-white text-xs md:text-sm font-medium leading-tight">{item.company}</p>
                  <p className="text-elevate-accent text-xs">{item.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-elevate-dark/30 rounded-lg border border-elevate-accent/10">
          <p className="text-2xl font-bold text-elevate-accent">10+</p>
          <p className="text-gray-300 text-sm">Years Experience</p>
        </div>
        <div className="text-center p-4 bg-elevate-dark/30 rounded-lg border border-elevate-accent/10">
          <p className="text-2xl font-bold text-elevate-accent">5K+</p>
          <p className="text-gray-300 text-sm">Hours Saved</p>
        </div>
        <div className="text-center p-4 bg-elevate-dark/30 rounded-lg border border-elevate-accent/10">
          <p className="text-2xl font-bold text-elevate-accent">$520K+</p>
          <p className="text-gray-300 text-sm">Value Generated</p>
        </div>
        <div className="text-center p-4 bg-elevate-dark/30 rounded-lg border border-elevate-accent/10">
          <p className="text-2xl font-bold text-elevate-accent">520%</p>
          <p className="text-gray-300 text-sm">Max ROI Achieved</p>
        </div>
      </div>
    </div>
  );
};