
import { useEffect, useState } from 'react';
import { Activity, Zap, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetrics {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
}

export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadWebVitals = async () => {
      try {
        const { onCLS, onINP, onLCP, onFCP, onTTFB } = await import('web-vitals');
        
        onCLS((metric) => {
          setMetrics(prev => ({ ...prev, cls: metric.value }));
        });
        
        onINP((metric) => {
          setMetrics(prev => ({ ...prev, fid: metric.value }));
        });
        
        onLCP((metric) => {
          setMetrics(prev => ({ ...prev, lcp: metric.value }));
        });
        
        onFCP((metric) => {
          setMetrics(prev => ({ ...prev, fcp: metric.value }));
        });
        
        onTTFB((metric) => {
          setMetrics(prev => ({ ...prev, ttfb: metric.value }));
        });
      } catch (error) {
        console.log('Web Vitals library not available');
      }
    };

    loadWebVitals();

    // Show performance monitor in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }
  }, []);

  const getScoreColor = (value: number | null, thresholds: { good: number; needs: number }) => {
    if (value === null) return 'bg-gray-500/20 text-gray-400';
    if (value <= thresholds.good) return 'bg-green-500/20 text-green-400';
    if (value <= thresholds.needs) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-red-500/20 text-red-400';
  };

  const formatValue = (value: number | null, unit: string) => {
    if (value === null) return '--';
    if (unit === 'ms') return `${Math.round(value)}ms`;
    if (unit === 's') return `${(value / 1000).toFixed(2)}s`;
    return value.toFixed(3);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-elevate-dark/95 border-white/20 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-accent" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300">LCP</span>
            <Badge className={getScoreColor(metrics.lcp, { good: 2500, needs: 4000 })}>
              {formatValue(metrics.lcp, 'ms')}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300">FID</span>
            <Badge className={getScoreColor(metrics.fid, { good: 100, needs: 300 })}>
              {formatValue(metrics.fid, 'ms')}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300">CLS</span>
            <Badge className={getScoreColor(metrics.cls, { good: 0.1, needs: 0.25 })}>
              {formatValue(metrics.cls, '')}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300">FCP</span>
            <Badge className={getScoreColor(metrics.fcp, { good: 1800, needs: 3000 })}>
              {formatValue(metrics.fcp, 'ms')}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-300">TTFB</span>
            <Badge className={getScoreColor(metrics.ttfb, { good: 800, needs: 1800 })}>
              {formatValue(metrics.ttfb, 'ms')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
