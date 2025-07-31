
import { useState, useEffect } from 'react';
import { TrendingUp, Search, Target, Zap, Globe, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSEOOptimization } from '@/hooks/useSEOOptimization';

interface SEOData {
  organicTraffic: number;
  keywordRankings: { keyword: string; position: number; change: number }[];
  backlinks: number;
  pageSpeed: number;
  mobileUsability: number;
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
}

export const SEODashboard = () => {
  const { metrics, performanceScore, recommendations } = useSEOOptimization();
  const [seoData, setSeoData] = useState<SEOData | null>(null);

  // Mock SEO data - in production this would come from actual SEO APIs
  useEffect(() => {
    const mockSEOData: SEOData = {
      organicTraffic: 12500,
      keywordRankings: [
        { keyword: 'AI automation', position: 3, change: 2 },
        { keyword: 'workflow optimization', position: 7, change: -1 },
        { keyword: 'business process automation', position: 12, change: 4 },
        { keyword: 'healthcare automation', position: 5, change: 0 },
        { keyword: 'finance automation', position: 8, change: 3 }
      ],
      backlinks: 847,
      pageSpeed: performanceScore,
      mobileUsability: 95,
      coreWebVitals: {
        lcp: metrics?.largestContentfulPaint || 0,
        fid: metrics?.firstInputDelay || 0,
        cls: metrics?.cumulativeLayoutShift || 0
      }
    };
    
    setSeoData(mockSEOData);
  }, [performanceScore, metrics]);

  const getRankingColor = (position: number) => {
    if (position <= 3) return 'text-green-400';
    if (position <= 10) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return '↗️';
    if (change < 0) return '↘️';
    return '→';
  };

  if (!seoData) return null;

  return (
    <div className="space-y-6">
      {/* SEO Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-xs text-gray-400">Organic Traffic</span>
            </div>
            <div className="text-2xl font-bold text-white">{seoData.organicTraffic.toLocaleString()}</div>
            <div className="text-xs text-green-400">+18% vs last month</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 text-accent" />
              <span className="text-xs text-gray-400">Avg. Position</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {Math.round(seoData.keywordRankings.reduce((sum, kw) => sum + kw.position, 0) / seoData.keywordRankings.length)}
            </div>
            <div className="text-xs text-yellow-400">+2 positions improved</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-accent" />
              <span className="text-xs text-gray-400">Backlinks</span>
            </div>
            <div className="text-2xl font-bold text-white">{seoData.backlinks.toLocaleString()}</div>
            <div className="text-xs text-green-400">+23 new this month</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-xs text-gray-400">Page Speed</span>
            </div>
            <div className="text-2xl font-bold text-white">{seoData.pageSpeed}</div>
            <div className="text-xs text-green-400">Excellent</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keywords" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border-white/10">
          <TabsTrigger value="keywords" className="data-[state=active]:bg-accent">Keywords</TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-accent">Performance</TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-accent">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Keyword Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {seoData.keywordRankings.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <span className="text-white font-medium">{keyword.keyword}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        {getChangeIcon(keyword.change)} {Math.abs(keyword.change)}
                      </span>
                      <Badge variant="outline" className={`${getRankingColor(keyword.position)} border-current`}>
                        #{keyword.position}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Core Web Vitals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Largest Contentful Paint</div>
                  <div className="text-2xl font-bold text-white">
                    {seoData.coreWebVitals.lcp ? `${(seoData.coreWebVitals.lcp / 1000).toFixed(2)}s` : '--'}
                  </div>
                  <div className="text-xs text-green-400">Good</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">First Input Delay</div>
                  <div className="text-2xl font-bold text-white">
                    {seoData.coreWebVitals.fid ? `${Math.round(seoData.coreWebVitals.fid)}ms` : '--'}
                  </div>
                  <div className="text-xs text-green-400">Good</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-2">Cumulative Layout Shift</div>
                  <div className="text-2xl font-bold text-white">
                    {seoData.coreWebVitals.cls ? seoData.coreWebVitals.cls.toFixed(3) : '--'}
                  </div>
                  <div className="text-xs text-green-400">Good</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                SEO Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300 text-sm">{recommendation}</span>
                  </div>
                ))}
                {recommendations.length === 0 && (
                  <div className="text-center py-8">
                    <span className="text-green-400">🎉 All recommendations implemented!</span>
                    <p className="text-gray-400 text-sm mt-2">Your site is well optimized for search engines.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
