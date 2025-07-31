
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface ReadingProgressProps {
  articleContent?: string;
  className?: string;
}

export const ReadingProgress: React.FC<ReadingProgressProps> = ({ 
  articleContent,
  className = "fixed top-0 left-0 right-0 z-50" 
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      const progressValue = Math.min(Math.max(scrollPercent * 100, 0), 100);
      
      setProgress(progressValue);
      setIsVisible(scrollTop > 100); // Show after scrolling 100px
    };

    const handleScroll = () => {
      requestAnimationFrame(calculateProgress);
    };

    window.addEventListener('scroll', handleScroll);
    calculateProgress(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={className}>
      <Progress 
        value={progress} 
        className="h-1 rounded-none bg-white/10"
        style={{
          background: 'linear-gradient(90deg, #22d3ee 0%, #a855f7 100%)'
        }}
      />
    </div>
  );
};
