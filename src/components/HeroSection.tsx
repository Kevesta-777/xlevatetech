import { Button } from "./ui/button";
import WaveAnimationModule from "./WaveAnimationModule";
import { Clock, TrendingUp, Calendar } from "lucide-react";
import AnimatedMetric from "./roi/AnimatedMetric";
const HeroSection = () => {
  const handleGetAssessment = () => {
    // Direct link to Calendly
    window.open('https://calendly.com/raj-dalal-xlevatetech', '_blank', 'noopener,noreferrer');
  };
  const handleROICalculator = () => {
    window.location.href = '/automation-roi-calculator';
  };

  return <section id="hero" className="hero-section relative min-h-[100vh] flex items-center justify-center bg-elevate-dark text-white overflow-hidden" style={{
    marginTop: 0,
    paddingTop: 'clamp(80px, 15vw, 120px)'
  }} aria-label="Hero section introducing Xlevate Tech automation services">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center max-w-7xl mx-auto">
          <div className="space-y-4 sm:space-y-5 md:space-y-6 animate-fade-in text-left max-w-2xl mx-auto md:mx-0 w-full">
            {/* Startup Growth Badge */}
            <div className="mb-4">
              
            </div>
            
            {/* Main Headline - 3 separate lines as shown in image */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight">
              <div className="text-white">Automate Smarter</div>
              <div className="text-white">Scale Faster</div>
              <div className="text-elevate-accent">Win Back Time</div>
            </h1>
            
            {/* Founder-led credibility */}
            <div className="pb-3">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-200 leading-[1.3]">Transform your biggest operational bottlenecks into competitive advantages. Automation solutions for Finance, Healthcare, and Real Estate.</h2>
            </div>
            
            {/* Current Performance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 py-4">
              <div className="bg-elevate-dark/30 border border-gray-700/30 rounded-lg p-3 sm:p-4 text-center min-h-[100px] flex flex-col justify-center relative">
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-elevate-accent to-transparent"></div>
                <Clock className="w-12 h-12 sm:w-6 sm:h-6 mx-auto mb-2 text-elevate-accent" />
                <div className="text-xl sm:text-2xl font-bold text-white">24h</div>
                <div className="text-xs sm:text-sm text-gray-300">Response Time</div>
                <div className="text-xs text-gray-400 mt-1">Support guarantee</div>
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-elevate-accent/50 to-transparent"></div>
              </div>
              <div className="bg-elevate-dark/30 border border-gray-700/30 rounded-lg p-3 sm:p-4 text-center min-h-[100px] flex flex-col justify-center relative">
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-elevate-accent to-transparent"></div>
                <TrendingUp className="w-12 h-12 sm:w-6 sm:h-6 mx-auto mb-2 text-elevate-accent" />
                <div className="text-xl sm:text-2xl font-bold text-white">Proven</div>
                <div className="text-xs sm:text-sm text-gray-300">Track Record</div>
                <div className="text-xs text-gray-400 mt-1">Trusted by clients</div>
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-elevate-accent/50 to-transparent"></div>
              </div>
              <div className="bg-elevate-dark/30 border border-gray-700/30 rounded-lg p-3 sm:p-4 text-center min-h-[100px] flex flex-col justify-center relative">
                <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-elevate-accent to-transparent"></div>
                <Calendar className="w-12 h-12 sm:w-6 sm:h-6 mx-auto mb-2 text-elevate-accent" />
                <div className="text-xl sm:text-2xl font-bold text-white">2-4 Weeks</div>

                <div className="text-xs sm:text-sm text-gray-300">Implementation</div>
                <div className="text-xs text-gray-400 mt-1">Seamless setup</div>
                <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-elevate-accent/50 to-transparent"></div>
              </div>
            </div>
            
            {/* Value Proposition Block */}
            <div className="py-3 animate-fade-in" style={{
            animationDelay: '1s'
          }}>
              <div className="flex items-center justify-start gap-4 mb-2">
                <span className="text-xl text-gray-500 line-through">$3,500</span>
                <span className="text-3xl font-bold text-elevate-accent">Complimentary</span>
              </div>
              <p className="text-lg text-gray-300 mb-1">Strategy Session + ROI Analysis</p>
              <p className="text-sm text-gray-400">(Limited Time Offer)</p>
            </div>
            
            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pb-3 animate-fade-in w-full max-w-lg mx-auto sm:max-w-none" style={{
            animationDelay: '1.3s'
          }}>
              <Button onClick={handleGetAssessment} className="bg-[#0A2463] hover:bg-[#1E3A8A] text-white font-bold text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-h-[44px] w-full sm:w-auto sm:flex-1 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#70EDFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1f2c]" aria-label="Get your free 30-minute strategy session">
                Get Free Strategy Session
              </Button>
              <Button variant="outline" onClick={handleROICalculator} className="border-2 border-elevate-accent text-elevate-accent hover:bg-elevate-accent hover:text-elevate-accent-foreground bg-transparent hover:text-white font-bold text-sm sm:text-base px-6 py-3 sm:px-8 sm:py-4 rounded-lg transition-all duration-300 min-h-[44px] w-full sm:w-auto sm:flex-1 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#70EDFF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1f2c]" aria-label="Calculate your automation ROI">
                Calculate Your ROI
              </Button>
            </div>
            
          </div>
          
          <div className="relative hidden md:block" aria-hidden="true">
            <WaveAnimationModule />
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-elevate-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-elevate-accent/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </section>;
};
export default HeroSection;