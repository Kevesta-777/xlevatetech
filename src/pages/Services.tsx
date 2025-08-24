import { useEffect } from "react";
import { Calendar, Download, CheckCircle, Star, Factory, ArrowRight, Shield, Zap, TrendingUp, Target, Award, Clock, Users, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { EnhancedXlevateScout } from "@/components/EnhancedXlevateScout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InteractiveTimelineEstimator } from "@/components/services/InteractiveTimelineEstimator";
import { ServiceComparisonMatrix } from "@/components/services/ServiceComparisonMatrix";
import { CostSavingsCalculator } from "@/components/services/CostSavingsCalculator";
import { ServicePackageBuilder } from "@/components/services/ServicePackageBuilder";
import { PricingComparisonChart } from "@/components/industries/PricingComparisonChart";
import { ROITimelineChart } from "@/components/industries/ROITimelineChart";
const Services = () => {
  useEffect(() => {
    document.title = "AI Automation Services & Custom Development | 30-40% Below Enterprise Rates | Xlevate Tech";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional AI automation services with transparent pricing. Proven 30% efficiency gains. Free consultation and 2-6 week implementation.');
    }
    const structuredData = {
      "@context": "https://schema.org",
      "@type": ["Service", "Organization", "ProfessionalService"],
      "name": "Xlevate Tech AI Automation Services",
      "description": "Professional AI automation services with research-backed competitive pricing",
      "provider": {
        "@type": "Organization",
        "name": "Xlevate Tech"
      },
      "serviceType": "AI Automation and Custom Development",
      "areaServed": "United States"
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);
    return () => {
      const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, []);
  const pricingIncentives = [{
    title: "Startup Launch Discount",
    description: "25% off first project for companies <50 employees",
    icon: Star,
    color: "text-green-400"
  }, {
    title: "Multi-Service Bundle",
    description: "15% discount when combining 2+ services",
    icon: Award,
    color: "text-blue-400"
  }, {
    title: "Referral Program",
    description: "$500 credit for successful client referrals",
    icon: Users,
    color: "text-purple-400"
  }, {
    title: "Success Guarantee",
    description: "Full refund if automation doesn't reduce processing time by 30%",
    icon: Shield,
    color: "text-elevate-accent"
  }];
  const serviceCategories = [{
    categoryTitle: "AI & Automation Solutions",
    categoryHeader: "Transform Your Business with Intelligent Automation",
    services: [{
      title: "AI Chatbot & Virtual Assistant Development",
      subtitle: "Custom AI Training & Multi-Platform Integration",
      description: "Custom AI training, multi-platform integration, analytics dashboard with 2-4 weeks implementation timeline.",
      icon: Zap,
      backgroundImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80",
      timeline: "2-4 weeks implementation",
      pricingTiers: [{
        name: "Starter Package",
        setupPrice: "$3,999",
        monthlyPrice: "$499/month",
        description: "Basic AI chatbot, workflow automation, 2-3 week delivery",
        features: ["Basic AI chatbot development", "Standard integrations", "Basic analytics", "Email support", "Standard training"]
      }, {
        name: "Professional Package",
        setupPrice: "$5,999",
        monthlyPrice: "$699/month",
        description: "Advanced AI workflows, real-time monitoring",
        features: ["Advanced AI features", "Custom integrations", "Advanced analytics", "Priority support", "Custom training models"]
      }, {
        name: "Premium Package",
        setupPrice: "$9,999",
        monthlyPrice: "$999/month",
        description: "Full AI ecosystem, predictive analytics, dedicated support",
        features: ["Full AI ecosystem", "Dedicated support team", "Custom training", "24/7 monitoring", "Predictive analytics"]
      }],
      savings: "40-60% below enterprise rates",
      marketAnalysis: "Enterprise: $5,000-$20,000+ setup, $800-$2,000/month | Regional: $2,500-$8,000 setup, $400-$1,200/month",
      expertise: ["AI Development: OpenAI GPT-4, Claude, Custom Models", "Multi-platform: Web, mobile, messaging platforms", "Analytics: Performance tracking, conversation insights", "Integration: CRM systems, calendars, databases"]
    }, {
      title: "Process Automation & Workflow Optimization",
      subtitle: "Custom Automation Tools & Performance Monitoring",
      description: "Custom automation tools, integration APIs, and performance monitoring to streamline your operations.",
      icon: Target,
      backgroundImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&q=80",
      timeline: "3-6 weeks implementation",
      pricingTiers: [{
        name: "Basic Automation",
        setupPrice: "$3,499",
        monthlyPrice: "$599/month maintenance",
        description: "Workflow mapping, efficiency recommendations",
        features: ["Basic workflow automation", "Standard integrations", "Monthly reporting", "Email support", "Basic performance monitoring"]
      }, {
        name: "Advanced Workflow Design",
        setupPrice: "$5,999",
        monthlyPrice: "$899/month optimization",
        description: "Process redesign, automation implementation",
        features: ["Custom workflow design", "Advanced integrations", "Real-time monitoring", "Priority support", "Performance analytics"]
      }, {
        name: "Complete Business Transformation",
        setupPrice: "$9,999",
        monthlyPrice: "$1,199/month ongoing support",
        description: "Ongoing optimization, performance monitoring",
        features: ["Full business transformation", "Dedicated support", "Continuous optimization", "Predictive insights", "Weekly optimization sprints"]
      }],
      savings: "45-65% below enterprise rates",
      marketAnalysis: "Enterprise: $200-$500/hour | Regional: $100-$300/hour",
      expertise: ["Automation Tools: Zapier, Make.com, n8n workflows", "Integration APIs: Custom connectors, data flow", "Performance Monitoring: KPI tracking, optimization", "Business Intelligence: Process analytics, insights"]
    }, {
      title: "AI-Powered Analytics & Insights",
      subtitle: "Real-Time Dashboards & Predictive Modeling",
      description: "Real-time dashboards, predictive modeling, and custom reporting for data-driven decision making.",
      icon: TrendingUp,
      backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80",
      timeline: "2-3 weeks setup",
      pricingTiers: [{
        name: "Essential Analytics",
        setupPrice: "$2,999",
        monthlyPrice: "$499/month",
        description: "Basic dashboards, standard reporting, data visualization",
        features: ["Basic dashboards", "Standard reporting", "Data visualization", "Email support", "Monthly insights"]
      }, {
        name: "Advanced Predictive Analytics",
        setupPrice: "$4,999",
        monthlyPrice: "$799/month",
        description: "Predictive modeling, advanced analytics, custom dashboards",
        features: ["Predictive modeling", "Advanced analytics", "Custom dashboards", "Priority support", "Real-time alerts"]
      }, {
        name: "Professional Intelligence Suite",
        setupPrice: "$8,999",
        monthlyPrice: "$1,099/month",
        description: "Full intelligence suite, AI-powered insights, dedicated support",
        features: ["Full intelligence suite", "AI-powered insights", "Dedicated support", "Custom modeling", "Executive reporting"]
      }],
      savings: "50-70% below enterprise rates",
      marketAnalysis: "Enterprise: $8,000-$25,000+ setup, $1,000-$3,000/month | Regional: $3,000-$12,000 setup, $500-$1,500/month",
      expertise: ["Analytics Platforms: Tableau, Power BI, custom solutions", "Predictive Modeling: Machine learning, forecasting", "Data Integration: Multiple sources, real-time processing", "Custom Reporting: Executive dashboards, KPI tracking"]
    }]
  }, {
    categoryTitle: "System Integration & Migration Services",
    categoryHeader: "Seamlessly Connect and Modernize Your Systems",
    services: [{
      title: "Legacy System Modernization",
      subtitle: "Zero-Downtime Data Migration",
      description: "Seamless migration from outdated systems to modern platforms with zero data loss and minimal downtime.",
      icon: Factory,
      backgroundImage: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1920&q=80",
      timeline: "1-4 weeks completion",
      pricingTiers: [{
        name: "Standard Migration",
        setupPrice: "$3,999",
        monthlyPrice: null,
        description: "Up to 50GB data, basic validation, 1-week completion",
        features: ["Data up to 50GB", "Basic validation protocols", "1-week completion", "Standard documentation", "Email support"]
      }, {
        name: "Complex System Integration",
        setupPrice: "$6,999",
        monthlyPrice: null,
        description: "Unlimited data, zero downtime guarantee, advanced mapping",
        features: ["Unlimited data volume", "Zero downtime guarantee", "Advanced field mapping", "Comprehensive testing", "Priority support"]
      }, {
        name: "Complete Digital Transformation",
        setupPrice: "Custom pricing",
        monthlyPrice: null,
        description: "Multi-system integration, custom APIs, ongoing support",
        features: ["Multi-system integration", "Custom API development", "Ongoing support", "Dedicated project manager", "24/7 monitoring"]
      }],
      savings: "50-75% below enterprise rates",
      marketAnalysis: "Enterprise: $8,000-$50,000+ | Regional: $3,000-$15,000",
      expertise: ["Platform Migrations: Excel to modern systems", "Data Processing: Validation, cleanup, transformation", "System Integration: APIs, databases, cloud platforms", "Quality Assurance: Zero data loss protocols"]
    }, {
      title: "API Development & Third-Party Integrations",
      subtitle: "Custom Connectors & System Integrations",
      description: "Connect your systems with custom API development and seamless third-party integrations.",
      icon: Zap,
      backgroundImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80",
      timeline: "1-3 weeks per integration",
      pricingTiers: [{
        name: "Basic API Integration",
        setupPrice: "$1,999",
        monthlyPrice: null,
        description: "Standard API setup, basic documentation, testing included",
        features: ["Standard API setup", "Basic documentation", "Testing included", "Email support", "Basic monitoring"]
      }, {
        name: "Custom API Development",
        setupPrice: "$3,999",
        monthlyPrice: null,
        description: "Custom API design, advanced security, comprehensive documentation",
        features: ["Custom API design", "Advanced security", "Comprehensive documentation", "Priority support", "Performance optimization"]
      }, {
        name: "Advanced Integration Suite",
        setupPrice: "$7,999+",
        monthlyPrice: null,
        description: "Multiple integrations, custom scoping, ongoing maintenance",
        features: ["Multiple integrations", "Custom scoping", "Ongoing maintenance", "Dedicated support", "Advanced monitoring"]
      }],
      savings: "45-60% below enterprise rates",
      marketAnalysis: "Enterprise: $3,000-$15,000+ per integration | Regional: $1,500-$8,000 per integration",
      expertise: ["API Development: REST, GraphQL, webhooks", "Third-party Integrations: CRM, ERP, marketing tools", "Security: OAuth, API key management, encryption", "Documentation: Comprehensive guides, testing suites"]
    }]
  }, {
    categoryTitle: "Business Intelligence & Optimization",
    categoryHeader: "Data-Driven Decisions for Competitive Advantage",
    services: [{
      title: "Performance Monitoring & Analytics",
      subtitle: "Real-Time Insights & Performance Optimization",
      description: "Comprehensive monitoring and analytics to track performance and optimize business operations.",
      icon: TrendingUp,
      backgroundImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80",
      timeline: "1-2 weeks setup",
      pricingTiers: [{
        name: "Essential Monitoring",
        setupPrice: "$1,499",
        monthlyPrice: "$199/month",
        description: "Basic monitoring, standard alerts, monthly reports",
        features: ["Basic monitoring setup", "Standard alert system", "Monthly performance reports", "Email support", "Basic dashboards"]
      }, {
        name: "Advanced Performance Suite",
        setupPrice: "$2,999",
        monthlyPrice: "$399/month",
        description: "Advanced analytics, custom dashboards, real-time alerts",
        features: ["Advanced analytics platform", "Custom dashboards", "Real-time alert system", "Priority support", "Performance optimization"]
      }, {
        name: "Advanced Monitoring Platform",
        setupPrice: "$4,999",
        monthlyPrice: "$699/month",
        description: "Full monitoring suite, predictive analytics, dedicated support",
        features: ["Full monitoring suite", "Predictive analytics", "Dedicated support team", "Custom integrations", "Executive reporting"]
      }],
      savings: "55-70% below enterprise rates",
      marketAnalysis: "Enterprise: $5,000-$20,000+ setup, $800-$2,500/month | Regional: $2,000-$8,000 setup, $300-$1,000/month",
      expertise: ["Monitoring Tools: Custom dashboards, real-time alerts", "Performance Analytics: KPI tracking, trend analysis", "Data Integration: Multiple sources, automated reporting", "Optimization: Performance tuning, efficiency improvements"]
    }, {
      title: "Quality Assurance & Testing Services",
      subtitle: "Comprehensive Testing & Compliance",
      description: "Professional testing strategies with accessibility compliance and automated testing frameworks.",
      icon: Shield,
      backgroundImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1920&q=80",
      timeline: "1-3 weeks per project",
      pricingTiers: [{
        name: "Essential Testing Package",
        setupPrice: "$1,999",
        monthlyPrice: null,
        description: "Basic functionality, compatibility testing",
        features: ["Functionality testing", "Compatibility testing", "Basic performance tests", "Bug reporting", "Test documentation"]
      }, {
        name: "Comprehensive QA Suite",
        setupPrice: "$3,999",
        monthlyPrice: null,
        description: "Full test suite, automated frameworks, accessibility compliance",
        features: ["Full test suite", "Automated frameworks", "WCAG compliance", "Security testing", "Performance optimization"]
      }, {
        name: "Premium Testing & Optimization",
        setupPrice: "$5,999",
        monthlyPrice: null,
        description: "Advanced testing, performance optimization, security vulnerability assessments",
        features: ["Advanced testing protocols", "Performance optimization", "Security vulnerability assessments", "Load testing", "Ongoing support"]
      }],
      savings: "50-70% below enterprise rates",
      marketAnalysis: "Enterprise: $5,000-$20,000+ | Regional: $1,500-$8,000",
      expertise: ["Testing Frameworks: Automated and manual protocols", "Accessibility: WCAG 2.1 AA compliance", "Performance: Load testing, optimization", "Security: Vulnerability assessment, audits"]
    }]
  }];
  return <div className="min-h-screen bg-elevate-dark text-white mobile-section">
      <a href="#main-content" className="skip-to-main">Skip to main content</a>
      <header>
        <Navbar />
      </header>
      
      <main id="main-content" className="pt-20 pb-12 mobile-section">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-elevate-dark via-elevate-dark to-blue-900/20 py-8 md:py-20 mobile-container">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Professional AI Automation Services
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-4xl mx-auto font-thin md:text-xl">Research-backed competitive pricing with transparent, fixed-fee structure - typically 30-50% below large consulting firms</p>
            
            {/* Competitive Advantage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-elevate-accent mb-2">30-50%</div>
                <div className="text-gray-300 text-sm md:text-base">Below Large Firms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-elevate-accent mb-2">2-6 Weeks</div>
                <div className="text-gray-300 text-sm md:text-base">Implementation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-elevate-accent mb-2">24/7</div>
                <div className="text-gray-300 text-sm md:text-base">Support Available &rarr; Direct Founder</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="cta-btn bg-elevate-accent hover:bg-elevate-accent/80 text-elevate-dark font-semibold px-6 md:px-8 py-3 rounded-lg transition-all duration-300" onClick={() => document.getElementById('services')?.scrollIntoView({
              behavior: 'smooth'
            })} aria-label="View our AI automation services">
                View Services
              </Button>
              <Button variant="outline" className="cta-btn border-elevate-accent text-elevate-accent hover:bg-elevate-accent hover:text-elevate-dark px-6 md:px-8 py-3 rounded-lg transition-all duration-300" onClick={() => document.getElementById('pricing-analysis')?.scrollIntoView({
              behavior: 'smooth'
            })} aria-label="Compare our pricing with competitors">
                Compare Pricing
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Pricing Analysis Charts */}
        <section id="pricing-analysis" className="pt-8 md:pt-20 bg-elevate-dark/50 mobile-section">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white">
                Data-Driven Pricing Analysis
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mx-auto">
                Comprehensive market research from 50+ enterprise firms and regional providers
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-16">
              <Card className="bg-elevate-dark border-elevate-accent/20 p-4 md:p-8 chart-container">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">Service Pricing Comparison</h3>
                <div className="chart-container-mobile">
                  <PricingComparisonChart />
                </div>
                <div className="chart-metrics-text text-center mt-4 text-sm text-gray-300">
                  Enterprise rates 40-60% higher | Xlevate savings: $2-15K per service
                </div>
              </Card>
              
              <Card className="bg-elevate-dark border-elevate-accent/20 p-4 md:p-8 chart-container">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">ROI Timeline Analysis</h3>
                <div className="chart-container-mobile">
                  <ROITimelineChart />
                </div>
                <div className="chart-metrics-text text-center mt-4 text-sm text-gray-300">
                  Break-even: 3-6 months | 12-month ROI: 150-300%
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Interactive Planning Tools */}
        <section className="pb-8 md:pb-20 bg-gradient-to-b from-elevate-dark/50 to-elevate-dark mobile-section">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white">
                Interactive Planning Tools
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Plan your implementation with our research-backed estimation tools
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-16">
              <div className="timeline-estimator-mobile">
                <InteractiveTimelineEstimator />
              </div>
              <div className="service-comparison-matrix-mobile">
                <ServiceComparisonMatrix />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
              <div className="cost-savings-calculator-mobile">
                <CostSavingsCalculator />
              </div>
              <div className="service-package-builder-mobile">
                <ServicePackageBuilder />
              </div>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section id="services" className="py-8 md:py-20 mobile-section">
          <div className="container mx-auto px-4 md:px-6">
            {serviceCategories.map((category, categoryIndex) => <div key={categoryIndex} className="mb-12 md:mb-20 last:mb-0">
                <div className="text-center mb-8 md:mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white">
                    {category.categoryTitle}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                    {category.categoryHeader}
                  </p>
                </div>
                
                <div className="space-y-8 md:space-y-16">
                  {category.services.map((service, serviceIndex) => <Card key={serviceIndex} className="bg-elevate-dark/70 border-elevate-accent/20 overflow-hidden service-card-mobile">
                      <div className="relative">
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{
                    backgroundImage: `url('${service.backgroundImage}')`
                  }} />
                        
                        {/* Content */}
                        <div className="relative z-10 p-4 md:p-8 lg:p-12">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                            {/* Service Overview */}
                            <div className="lg:col-span-2">
                              <div className="flex items-start gap-4 mb-6">
                                <service.icon className="h-10 w-10 md:h-12 md:w-12 text-elevate-accent flex-shrink-0 icon-accent-contrast" />
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
                                    {service.title}
                                  </h3>
                                  <p className="text-elevate-accent font-medium text-sm md:text-base">
                                    {service.subtitle}
                                  </p>
                                </div>
                              </div>
                              
                              <p className="text-gray-300 text-base md:text-lg mb-6 md:mb-8">
                                {service.description}
                              </p>
                              
                              {/* Implementation Timeline */}
                              <div className="flex items-center gap-2 mb-6">
                                <Clock className="h-4 w-4 md:h-5 md:w-5 text-elevate-accent flex-shrink-0" />
                                <span className="text-elevate-accent font-medium text-sm md:text-base">{service.timeline}</span>
                              </div>
                              
                              {/* Pricing Tiers */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
                                {service.pricingTiers.map((tier, tierIndex) => <Card key={tierIndex} className="bg-gray-800/50 border-gray-600 p-3 md:p-4">
                                    <div className="text-center">
                                      <h4 className="font-bold text-white mb-2 text-sm md:text-base">{tier.name}</h4>
                                      <div className="text-xl md:text-2xl font-bold text-elevate-accent mb-2">
                                        {tier.setupPrice}
                                      </div>
                                      {tier.monthlyPrice && <div className="text-xs md:text-sm text-gray-300 mb-3">
                                          {tier.monthlyPrice}
                                        </div>}
                                      <p className="text-xs md:text-sm text-gray-400 mb-4 line-clamp-2">
                                        {tier.description}
                                      </p>
                                      <ul className="text-xs text-gray-300 space-y-1">
                                        {tier.features.slice(0, 3).map((feature, featureIndex) => <li key={featureIndex} className="flex items-start gap-2">
                                            <CheckCircle className="h-3 w-3 text-green-400 flex-shrink-0 mt-0.5" />
                                            <span className="text-left line-clamp-1">{feature}</span>
                                          </li>)}
                                        {tier.features.length > 3 && <li className="text-xs text-gray-500 italic">
                                            +{tier.features.length - 3} more features
                                          </li>}
                                      </ul>
                                    </div>
                                  </Card>)}
                              </div>
                              
                              {/* Market Analysis */}
                              <div className="bg-gray-800/30 rounded-lg p-4 md:p-6 mb-6">
                                <h4 className="text-base md:text-lg font-bold text-white mb-3 flex items-center gap-2">
                                  <Target className="h-4 w-4 md:h-5 md:w-5 text-elevate-accent flex-shrink-0" />
                                  Competitive Analysis
                                </h4>
                                <div className="mb-4">
                                  <span className="text-green-400 font-bold text-base md:text-lg">{service.savings}</span>
                                  <span className="text-gray-300 ml-2 text-sm md:text-base">cost savings vs competitors</span>
                                </div>
                                <p className="text-gray-400 text-xs md:text-sm mb-4">
                                  Market Research: {service.marketAnalysis}
                                </p>
                              </div>
                            </div>
                            
                            {/* Expertise Sidebar */}
                            <div className="lg:col-span-1">
                              <Card className="bg-gray-800/50 border-gray-600 p-4 md:p-6 h-fit">
                                <h4 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                                  <Award className="h-4 w-4 md:h-5 md:w-5 text-elevate-accent flex-shrink-0" />
                                  Technical Expertise
                                </h4>
                                <ul className="space-y-3">
                                  {service.expertise.map((item, expIndex) => <li key={expIndex} className="text-gray-300 text-xs md:text-sm leading-relaxed">
                                      <span className="text-elevate-accent">•</span> {item}
                                    </li>)}
                                </ul>
                                
                                <div className="mt-6 md:mt-8 space-y-3">
                                  <Button 
                                    className="cta-btn w-full bg-elevate-accent hover:bg-elevate-accent/80 text-elevate-dark font-semibold"
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                                    aria-label={`Get custom quote for ${service.title}`}
                                  >
                                    <a href="/automation-roi-calculator">
                                      Get Custom Quote
                                    </a>
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    className="cta-btn w-full border-elevate-accent text-elevate-accent hover:bg-elevate-accent hover:text-elevate-dark"
                                    aria-label={`Schedule consultation for ${service.title}`}
                                  >
                                    <a href="https://calendly.com/raj-dalal-xlevatetech" target="_blank">
                                    Schedule Consultation
                                    </a>
                                  </Button>
                                </div>
                              </Card>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>)}
                </div>
              </div>)}
          </div>
        </section>

        {/* Pricing Incentives */}
        <section className="py-8 md:py-20 bg-elevate-dark/30 mobile-section">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white">
                Special Offers & Guarantees
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
                Limited-time incentives and risk-free guarantees to get you started
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {pricingIncentives.map((incentive, index) => <Card key={index} className="bg-elevate-dark border-elevate-accent/20 p-4 md:p-6 text-center hover:border-elevate-accent/40 transition-all duration-300">
                  <incentive.icon className={`h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 ${incentive.color} icon-accent-contrast`} />
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3">{incentive.title}</h3>
                  <p className="text-gray-300 text-sm md:text-base">{incentive.description}</p>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Competitive Positioning */}
        <section className="py-8 md:py-20 bg-gradient-to-r from-elevate-dark to-blue-900/20 mobile-section">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white">
              Why Choose Xlevate Tech?
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-8 md:mb-12">
                Calculate your potential savings with real-time market data and industry benchmarks
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
              <div className="text-center">
                <DollarSign className="h-12 w-12 md:h-16 md:w-16 text-elevate-accent mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Fixed-Fee Pricing</h3>
                <p className="text-gray-300 text-sm md:text-base">No hourly surprises. Research-backed competitive rates with clear deliverables.</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 md:h-16 md:w-16 text-elevate-accent mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Rapid Implementation</h3>
                <p className="text-gray-300 text-sm md:text-base">2-4 week delivery for most automation projects with 6 months support included.</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 md:h-16 md:w-16 text-elevate-accent mx-auto mb-4" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">Success Guarantee</h3>
                <p className="text-gray-300 text-sm md:text-base">Full refund if automation doesn't reduce processing time by 30% or more.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="cta-btn bg-elevate-accent hover:bg-elevate-accent/80 text-elevate-dark font-semibold px-6 md:px-8 py-3 rounded-lg transition-all duration-300" onClick={() => window.location.href = '/contact'} aria-label="Start your automation project today">
                Start Your Project
              </Button>
              <Button 
                variant="outline"
                className="cta-btn border-elevate-accent text-elevate-accent hover:bg-elevate-accent hover:text-elevate-dark px-6 md:px-8 py-3 rounded-lg transition-all duration-300"
                onClick={() => window.location.href = '/automation-roi-calculator'}
                aria-label="Calculate your return on investment"
              >
                Calculate ROI
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* <EnhancedXlevateScout /> */}
      <Footer />
      <ScrollToTop />
    </div>;
};
export default Services;