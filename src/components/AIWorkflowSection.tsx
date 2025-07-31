
import { useState } from "react";
import { Button } from "./ui/button";
import { Building2, Heart, TrendingUp } from "lucide-react";

const AIWorkflowSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission here
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <section className="pt-6 pb-16 bg-gray-50 text-gray-900 relative z-10">
      <div className="container mx-auto responsive-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Get Early Access to Our AI Workflow Library
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join 250+ teams getting pre-built automation templates
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-[#0A2463]/10 rounded-full flex items-center justify-center" style={{ width: '3rem', height: '3rem', borderRadius: '50%' }}>
                  <Heart className="w-6 h-6 text-[#0A2463]" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Healthcare</h3>
              <p className="text-gray-600 text-sm">HIPAA-compliant patient onboarding</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-[#0A2463]/10 rounded-full flex items-center justify-center" style={{ width: '3rem', height: '3rem', borderRadius: '50%' }}>
                  <Building2 className="w-6 h-6 text-[#0A2463]" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Real Estate</h3>
              <p className="text-gray-600 text-sm">Automated lease processing</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-[#0A2463]/10 rounded-full flex items-center justify-center" style={{ width: '3rem', height: '3rem', borderRadius: '50%' }}>
                  <TrendingUp className="w-6 h-6 text-[#0A2463]" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Finance</h3>
              <p className="text-gray-600 text-sm">SEC-compliant report generation</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto email-form">
            <div className="flex flex-col md:flex-row items-center gap-3 mb-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your work email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent w-full email-input"
                required
              />
              <Button
                type="submit"
                className="bg-[#0A2463] hover:bg-[#1E3A8A] text-white px-6 py-3 rounded-md font-semibold w-full md:w-auto cta-button"
              >
                Join Waitlist
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Launching August 2025. No spam. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AIWorkflowSection;
