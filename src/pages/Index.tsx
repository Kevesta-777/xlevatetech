
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import IndustryImpactSection from "@/components/IndustryImpactSection";
import ServicesSection from "@/components/ServicesSection";
import ImplementationTimelineSection from "@/components/ImplementationTimelineSection";
import StartupCredibilitySection from "@/components/StartupCredibilitySection";
import UrgencySection from "@/components/UrgencySection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { XlevateScout } from "@/components/XlevateScout";
import { SEOOptimizer } from "@/components/blog/SEOOptimizer";
import FAQSchema from "@/components/FAQSchema";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    // Enhanced performance monitoring
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
      
      // Track page view in analytics
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'page_view', {
          page_title: 'Xlevate Tech - AI Automation Solutions',
          page_location: window.location.href,
          load_time: Math.round(loadTime)
        });
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  return (
    <div className="min-h-screen bg-elevate-dark" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
      <SEOOptimizer
        title="Reclaim 30+ Hours Monthly with AI Automation"
        description="Streamline ops, stay compliant, and grow. AI-driven automation for operational leaders in finance, real estate, and healthcare. Rapid implementation in 2-4 weeks."
        keywords={[
          "AI automation",
          "workflow optimization", 
          "no-code automation",
          "business process automation",
          "healthcare automation",
          "finance automation",
          "real estate automation",
          "compliance automation",
          "operational efficiency"
        ]}
        type="website"
        url="https://xlevatetech.com"
      />
      
      <FAQSchema />
      
      <header>
        <Navbar />
      </header>
      
      <main role="main" className="pt-[64px] md:pt-0">
        <HeroSection />
        <IndustryImpactSection />
        <ServicesSection />
        <ImplementationTimelineSection />
        <StartupCredibilitySection />
        <UrgencySection />
        <FAQSection />
      </main>
      
      <footer>
        <Footer />
      </footer>
      
      <ScrollToTop />
      <XlevateScout />
    </div>
  );
};

export default Index;
