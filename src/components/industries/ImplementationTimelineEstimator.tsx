
import { useState } from "react";
import { Calendar, Clock, Users, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimelinePhase {
  name: string;
  duration: string;
  description: string;
  resources: string[];
}

interface IndustryTimeline {
  name: string;
  totalDuration: string;
  complexity: "Low" | "Medium" | "High";
  phases: TimelinePhase[];
}

const industryTimelines: IndustryTimeline[] = [
  {
    name: "Real Estate & Property Management",
    totalDuration: "8-12 weeks",
    complexity: "High",
    phases: [
      {
        name: "Data Migration Planning",
        duration: "2-3 weeks",
        description: "System analysis and migration strategy development",
        resources: ["Data Architect", "Migration Specialist", "Project Manager"]
      },
      {
        name: "Workflow Automation Setup",
        duration: "3-4 weeks", 
        description: "Tenant workflow automation and pipeline optimization",
        resources: ["Automation Engineer", "QA Specialist", "Systems Integrator"]
      },
      {
        name: "Testing & Go-Live",
        duration: "3-5 weeks",
        description: "System testing, user training, and deployment",
        resources: ["Testing Team", "Training Specialist", "Support Engineer"]
      }
    ]
  },
  {
    name: "Finance & Wealth Management",
    totalDuration: "6-10 weeks",
    complexity: "Medium",
    phases: [
      {
        name: "AI Chatbot Development",
        duration: "2-3 weeks",
        description: "Custom chatbot creation and knowledge base setup",
        resources: ["AI Developer", "Content Specialist", "UX Designer"]
      },
      {
        name: "Portfolio Integration",
        duration: "2-4 weeks",
        description: "Portfolio management system integration and automation",
        resources: ["Integration Specialist", "Financial Analyst", "Developer"]
      },
      {
        name: "Deployment & Training",
        duration: "2-3 weeks", 
        description: "System deployment and staff training programs",
        resources: ["Deployment Engineer", "Trainer", "Support Team"]
      }
    ]
  },
  {
    name: "Healthcare & Pharmaceuticals",
    totalDuration: "10-14 weeks",
    complexity: "High",
    phases: [
      {
        name: "EMR Integration Planning",
        duration: "3-4 weeks",
        description: "EMR system analysis and integration planning",
        resources: ["Healthcare IT Specialist", "Compliance Officer", "System Architect"]
      },
      {
        name: "Appeals Engine Development",
        duration: "4-6 weeks",
        description: "Utilization Review appeals engine creation and testing",
        resources: ["Healthcare Developer", "Medical Coder", "QA Engineer"]
      },
      {
        name: "Patient Bot & Go-Live",
        duration: "3-4 weeks",
        description: "Patient intake bot deployment and system launch",
        resources: ["Bot Developer", "Healthcare Trainer", "Support Specialist"]
      }
    ]
  }
];

export const ImplementationTimelineEstimator = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryTimeline>(industryTimelines[0]);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleLeadCapture = async () => {
    if (!email || !company) {
      toast({
        title: "Missing Information",
        description: "Please provide your email and company name to receive the detailed timeline.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('newsletter')
        .insert([
          {
            email,
            industry: selectedIndustry.name
          }
        ]);

      if (error) throw error;

      toast({
        title: "Timeline Sent!",
        description: "Your detailed implementation timeline has been sent to your email.",
      });

      setEmail("");
      setCompany("");
    } catch (error) {
      console.error('Error capturing lead:', error);
      toast({
        title: "Error",
        description: "Failed to send timeline. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low": return "text-green-400";
      case "Medium": return "text-yellow-400"; 
      case "High": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="bg-gradient-to-br from-elevate-dark/70 to-elevate-dark/90 backdrop-blur-sm border border-elevate-accent/20 rounded-2xl p-6 md:p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4 bg-elevate-accent/20 backdrop-blur-sm px-4 py-2 rounded-full border border-elevate-accent/30">
          <Calendar className="h-5 w-5 text-elevate-accent" />
          <span className="text-elevate-accent font-semibold">Implementation Timeline</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Project Timeline Estimator
        </h3>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Get realistic timelines for your automation project based on industry complexity and scope.
        </p>
      </div>

      {/* Industry Selection */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-4">Select Your Industry:</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {industryTimelines.map((industry) => (
            <button
              key={industry.name}
              onClick={() => setSelectedIndustry(industry)}
              className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                selectedIndustry.name === industry.name
                  ? "border-elevate-accent bg-elevate-accent/20 text-white"
                  : "border-gray-600 bg-elevate-dark/50 text-gray-300 hover:border-elevate-accent/50 hover:bg-elevate-accent/10"
              }`}
            >
              <div className="font-medium text-sm">{industry.name}</div>
              <div className="text-xs text-gray-400 mt-1">{industry.totalDuration}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Display */}
      <div className="bg-elevate-dark/50 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-white">{selectedIndustry.name}</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-elevate-accent" />
              <span className="text-white font-semibold">{selectedIndustry.totalDuration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-elevate-accent" />
              <span className={`font-semibold ${getComplexityColor(selectedIndustry.complexity)}`}>
                {selectedIndustry.complexity} Complexity
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {selectedIndustry.phases.map((phase, index) => (
            <div key={index} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-elevate-accent rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-white font-semibold">{phase.name}</h5>
                    <span className="text-elevate-accent font-medium">{phase.duration}</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-3">{phase.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Users className="h-4 w-4 text-gray-400" />
                    {phase.resources.map((resource, idx) => (
                      <span key={idx} className="text-xs bg-elevate-accent/20 text-elevate-accent px-2 py-1 rounded">
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {index < selectedIndustry.phases.length - 1 && (
                <div className="absolute left-4 top-8 w-px h-8 bg-elevate-accent/30"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lead Capture Form */}
      <div className="bg-gradient-to-r from-elevate-accent/10 to-purple-500/10 backdrop-blur-sm border border-elevate-accent/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="h-5 w-5 text-elevate-accent" />
          <span className="text-white font-semibold">Get Your Detailed Timeline</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-elevate-dark/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-elevate-accent focus:outline-none"
          />
          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-elevate-dark/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-elevate-accent focus:outline-none"
          />
        </div>
        
        <button
          onClick={handleLeadCapture}
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-elevate-accent to-purple-500 hover:from-elevate-accent-light hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            "Sending Timeline..."
          ) : (
            <>
              Get Detailed Timeline
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
