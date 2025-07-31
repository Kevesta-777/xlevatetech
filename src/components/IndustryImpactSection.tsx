import { AlertTriangle, Zap, Settings, Cog, Building, Pill, Bot } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
const IndustryImpactSection = () => {
  const impactData = [{
    header: "Transforming Property Management: Buildium to AppFolio Migration",
    challenge: "Complete platform migration without operational disruption",
    solution: "Automated data migration, property transfer, tenant record management",
    status: "Data Migration - Pending Import and Validation",
    progress: 80,
    phase: "3",
    weeks: "Week 8/10 - Starting 6/10/25",
    icon: Building,
    challengeIcon: AlertTriangle,
    solutionIcon: Zap,
    industry: "Real Estate"
  }, {
    header: "Revolutionizing Client Engagement: AI Chatbot & Workflow Automation",
    challenge: "Scale client service without sacrificing quality",
    solution: "AI chatbot with Calendly and CRM integration for automated lead gen, client engagement, and scheduling",
    status: "Integration & Testing Phase",
    progress: 90,
    phase: "2",
    weeks: "Week 4/5 - Starting 7/7/25",
    icon: Bot,
    challengeIcon: Settings,
    solutionIcon: Bot,
    industry: "Wealth Management"
  }, {
    header: "Streamlining Operations: UR Appeals & Patient Intake Automation",
    challenge: "Automate appeals and patient intake processes",
    solution: "UR appeals engine, AI intake bot, workflow automation",
    status: "Discovery & Requirements Phase",
    progress: 10,
    phase: "1",
    weeks: "Week 1/8 - Starting TBD",
    icon: Pill,
    challengeIcon: Cog,
    solutionIcon: Zap,
    industry: "Pharmacy / Healthcare"
  }];
  const handleViewCaseStudies = () => {
    // Navigate to case studies page
    window.location.href = '/case-studies';

    // GA4 tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'CaseStudyNavigation', {
        event_category: 'engagement',
        event_label: 'industry_impact_case_studies'
      });
    }
  };
  return <>
      <section className="py-16 bg-elevate-dark relative z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              AI-Driven Transformation: Live Client Progress Stories
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Real-time implementation progress across industries
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
            {impactData.map((impact, index) => {
            const IconComponent = impact.icon;
            return <Card key={index} className="bg-gradient-to-br from-elevate-accent/10 to-elevate-accent/5 border border-elevate-accent/20 shadow-lg hover:shadow-xl hover:border-elevate-accent/40 transition-all duration-300 h-full rounded-lg">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                        Phase {impact.phase}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm text-elevate-accent font-medium">
                        {impact.weeks.split(' - ')[0]}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-elevate-accent/20 p-2 rounded-lg">
                        <IconComponent className="h-5 w-5 text-elevate-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1 text-sm">
                          {impact.header}
                        </h3>
                        <div className="text-sm text-gray-300">
                          {impact.industry}
                        </div>
                      </div>
                    </div>

                    {/* Challenge Section */}
                    <div className="mb-4">
                      <div className="flex items-start gap-2 mb-2">
                        <impact.challengeIcon className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-medium text-white mb-1">CHALLENGE</div>
                          <div className="text-sm text-gray-300">{impact.challenge}</div>
                        </div>
                      </div>
                    </div>

                    {/* Solution Section */}
                    <div className="mb-4">
                      <div className="flex items-start gap-2 mb-2">
                        <impact.solutionIcon className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-medium text-white mb-1">SOLUTION</div>
                          <div className="text-sm text-gray-300">{impact.solution}</div>
                        </div>
                      </div>
                    </div>

                    {/* Status and Progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${impact.progress >= 70 ? 'bg-green-500' : impact.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                          <span className="text-sm font-medium text-white">
                            {impact.status} – {impact.progress}% Complete
                          </span>
                        </div>
                      </div>
                      <Progress value={impact.progress} className="h-2" />
                      <div className="text-xs text-gray-400 mt-1">In Progress</div>
                    </div>
                    
                    <div className="mt-auto flex justify-between items-end">
                      <button onClick={handleViewCaseStudies} className="text-elevate-accent hover:text-elevate-accent-light font-medium text-sm transition-colors flex items-center gap-1">
                        Learn More →
                      </button>
                      <div className="text-right">
                        <div className="text-xs text-gray-300 font-medium">{impact.weeks.split(' - ')[1]}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>;
          })}
          </div>

          {/* Legal Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-gray-400 max-w-4xl mx-auto leading-relaxed">
              These are current, in-progress automation projects for real clients. Outcome metrics shown elsewhere are based on industry benchmarks and internal projections; results will be validated and published upon client sign-off per FTC guidelines.
            </p>
          </div>

          {/* Compliance Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-300 mb-2">Xlevate Tech adheres to the FTC Trade Regulation Rule on Consumer Reviews & Testimonials effective Oct 21 2024.</p>
            <a href="/case-studies" className="text-elevate-accent hover:text-elevate-accent-light font-medium text-sm transition-colors">
              View policy →
            </a>
          </div>
        </div>
      </section>
    </>;
};
export default IndustryImpactSection;