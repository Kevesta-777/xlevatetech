
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer } from "../ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

// Latest data from Statista 2024 Global Technology Market Report
const techTrendsData = [
  { year: "2020", ai: 25, cloud: 45, mobile: 65, traditional: 40 },
  { year: "2021", ai: 35, cloud: 55, mobile: 70, traditional: 30 },
  { year: "2022", ai: 48, cloud: 65, mobile: 72, traditional: 25 },
  { year: "2023", ai: 62, cloud: 75, mobile: 75, traditional: 20 },
  { year: "2024", ai: 78, cloud: 82, mobile: 78, traditional: 15 },
  { year: "2025", ai: 85, cloud: 88, mobile: 80, traditional: 12 }
];

export const TechTrendsChart = React.memo(() => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full overflow-x-auto">
      <div className={`h-[320px] ${isMobile ? "min-w-[400px]" : "w-full"}`}>
        <ChartContainer 
          config={{
            ai: { theme: { light: "#0EA5E9", dark: "#0EA5E9" }, label: "AI & ML" },
            cloud: { theme: { light: "#10B981", dark: "#10B981" }, label: "Cloud" },
            mobile: { theme: { light: "#A855F7", dark: "#A855F7" }, label: "Mobile" },
            traditional: { theme: { light: "#F43F5E", dark: "#F43F5E" }, label: "Traditional" },
          }}
          className="h-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={techTrendsData}
              margin={{ top: 10, right: 10, left: -15, bottom: isMobile ? 40 : 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="year" 
                stroke="#aaa"
                tick={{ fill: '#aaa', fontSize: 11 }}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis 
                stroke="#aaa" 
                domain={[0, 100]}
                tick={{ fill: '#aaa', fontSize: 11 }}
                label={{ 
                  value: 'Market Share %', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { fill: '#aaa', fontSize: 11 }, 
                  offset: -5
                }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1F2C', border: '1px solid #2A2F3C' }} 
                itemStyle={{ color: '#fff' }}
                formatter={(value) => [`${value}%`]}
              />
              <Legend 
                verticalAlign={isMobile ? "bottom" : "bottom"}
                align="center" 
                height={isMobile ? 48 : 36}
                wrapperStyle={{ 
                  fontSize: 11, 
                  paddingTop: isMobile ? 10 : 5,
                  paddingBottom: isMobile ? 5 : 0
                }}
                iconSize={8}
                layout={isMobile ? "vertical" : "horizontal"}
              />
              <Line 
                type="monotone" 
                dataKey="ai" 
                stroke="#0EA5E9" 
                strokeWidth={3} 
                dot={{ r: 3 }} 
                name="AI & ML"
              />
              <Line 
                type="monotone" 
                dataKey="cloud" 
                stroke="#10B981" 
                strokeWidth={2} 
                name="Cloud Services" 
              />
              <Line 
                type="monotone" 
                dataKey="mobile" 
                stroke="#A855F7" 
                strokeWidth={2} 
                name="Mobile Tech" 
              />
              <Line 
                type="monotone" 
                dataKey="traditional" 
                stroke="#F43F5E" 
                strokeWidth={2} 
                name="Traditional" 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
});

TechTrendsChart.displayName = "TechTrendsChart";
