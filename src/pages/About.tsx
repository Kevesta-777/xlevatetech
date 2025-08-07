import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { EnhancedXlevateScout } from "@/components/EnhancedXlevateScout";
import { useEffect } from "react";
import { Check, Calendar, TrendingUp, Users, DollarSign, Clock, Linkedin, Mail, Target } from "lucide-react";
import AnimatedMetric from "@/components/roi/AnimatedMetric";
import LightSpotlight from "@/components/LightSpotlight";
import AnimatedArrow from "@/components/AnimatedArrow";
import { SkillGrowthChart } from "@/components/SkillGrowthChart";
import { CareerTimelineChart } from "@/components/CareerTimelineChart";
const About = () => {
  useEffect(() => {
    // Set document title
    document.title = "Meet Raj Dalal | Founder & AI Automation Expert | 10+ Years Enterprise Experience | Xlevate Tech";

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover the story behind Xlevate Tech\'s founder Raj Dalal. From enterprise operations experience to automation expertise, helping businesses reclaim 30+ hours monthly. The founder who\'s helped businesses save time through automation.');
    }
  }, []);
  return <div className="min-h-screen bg-elevate-dark">
      <header>
        <Navbar />
      </header>
      
      <main role="main" className="pt-20">
        {/* Hero Section - Founder's Journey */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-tight">
                Meet the Founder Transforming{" "}
                <span className="text-elevate-accent">Business Operations</span>
              </h1>
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-xl text-gray-300 leading-relaxed md:text-2xl font-thin text-left">With over a decade optimizing complex business processes for companies of all sizes, Raj founded Xlevate Tech to deliver proven automation strategies with personal attention. Having streamlined operations at fast-growing companies like Bswift and Bounteous, Raj brings that same expertise directly to your business—without the overhead and delays of large consulting teams.</p>
                <div className="bg-gradient-to-r from-elevate-accent/20 to-elevate-accent/10 border border-elevate-accent/30 rounded-xl p-6 mt-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-elevate-accent mt-1 flex-shrink-0" />
                      <p className="text-base md:text-lg text-white font-medium">
                        Reduce operational costs by 30-60% in the first 90 days
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-elevate-accent mt-1 flex-shrink-0" />
                      <p className="text-base md:text-lg text-white font-medium">
                        Eliminate repetitive tasks that drain your team's productivity
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-elevate-accent mt-1 flex-shrink-0" />
                      <p className="text-base md:text-lg text-white font-medium">
                        Scale operations seamlessly without proportional staff increases
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-elevate-accent mt-1 flex-shrink-0" />
                      <p className="text-base md:text-lg text-white font-medium">
                        Get measurable ROI with transparent reporting and benchmarks
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quantified Success Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-elevate-accent/10 to-elevate-accent/5 border-y border-elevate-accent/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                <span className="text-elevate-accent">Proven Track Record</span> with Transparent Results
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Real projects, real results, real ROI. Currently transforming operations for growing businesses.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <AnimatedMetric icon={Clock} value={0} prefix="15-20" label="Hours Typical Monthly Savings*" className="bg-elevate-dark/50 border border-elevate-accent/20 rounded-xl" iconClassName="text-elevate-accent" delay={0} />
              <AnimatedMetric icon={Users} value={2} label="Active Client Projects" className="bg-elevate-dark/50 border border-elevate-accent/20 rounded-xl" iconClassName="text-elevate-accent" delay={200} />
              <AnimatedMetric icon={Target} value={0} prefix="30-60%" label="Typical Process Improvement*" className="bg-elevate-dark/50 border border-elevate-accent/20 rounded-xl" iconClassName="text-elevate-accent" delay={400} />
              <AnimatedMetric icon={Calendar} value={0} prefix="2-6" label="Week Implementation Timeline*" className="bg-elevate-dark/50 border border-elevate-accent/20 rounded-xl" iconClassName="text-elevate-accent" delay={600} />
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-gray-400">
                *Results based on recent implementations and industry benchmarks. Individual outcomes vary based on process complexity and organizational readiness.
              </p>
            </div>

            <div className="text-center mt-12">
              <a href="https://calendly.com/raj-dalal-xlevatetech" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-elevate-accent hover:bg-elevate-accent-light text-white py-4 px-8 rounded-lg transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-elevate-accent focus:ring-offset-2 focus:ring-offset-elevate-dark">
                <Calendar className="h-5 w-5" />
                Work with Founder Directly
              </a>
            </div>
          </div>
        </section>

        {/* Skills & Experience Charts */}
        <section className="py-16 px-2 sm:px-6 lg:px-8 bg-gradient-to-br from-elevate-accent/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Expertise Evolution &{" "}
                <span className="text-elevate-accent">Career Impact</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                A decade-long journey from operations specialist to AI automation expert, with measurable results at every step.
              </p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-16">
              <SkillGrowthChart />
              <CareerTimelineChart />
            </div>
          </div>
        </section>

        {/* Personal Journey Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 text-center">
                  From Operations Troubleshooter to{" "}
                  <span className="text-elevate-accent">Automation Architect</span>
                </h2>
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                  <p className="font-thin text-xl">Raj's career began solving operational puzzles in property accounting, working with intricate systems and multi-layered workflows. After joining dynamic teams at companies like Bswift and Bounteous, he saw the same pattern everywhere: talented people spending too much time on repetitive tasks that could be automated.</p>

                  <p className="font-thin text-xl">The breakthrough came when Raj realized that the sophisticated automation strategies used by large organizations could be adapted and delivered much faster for growing businesses. That's when he founded Xlevate Tech, to bring proven automation solutions without the complexity, bureaucracy, or high costs typically associated with large-scale implementations.</p>

                  <p className="font-thin text-xl">Today at Xlevate Tech, Raj combines operational expertise with cutting-edge AI to deliver measurable automation results. The focus is simple: eliminate the repetitive tasks that drain your team's energy so they can focus on what drives real growth and real ROI in 30/60/90 days.</p>
                </div>
              </div>
              <div className="text-center">
                {/* Light Spotlight Component - Positioned closer to photo */}
                <div className="mb-4">
                  <LightSpotlight title="Illuminating Excellence" subtitle="Meet the Automation Expert" className="mb-4" />
                </div>
                
                <div className="inline-block bg-gradient-to-br from-elevate-accent/20 to-elevate-accent/5 p-8 rounded-2xl border border-elevate-accent/20">
                  <div className="h-48 w-48 overflow-hidden rounded-full mx-auto mb-6 border-4 border-elevate-accent/30">
                    <img src="/raj.jpg" alt="Raj Dalal - Founder & Principal Consultant, Xlevate Tech" className="object-cover h-full w-full" loading="lazy" width={192} height={192} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Raj Dalal</h3>
                  <p className="text-elevate-accent font-medium mb-4">
                    Founder & Principal Consultant, Xlevate Tech
                  </p>
                  <p className="text-gray-300 italic mb-6">
                    "Build for smarter systems. Focused on real growth."
                  </p>
                  
                  {/* Single Contact Option */}
                  <div className="flex justify-center">
                    <a href="https://www.linkedin.com/in/rajdalal1/" target="_blank" rel="noopener noreferrer me" className="p-3 bg-elevate-dark/50 hover:bg-elevate-accent/20 border border-elevate-accent/20 hover:border-elevate-accent/40 rounded-lg transition-all duration-300" aria-label="Connect with Raj on LinkedIn">
                      <Linkedin className="h-5 w-5 text-elevate-accent" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Xlevate Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-elevate-dark/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Why Choose{" "}
              <span className="text-elevate-accent">Xlevate Tech</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Direct Founder Involvement */}
              <div className="bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Direct Founder Involvement</h3>
                <p className="text-gray-300 mb-4 font-thin">Unlike agencies where you work with account managers, every project receives Raj's personal attention and specialized expertise.
              </p>
                <div className="flex items-center text-elevate-accent">
                  <Check className="h-5 w-5 mr-2" />
                  <span className="font-medium"> 10+ years hands on automation experience</span>
                </div>
              </div>

              {/* Guaranteed Results */}
              <div className="bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Guaranteed Results</h3>
                <p className="text-gray-300 mb-4 text-base font-thin">Most projects completed in 2-4 weeks vs. industry standard 8-12 weeks. If we don't meet timeline commitments, additional support is provided at no charge</p>
                <div className="flex items-center text-elevate-accent">
                  <Check className="h-5 w-5 mr-2" />
                  <span className="font-medium">Speed without sacrificing quality</span>
                </div>
              </div>

              {/* Industry Specialization */}
              <div className="bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Deep Industry Knowledge</h3>
                <p className="text-gray-300 mb-4">
                  Specialized expertise in Finance, Healthcare, and Real Estate operations with proven automation frameworks.
                </p>
                <div className="flex items-center text-elevate-accent">
                  <Check className="h-5 w-5 mr-2" />
                  <span className="font-medium">Pre-built frameworks accelerate deployment</span>
                </div>
              </div>

              {/* Fixed-Fee Pricing */}
              <div className="bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Transparent Pricing</h3>
                <p className="text-gray-300 mb-4">Fixed-fee pricing with no billing surprises. You know exactly what you're investing in uprfront and what you'll get in return.</p>
                <div className="flex items-center text-elevate-accent">
                  <Check className="h-5 w-5 mr-2" />
                  <span className="font-medium">Typical savings: 40-60% below large consulting firms</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Side Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
              The Human Behind the{" "}
              <span className="text-elevate-accent">Solutions</span>
            </h2>
            <div className="bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 rounded-2xl p-8">
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Raised in Uptown Chicago and rooted in Skokie, I've always been wired to break things down, understand how they work, and build them back better. 
                When not optimizing systems, you'll find me:
              </p>
              <ul className="space-y-3 text-gray-300 mb-6">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-elevate-accent mt-1 flex-shrink-0" />
                  <span>Exploring Chicago's food scene and experimenting with bold home cooking</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-elevate-accent mt-1 flex-shrink-0" />
                  <span>Staying active through fitness and chasing my sweet goldendoodle Bentley</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-elevate-accent mt-1 flex-shrink-0" />
                  <span>Discovering new places with family and friends, exploring the outdoors</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-elevate-accent mt-1 flex-shrink-0" />
                  <span>Winding down with great sci-fi flicks and motivational podcasts</span>
                </li>
              </ul>
              <p className="text-lg text-gray-300 leading-relaxed">
                My diverse experiences help me understand the human side of operations because technology should serve people, not the reverse.
              </p>
            </div>
          </div>
        </section>

        {/* Strategic Navigation */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-elevate-dark/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
              Ready to Transform Your{" "}
              <span className="text-elevate-accent">Operations?</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a href="/services" className="group bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 hover:border-elevate-accent/40 rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-elevate-accent transition-colors">
                  Explore Services
                </h3>
                <p className="text-gray-300 mb-4">
                  Discover my automation services and pricing packages
                </p>
                <div className="flex items-center text-elevate-accent">
                  <AnimatedArrow size={16} />
                </div>
              </a>

              <a href="/case-studies" className="group bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 hover:border-elevate-accent/40 rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-elevate-accent transition-colors">
                  View Results
                </h3>
                <p className="text-gray-300 mb-4">
                  See current client implementations and success stories
                </p>
                <div className="flex items-center text-elevate-accent">
                  <AnimatedArrow size={16} />
                </div>
              </a>

              <a href="/automation-roi-calculator" className="group bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 hover:border-elevate-accent/40 rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-elevate-accent transition-colors">
                  Calculate Savings
                </h3>
                <p className="text-gray-300 mb-4">
                  Estimate your potential automation ROI and time savings
                </p>
                <div className="flex items-center text-elevate-accent">
                  <AnimatedArrow size={16} />
                </div>
              </a>

              <a href="/contact" className="group bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 hover:border-elevate-accent/40 rounded-xl p-6 transition-all duration-300 hover:transform hover:scale-105">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-elevate-accent transition-colors">
                  Get Started
                </h3>
                <p className="text-gray-300 mb-4">
                  Schedule a consultation to discuss your automation needs
                </p>
                <div className="flex items-center text-elevate-accent">
                  <AnimatedArrow size={16} />
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-elevate-accent/20 to-elevate-accent/5 border-t border-elevate-accent/20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Ready to Start Your{" "}
              <span className="text-elevate-accent">Automation Journey?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Schedule a 30-minute discovery session to explore how automation can transform your operations. 
              Let's discuss your specific challenges and identify immediate opportunities for time savings.
            </p>
            <a href="https://calendly.com/raj-dalal-xlevatetech" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-elevate-accent hover:bg-elevate-accent-light text-white py-4 px-8 rounded-lg transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-elevate-accent focus:ring-offset-2 focus:ring-offset-elevate-dark">
              <Calendar className="h-5 w-5" />
              Schedule Discovery Session
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
      {/* <EnhancedXlevateScout /> */}
    </div>;
};
export default About;