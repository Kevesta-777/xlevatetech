import { BarChart3, Building2, Heart, DollarSign, Home, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { industryInsights2025, getIndustryInsight } from "@/data/marketData2025";

interface IndustryInsightsWidgetProps {
  selectedIndustry?: string;
}

export const IndustryInsightsWidget = ({ selectedIndustry }: IndustryInsightsWidgetProps) => {
  const getIndustryIcon = (industry: string) => {
    switch (industry.toLowerCase()) {
      case 'healthcare': return <Heart className="h-5 w-5" />;
      case 'finance': return <DollarSign className="h-5 w-5" />;
      case 'real estate': return <Home className="h-5 w-5" />;
      default: return <Building2 className="h-5 w-5" />;
    }
  };

  const selectedInsight = selectedIndustry ? getIndustryInsight(selectedIndustry) : null;
  const displayInsights = selectedInsight ? [selectedInsight] : industryInsights2025;

  return (
    <Card className="bg-gradient-to-br from-elevate-dark/50 to-elevate-dark/80 border-elevate-accent/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-elevate-accent" />
          <h3 className="text-xl font-semibold text-white">
            {selectedIndustry ? `${selectedIndustry} Insights` : 'Industry Insights 2025'}
          </h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {displayInsights.map((insight) => (
          <div key={insight.industry} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-elevate-accent/20 rounded-lg text-elevate-accent">
                {getIndustryIcon(insight.industry)}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">{insight.industry}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span>Market: {insight.marketSize}</span>
                  <span className="text-green-400">Growth: {insight.growthRate}</span>
                  <span>Adoption: {insight.adoptionRate}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-elevate-accent" />
                Key Automation Trends:
              </h5>
              {insight.keyTrends.map((trend, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-elevate-accent text-lg">•</span>
                  <span>{trend}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {insight.sources.map((source, index) => (
                <Badge key={index} variant="outline" className="border-white/30 text-gray-300 text-xs">
                  {source.split(' - ')[1] || source}
                </Badge>
              ))}
            </div>
          </div>
        ))}
        
        <div className="text-center pt-4 border-t border-white/10">
          <Button 
            className="w-full bg-elevate-accent text-black hover:bg-elevate-accent/80"
            onClick={() => window.location.href = '/industries'}
          >
            Explore All Industries
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};