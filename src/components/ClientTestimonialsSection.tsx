
import { Clock, Settings, CheckCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

const ClientTestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Working directly with the founder gives us confidence that our automation needs are prioritized. The communication has been excellent throughout the process.",
      author: "Operations Director",
      company: "Pharmacy Implementation",
      icon: Settings,
      phase: "Implementation Phase",
      status: "Week 2",
      startDate: "Started Dec 2024"
    },
    {
      quote: "The hands-on approach is exactly what we needed for our complex workflows. Implementation timeline was clear from day one, with regular progress updates.",
      author: "Principal",
      company: "Real Estate Investment Firm",
      icon: Clock,
      phase: "Implementation Phase",
      status: "Week 3",
      startDate: "Started Nov 2024"
    },
    {
      quote: "The structured approach and consistent communication made the whole process smooth. We appreciate the transparency in every step of the implementation.",
      author: "Private Wealth Manager",
      company: "Wealth Management Firm",
      icon: CheckCircle,
      phase: "Implementation Phase",
      status: "Week 1",
      startDate: "Started Jan 2025"
    }
  ];

  return (
    <section className="py-16 bg-white relative z-10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Live Client Progress Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real automation implementations happening right now across industries
          </p>
          <div className="mt-4">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              Results pending - stay tuned for full case studies
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => {
            const IconComponent = testimonial.icon;
            return (
              <Card key={index} className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                  <div className="flex flex-col sm:flex-row items-start gap-3 mb-4">
                    <div className="bg-[#0A2463]/10 p-3 rounded-lg flex-shrink-0 mx-auto sm:mx-0">
                      <IconComponent className="h-6 w-6 text-[#0A2463]" />
                    </div>
                    <div className="flex-1 text-center sm:text-left w-full">
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 mb-2 text-xs px-2 py-1">
                        {testimonial.phase}
                      </Badge>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <div className="text-lg font-bold text-[#0A2463] bg-[#0A2463]/5 px-3 py-1 rounded-full inline-block">
                          {testimonial.status}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {testimonial.startDate}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-700 mb-6 flex-1 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="mt-auto">
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-[#0A2463] font-medium">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Ready to start your automation journey?
          </p>
          <a 
            href="https://calendly.com/raj-dalal-xlevatetech" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center gap-2 bg-[#0A2463] hover:bg-[#1E3A8A] text-white font-bold text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 min-h-[44px] w-full max-w-sm mx-auto sm:w-auto focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#70EDFF] focus-visible:ring-offset-2"
            aria-label="Schedule a 15-minute discovery call to view implementation process"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
            Schedule 15-Minute Call
          </a>
        </div>
      </div>
    </section>
  );
};

export default ClientTestimonialsSection;
