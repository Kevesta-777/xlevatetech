
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer } from "../ui/chart";
import { useIsMobile } from "@/hooks/use-mobile";

// Pricing comparison data based on market research
const pricingData = [
  {
    service: "AI Automation",
    Enterprise: 15000,
    Freelancer: 8000,
    Xlevate: 4500,
    XlevateSavings: "70%"
  },
  {
    service: "Process Optimization",
    Enterprise: 12000,
    Freelancer: 6500,
    Xlevate: 6600,
    XlevateSavings: "45%"
  },
  {
    service: "System Migration",
    Enterprise: 18000,
    Freelancer: 10000,
    Xlevate: 4000,
    XlevateSavings: "78%"
  },
  {
    service: "QA & Testing",
    Enterprise: 9000,
    Freelancer: 5000,
    Xlevate: 3000,
    XlevateSavings: "67%"
  }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const xlevateData = payload.find((p: any) => p.dataKey === 'Xlevate');
    const enterpriseData = payload.find((p: any) => p.dataKey === 'Enterprise');
    const savings = pricingData.find(d => d.service === label)?.XlevateSavings;
    
    return (
      <div className="bg-elevate-dark border border-elevate-accent/30 rounded-lg p-3 shadow-lg">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey}: ${entry.value.toLocaleString()}
          </p>
        ))}
        {xlevateData && enterpriseData && (
          <p className="text-elevate-accent font-semibold text-sm mt-2">
            Save {savings} vs Enterprise
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const PricingComparisonChart = React.memo(() => {
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="chart-container-mobile">
        <div className={`chart-inner-mobile ${!isMobile ? "!min-w-full !w-full" : ""}`}>
          <ChartContainer 
            config={{
              Enterprise: { theme: { light: "#64748B", dark: "#64748B" }, label: "Enterprise" },
              Freelancer: { theme: { light: "#94A3B8", dark: "#94A3B8" }, label: "Freelancer" },
              Xlevate: { theme: { light: "#0EA5E9", dark: "#0EA5E9" }, label: "Xlevate" },
            }}
            className="h-full w-full"
          >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pricingData}
              margin={{ top: 20, right: 30, left: 20, bottom: isMobile ? 60 : 40 }}
              barGap={10}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
              <XAxis 
                dataKey="service" 
                stroke="#aaa"
                tick={{ fill: '#aaa', fontSize: isMobile ? 10 : 11 }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 80 : 60}
                interval={0}
              />
              <YAxis 
                stroke="#aaa" 
                tick={{ fill: '#aaa', fontSize: 11 }}
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                label={{ 
                  value: 'Price ($)', 
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
              <Bar 
                dataKey="Enterprise" 
                fill="#64748B" 
                name="Enterprise Solutions"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="Freelancer" 
                fill="#94A3B8" 
                name="Freelancer Services"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="Xlevate" 
                fill="#0EA5E9" 
                name="Xlevate Tech"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
});

PricingComparisonChart.displayName = "PricingComparisonChart";
