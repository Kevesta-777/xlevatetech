
import { useState, useEffect } from 'react';
import { Search, Target, TrendingUp, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ContentAnalysis {
  readabilityScore: number;
  seoScore: number;
  keywordDensity: { [key: string]: number };
  suggestions: string[];
  wordCount: number;
  readingTime: number;
}

interface ContentOptimizerProps {
  content: string;
  targetKeywords?: string[];
  onOptimize?: (suggestions: string[]) => void;
}

export const ContentOptimizer = ({ 
  content, 
  targetKeywords = [], 
  onOptimize 
}: ContentOptimizerProps) => {
  const [analysis, setAnalysis] = useState<ContentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeContent = () => {
    setIsAnalyzing(true);
    
    // Simulate content analysis
    setTimeout(() => {
      const words = content.split(/\s+/).filter(word => word.length > 0);
      const wordCount = words.length;
      const readingTime = Math.ceil(wordCount / 200); // Average reading speed
      
      // Calculate keyword density
      const keywordDensity: { [key: string]: number } = {};
      targetKeywords.forEach(keyword => {
        const regex = new RegExp(keyword.toLowerCase(), 'gi');
        const matches = content.match(regex) || [];
        keywordDensity[keyword] = (matches.length / wordCount) * 100;
      });

      // Calculate scores (simplified)
      const readabilityScore = Math.min(100, Math.max(0, 100 - (wordCount / 20)));
      const seoScore = Math.min(100, 
        (wordCount > 300 ? 25 : 0) + 
        (targetKeywords.some(kw => content.toLowerCase().includes(kw.toLowerCase())) ? 25 : 0) +
        (content.includes('http') ? 25 : 0) +
        25
      );

      // Generate suggestions
      const suggestions: string[] = [];
      if (wordCount < 300) suggestions.push('Consider adding more content (aim for 300+ words)');
      if (!targetKeywords.some(kw => content.toLowerCase().includes(kw.toLowerCase()))) {
        suggestions.push('Include target keywords naturally in the content');
      }
      if (!content.includes('http')) suggestions.push('Add relevant internal and external links');
      if (readingTime > 10) suggestions.push('Consider breaking up long paragraphs for better readability');

      setAnalysis({
        readabilityScore,
        seoScore,
        keywordDensity,
        suggestions,
        wordCount,
        readingTime
      });
      
      setIsAnalyzing(false);
      
      if (onOptimize && suggestions.length > 0) {
        onOptimize(suggestions);
      }
    }, 1000);
  };

  useEffect(() => {
    if (content && content.length > 100) {
      analyzeContent();
    }
  }, [content, targetKeywords]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  if (!analysis && !isAnalyzing) return null;

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-accent" />
          Content Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            <span className="ml-3 text-gray-300">Analyzing content...</span>
          </div>
        ) : analysis && (
          <div className="space-y-4">
            {/* Content Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="h-4 w-4 text-accent" />
                  <span className="text-xs text-gray-400">Word Count</span>
                </div>
                <div className="text-lg font-semibold text-white">{analysis.wordCount}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="text-xs text-gray-400">Reading Time</span>
                </div>
                <div className="text-lg font-semibold text-white">{analysis.readingTime} min</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Search className="h-4 w-4 text-accent" />
                  <span className="text-xs text-gray-400">SEO Score</span>
                </div>
                <div className={`text-lg font-semibold ${getScoreColor(analysis.seoScore)}`}>
                  {analysis.seoScore}%
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-accent" />
                  <span className="text-xs text-gray-400">Readability</span>
                </div>
                <div className={`text-lg font-semibold ${getScoreColor(analysis.readabilityScore)}`}>
                  {analysis.readabilityScore}%
                </div>
              </div>
            </div>

            {/* Keyword Density */}
            {Object.keys(analysis.keywordDensity).length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-2">Keyword Density</h4>
                <div className="space-y-2">
                  {Object.entries(analysis.keywordDensity).map(([keyword, density]) => (
                    <div key={keyword} className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">{keyword}</span>
                      <Badge variant="outline" className={getScoreBadge(density * 10)}>
                        {density.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-2">Optimization Suggestions</h4>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-accent mt-1">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button 
              onClick={analyzeContent}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              Re-analyze Content
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
