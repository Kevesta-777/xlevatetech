
import { Calendar, Cog, TestTube, Rocket } from "lucide-react";
import { Card, CardContent } from "./ui/card";
const ImplementationTimelineSection = () => {
  const timelineSteps = [{
    icon: Calendar,
    title: "Discovery & Planning",
    duration: "3-4 days",
    description: "Workflow analysis, requirements gathering, and implementation roadmap",
    activities: ["Current process audit", "Automation opportunities", "Technical requirements", "Success metrics"]
  }, {
    icon: Cog,
    title: "Development & Integration",
    duration: "2-6 weeks",
    description: "Custom automation development and system integration",
    activities: ["Workflow automation", "System connections", "Data migrations", "Testing protocols"]
  }, {
    icon: TestTube,
    title: "Testing & Optimization",
    duration: "2-3 days",
    description: "Comprehensive testing and performance optimization",
    activities: ["End-to-end testing", "Performance tuning", "Error handling", "Quality assurance"]
  }, {
    icon: Rocket,
    title: "Go-Live & Training",
    duration: "2-3 days",
    description: "Production deployment and team training",
    activities: ["Production deployment", "Team training", "Documentation", "Ongoing support setup"]
  }];
  return <section className="pt-16 bg-elevate-dark relative z-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Implementation Timeline
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
            Structured approach to rapid automation deployment
          </p>
          <div className="text-sm text-gray-400 bg-elevate-accent/10 border border-elevate-accent/20 px-4 py-2 rounded-full inline-block">
            * Timeline varies by complexity and scope
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto mb-12">
          {timelineSteps.map((step, index) => {
          const IconComponent = step.icon;
          return <Card key={index} className="bg-gradient-to-br from-elevate-accent/10 to-elevate-accent/5 border border-elevate-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 relative h-full">
                <CardContent className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                  {/* Step Number - Fixed positioning and sizing */}
                  <div className="absolute inset-0 top-6 left-6 w-12 h-12 md:top-4 md:left-4 md:w-8 md:h-8 bg-elevate-accent text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {index + 1}
                  </div>
                  
                  {/* Icon and Duration */}
                  <div className="flex flex-col items-center text-center mb-4 sm:mb-6 mt-6 sm:mt-8">
                    <div className="bg-elevate-accent/10 p-2 sm:p-3 rounded-xl mb-4 sm:mb-6">
                      <IconComponent className="h-12 w-12 sm:h-8 sm:w-8 text-elevate-accent" />
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white bg-elevate-accent px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
                      {step.duration}
                    </div>
                  </div>
                  
                  {/* Title and Description */}
                  <div className="text-center mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Activities */}
                  <ul className="space-y-1.5 sm:space-y-2 mt-auto">
                    {step.activities.map((activity, idx) => <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-elevate-accent rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">{activity}</span>
                      </li>)}
                  </ul>
                </CardContent>
              </Card>;
        })}
        </div>


        <div className="mt-8 sm:mt-12 text-center bg-elevate-accent rounded-2xl p-4 sm:p-6 lg:p-8 text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready for Rapid Implementation?</h3>
          <p className="text-sm sm:text-base text-gray-200 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">Start your automation journey today with our proven implementation process.</p>
          <div className="text-base sm:text-lg font-semibold text-white">
            Total Timeline: 2-4 weeks from start to finish
          </div>
        </div>
      </div>
    </section>;
};
export default ImplementationTimelineSection;
