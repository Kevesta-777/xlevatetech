
import { Building, DollarSign, Heart, Factory } from "lucide-react";
import { Industry } from "@/types/industry";

export const industries: Industry[] = [
  {
    title: "Real Estate & Property Management",
    subtitle: "Automated Workflows & Data Migration Excellence",
    description: "Transform your property management operations with AI-powered automation that streamlines tenant workflows, optimizes data migration, and delivers measurable ROI across all major platforms.",
    bulletPoints: [
      "Automated tenant onboarding and lease management workflows",
      "Zero-downtime data migration across Yardi, AppFolio, Buildium, MRI",
      "AI-powered market analysis and property valuation tools",
      "Streamlined maintenance request processing and vendor coordination",
      "Real-time portfolio performance analytics and reporting dashboards"
    ],
    icon: Building,
    exampleClients: ["CBRE Group", "JLL (Jones Lang LaSalle)", "Marcus & Millichap", "Greystar Real Estate", "Regional property management companies", "Commercial portfolios"],
    gradient: "from-green-500 to-emerald-600",
    color: "#10b981",
    professionalExample: "Recently completed $50M portfolio Buildium to AppFolio migration achieving 90% completion rate with projected 50% admin time reduction and $25K+ annual savings.",
    highResImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    caseStudyLink: "/case-studies#real-estate"
  },
  {
    title: "Finance & Wealth Management",
    subtitle: "AI-Powered Portfolio Management & Client Automation",
    description: "Revolutionize client experiences with intelligent portfolio management, automated onboarding processes, and AI-driven insights that enhance advisor efficiency and client satisfaction.",
    bulletPoints: [
      "Intelligent portfolio rebalancing and risk assessment automation",
      "AI-powered client onboarding with document processing and verification",
      "Smart meeting scheduling and consultation workflow automation",
      "Regulatory compliance monitoring and automated reporting systems",
      "Real-time market analysis and investment opportunity identification"
    ],
    icon: DollarSign,
    exampleClients: ["Charles Schwab", "Vanguard Group", "BlackRock", "Fidelity Investments", "Regional RIA firms", "Independent wealth advisors"],
    gradient: "from-blue-500 to-indigo-600",
    color: "#3b82f6",
    professionalExample: "Currently developing AI chatbot integration and automated workflows for wealth management firm, targeting 60% routine task reduction with 24/7 client support availability and $35K+ operational savings.",
    highResImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    caseStudyLink: "/case-studies#wealth-management"
  },
  {
    title: "Healthcare & Pharmaceuticals",
    subtitle: "EMR Optimization & Patient Journey Automation",
    description: "Enhance patient care and operational efficiency with intelligent EMR integration, automated clinical workflows, and AI-powered patient engagement solutions.",
    bulletPoints: [
      "Seamless EMR integration and clinical workflow optimization",
      "AI-powered utilization review and appeals processing automation",
      "Intelligent patient intake and appointment scheduling systems",
      "Automated regulatory submission and compliance documentation",
      "Real-time clinical decision support and outcome tracking"
    ],
    icon: Heart,
    exampleClients: ["Cleveland Clinic", "Kaiser Permanente", "Teladoc Health", "Pfizer", "Johnson & Johnson", "Regional healthcare networks"],
    gradient: "from-red-500 to-pink-600",
    color: "#ef4444",
    professionalExample: "Developing UR appeals engine and AI intake bot system projected to achieve 70% faster appeals processing, 80% faster patient intake, and $30K+ cost reduction with improved tracking.",
    highResImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    caseStudyLink: "/case-studies#healthcare"
  },
  {
    title: "Commercial & Industrial Solutions",
    subtitle: "Operational Excellence & Process Optimization",
    description: "Drive operational excellence across retail, manufacturing, and hospitality with AI-powered process automation, predictive analytics, and intelligent workflow optimization.",
    bulletPoints: [
      "End-to-end process automation and workflow optimization",
      "AI-driven inventory management and demand forecasting",
      "Intelligent quality control and predictive maintenance systems",
      "Customer experience personalization and engagement automation",
      "Real-time operational analytics and performance optimization"
    ],
    icon: Factory,
    exampleClients: ["Target Corporation", "McDonald's franchises", "General Electric partners", "Marriott International", "Regional manufacturing companies", "Multi-location retail chains"],
    gradient: "from-slate-500 to-gray-600",
    color: "#64748b",
    professionalExample: "We are actively expanding our service offerings into new industries and technology domains in Q4 2025.",
    highResImage: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=800&h=600&fit=crop&crop=entropy&auto=format&q=80",
    caseStudyLink: "/services?industry=commercial"
  }
];
