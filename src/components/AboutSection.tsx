
import { Avatar, AvatarImage } from "./ui/avatar";
import { ArrowRight, Check } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-elevate-dark text-white relative z-10 scroll-mt-20">
      <div className="container px-3 sm:px-5 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">About Xlevate Tech</h2>
            <div className="h-1 w-20 bg-elevate-accent mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-6 text-gray-300">
            <div className="bg-elevate-dark/70 backdrop-blur-sm border border-elevate-accent/20 rounded-xl p-6 card-shadow">
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                <div className="h-24 w-24 sm:h-20 sm:w-20 overflow-hidden rounded-full flex-shrink-0 mx-auto sm:mx-0">
                  <img 
                    src="/raj.jpg"
                    alt="Raj Dalal - Founder & Principal Consultant, Xlevate Tech" 
                    className="object-cover h-full w-full" 
                    loading="lazy"
                    width={96}
                    height={96}
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-semibold text-white mt-2 sm:mt-0">Raj Dalal</h3>
                  <p className="text-gray-300">Founder & Principal Consultant</p>
                  <p className="text-sm italic text-elevate-accent/80 -mt-1 mb-2">
                    "The founder who's helped businesses save 1000+ hours monthly"
                  </p>
                </div>
              </div>
              
              <p className="mb-4 text-lg">
                <strong className="text-white">After 10+ years drowning in enterprise inefficiencies, I founded Xlevate Tech to help others avoid the same operational pain.</strong> 
                Bringing the nimbleness of small business innovation to automation solutions previously only available at enterprise scale.
              </p>
              
              <div className="bg-gradient-to-r from-elevate-accent/20 to-elevate-accent/10 border border-elevate-accent/30 rounded-lg p-4 mb-4">
                <p className="text-white font-semibold">
                  The automation specialist who turns your biggest time-wasting processes into your competitive advantage. 
                  <span className="text-elevate-accent"> 90% task reduction, 30-day results, guaranteed.</span>
                </p>
              </div>

              <p className="mb-4">
                After working with several fast-paced small businesses, I saw firsthand how smaller teams struggle without automation, 
                fueling my passion to help organizations of any size reclaim time and focus on what truly drives growth.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
                <div className="bg-elevate-dark/50 rounded-lg p-3 border border-elevate-accent/20">
                  <div className="text-2xl font-bold text-elevate-accent">1000+</div>
                  <div className="text-xs text-gray-400">Hours Saved Monthly</div>
                </div>
                <div className="bg-elevate-dark/50 rounded-lg p-3 border border-elevate-accent/20">
                  <div className="text-2xl font-bold text-elevate-accent">$50M+</div>
                  <div className="text-xs text-gray-400">Assets Managed</div>
                </div>
                <div className="bg-elevate-dark/50 rounded-lg p-3 border border-elevate-accent/20">
                  <div className="text-2xl font-bold text-elevate-accent">90%</div>
                  <div className="text-xs text-gray-400">Task Reduction</div>
                </div>
                <div className="bg-elevate-dark/50 rounded-lg p-3 border border-elevate-accent/20">
                  <div className="text-2xl font-bold text-elevate-accent">30</div>
                  <div className="text-xs text-gray-400">Day Results</div>
                </div>
              </div>
            </div>
            
            <div className="bg-elevate-dark/70 backdrop-blur-sm border border-elevate-accent/20 rounded-xl p-6 card-shadow">
              <h3 className="text-xl font-semibold mb-3 text-white">Why Choose Xlevate Tech:</h3>
              <p className="mb-4 font-bold text-white">
                4-month startup with 10+ years enterprise expertise. Direct founder involvement vs. agency account managers.
              </p>
              <p className="mb-4">
                We believe that smart businesses shouldn't drown in manual work. At Xlevate, we build AI-powered workflows, 
                optimize tech stacks, and migrate legacy tools — so you can reclaim your time, simplify compliance, and scale faster with fewer resources.
              </p>
              <p className="mb-5">
                Real projects, real results, real ROI. Our mission is to deliver clarity through automation, 
                control through clean data, and confidence through execution.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm md:flex-row flex-col">
                <div className="flex flex-row gap-4 md:gap-4">
                  <div className="group flex items-center px-4 py-3 bg-elevate-dark/50 rounded-full border border-elevate-accent/20 cursor-pointer transition-all duration-300 hover:bg-elevate-accent/10 hover:border-elevate-accent/40 hover:scale-105 hover:shadow-lg hover:shadow-elevate-accent/20">
                    <Check className="h-4 w-4 text-elevate-accent mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    <span className="transition-colors duration-300 group-hover:text-elevate-accent group-hover:font-medium">Guaranteed Results</span>
                  </div>
                  <div className="group flex items-center px-4 py-3 bg-elevate-dark/50 rounded-full border border-elevate-accent/20 cursor-pointer transition-all duration-300 hover:bg-elevate-accent/10 hover:border-elevate-accent/40 hover:scale-105 hover:shadow-lg hover:shadow-elevate-accent/20">
                    <Check className="h-4 w-4 text-elevate-accent mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                    <span className="transition-colors duration-300 group-hover:text-elevate-accent group-hover:font-medium">Fixed-Fee Pricing</span>
                  </div>
                </div>
                <div className="group flex items-center px-4 py-3 bg-elevate-dark/50 rounded-full border border-elevate-accent/20 cursor-pointer transition-all duration-300 hover:bg-elevate-accent/10 hover:border-elevate-accent/40 hover:scale-105 hover:shadow-lg hover:shadow-elevate-accent/20 md:w-auto w-fit">
                  <Check className="h-4 w-4 text-elevate-accent mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
                  <span className="transition-colors duration-300 group-hover:text-elevate-accent group-hover:font-medium">Enterprise-Grade Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
