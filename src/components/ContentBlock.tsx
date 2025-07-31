
import { ArrowRight, TrendingUp, CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";

const ContentBlock = () => {
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
    const animatedElements = sectionRef.current?.querySelectorAll('.cta-card');
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
      ref={sectionRef}
      className="section-padding bg-elevate-dark text-white relative z-10"
      aria-labelledby="cta-section-heading"
    >
      <div className="container">
        <h2 id="cta-section-heading" className="sr-only">Call to Action</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Lead Magnet Teaser */}
          <div className="cta-card bg-elevate-dark/70 backdrop-blur-sm border border-elevate-accent/20 rounded-xl p-5 pt-4 card-shadow hover:border-elevate-accent/40 transition-all duration-300 h-full opacity-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500/20 p-2 rounded-lg" aria-hidden="true">
                <CheckCircle className="h-4 w-4 text-elevate-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white">7 Business Tasks You Should Automate with AI Today</h3>
            </div>
            <p className="text-gray-300 mb-6">
              We're putting together a powerful resource showing how small teams can save 20+ hours a week using AI, automation, and no-code tools. Want to be the first to see it?
            </p>
            <div className="flex justify-center">
              <a 
                href="mailto:raj.dalal@xlevatetech.com?subject=AI%20Automation%20Early%20Access&body=Hi%20Raj,%20I'd%20like%20to%20join%20the%20early%20access%20list%20for%20your%20AI%20automation%20resource.%20Thanks!"
                className="btn-primary inline-flex items-center gap-2 group text-sm whitespace-nowrap w-auto text-center justify-center"
                aria-label="Join the Early Access List for AI Automation Resource"
              >
                <span className="truncate">🔗 Join the Early Access List</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </div>
          
          {/* Mini Case Study Teaser */}
          <div className="cta-card bg-elevate-dark/70 backdrop-blur-sm border border-elevate-accent/20 rounded-xl p-5 pt-4 card-shadow hover:border-elevate-accent/40 transition-all duration-300 h-full opacity-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-500/20 p-2 rounded-lg" aria-hidden="true">
                <TrendingUp className="h-4 w-4 text-elevate-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white">Real Results. Built with Automation.</h3>
            </div>
            <p className="text-gray-300 mb-6">
              We recently helped a lean operations team streamline three core processes using AI workflows — cutting 15 hours of manual work a week. Smart systems. Measurable ROI.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://calendly.com/raj-dalal-xlevatetech" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 group text-sm whitespace-nowrap w-auto text-center justify-center"
                aria-label="Book your free automation audit with Xlevate Tech"
              >
                <span className="truncate">📅 Book Your Free Automation Audit</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentBlock;
