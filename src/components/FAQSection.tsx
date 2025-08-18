import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
  id: string;
  highlights?: string[];
  details?: string[];
}

const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "How long does AI automation implementation take?",
    answer: "Most AI automation projects are completed within 2-6 weeks, depending on complexity and scope. We provide a detailed timeline during your free consultation, including key milestones and deliverables.",
    highlights: ["2-6 weeks"],
    details: [
      "Simple Process Automation: 1-2 weeks",
      "System Integration Projects: 3-4 weeks", 
      "Complex Multi-System Automation: 4-6 weeks"
    ]
  },
  {
    id: "faq-2",
    question: "What industries do you serve?",
    answer: "We specialize in AI automation solutions for three primary industries. Our solutions are also adaptable to other service-based industries with similar process automation needs.",
    details: [
      "Finance & Wealth Management: Portfolio automation, client onboarding, compliance reporting",
      "Healthcare: Patient data management, appointment scheduling, billing automation",
      "Real Estate: Lead management, property listing automation, client communication"
    ]
  },
  {
    id: "faq-3",
    question: "What's your implementation guarantee?",
    answer: "We guarantee 30% time reduction in your automated processes or provide a full refund within 90 days of implementation. We're confident in our results because we've achieved 30-50% efficiency gains for 100% of our completed projects.",
    highlights: ["30% time reduction", "full refund"],
    details: [
      "Measurable time savings documentation",
      "Performance benchmarking before and after",
      "90-day support and optimization period",
      "Full refund if targets aren't met"
    ]
  },
  {
    id: "faq-4",
    question: "Do you work with small businesses?",
    answer: "Absolutely! We offer startup-friendly pricing and scalable solutions designed specifically for growing businesses. Many of our clients started as small businesses and scaled their operations using our automation solutions.",
    highlights: ["startup-friendly pricing"],
    details: [
      "Flexible payment terms",
      "Phased implementation approach",
      "Focus on high-impact, low-cost automation",
      "Training and handover for your team"
    ]
  },
  {
    id: "faq-5",
    question: "How is pricing structured?",
    answer: "We use transparent, fixed-fee pricing with no hidden costs or hourly billing surprises. Investment typically ranges from $5K-$25K depending on project scope, with ROI typically achieved within 3-6 months.",
    highlights: ["transparent, fixed-fee pricing", "$5K-$25K"],
    details: [
      "Discovery & Strategy: Free consultation and project scoping",
      "Implementation: Fixed project fee based on scope and complexity", 
      "Support & Maintenance: Optional monthly retainer for ongoing optimization"
    ]
  }
];

// JSON-LD Schema for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": `${faq.answer} ${faq.details ? faq.details.join('. ') : ''}`
    }
  }))
};

const FAQSection = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sectionRef = useRef<HTMLElement>(null);

  // Lazy loading implementation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isLoaded) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isLoaded]);

  // Mobile touch optimization
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Ensure proper touch handling on mobile
      const target = e.target as HTMLElement;
      if (target.closest('[data-accordion-trigger]')) {
        target.style.setProperty('-webkit-tap-highlight-color', 'rgba(59, 130, 246, 0.1)');
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    return () => document.removeEventListener('touchstart', handleTouchStart);
  }, []);

  const handleItemClick = (itemId: string) => {
    // If clicking the already open item, close it
    const newOpenItem = openItem === itemId ? null : itemId;
    setOpenItem(newOpenItem);
    
    // Scroll into view if opening (mobile optimized)
    if (newOpenItem && itemRefs.current[itemId]) {
      setTimeout(() => {
        itemRefs.current[itemId]?.scrollIntoView({ 
          behavior: 'smooth',
          block: window.innerWidth < 768 ? 'start' : 'center'
        });
      }, 100);
    }
  };

  const renderAnswer = (faq: FAQItem) => {
    const { answer, highlights = [], details = [] } = faq;
    
    let processedAnswer = answer;
    
    // Highlight key terms
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi');
      processedAnswer = processedAnswer.replace(
        regex, 
        '<span class="bg-elevate-accent/20 text-elevate-accent px-1 py-0.5 rounded font-semibold">$1</span>'
      );
    });

    return (
      <div className="space-y-4">
        <p 
          className="typography-body leading-relaxed text-gray-300 whitespace-normal break-words text-sm md:text-base lg:text-lg"
          dangerouslySetInnerHTML={{ __html: processedAnswer }}
        />
        {details.length > 0 && (
          <ul className="space-y-2 ml-4">
            {details.map((detail, index) => (
              <li 
                key={index}
                className="text-gray-400 text-sm md:text-base flex items-start"
              >
                <span className="text-elevate-accent mr-2 mt-1 flex-shrink-0">•</span>
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
      
      <section 
        ref={sectionRef}
        id="faq"
        className="section-padding bg-elevate-dark text-white relative z-10"
        aria-labelledby="faq-section-heading"
      >
        <div className="container mx-auto responsive-padding">
          <div className="text-center mb-8 md:mb-12">
            <h2 
              id="faq-section-heading" 
              className="typography-h2 mb-4 heading-gradient text-3xl"
            >
              Frequently Asked Questions
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Get answers to common questions about our AI automation services, implementation process, and pricing structure.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id}
                  ref={(el) => (itemRefs.current[faq.id] = el)}
                  className="border border-elevate-accent/20 rounded-lg bg-elevate-dark/50 backdrop-blur-sm overflow-hidden hover:border-elevate-accent/40 transition-all duration-300"
                >
                  <AccordionTrigger 
                    onClick={() => handleItemClick(faq.id)} 
                    className="px-4 sm:px-6 py-4 sm:py-5 text-left font-medium hover:text-elevate-accent transition-colors flex justify-between items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elevate-accent no-underline hover:no-underline min-h-[44px]" 
                    aria-controls={`${faq.id}-content`}
                    aria-expanded={openItem === faq.id}
                    data-accordion-trigger
                  >
                    <span className="text-left flex-1 pr-2 text-white leading-relaxed text-sm md:text-base lg:text-lg font-semibold">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent
                    id={`${faq.id}-content`}
                    className="px-4 sm:px-6 pb-4 sm:pb-5 text-gray-300 animate-accordion-down overflow-visible"
                  >
                    <div className="pt-4 border-t border-elevate-accent/10">
                      {renderAnswer(faq)}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Call to Action */}
            <div className="mt-12 p-6 md:p-8 bg-gradient-to-br from-elevate-accent/10 to-elevate-accent/5 rounded-lg border border-elevate-accent/20 text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-300 mb-6 text-sm md:text-base max-w-2xl mx-auto">
                Schedule a free consultation to discuss your automation needs and get a custom project quote with guaranteed ROI.
              </p>
              <a 
                href="/contact" 
                className="inline-block bg-elevate-accent hover:bg-elevate-accent/90 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 min-h-[44px] flex items-center justify-center text-sm md:text-base"
                aria-label="Book a free consultation"
              >
                Book Free Consultation
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;