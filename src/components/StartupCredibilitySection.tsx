
import { Clock, Shield, Target, Zap } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

const StartupCredibilitySection = () => {
  const trustElements = [
    {
      icon: Clock,
      title: "Response Time Guarantee",
      description: "Get answers to your questions within 24 hours, not days or weeks",
      metric: "<24 hours",
      highlight: "Fast response"
    },
    {
      icon: Shield,
      title: "Consistent Implementation Excellence",
      description: "Every project is delivered with care and attention to detail with seamless onboarding, setup, and integration tailored for your business",
      metric: "Proven solutions",
      highlight: "Proven results"
    },
    {
      icon: Target,
      title: "Active Client Base",
      description: "Currently serving clients across finance, healthcare, and real estate",
      metric: "3+ active clients",
      highlight: "Growing portfolio"
    },
    {
      icon: Zap,
      title: "Limited Availability",
      description: "Focused approach ensures quality delivery and personal attention",
      metric: "Limited slots",
      highlight: "Exclusive access"
    }
  ];

  const industryBadges = [
    "Healthcare & Pharmacy Operations",
    "Real Estate & Property Management", 
    "Finance & Wealth Management",
    "SaaS & AI Startups"
  ];

  return (
    <section className="pb-16 bg-elevate-dark relative z-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Why Choose Our Automation Expertise?
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            AI automation specialist helping businesses reclaim time through proven, reliable solutions
          </p>
        </div>

        {/* Trust Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 max-w-6xl mx-auto">
          {trustElements.map((element, index) => {
            const IconComponent = element.icon;
            return (
              <Card 
                key={index}
                className="bg-gradient-to-br from-elevate-accent/10 to-elevate-accent/5 border border-elevate-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 text-center group h-full"
              >
                <CardContent className="p-8 flex flex-col h-full items-center text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-elevate-accent/10 rounded-full flex items-center justify-center group-hover:bg-elevate-accent/20 transition-colors">
                      <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-elevate-accent" />
                    </div>
                  </div>
                  <Badge className="mb-3 text-sm text-elevate-accent bg-elevate-accent/10 border-elevate-accent/20">
                    {element.highlight}
                  </Badge>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {element.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-6 flex-1">
                    {element.description}
                  </p>
                  <div className="text-2xl font-bold text-elevate-accent mt-auto">
                    {element.metric}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Industry Specialization */}
        <div className="bg-gradient-to-br from-elevate-accent/10 to-elevate-accent/5 border border-elevate-accent/20 rounded-2xl p-8 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Industry Specialization</h3>
            <p className="text-gray-300">Focused expertise across key business sectors</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {industryBadges.map((industry, index) => (
              <Badge 
                key={index}
                className="bg-elevate-accent text-white hover:bg-elevate-accent-light transition-colors px-4 py-2 text-sm md:text-base whitespace-nowrap"
              >
                <a href="/industries">{industry}
                </a>
              </Badge>
            ))}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="bg-elevate-accent rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-6">Current Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-white mb-1">Significant Time Savings</div>
              <div className="text-white font-semibold mb-1">For Every Client</div>
              <div className="text-gray-200 text-sm">Free up valuable staff hours each month with streamlined automation</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">Trusted</div>
              <div className="text-white font-semibold mb-1">Implementations</div>
              <div className="text-gray-200 text-sm">Our focus on collaboration and careful implementation ensures every project meets expectations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">&lt;24h</div>
              <div className="text-white font-semibold mb-1">Response Time</div>
              <div className="text-gray-200 text-sm">Support guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartupCredibilitySection;
