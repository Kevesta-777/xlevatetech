
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer } from "../ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

// Latest data from Precedence Research 2024 Market Analysis
const marketShareData = [
  { name: "AI & ML", value: 42, color: "#0EA5E9" },
  { name: "Cloud Services", value: 28, color: "#10B981" },
  { name: "Mobile Technologies", value: 20, color: "#A855F7" },
  { name: "Traditional Systems", value: 10, color: "#F43F5E" }
];

export const MarketShareChart = React.memo(() => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full overflow-x-auto">
      <div className={`h-[320px] ${isMobile ? "min-w-[300px]" : "w-full"}`}>
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
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: isMobile ? 30 : 10 }}>
              <Pie
                data={marketShareData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={isMobile ? 65 : 80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {marketShareData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1F2C', border: '1px solid #2A2F3C' }} 
                itemStyle={{ color: '#fff' }}
                formatter={(value) => [`${value}% market share`]} 
              />
              <Legend
                layout={isMobile ? "horizontal" : "vertical"}
                verticalAlign={isMobile ? "bottom" : "middle"}
                align={isMobile ? "center" : "right"}
                wrapperStyle={{ 
                  fontSize: 11, 
                  paddingLeft: isMobile ? 0 : 20,
                  paddingTop: isMobile ? 10 : 0
                }}
                iconSize={10}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
});

MarketShareChart.displayName = "MarketShareChart";
