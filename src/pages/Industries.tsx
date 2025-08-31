import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { SEOHead } from "@/components/blog/SEOHead";
import { EnhancedIndustriesGrid } from "@/components/industries/EnhancedIndustriesGrid";
import { TechTrendsChart } from "@/components/industries/TechTrendsChart";
import { MarketShareChart } from "@/components/industries/MarketShareChart";
import { KeyInsights } from "@/components/industries/KeyInsights";
import { ComplianceSection } from "@/components/industries/ComplianceSection";
import { Sparkles, Zap, Shield, Target } from "lucide-react";
import { EnhancedXlevateScout } from "@/components/EnhancedXlevateScout";

const Industries = () => {

  return <div className="min-h-screen bg-elevate-dark overflow-hidden">
      <SEOHead pageKey="industries" />
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-elevate-accent text-white px-4 py-2 rounded-lg z-50">
        Skip to main content
      </a>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large Floating Shapes with improved performance */}
        {[...Array(6)].map((_, i) => <div key={i} className="absolute opacity-5 gpu-accelerated" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float ${6 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 4}s`
      }}>
            <div className={`w-32 h-32 bg-gradient-to-br from-elevate-accent to-purple-500 rounded-full blur-xl`} />
          </div>)}
      </div>

      <header role="banner">
        <Navbar />
      </header>
      
      <main id="main-content" role="main" className="relative z-10 pt-20">
        {/* Hero Section with Real Project Results */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden" aria-labelledby="hero-heading">
          {/* Morphing Background Shapes */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{
            animationDelay: '1s'
          }} />
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">

            <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
              Industries We{" "}
              <span className="bg-gradient-to-r from-elevate-accent via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                Transform
              </span>
              <br />
              with AI Automation
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">Industry-Leading AI Automation Solutions: Discover 2025 market benchmarks showing average efficiency gains of 37-76% across sectors*</p>
            
            {/* FTC Compliance Disclaimer */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 max-w-4xl mx-auto mb-8">
              <p className="text-sm text-gray-300 text-center">
                <strong>*Industry benchmarks from published research.</strong> Individual client results pending project completion and may vary. Full case studies available Q4 2025.
              </p>
            </div>

            {/* Value Propositions with WCAG compliant design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              {[{
              icon: Shield,
              text: "Market research indicates potential for audit-ready automation with documentation systems",
              metric: "Industry Avg: 37-76% Efficiency Gains*"
            }, {
              icon: Zap,
              text: "Benchmark studies show streamlined processes and workflow optimization potential",
              metric: "Market Research: 40-60% Process Optimization*"
            }, {
              icon: Target,
              text: "Industry analyses suggest significant operational improvement opportunities",
              metric: "2025 Benchmarks: $25K+ Potential Savings*"
            }].map((item, i) => <div key={i} className="flex flex-col items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <item.icon className="h-6 w-6 text-elevate-accent" aria-hidden="true" />
                  <span className="text-gray-300 text-sm text-center">{item.text}</span>
                  <span className="text-elevate-accent font-semibold text-xs">{item.metric}</span>
                </div>)}
            </div>
            
            {/* Enhanced Disclaimer for Statistics */}
            <div className="mb-8 text-center">
              <p className="text-xs text-gray-400 max-w-3xl mx-auto">
                *Based on McKinsey, Wipro, and IMARC 2025 industry studies. Individual results may vary based on implementation scope and existing systems.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-gradient-to-r from-elevate-accent to-purple-500 hover:from-elevate-accent-light hover:to-purple-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-h-[44px] flex items-center justify-center" aria-label="Start your free industry assessment consultation">
                Start Free Industry Assessment
              </a>
              <a href="/case-studies" className="border border-elevate-accent text-elevate-accent hover:bg-elevate-accent hover:text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 min-h-[44px] flex items-center justify-center" aria-label="View detailed success stories and case studies">
                View Success Stories
              </a>
            </div>
          </div>
        </section>

        {/* Enhanced Industries Grid with Real Project Integration */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-elevate-dark/50 to-elevate-dark" aria-labelledby="industries-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 id="industries-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                Transforming Industries with Next-Gen Technology
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Explore industry benchmark data and target opportunities for AI automation solutions 
                based on 2025 market research showing potential efficiency improvements across sectors.
              </p>
            </div>
            <EnhancedIndustriesGrid />
          </div>
        </section>
        
        {/* Enhanced Market Intelligence Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-elevate-dark to-elevate-dark/90" aria-labelledby="market-intelligence-heading">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 id="market-intelligence-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                Technology Market Landscape 2025
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
                Stay ahead of the curve with real-time market insights. Our data shows rapid AI adoption 
                across all industries, with automation platforms leading the charge while legacy systems decline.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-elevate-dark/70 to-elevate-dark/90 backdrop-blur-sm border border-elevate-accent/20 rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-elevate-dark/50 border border-elevate-accent/10 rounded-xl p-6 overflow-hidden">
                  <h3 className="text-xl font-semibold mb-3 text-center text-white">Market Share Trends</h3>
                  <p className="text-sm text-gray-400 mb-4 text-center">Technology adoption rates 2020-2025</p>
                  <div className="chart-wrapper" role="img" aria-label="Line chart showing technology adoption trends from 2020-2025, with AI and automation platforms showing 400% growth while legacy systems decline 60%">
                    <TechTrendsChart />
                  </div>
                </div>
                
                <div className="bg-elevate-dark/50 border border-elevate-accent/10 rounded-xl p-6 overflow-hidden">
                  <h3 className="text-xl font-semibold mb-3 text-center text-white">Current Market Distribution</h3>
                  <p className="text-sm text-gray-400 mb-4 text-center">2025 projected market share by sector</p>
                  <div className="chart-wrapper" role="img" aria-label="Pie chart showing 2025 projected market share: AI automation 45%, cloud services 30%, mobile solutions 15%, traditional systems 10%">
                    <MarketShareChart />
                  </div>
                </div>
              </div>
              
              <KeyInsights />
              
              <div className="mt-8 text-center">
                <a href="/contact" className="bg-elevate-accent hover:bg-elevate-accent-light text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 min-h-[44px] inline-flex items-center justify-center" aria-label="Download comprehensive market intelligence report">
                  Download Full Market Report
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Research Methodology & Compliance Section */}
        <ComplianceSection />

        {/* Final CTA Section with Professional Results */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-elevate-accent/10 via-purple-500/10 to-pink-500/10" aria-labelledby="final-cta-heading">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="final-cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Explore Industry Benchmarks for Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join companies targeting 37-76% efficiency improvements based on 2025 market research. 
              Get your free industry-specific automation assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="bg-gradient-to-r from-elevate-accent to-purple-500 hover:from-elevate-accent-light hover:to-purple-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg min-h-[44px] flex items-center justify-center" aria-label="Schedule your free consultation to discuss automation opportunities">
                Schedule Free Consultation
              </a>
              <a href="/case-studies" className="border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-lg font-semibold transition-all duration-300 min-h-[44px] flex items-center justify-center" aria-label="Explore detailed case studies showing real project results">
                Explore Case Studies
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <footer role="contentinfo">
        <Footer />
      </footer>
      <ScrollToTop />
      {/* <EnhancedXlevateScout/> */}
    </div>;
};

export default Industries;
