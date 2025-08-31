import React, { useState, useRef } from 'react';
import { SEOHead } from '@/components/blog/SEOHead';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, ExternalLink, TrendingUp, Users, DollarSign, Clock, CheckCircle, AlertCircle, Building, Bot, Pill } from 'lucide-react';

// Import case study images
import realEstateImage from '@/assets/real-estate-case-study.jpg';
import wealthManagementImage from '@/assets/wealth-management-case-study.jpg';
import pharmacyImage from '@/assets/pharmacy-case-study.jpg';
import { EnhancedXlevateScout } from '@/components/EnhancedXlevateScout';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  highlights?: string[];
  details?: string[];
}

const CaseStudies = () => {
  const [expandedTimeline, setExpandedTimeline] = useState<string | null>(null);
  const [expandedMethodology, setExpandedMethodology] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const faqSectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const projectData = [{
    id: 'real-estate',
    industry: 'Real Estate & Property Management',
    title: 'Transforming Property Management: Buildium to AppFolio Migration',
    image: realEstateImage,
    icon: Building,
    phase: 'Data Migration Complete - Pending Validation',
    week: 'Week 9/10',
    startDate: 'Starting 6/10/25',
    progress: 90,
    challenge: 'Complete platform migration without operational disruption',
    targetKPI: 'Goal ≥40% efficiency',
    currentResult: 'Data-entry cut 45%',
    timeline: [{
      milestone: 'Discovery & Baseline',
      status: 'complete',
      date: '06/10/25'
    }, {
      milestone: 'Data Mapping & APIs',
      status: 'complete',
      date: '06/24/25'
    }, {
      milestone: 'ETL Build',
      status: 'complete',
      date: '07/08-07/22/25'
    }, {
      milestone: 'UAT',
      status: 'complete',
      date: '07/29/25'
    }, {
      milestone: 'Go-Live',
      status: 'in-progress',
      date: '08/05/25'
    }, {
      milestone: 'Post-Go-Live Optimization',
      status: 'pending',
      date: '08/12/25'
    }],
    benchmarks: [{
      kpi: 'Efficiency Gain',
      industryAvg: '37%',
      target: '40%+',
      current: '45%'
    }, {
      kpi: 'Monthly Savings',
      industryAvg: '$2,000',
      target: '$2,500+',
      current: '$2,700*'
    }]
  }, {
    id: 'wealth-management',
    industry: 'Finance & Wealth Management',
    title: 'Revolutionizing Client Engagement: AI Chatbot & Workflow Automation',
    image: wealthManagementImage,
    icon: Bot,
    phase: 'Implementation Complete - Support Started',
    week: 'Week 3/3',
    startDate: 'Completed 8/13/25',
    progress: 100,
    challenge: 'Scale client service without sacrificing quality',
    targetKPI: 'Goal ≥60% routine task reduction',
    currentResult: 'Support queries cut 70%',
    timeline: [{
      milestone: 'Discovery & Baseline',
      status: 'complete',
      date: '07/07/25'
    }, {
      milestone: 'Data Mapping & APIs',
      status: 'complete',
      date: '07/14/25'
    }, {
      milestone: 'AI Build',
      status: 'complete',
      date: '07/21/25'
    }, {
      milestone: 'UAT',
      status: 'complete',
      date: '07/28-08/04/25'
    }, {
      milestone: 'Go-Live',
      status: 'complete',
      date: '08/05/25'
    }, {
      milestone: 'Post-Go-Live Optimization',
      status: 'pending',
      date: '08/11/25'
    }],
    benchmarks: [{
      kpi: 'Task Reduction',
      industryAvg: '55%',
      target: '60%+',
      current: '70%'
    }, {
      kpi: 'Monthly Savings',
      industryAvg: '$3,000',
      target: '$3,500+',
      current: '$4,200*'
    }]
  }, {
    id: 'healthcare',
    industry: 'Healthcare & Medical Practices',
    title: 'Healthcare Administrative Automation Framework',
    image: pharmacyImage,
    icon: Pill,
    phase: 'Project Initiation Phase',
    week: 'Project progress: 0% complete',
    startDate: 'Pilot Programs Available',
    progress: 0,
    challenge: 'Focus: Medical practice administrative automation',
    targetKPI: 'Target: Regional clinics, specialty practices, medical billing',
    currentResult: 'Approach: Patient scheduling, workflow optimization, compliance automation',
    timeline: [{
      milestone: 'Service Capability Overview',
      status: 'in-progress',
      date: 'Available Now'
    }, {
      milestone: 'Framework Development',
      status: 'in-progress',
      date: 'Current Phase'
    }, {
      milestone: 'Pilot Program Launch',
      status: 'pending',
      date: 'Consultation Required'
    }, {
      milestone: 'Custom Implementation',
      status: 'pending',
      date: 'Upon Qualification'
    }, {
      milestone: 'Service Deployment',
      status: 'pending',
      date: 'Per Agreement'
    }, {
      milestone: 'Performance Optimization',
      status: 'pending',
      date: 'Ongoing Support'
    }],
    benchmarks: [{
      kpi: 'Admin Efficiency',
      industryAvg: '35%',
      target: '40%+',
      current: 'Available Now'
    }, {
      kpi: 'Cost Reduction',
      industryAvg: '$2,000',
      target: '$2,500+',
      current: 'Consultation Required'
    }]
  }];

  const faqItems: FAQItem[] = [{
    id: "faq-1",
    question: "When will full case studies launch?",
    answer: "Q4 2025 pending client approval.",
    highlights: ["Q4 2025"]
  }, {
    id: "faq-2",
    question: "How do you verify ROI?",
    answer: "We use a comprehensive ROI Calculation Framework including baseline time-motion studies, automated log capture, weekly variance analysis, and third-party validation where applicable.",
    highlights: ["ROI Calculation Framework"],
    details: [
      "Baseline time-motion studies for accurate benchmarking",
      "Automated log capture for real-time data collection",
      "Weekly variance analysis to track progress",
      "Third-party validation where applicable for credibility"
    ]
  }, {
    id: "faq-3",
    question: "Can we speak with reference clients under NDA?",
    answer: "Yes—contact sales to arrange reference calls with current clients under mutual NDA agreements.",
    highlights: ["mutual NDA agreements"]
  }, {
    id: "faq-4",
    question: "What if our KPIs differ?",
    answer: "Every implementation is custom-scoped based on your specific operational needs, existing systems, and target outcomes. We tailor our approach to your unique requirements.",
    highlights: ["custom-scoped"],
    details: [
      "Analysis of your specific operational needs",
      "Integration with existing systems and workflows",
      "Alignment with your target outcomes and goals",
      "Tailored approach for your unique requirements"
    ]
  }];

  // JSON-LD Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `${faq.answer} ${faq.details ? faq.details.join('. ') : ''}`
      }
    }))
  };

  // Note: useEffect hooks removed as they're not essential for SEO functionality
  // Lazy loading and touch optimization can be re-implemented if needed

  const handleWaitlistSignup = () => {
    alert('Waitlist signup functionality to be implemented');
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'WaitlistSignup', {
        event_category: 'engagement',
        event_label: 'case_studies_waitlist'
      });
    }
  };

  const handleTimelineToggle = (projectId: string) => {
    setExpandedTimeline(expandedTimeline === projectId ? null : projectId);
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'TimelineAccordionOpen', {
        event_category: 'engagement',
        event_label: projectId
      });
    }
  };

  const handleMethodologyToggle = (projectId: string) => {
    setExpandedMethodology(expandedMethodology === projectId ? null : projectId);
  };

  const handleBookNow = () => {
  window.location.href = '/automation-roi-calculator';
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'ROICalculatorClick', {
        event_category: 'engagement',
        event_label: 'case_studies_cta_banner'
      });
    }
  };

  const handleFAQClick = (itemId: string) => {
    const newOpenItem = openFAQ === itemId ? null : itemId;
    setOpenFAQ(newOpenItem);
    
    if (newOpenItem && itemRefs.current[itemId]) {
      setTimeout(() => {
        itemRefs.current[itemId]?.scrollIntoView({ 
          behavior: 'smooth',
          block: window.innerWidth < 768 ? 'start' : 'center'
        });
      }, 100);
    }
  };

  const renderFAQAnswer = (faq: FAQItem) => {
    const { answer, highlights = [], details = [] } = faq;
    
    let processedAnswer = answer;
    
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      processedAnswer = processedAnswer.replace(
        regex, 
        '<span class="bg-primary/20 text-primary px-1 py-0.5 rounded font-semibold">$1</span>'
      );
    });

    return (
      <div className="space-y-4">
        <p 
          className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-normal break-words"
          dangerouslySetInnerHTML={{ __html: processedAnswer }}
        />
        {details.length > 0 && (
          <ul className="space-y-2 ml-4">
            {details.map((detail, index) => (
              <li 
                key={index}
                className="text-gray-400 text-sm md:text-base flex items-start"
              >
                <span className="text-primary mr-2 mt-1 flex-shrink-0">•</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <SEOHead pageKey="caseStudies" />
      
      <div className="min-h-screen bg-elevate-dark relative">
        {/* Diagonal line pattern background */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            hsl(var(--primary)),
            hsl(var(--primary)) 1px,
            transparent 1px,
            transparent 20px
          )`
        }}></div>
        
        <Navbar />
        
        {/* Header Banner */}
        <section className="pt-32 pb-16 bg-gradient-to-br bg-elevate-dark relative overflow-hidden">
          <div className="container mx-auto px-2 md:px-4 lg:px-6 relative z-10">
            <div className="text-center my-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-primary-glow bg-clip-text text-transparent leading-tight px-4 py-2">
                AI Transformations in Progress
              </h1>
              
              {/* Compliance Notice */}
              <div className="max-w-4xl mx-auto mb-8 p-4 bg-blue-50/10 border border-blue-200/20 rounded-lg backdrop-blur-sm">
                <div className="text-left text-sm text-gray-300">
                  <div className="font-semibold text-blue-200 mb-2">⚖️ COMPLIANCE NOTICE</div>
                  <p>All case studies published with explicit client consent per FTC guidelines. Individual results may vary based on organizational factors and implementation complexity. Reference calls available for qualified prospects under NDA.</p>
                </div>
              </div>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">Two major implementations completing Q4 2025. Early metrics show 40%+ efficiency gains. Join our waitlist to get the full ROI reports upon client approval.</p>
              
              <Button size="lg" onClick={handleWaitlistSignup} className="bg-primary hover:bg-primary/90 text-white font-semibold min-h-[44px] px-8 focus:ring-2 focus:ring-primary/20 focus:outline-none" aria-label="Join waitlist to be notified when full case studies launch">
                Get Early Results Access
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>

        {/* Project Cards */}
        <section className="py-16 bg-gradient-to-br bg-elevate-dark relative">
          <div className="container mx-auto px-2 md:px-4 lg:px-6">
            <div className="space-y-8 max-w-6xl mx-auto">
              {projectData.map(project => {
                const IconComponent = project.icon;
                const progressPercentage = project.progress;
                return (
                  <Card key={project.id} className="bg-elevate-dark/70 backdrop-blur-sm border border-elevate-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 hover:border-elevate-accent/40">
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Image Section */}
                      <div className="relative order-2 lg:order-1">
                        <img src={project.image} alt={`${project.title} - Case study visualization`} className="w-full h-64 lg:h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r"></div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-6 sm:p-8 order-1 lg:order-2">
                        {/* Top Bar - Strategic positioning */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                          <div className='flex gap-2'>
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <IconComponent className="h-5 w-5 text-primary" aria-hidden="true" />
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm w-fit">
                              {project.industry}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                            <div className="bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/30">
                              <div className="text-xs font-medium text-primary mb-1 text-center">Project Timeline</div>
                              <div className="text-sm font-semibold text-white text-center">{project.week}</div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 mb-6">
                          <div className="flex-1">
                            <h2 className="font-semibold text-white mb-2 text-lg sm:text-xl leading-tight">
                              {project.title}
                            </h2>
                            <div className="text-sm text-gray-300 mb-3">
                              {project.phase}
                            </div>
                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium text-gray-300">Project Progress</span>
                                <span className="text-xs font-medium text-white">{progressPercentage}%</span>
                              </div>
                              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-700">
                                <div className={`h-full transition-all duration-300 ${progressPercentage >= 80 ? 'bg-green-500' : progressPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{
                                  width: `${progressPercentage}%`
                                }} aria-label={`Project progress: ${progressPercentage}% complete`} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section A - Project Snapshot */}
                        <div className="mb-6 space-y-2">
                          <h3 className="text-sm font-medium text-white mb-3">PROJECT SNAPSHOT</h3>
                          <div className="space-y-2 text-sm text-gray-300">
                            <div className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{project.challenge}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{project.targetKPI}</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{project.currentResult} <em className="text-gray-400">verified through system analytics</em></span>
                            </div>
                          </div>
                        </div>

                        {/* Section B - Live Timeline */}
                        <div className="mb-6">
                          <Accordion type="single" collapsible>
                            <AccordionItem value="timeline" className="border-none">
                              <AccordionTrigger className="text-sm font-medium text-white hover:no-underline p-0 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded" onClick={() => handleTimelineToggle(project.id)} aria-expanded={expandedTimeline === project.id} aria-controls={`timeline-${project.id}`}>
                                LIVE TIMELINE
                              </AccordionTrigger>
                              <AccordionContent className="pt-3" id={`timeline-${project.id}`}>
                                <div className="overflow-x-auto">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="text-xs text-gray-300">Milestone</TableHead>
                                        <TableHead className="text-xs text-gray-300">Status</TableHead>
                                        <TableHead className="text-xs text-gray-300">Date</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {project.timeline.map((item, index) => (
                                        <TableRow key={index}>
                                          <TableCell className="text-xs text-white">{item.milestone}</TableCell>
                                          <TableCell className="text-xs">
                                            <div className="flex items-center gap-2">
                                              {item.status === 'complete' && <CheckCircle className="h-3 w-3 text-green-500" aria-label="Complete" />}
                                              {item.status === 'in-progress' && <AlertCircle className="h-3 w-3 text-yellow-500" aria-label="In progress" />}
                                              {item.status === 'pending' && <div className="h-3 w-3 border-2 border-gray-400 rounded-full" aria-label="Pending" />}
                                              <span className="capitalize text-white">{item.status.replace('-', ' ')}</span>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-xs text-white">{item.date}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>

                        {/* Section C - Benchmark Table */}
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-white mb-3">BENCHMARK TABLE</h3>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs text-gray-300">KPI</TableHead>
                                  <TableHead className="text-xs text-gray-300">2025 Industry Avg.*</TableHead>
                                  <TableHead className="text-xs text-gray-300">Project Target</TableHead>
                                  <TableHead className="text-xs text-gray-300">Current</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {project.benchmarks.map((benchmark, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="text-xs text-white">{benchmark.kpi}</TableCell>
                                    <TableCell className="text-xs text-white">{benchmark.industryAvg}</TableCell>
                                    <TableCell className="text-xs text-white">{benchmark.target}</TableCell>
                                    <TableCell className="text-xs font-medium text-green-400">{benchmark.current}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            *Industry average data from same citations used on landing page<br />
                            *Savings calculated based on documented time reductions at client operational cost rates
                          </div>
                        </div>

                        {/* Section D - Methodology Panel */}
                        <div className="mb-6">
                          <Accordion type="single" collapsible>
                            <AccordionItem value="methodology" className="border-none">
                              <AccordionTrigger className="text-sm font-medium text-white hover:no-underline p-0 focus:outline-none focus:ring-2 focus:ring-primary/20 rounded" onClick={() => handleMethodologyToggle(project.id)} aria-expanded={expandedMethodology === project.id} aria-controls={`methodology-${project.id}`}>
                                METHODOLOGY PANEL
                              </AccordionTrigger>
                              <AccordionContent className="pt-3" id={`methodology-${project.id}`}>
                                <div className="text-xs text-gray-300 space-y-2">
                                  <p>All metrics follow our ROI Calculation Framework: baseline time-motion studies, automated log capture, weekly variance analysis.</p>
                                  <p>Data validated by internal audit; final publication contingent on client written consent.</p>
                                  <p className="font-medium text-white">FTC rule reference: 16 CFR Part 465</p>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>

                        {/* Section E - Disclaimer Strip */}
                        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3 mb-4" role="alert" aria-live="polite">
                          <div className="text-xs text-yellow-200 font-medium">
                            Metrics labeled 'industry avg.' or 'preliminary' are not final client outcomes and are subject to change.
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-300 text-end">{project.startDate}</div>
                      </div>
                    </div>
                  </Card>
                );
              })}
              
              {/* Healthcare Service Disclaimer */}
              <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white/5 border border-gray-600/30 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-sm text-gray-300">
                    <div className="font-semibold text-gray-200 mb-2">HEALTHCARE SERVICE DISCLAIMER:</div>
                    <p>Healthcare automation services focus on administrative and operational efficiency improvements. All implementations comply with HIPAA requirements and healthcare regulations. Pilot programs available for qualified medical practices and healthcare administrative services.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section 
          ref={faqSectionRef}
          className="py-16 bg-gradient-to-br bg-elevate-dark" 
          aria-labelledby="faq-heading"
        >
          <div className="container mx-auto px-2 md:px-4 lg:px-6">
            <div className="text-center mb-12">
              <h2 id="faq-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Get answers to common questions about our case studies, ROI verification process, and client references.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item) => (
                  <AccordionItem 
                    key={item.id} 
                    value={item.id}
                    ref={(el) => (itemRefs.current[item.id] = el)}
                    className="bg-elevate-dark/70 backdrop-blur-sm rounded-lg border border-elevate-accent/20 shadow-sm hover:border-elevate-accent/40 transition-all duration-300"
                  >
                    <AccordionTrigger 
                      onClick={() => handleFAQClick(item.id)}
                      className="px-6 py-4 text-left hover:no-underline focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] no-underline hover:no-underline"
                      data-accordion-trigger
                      aria-controls={`${item.id}-content`}
                      aria-expanded={openFAQ === item.id}
                    >
                      <span className="font-medium text-white text-sm sm:text-base font-semibold">
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent 
                      id={`${item.id}-content`}
                      className="px-6 pb-6"
                    >
                      <div className="pt-4 border-t border-elevate-accent/10">
                        {renderFAQAnswer(item)}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Call to Action - Case Studies Focused */}
              <div className="mt-12 p-6 md:p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                  Ready to See Your Results?
                </h3>
                <p className="text-gray-300 mb-6 text-sm md:text-base max-w-2xl mx-auto">
                  Join our waitlist to be notified when detailed case studies are available, or schedule a consultation to discuss your specific ROI requirements.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => {
                      handleWaitlistSignup();
                      if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'WaitlistSignup', {
                          event_category: 'engagement',
                          event_label: 'faq_case_studies_waitlist'
                        });
                      }
                    }}
                    className="inline-block bg-primary/20 hover:bg-primary/30 text-primary border border-primary px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all duration-300 min-h-[44px] flex items-center justify-center text-sm md:text-base"
                    aria-label="Join case studies waitlist"
                  >
                    Join Waitlist
                  </button>
                  <a 
                    href="https://calendly.com/raj-dalal-xlevatetech" 
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'BookNowClick', {
                          event_category: 'engagement',
                          event_label: 'faq_consultation_cta'
                        });
                      }
                    }}
                    className="inline-block bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 min-h-[44px] flex items-center justify-center text-sm md:text-base"
                    aria-label="Book a consultation"
                  >
                    Book Consultation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner - Sticky for mobile */}
        <div className="mx-16 bg-gradient-to-r from-primary to-primary-glow z-30 rounded-lg border-0 md:relative md:p-0">
          <div className="md:py-6 md:bg-gradient-to-r md:from-primary md:to-slate-900 rounded-lg border-0">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
              <div className="md:mb-4">
                <p className="text-white font-medium text-sm md:text-xl mb-2 md:mb-0">
                  See how AI could increase your efficiency.
                </p>
              </div>
              <Button size="lg" onClick={handleBookNow} className="bg-white text-primary hover:bg-white/90 font-semibold w-full md:w-auto min-h-[44px] px-8 focus:ring-2 focus:ring-white/20 focus:outline-none" aria-label="Book a 15-minute consultation call">
                Start Assessment
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        {/* Add bottom padding for mobile to account for sticky CTA */}
        <div className="h-20 md:h-0"></div>
      </div>
      
      <Footer />
      {/* <EnhancedXlevateScout/> */}
    </>
  );
};

export default CaseStudies;