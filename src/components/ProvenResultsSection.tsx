
import { Brain, Zap, Shield, Target } from "lucide-react";

const ProvenResultsSection = () => {
  const expertise = [
    {
      title: "Streamlined Efficiency",
      description: "Streamlined automations that free up your team for higher-value work",
      icon: Brain,
      highlight: "Zero-Code Integration"
    },
    {
      title: "Seamless Implementation", 
      description: "Seamless setup and integration with your existing systems",
      icon: Zap,
      highlight: "Transparent Process"
    },
    {
      title: "Dependable Reliability",
      description: "Dependable integrations, trusted by multiple clients in your industry",
      icon: Shield,
      highlight: "Proven Solutions"
    },
    {
      title: "Hands-On Support",
      description: "Hands-on onboarding and prompt assistance when you need it",
      icon: Target,
      highlight: "Continuous Optimization"
    }
  ];

  return (
    <section className="section-padding bg-white text-gray-900 relative z-10">
      <div className="container mx-auto responsive-padding">
        <h2 className="typography-h2 text-center mb-8 md:mb-12 text-gray-900">
          Our Proven Approach to Business Automation
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          {expertise.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-[#0A2463]/10 rounded-full flex items-center justify-center group-hover:bg-[#0A2463]/20 transition-colors">
                    <IconComponent className="w-6 h-6 text-[#0A2463]" />
                  </div>
                </div>
                <div className="mb-2 text-xs text-[#0A2463] font-bold uppercase tracking-wide">
                  {item.highlight}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <div className="text-gray-600 leading-relaxed space-y-2">
                  <p>Key benefits include:</p>
                  <ul className="text-left space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#0A2463] rounded-full mt-2 flex-shrink-0"></span>
                      <span>{item.description}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#0A2463] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Enhanced productivity and efficiency</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#0A2463] rounded-full mt-2 flex-shrink-0"></span>
                      <span>Measurable ROI within 90 days</span>
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Ready to transform your business operations with intelligent automation?
          </p>
          <a
            href="https://calendly.com/raj-dalal-xlevatetech"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 group text-base py-3 px-8"
          >
            Get Free Automation Audit
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProvenResultsSection;
