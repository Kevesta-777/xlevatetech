import { useState } from 'react';
import { TrendingUp, Info, ExternalLink, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { marketStatistics2025, type MarketStatistic } from "@/data/marketData2025";

interface MarketDataWidgetProps {
  category?: string;
  limit?: number;
}

export const MarketDataWidget = ({ category, limit = 4 }: MarketDataWidgetProps) => {
  const [selectedStat, setSelectedStat] = useState<MarketStatistic | null>(null);

  const filteredStats = category && category !== 'All' 
    ? marketStatistics2025.filter(stat => 
        stat.label.toLowerCase().includes(category.toLowerCase()) ||
        stat.source.toLowerCase().includes(category.toLowerCase())
      ).slice(0, limit)
    : marketStatistics2025.slice(0, limit);

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              2025 Market Intelligence
            </h3>
            <Badge className="bg-accent text-black font-semibold">Live Data</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredStats.map((stat) => (
            <div 
              key={stat.id}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-accent">{stat.value}</span>
                    <span className="text-sm font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-white font-medium mb-2">{stat.label}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    Updated: {new Date(stat.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setSelectedStat(stat)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <p className="font-medium mb-2">{stat.source}</p>
                        <p className="text-sm text-gray-300">{stat.methodology}</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-accent"
                          onClick={() => window.open(stat.sourceUrl, '_blank')}
                        >
                          View Source <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-2">
              Sources: McKinsey, Gartner, Deloitte, Salesforce Research 2025
            </p>
            <Button 
              variant="outline"
              size="sm"
              className="border-accent/30 text-accent hover:bg-accent/10"
              onClick={() => window.location.href = '/automation-roi-calculator'}
            >
              Calculate Your ROI
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};