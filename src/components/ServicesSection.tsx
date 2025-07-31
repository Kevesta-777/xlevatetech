
import { BrainCircuit, Database, Shield, Factory } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useEffect, useRef } from "react";

const services = [
  {
    title: "AI & Automation Enablement",
    description: "AI-accelerated development delivering intelligent workflows 2-3 weeks faster than traditional agencies. Eliminates manual tasks and streamlines operations.",
    iconComponent: BrainCircuit,
    benefits: ["Automated data processing", "Smart decision workflows", "Integration with existing systems", "Real-time monitoring"],
    idealFor: "Teams ready to move fast and see immediate ROI",
    pricingTiers: [
      { name: "Starter Plan", price: "$3,999 setup + $499/month", features: "Basic AI chatbot, workflow automation, 2-3 week delivery" },
      { name: "Professional Plan", price: "$5,999 setup + $699/month", features: "Advanced AI workflows, real-time monitoring" },
      { name: "Enterprise Plan", price: "$9,999 setup + $999/month", features: "Full AI ecosystem, predictive analytics, dedicated support" }
    ]
  },
  {
    title: "System & Data Migrations",
    description: "Seamless migration from outdated systems to modern platforms with zero data loss and minimal downtime.",
    iconComponent: Database,
    benefits: ["Clean data mapping", "Validation protocols", "Seamless transitions", "Performance optimization"],
    idealFor: "Organizations tired of manual data management",
    pricingTiers: [
      { name: "Standard Migration", price: "$3,999 one-time", features: "Up to 50GB data, basic validation, 1-week completion" },
      { name: "Complex Migration", price: "$6,999 one-time", features: "Unlimited data, advanced mapping, zero downtime guarantee" },
      { name: "Enterprise Migration", price: "Custom pricing", features: "Multi-system integration, custom APIs, ongoing support" }
    ]
  },
  {
    title: "Business Process Optimization",
    description: "Comprehensive workflow analysis and process redesign that delivers measurable operational improvements.",
    iconComponent: Factory,
    benefits: ["Workflow analysis", "Process redesign", "SOP development", "Performance monitoring"],
    idealFor: "Companies seeking operational excellence",
    pricingTiers: [
      { name: "Process Analysis", price: "$3,499 setup + $599/month", features: "Workflow mapping, efficiency recommendations" },
      { name: "Full Optimization", price: "$5,999 setup + $899/month", features: "Process redesign, automation implementation" },
      { name: "Continuous Improvement", price: "$9,999 setup + $1,199/month", features: "Ongoing optimization, performance monitoring" }
    ]
  },
  {
    title: "Quality Assurance & Testing",
    description: "Comprehensive testing strategies with accessibility compliance and automated testing framework setup.",
    iconComponent: Shield,
    benefits: ["Testing strategies", "WCAG compliance", "Automated frameworks", "Launch support"],
    idealFor: "Teams launching critical systems",
    pricingTiers: [
      { name: "Essential Testing", price: "$1,999 per project", features: "Basic functionality, compatibility testing" },
      { name: "Comprehensive QA", price: "$3,999 per project", features: "Full test suite, automated frameworks, accessibility compliance" },
      { name: "Premium QA", price: "$5,999 per project", features: "Advanced testing, performance optimization, security audits" }
    ]
  }
];

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          const children = entry.target.querySelectorAll('.service-card');
          children.forEach((child, index) => {
            (child as HTMLElement).style.transitionDelay = `${index * 100}ms`;
            child.classList.add('animate-fade-in');
          });
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="services" 
      ref={sectionRef} 
      className="section-padding bg-gradient-to-br from-elevate-accent/10 to-elevate-accent/5 text-white relative z-10 scroll-mt-20 opacity-0" 
      aria-labelledby="services-heading"
    >
      <div className="container">
        <div className="text-center mb-16">
          <h2 id="services-heading" className="text-3xl md:text-4xl font-display font-bold mb-4">
            Service Packages with Transparent Pricing
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Research-backed rates that are 30-45% below enterprise consulting fees
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="service-card bg-elevate-dark backdrop-blur-sm border border-elevate-accent/20 rounded-xl shadow-lg hover:shadow-xl hover:border-elevate-accent/40 transition-all duration-300 opacity-0 transform hover:translate-y-[-4px] h-full"
            >
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-500/20 p-3 rounded-lg">
                    <service.iconComponent className="h-6 w-6 text-elevate-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                </div>
                
                <p className="text-gray-300 mb-4 flex-1 text-sm">{service.description}</p>
                
                {/* Pricing Tiers Display */}
                <div className="mb-4 space-y-2">
                  {service.pricingTiers.map((tier, tierIndex) => (
                    <div key={tierIndex} className="p-3 bg-elevate-accent/10 border border-elevate-accent/20 rounded-lg">
                      <p className="text-elevate-accent font-semibold text-sm">{tier.name}</p>
                      <p className="text-white text-sm">{tier.price}</p>
                      <p className="text-gray-400 text-xs mt-1">{tier.features}</p>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-elevate-accent mb-2">Key Benefits:</p>
                    <ul className="space-y-1">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 bg-elevate-accent rounded-full mt-2 flex-shrink-0"></span>
                          <span className="text-xs text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-auto pt-3 border-t border-elevate-accent/20">
                    <p className="text-sm font-semibold text-elevate-accent mb-1">Ideal for:</p>
                    <p className="text-xs text-gray-300">{service.idealFor}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Cut Costs by 30-45%?</h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Get enterprise-quality automation solutions at startup-friendly prices with our transparent, fixed-fee model
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a 
              href="https://calendly.com/raj-dalal-xlevatetech" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center gap-2 bg-[#70EDFF] hover:bg-[#5BBFEA] text-[#0A2463] font-bold text-sm sm:text-base lg:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-h-[44px] w-full sm:w-auto"
            >
              Get Custom Proposal
            </a>
            <a 
              href="/services" 
              className="inline-flex items-center justify-center gap-2 bg-elevate-dark/50 hover:bg-elevate-dark/70 text-gray-300 border border-elevate-accent/20 hover:border-elevate-accent/40 font-bold text-sm sm:text-base lg:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-lg transition-all duration-300 min-h-[44px] w-full sm:w-auto"
            >
              View All Services & Pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
