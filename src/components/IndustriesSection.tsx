
import { IndustriesGrid } from "./industries/IndustriesGrid";
import { PricingComparisonChart } from "./industries/PricingComparisonChart";
import { ROITimelineChart } from "./industries/ROITimelineChart";
import { KeyInsights } from "./industries/KeyInsights";
import { useEffect, useRef } from "react";

const IndustriesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Add animation on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe elements for animation
    const animatedElements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    if (animatedElements) {
      animatedElements.forEach((el) => {
        observer.observe(el);
      });
    }

    return () => {
      if (animatedElements) {
        animatedElements.forEach((el) => {
          observer.unobserve(el);
        });
      }
    };
  }, []);

  return (
    <section 
      id="industries" 
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-elevate-dark/95 to-elevate-dark text-white relative z-10 scroll-mt-20"
      aria-labelledby="industries-heading"
    >
      <div className="container">
        <div className="text-center mb-8 sm:mb-10 animate-on-scroll opacity-0">
          <h2 id="industries-heading" className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-3 sm:mb-4">Industries We Automate</h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto px-4 sm:px-6 mb-1 line-height-comfortable">
            We build AI-powered systems for operations-heavy industries — especially those facing compliance demands, repetitive workflows, or disconnected legacy tools.
          </p>
        </div>
        <IndustriesGrid />
        
        <div className="mt-10 sm:mt-12 pt-6 border-t border-elevate-accent/20">
          <div className="text-center mb-6 animate-on-scroll opacity-0">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-3 sm:mb-4">Xlevate Value Proposition & ROI Analysis</h3>
            <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto mb-2 px-4 sm:px-6 line-height-comfortable">
              Discover how Xlevate delivers superior value with competitive pricing and proven ROI timelines. Save up to 70% compared to enterprise solutions while achieving positive returns within 4-5 months.
            </p>
          </div>
          
          <div className="bg-elevate-dark/70 backdrop-blur-sm border border-elevate-accent/20 rounded-xl p-3 sm:p-4 md:p-6 card-shadow animate-on-scroll opacity-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-elevate-dark/50 border border-elevate-accent/10 rounded-lg p-3 sm:p-4 overflow-hidden">
                <h4 className="text-lg sm:text-xl font-display font-semibold mb-2 sm:mb-3 text-center">Pricing Comparison</h4>
                <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 text-center">Xlevate vs Market Leaders - Save up to 70%</p>
                <div className="chart-wrapper" aria-label="Bar chart comparing Xlevate pricing against enterprise solutions and freelancers, showing significant cost savings">
                  <PricingComparisonChart />
                </div>
              </div>
              
              <div className="bg-elevate-dark/50 border border-elevate-accent/10 rounded-lg p-3 sm:p-4 overflow-hidden">
                <h4 className="text-lg sm:text-xl font-display font-semibold mb-2 sm:mb-3 text-center">ROI Timeline Analysis</h4>
                <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 text-center">Payback periods and return projections by package</p>
                <div className="chart-wrapper" aria-label="Line chart showing ROI timeline for different Xlevate packages, with break-even points and growth projections">
                  <ROITimelineChart />
                </div>
              </div>
            </div>
            
            <KeyInsights />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
