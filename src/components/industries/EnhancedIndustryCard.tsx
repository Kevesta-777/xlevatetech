import { Industry } from "@/types/industry";
import { ArrowRight, CheckCircle, Star, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
interface EnhancedIndustryCardProps {
  industry: Industry;
  index: number;
}
export const EnhancedIndustryCard = ({
  industry,
  index
}: EnhancedIndustryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div
      className="group relative min-h-[810px] sm-custom:min-h-[750px] sm:min-h-[600px] md:min-h-[840px] lg:min-h-[780px] lg-custom:min-h-[670px]  h-full perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 150}ms` }}
    >

      {/* Card Container with Flip Animation */}
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className={`relative h-full bg-gradient-to-br ${industry.gradient} opacity-90 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden transition-all duration-500 ease-out transform ${isHovered ? 'scale-105 shadow-2xl shadow-black/20' : 'shadow-lg'}`}>
            {/* High-Resolution Background Image */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <img src={industry.highResImage} alt={`${industry.title} automation`} className="w-full h-full object-cover opacity-20 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent"></div>
            </div>

            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {[...Array(6)].map((_, i) => <div key={i} className={`absolute w-2 h-2 bg-white/30 rounded-full animate-float ${isHovered ? 'opacity-100' : 'opacity-50'}`} style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }} />)}
            </div>

            <div className="relative z-10 p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 p-3 bg-white/20 backdrop-blur-sm rounded-xl transition-transform duration-300 group-hover:rotate-12">
                  <industry.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-1 leading-tight">{industry.title}</h3>
                  <p className="text-white/80 text-sm font-medium">{industry.subtitle}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-white/90 text-sm mb-4 leading-relaxed">{industry.description}</p>

              {/* Professional Example - Fixed height */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-white font-semibold text-sm">Recent Project</span>
                </div>
                <p className="text-white/90 text-xs leading-relaxed line-clamp-4">{industry.professionalExample}</p>
              </div>

              {/* Bullet Points - Consistent spacing */}
              <div className="space-y-3 mb-6 flex-1 min-h-[120px]">
                {industry.bulletPoints.slice(0, 5).map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-white/80 mt-1 flex-shrink-0" />
                    <span className="text-white/90 text-sm leading-relaxed">{point}</span>
                  </div>))}
              </div>

              {/* Healthcare Service Disclaimer - Only show for healthcare industry */}
              {industry.title === "Healthcare & Pharmaceuticals"}

              {/* CTA Buttons - Fixed positioning at bottom */}
              <div className="mt-auto pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <button onClick={() => setIsFlipped(!isFlipped)} className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors duration-200">
                    View Clients
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                
                <Link to={industry.caseStudyLink} className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 border border-white/20 flex items-center justify-center gap-2 min-h-[44px]">
                  Learn More
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side - Client List */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className={`relative h-full bg-gradient-to-br ${industry.gradient} opacity-90 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all duration-500 ease-out transform ${isHovered ? 'scale-105 shadow-2xl shadow-black/20' : 'shadow-lg'}`}>
            {/* Background Image for back side */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <img src={industry.highResImage} alt={`${industry.title} clients`} className="w-full h-full object-cover opacity-10" />
            </div>

            <div className="relative z-10 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-bold text-white">Example Clients</h4>
                <button onClick={() => setIsFlipped(false)} className="text-white/80 hover:text-white transition-colors duration-200">
                  <ArrowRight className="h-5 w-5 rotate-180" />
                </button>
              </div>

              {/* Client Grid */}
              <div className="grid grid-cols-1 gap-3 flex-1">
                {industry.exampleClients.map((client, i) => <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 transition-all duration-200 hover:bg-white/20 animate-fade-in" style={{
                animationDelay: `${i * 100}ms`
              }}>
                    <span className="text-white font-medium text-sm">{client}</span>
                  </div>)}
              </div>

              {/* Back CTA - Fixed positioning */}
              <div className="mt-auto pt-4 border-t border-white/10">
                <Link to="/contact" className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 border border-white/20 flex items-center justify-center gap-2 min-h-[44px]">
                  Get Custom Quote
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
};