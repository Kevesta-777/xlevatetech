import { Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const ComplianceSection = () => {
  const [showMethodology, setShowMethodology] = useState(false);

  const dataSources = [
    {
      title: "Real Estate",
      sources: ["McKinsey PropTech Outlook 2025", "CRETI Industry Analysis"]
    },
    {
      title: "Healthcare", 
      sources: ["IMARC Pharmacy Automation Studies", "Healthcare IT Analytics"]
    },
    {
      title: "Finance",
      sources: ["Wipro AI Adoption Survey 2025", "Deloitte Wealth-Tech Research"]
    },
    {
      title: "Commercial",
      sources: ["Industry efficiency studies from Statista", "Precedence Research"]
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-elevate-dark/80 to-elevate-dark" aria-labelledby="compliance-heading">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-br from-elevate-dark/70 to-elevate-dark/90 backdrop-blur-sm border border-elevate-accent/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 id="compliance-heading" className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <Info className="h-8 w-8 text-elevate-accent" />
              Research Methodology & Compliance
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Transparent sourcing and methodology for all industry benchmark data
            </p>
          </div>

          {/* Benchmark Data Sources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-elevate-dark/50 border border-elevate-accent/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-elevate-accent" />
                Benchmark Data Sources
              </h3>
              <div className="space-y-4">
                {dataSources.map((item, index) => (
                  <div key={index} className="border-l-2 border-elevate-accent/30 pl-4">
                    <h4 className="font-semibold text-elevate-accent">{item.title}:</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      {item.sources.map((source, idx) => (
                        <li key={idx}>• {source}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-elevate-dark/50 border border-elevate-accent/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                FTC Compliance Statement
              </h3>
              <div className="space-y-4 text-gray-300 text-sm">
                <p>
                  All efficiency metrics represent third-party industry research or preliminary implementation data verified through internal systems.
                </p>
                <p>
                  Individual client results vary based on business requirements, existing infrastructure, and implementation scope.
                </p>
                <p className="text-elevate-accent font-semibold">
                  Full case studies with verified outcomes available upon client authorization per FTC Trade Regulation Rule (16 CFR Part 465) effective October 21, 2024.
                </p>
              </div>
            </div>
          </div>

          {/* Methodology Toggle */}
          <div className="text-center">
            <Button
              onClick={() => setShowMethodology(!showMethodology)}
              variant="outline"
              className="border-elevate-accent/30 text-elevate-accent hover:bg-elevate-accent hover:text-white"
            >
              {showMethodology ? 'Hide' : 'Show'} Detailed Methodology
            </Button>

            {showMethodology && (
              <div className="mt-6 bg-elevate-dark/30 border border-elevate-accent/10 rounded-xl p-6 text-left">
                <h4 className="text-lg font-semibold text-white mb-4">Research Methodology</h4>
                <div className="text-gray-300 text-sm space-y-3">
                  <p>
                    <strong>Data Collection:</strong> Industry benchmarks sourced from peer-reviewed studies, enterprise software vendors, and consulting firm reports published in 2024-2025.
                  </p>
                  <p>
                    <strong>Verification Process:</strong> All statistical claims cross-referenced with multiple sources and validated against industry standards.
                  </p>
                  <p>
                    <strong>Disclaimer Requirements:</strong> In compliance with FTC guidelines, all projected outcomes clearly distinguish between industry averages and specific client results.
                  </p>
                  <p>
                    <strong>Client Privacy:</strong> Specific client names used represent target industries only. Actual client testimonials and case studies require written authorization.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};