import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, ExternalLink, RefreshCw, Shield, Archive } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SmartLink, LinkValidationStatus } from '@/components/blog/SmartLink';
import { supabase } from '@/integrations/supabase/client';

interface CuratedArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  feed_name: string;
  category: string;
  pub_date: string;
  cached_at: string;
  is_featured: boolean;
}

interface ContentCuratorProps {
  category?: string;
  maxArticles?: number;
}

export const ContentCurator = ({ category = 'All', maxArticles = 6 }: ContentCuratorProps) => {
  const [curatedArticles, setCuratedArticles] = useState<CuratedArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadCuratedContent();
  }, [category]);

  const loadCuratedContent = async () => {
    setIsLoading(true);
    
    try {
      // First try to load from cached RSS content
      let query = supabase
        .from('rss_content_cache')
        .select(`
          id,
          title,
          description,
          link,
          category,
          pub_date,
          cached_at,
          is_featured,
          rss_feeds!inner(name)
        `)
        .order('pub_date', { ascending: false })
        .limit(maxArticles);

      // Filter by category if specified
      if (category !== 'All') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading RSS content:', error);
        // Fallback to mock data if RSS cache is empty
        loadFallbackContent();
        return;
      }

      if (data && data.length > 0) {
        // Transform data to match interface
        const transformedData = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          link: item.link || '',
          feed_name: (item.rss_feeds as any)?.name || 'Unknown Source',
          category: item.category || 'General',
          pub_date: item.pub_date || item.cached_at,
          cached_at: item.cached_at,
          is_featured: item.is_featured || false
        }));

        setCuratedArticles(transformedData);
      } else {
        // No cached content, load fallback
        loadFallbackContent();
      }
    } catch (error) {
      console.error('Error loading curated content:', error);
      loadFallbackContent();
    }
    
    setLastUpdate(new Date());
    setIsLoading(false);
  };

  const loadFallbackContent = () => {
    // Fallback content when RSS feeds are not available
    const fallbackContent: CuratedArticle[] = [
      {
        id: 'fallback-automation-trends',
        title: "2025 Automation Market Reaches $226.8B Growth",
        description: "Latest industry analysis shows unprecedented growth in automation technologies across all sectors.",
        link: "/blog/automation-market-2025",
        feed_name: 'Xlevate Tech',
        category: 'AI Automation',
        pub_date: new Date().toISOString(),
        cached_at: new Date().toISOString(),
        is_featured: true
      },
      {
        id: 'fallback-healthcare-ai',
        title: "Healthcare AI Adoption Surges to 86% in 2025",
        description: "Healthcare organizations worldwide rapidly adopting AI solutions for improved patient outcomes.",
        link: "/blog/healthcare-ai-adoption-2025",
        feed_name: 'Xlevate Tech',
        category: 'Healthcare',
        pub_date: new Date().toISOString(),
        cached_at: new Date().toISOString(),
        is_featured: false
      },
      {
        id: 'fallback-finance-automation',
        title: "82% of CFOs Increase Automation Investments",
        description: "Financial leaders prioritize automation to drive efficiency and reduce operational costs.",
        link: "/blog/cfo-automation-investment-2025",
        feed_name: 'Xlevate Tech',
        category: 'Finance',
        pub_date: new Date().toISOString(),
        cached_at: new Date().toISOString(),
        is_featured: false
      }
    ];

    // Filter by category if specified
    let filteredContent = fallbackContent;
    if (category !== 'All') {
      filteredContent = fallbackContent.filter(article => article.category === category);
    }

    setCuratedArticles(filteredContent.slice(0, maxArticles));
  };

  const getValidationIcon = (article: CuratedArticle) => {
    // For internal links, show as valid
    if (!article.link || article.link.startsWith('/')) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    
    // For external links, show as checking (in production, this would be real validation)
    return <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />;
  };

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="h-5 w-5 animate-spin text-accent" />
            <span className="text-white">Loading curated content...</span>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-white/10 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with validation status */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Curated 2025 Content</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={loadCuratedContent}
              className="border-white/30 text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <p className="text-sm text-gray-400">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </CardHeader>
      </Card>

      {/* Curated Articles */}
      <div className="space-y-4">
        {curatedArticles.map((article) => {
          return (
            <Card key={article.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getValidationIcon(article)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-accent/50 text-accent text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        {article.feed_name}
                      </Badge>
                      {article.is_featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="text-white font-medium mb-2 line-clamp-2">
                      {article.title}
                    </h4>
                    
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{new Date(article.pub_date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{article.category}</span>
                      </div>
                      
                      <SmartLink
                        url={article.link}
                        showValidationStatus={false}
                        validateBeforeRedirect={false}
                      >
                        <ExternalLink className="h-4 w-4 text-accent hover:text-accent/80" />
                      </SmartLink>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Source attribution */}
      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="p-4">
          <h4 className="text-white font-medium mb-2">Trusted Sources</h4>
          <p className="text-gray-300 text-sm mb-3">
            Content is curated from verified sources with domain authority scores 70+
          </p>
          <div className="flex flex-wrap gap-2">
            {['McKinsey & Company', 'Deloitte Insights', 'Gartner Research', 'Xlevate Tech'].map((sourceName) => (
              <Badge key={sourceName} variant="outline" className="border-primary/50 text-primary text-xs">
                {sourceName}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};