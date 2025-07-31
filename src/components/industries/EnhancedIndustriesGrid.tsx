import { industries } from "@/data/industriesData";
import { EnhancedIndustryCard } from "./EnhancedIndustryCard";
import { ImplementationTimelineEstimator } from "./ImplementationTimelineEstimator";

export const EnhancedIndustriesGrid = () => {
  return (
    <div className="relative">
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-elevate-accent/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Industries Grid - Enhanced 2x2 Layout with Equal Heights */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-16 auto-rows-fr">
        {industries.map((industry, index) => (
          <div key={industry.title} className="h-full">
            <EnhancedIndustryCard industry={industry} index={index} />
          </div>
        ))}
      </div>

      {/* Implementation Timeline Estimator */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Project Timeline Planning
          </h3>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Get realistic implementation timelines based on your industry's specific requirements and complexity levels.
          </p>
        </div>
        <ImplementationTimelineEstimator />
      </section>

      {/* Call to Action Section */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-elevate-accent/10 to-purple-500/10 backdrop-blur-sm border border-elevate-accent/20 rounded-2xl p-8 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Automation Journey?</h3>
          <p className="text-gray-300 mb-6 text-lg">
            We customize automation solutions for any business that needs to streamline operations and become audit-ready with measurable ROI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-elevate-accent hover:bg-elevate-accent-light text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg min-h-[44px] flex items-center justify-center"
            >
              Schedule Free Consultation
            </a>
            <a
              href="/case-studies"
              className="border border-elevate-accent text-elevate-accent hover:bg-elevate-accent hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 min-h-[44px] flex items-center justify-center"
            >
              View Case Studies
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
