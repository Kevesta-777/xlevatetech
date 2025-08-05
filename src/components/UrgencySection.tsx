import { Clock, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
const UrgencySection = () => {
  return <section className="section-padding bg-gradient-to-br from-elevate-accent/10 to-elevate-accent/5 text-white relative overflow-hidden py-16">
      <div className="container mx-auto responsive-padding relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Urgency Message */}
          <div className="mb-12">
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 mb-6">
              <AlertCircle className="w-4 h-4 mr-2" />
              Limited Monthly Capacity
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Secure Your Automation Slot
            </h2>
            <p className="text-xl text-blue-200 mb-8">
              Quality-focused approach means limited availability - only 3-4 new implementations per month
            </p>
          </div>

          {/* Availability Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-[#70EDFF]" />
                  <h3 className="text-xl font-bold">This Month</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Available slots:</span>
                    <a 
                      href="https://calendly.com/raj-dalal-xlevatetech" 
                      target="_blank">
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30">
                        2 remaining
                      </Badge>                    
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Start timeline:</span>
                    <span className="font-semibold">Within 1 week</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-[#70EDFF]" />
                  <h3 className="text-xl font-bold">Next Month</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Available slots:</span>
                    <a 
                      href="https://calendly.com/raj-dalal-xlevatetech" 
                      target="_blank">
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                          4 open slots
                        </Badge>
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Priority booking:</span>
                    <span className="font-semibold">Schedule now</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Why Act Now Benefits */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">Secure Your Priority Slot</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#70EDFF]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-5 h-5 md:w-6 md:h-6 text-[#70EDFF]" />
                </div>
                <h4 className="font-semibold mb-2">Immediate Start</h4>
                <p className="text-blue-200 text-sm">Begin automation within days of booking</p>
              </div>
              <div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#70EDFF]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#70EDFF]" />
                </div>
                <h4 className="font-semibold mb-2">Dedicated Attention</h4>
                <p className="text-blue-200 text-sm">Focused implementation without distractions</p>
              </div>
              <div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#70EDFF]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-[#70EDFF]" />
                </div>
                <h4 className="font-semibold mb-2">Quality Guarantee</h4>
                <p className="text-blue-200 text-sm">Limited capacity ensures exceptional results</p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div>
            <p className="text-xl mb-6 text-blue-200">
              Don't wait - automation slots fill quickly
            </p>
            <a href="https://calendly.com/raj-dalal-xlevatetech" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-[#0A2463] hover:bg-gray-100 font-bold text-base md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-h-[44px] mx-auto">
              <div className="flex items-center justify-start min-w-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                <span className="ml-2 text-sm md:text-base">
                  Schedule 15-Minute Discovery Call
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#70EDFF]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </section>;
};
export default UrgencySection;