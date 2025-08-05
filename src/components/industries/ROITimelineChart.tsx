
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { ChartContainer } from "../ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

// ROI timeline data showing payback periods
const roiData = [
  { month: "Month 1", Starter: -100, Professional: -100, Premium: -100 },
  { month: "Month 2", Starter: -75, Professional: -80, Premium: -85 },
  { month: "Month 3", Starter: -45, Professional: -55, Premium: -65 },
  { month: "Month 4", Starter: -10, Professional: -25, Premium: -40 },
  { month: "Month 5", Starter: 25, Professional: 5, Premium: -15 },
  { month: "Month 6", Starter: 65, Professional: 40, Premium: 15 },
  { month: "Month 7", Starter: 110, Professional: 80, Premium: 50 },
  { month: "Month 8", Starter: 160, Professional: 125, Premium: 90 },
  { month: "Month 9", Starter: 215, Professional: 175, Premium: 135 },
  { month: "Month 10", Starter: 275, Professional: 230, Premium: 185 },
  { month: "Month 11", Starter: 340, Professional: 290, Premium: 240 },
  { month: "Month 12", Starter: 410, Professional: 355, Premium: 300 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-elevate-dark border border-elevate-accent/30 rounded-lg p-3 shadow-lg">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey}: {entry.value > 0 ? '+' : ''}{entry.value}% ROI
          </p>
        ))}
        <p className="text-gray-400 text-xs mt-1">
          {payload[0]?.value >= 0 ? 'Positive ROI achieved' : 'Investment payback period'}
        </p>
      </div>
    );
  }
  return null;
};

export const ROITimelineChart = React.memo(() => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="chart-container-mobile">
        <div className={`chart-inner-mobile ${!isMobile ? "!min-w-full !w-full" : ""}`}>
          <ChartContainer 
            config={{
              Starter: { theme: { light: "#0EA5E9", dark: "#0EA5E9" }, label: "Starter Package" },
              Professional: { theme: { light: "#10B981", dark: "#10B981" }, label: "Professional Package" },
              Premium: { theme: { light: "#A855F7", dark: "#A855F7" }, label: "Premium Package" },
            }}
            className="h-full w-full"
          >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={roiData}
              margin={{ top: 20, right: 30, left: 20, bottom: isMobile ? 60 : 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="#aaa"
                tick={{ fill: '#aaa', fontSize: isMobile ? 9 : 11 }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 80 : 60}
                interval={isMobile ? 1 : 0}
              />
              <YAxis 
                stroke="#aaa" 
                tick={{ fill: '#aaa', fontSize: 11 }}
                tickFormatter={(value) => `${value}%`}
                label={{ 
                  value: 'ROI (%)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { fill: '#aaa', fontSize: 11 }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top"
                align="center" 
                height={36}
                wrapperStyle={{ 
                  fontSize: 11, 
                  paddingBottom: 10
                }}
                iconSize={12}
              />
              
              {/* Break-even line at 0% ROI */}
              <ReferenceLine 
                y={0} 
                stroke="#F43F5E" 
                strokeDasharray="8 8" 
                strokeWidth={2}
                label={{ 
                  value: "Break-even", 
                  position: "top", 
                  fill: "#F43F5E", 
                  fontSize: 10 
                }}
              />
              
              <Line 
                type="monotone" 
                dataKey="Starter" 
                stroke="#0EA5E9" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "#0EA5E9" }} 
                name="Starter Package"
                activeDot={{ r: 6, fill: "#0EA5E9" }}
              />
              <Line 
                type="monotone" 
                dataKey="Professional" 
                stroke="#10B981" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "#10B981" }} 
                name="Professional Package"
                activeDot={{ r: 6, fill: "#10B981" }}
              />
              <Line 
                type="monotone" 
                dataKey="Premium" 
                stroke="#A855F7" 
                strokeWidth={3} 
                dot={{ r: 4, fill: "#A855F7" }} 
                name="Premium Package"
                activeDot={{ r: 6, fill: "#A855F7" }}
              />
            </LineChart>
          </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
});

ROITimelineChart.displayName = "ROITimelineChart";
