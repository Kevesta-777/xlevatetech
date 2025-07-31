import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const skillData = [
  { skill: 'AI Automation', value: 90, color: '#00D9FF' },
  { skill: 'Process Optimization', value: 95, color: '#FF6B6B' },
  { skill: 'Data Analysis', value: 85, color: '#4ECDC4' },
  { skill: 'System Integration', value: 88, color: '#95A5A6' },
  { skill: 'Project Management', value: 92, color: '#F1C40F' },
  { skill: 'Business Strategy', value: 80, color: '#E74C3C' },
];

const timelineData = [
  { year: 2015, 'AI Automation': 0, 'Process Optimization': 25, 'Data Analysis': 30, 'System Integration': 20, 'Project Management': 35, 'Business Strategy': 25 },
  { year: 2017, 'AI Automation': 10, 'Process Optimization': 40, 'Data Analysis': 45, 'System Integration': 35, 'Project Management': 50, 'Business Strategy': 40 },
  { year: 2019, 'AI Automation': 85, 'Process Optimization': 85, 'Data Analysis': 85, 'System Integration': 80, 'Project Management': 92, 'Business Strategy': 80 },
  { year: 2021, 'AI Automation': 88, 'Process Optimization': 90, 'Data Analysis': 100, 'System Integration': 85, 'Project Management': 95, 'Business Strategy': 85 },
  { year: 2023, 'AI Automation': 90, 'Process Optimization': 95, 'Data Analysis': 85, 'System Integration': 88, 'Project Management': 92, 'Business Strategy': 80 },
  { year: 2025, 'AI Automation': 90, 'Process Optimization': 95, 'Data Analysis': 85, 'System Integration': 88, 'Project Management': 92, 'Business Strategy': 80 },
];

export const SkillGrowthChart = () => {
  const [activeView, setActiveView] = useState<'radar' | 'timeline'>('radar');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-elevate-dark/95 border border-elevate-accent/30 rounded-lg p-4 shadow-xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-elevate-accent">
              {entry.dataKey}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Skill Growth: Ops to AI Expert
        </h3>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveView('radar')}
            className={`px-6 py-2 rounded-lg transition-all duration-300 ${
              activeView === 'radar'
                ? 'bg-elevate-accent text-white'
                : 'bg-elevate-dark/50 text-gray-300 hover:bg-elevate-accent/20'
            }`}
          >
            Current Skills
          </button>
          <button
            onClick={() => setActiveView('timeline')}
            className={`px-6 py-2 rounded-lg transition-all duration-300 ${
              activeView === 'timeline'
                ? 'bg-elevate-accent text-white'
                : 'bg-elevate-dark/50 text-gray-300 hover:bg-elevate-accent/20'
            }`}
          >
            Growth Timeline
          </button>
        </div>
      </div>

      <div className="h-96 w-full">
        {activeView === 'radar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={skillData}>
              <PolarGrid 
                stroke="rgba(255, 255, 255, 0.1)" 
                radialLines={true}
              />
              <PolarAngleAxis 
                dataKey="skill" 
                tick={{ 
                  fill: '#ffffff', 
                  fontSize: 12, 
                  fontWeight: 500 
                }}
                className="text-white text-sm"
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ 
                  fill: '#00D9FF', 
                  fontSize: 10 
                }}
                tickCount={6}
              />
              <Radar
                name="Skill Level"
                dataKey="value"
                stroke="#00D9FF"
                fill="#00D9FF"
                fillOpacity={0.3}
                strokeWidth={3}
                dot={{ fill: '#00D9FF', strokeWidth: 2, r: 4 }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
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
              <Legend 
                wrapperStyle={{ color: '#ffffff' }}
                iconType="line"
              />
              <Line type="monotone" dataKey="AI Automation" stroke="#00D9FF" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Process Optimization" stroke="#FF6B6B" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Data Analysis" stroke="#4ECDC4" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="System Integration" stroke="#95A5A6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Project Management" stroke="#F1C40F" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Business Strategy" stroke="#E74C3C" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {skillData.map((skill, index) => (
          <div key={skill.skill} className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: skill.color }}
            />
            <span className="text-gray-300 text-sm">{skill.skill}</span>
            <span className="text-elevate-accent font-semibold text-sm">{skill.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};