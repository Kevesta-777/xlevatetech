
import { useEffect, useState } from 'react';

interface SEOMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export const useSEOOptimization = () => {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const measurePerformance = async () => {
      try {
        // Wait for page to fully load
        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            const handler = () => {
              if (document.readyState === 'complete') {
                window.removeEventListener('readystatechange', handler);
                resolve(void 0);
              }
            };
            window.addEventListener('readystatechange', handler);
          });
        }

        // Get navigation timing
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;
        const timeToFirstByte = navigation.responseStart - navigation.requestStart;
        const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;

        // Initialize metrics with navigation timing
        let newMetrics: SEOMetrics = {
          pageLoadTime,
          timeToFirstByte,
          domContentLoaded,
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          cumulativeLayoutShift: 0,
          firstInputDelay: 0
        };

        // Try to get Web Vitals if available
        try {
          const { onCLS, onINP, onLCP, onFCP } = await import('web-vitals');
          
          onFCP((metric) => {
            setMetrics(prev => prev ? { ...prev, firstContentfulPaint: metric.value } : null);
          });
          
          onLCP((metric) => {
            setMetrics(prev => prev ? { ...prev, largestContentfulPaint: metric.value } : null);
          });
          
          onCLS((metric) => {
            setMetrics(prev => prev ? { ...prev, cumulativeLayoutShift: metric.value } : null);
          });
          
          onINP((metric) => {
            setMetrics(prev => prev ? { ...prev, firstInputDelay: metric.value } : null);
          });
        } catch (error) {
          console.log('Web Vitals not available, using basic metrics');
        }

        setMetrics(newMetrics);
        setIsLoading(false);
      } catch (error) {
        console.error('Error measuring performance:', error);
        setIsLoading(false);
      }
    };

    measurePerformance();
  }, []);

  const getPerformanceScore = () => {
    if (!metrics) return 0;
    
    let score = 100;
    
    // Deduct points for poor metrics
    if (metrics.largestContentfulPaint > 2500) score -= 20;
    if (metrics.firstInputDelay > 100) score -= 20;
    if (metrics.cumulativeLayoutShift > 0.1) score -= 20;
    if (metrics.firstContentfulPaint > 1800) score -= 20;
    if (metrics.timeToFirstByte > 800) score -= 20;
    
    return Math.max(0, score);
  };

  const getRecommendations = () => {
    if (!metrics) return [];
    
    const recommendations: string[] = [];
    
    if (metrics.largestContentfulPaint > 2500) {
      recommendations.push('Optimize images and reduce server response times to improve LCP');
    }
    
    if (metrics.firstInputDelay > 100) {
      recommendations.push('Reduce JavaScript execution time to improve FID');
    }
    
    if (metrics.cumulativeLayoutShift > 0.1) {
      recommendations.push('Add size attributes to images and ensure stable layouts');
    }
    
    if (metrics.firstContentfulPaint > 1800) {
      recommendations.push('Optimize critical CSS and reduce render-blocking resources');
    }
    
    if (metrics.timeToFirstByte > 800) {
      recommendations.push('Optimize server response times and consider CDN usage');
    }
    
    return recommendations;
  };

  return {
    metrics,
    isLoading,
    performanceScore: getPerformanceScore(),
    recommendations: getRecommendations()
  };
};
