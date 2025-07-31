
import { useEffect, useRef } from 'react';

interface LightSpotlightProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const LightSpotlight = ({ 
  title = "Illuminating Excellence", 
  subtitle = "Meet the Automation Expert",
  className = "" 
}: LightSpotlightProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-spotlight');
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden bg-elevate-dark w-full rounded-2xl z-0 group hover:scale-105 transition-transform duration-300 ${className}`}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        {/* Left lamp gradient - Enhanced brightness */}
        <div className="absolute inset-auto right-1/2 h-48 overflow-visible w-56 spotlight-left opacity-70 animate-spotlight-width group-hover:opacity-95 group-hover:scale-110 transition-all duration-500">
          <div className="absolute w-full left-0 bg-elevate-dark h-32 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]"></div>
          <div className="absolute w-32 h-full left-0 bg-elevate-dark bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]"></div>
        </div>
        
        {/* Right lamp gradient - Enhanced brightness */}
        <div className="absolute inset-auto left-1/2 h-48 w-56 spotlight-right opacity-70 animate-spotlight-width group-hover:opacity-95 group-hover:scale-110 transition-all duration-500">
          <div className="absolute w-32 h-full right-0 bg-elevate-dark bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]"></div>
          <div className="absolute w-full right-0 bg-elevate-dark h-32 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]"></div>
        </div>
        
        {/* Enhanced shadow and glow effects */}
        <div className="absolute top-1/2 h-40 w-full translate-y-8 scale-x-150 bg-elevate-dark blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-40 w-full bg-transparent opacity-15 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-32 w-[26rem] -translate-y-1/2 rounded-full bg-elevate-accent opacity-40 blur-3xl group-hover:opacity-60 transition-opacity duration-500"></div>
        
        {/* Enhanced center glow */}
        <div className="absolute inset-auto z-30 h-32 w-28 -translate-y-20 rounded-full bg-elevate-accent-light blur-2xl animate-spotlight-small-width opacity-60 group-hover:opacity-85 group-hover:scale-125 transition-all duration-500"></div>
        
        {/* Enhanced lamp line */}
        <div className="absolute inset-auto z-50 h-1 w-56 -translate-y-24 bg-elevate-accent animate-spotlight-width opacity-75 group-hover:opacity-95 group-hover:shadow-xl group-hover:shadow-elevate-accent/60 transition-all duration-500"></div>
        
        {/* Top cover - reduced height */}
        <div className="absolute inset-auto z-40 h-36 w-full -translate-y-44 bg-elevate-dark"></div>
      </div>

      {/* Content positioned in the middle */}
      <div className="relative z-50 flex -translate-y-40 flex-col items-center px-5">
        <h3 className="mt-4 bg-gradient-to-br from-elevate-accent to-elevate-accent-light py-2 bg-clip-text text-center text-xl md:text-3xl font-bold tracking-tight text-transparent opacity-60 translate-y-12 animate-spotlight-up">
          {title}
        </h3>
        {subtitle && (
          <p className="text-gray-300 text-center text-base md:text-lg mt-2 opacity-60 translate-y-12 animate-spotlight-up [animation-delay:0.2s]">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default LightSpotlight;
