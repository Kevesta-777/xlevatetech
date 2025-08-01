
import { useState, useRef } from "react";
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
}

const faqs: FAQItem[] = [
  {
    id: "faq-1",
    question: "What types of businesses do you typically work with?",
    answer: "We work with small to mid-sized companies in finance, healthcare, real estate, and compliance-heavy industries that need to streamline manual operations and workflows."
  },
  {
    id: "faq-2",
    question: "Do I need to know how to code or have a developer on staff?",
    answer: "Nope. Our solutions are built using low-code and no-code tools like Zapier, Make.com, and GPT agents. You don't need any technical background to benefit."
  },
  {
    id: "faq-3",
    question: "What's included in the free automation audit?",
    answer: "We'll analyze your current workflows, identify 2–3 time-draining tasks, and give you a plan to automate them using AI tools. No strings attached."
  },
  {
    id: "faq-4",
    question: "Are your services compliant with HIPAA, FINRA, or SEC standards?",
    answer: "We help teams prepare for audits by improving documentation, workflows, and internal tracking — but we do not provide licensed compliance or legal services."
  },
  {
    id: "faq-5",
    question: "How fast can we launch automations?",
    answer: "Most of our clients see their first automations live within 2–3 weeks. Our goal is to get you ROI as quickly as possible."
  }
];

const FAQSection = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleItemClick = (itemId: string) => {
    // If clicking the already open item, close it
    const newOpenItem = openItem === itemId ? null : itemId;
    setOpenItem(newOpenItem);
    
    // Scroll into view if opening
    if (newOpenItem && itemRefs.current[itemId]) {
      setTimeout(() => {
        itemRefs.current[itemId]?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  };

  return (
    <section 
      id="faq"
      className="section-padding bg-elevate-dark text-white relative z-10"
      aria-labelledby="faq-section-heading"
    >
      <div className="container mx-auto responsive-padding">
        <h2 
          id="faq-section-heading" 
          className="typography-h2 text-center mb-8 md:mb-12 heading-gradient text-3xl"
        >
          Frequently Asked Questions
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={faq.id}
                ref={(el) => (itemRefs.current[faq.id] = el)}
                className="border border-elevate-accent/20 rounded-lg bg-elevate-dark/50 backdrop-blur-sm overflow-hidden"
              >
                <AccordionTrigger 
                  onClick={() => handleItemClick(faq.id)} 
                  className="px-4 sm:px-6 py-4 sm:py-5 text-left font-medium hover:text-elevate-accent transition-colors flex justify-between items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elevate-accent no-underline hover:no-underline" 
                  aria-controls={`${faq.id}-content`}
                  aria-expanded={openItem === faq.id}
                >
                  <span className="text-left flex-1 pr-2 text-white leading-relaxed text-sm md:text-base lg:text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent
                  id={`${faq.id}-content`}
                  className="px-4 sm:px-6 pb-4 sm:pb-5 text-gray-300 animate-accordion-down overflow-visible"
                >
                  <div className="pt-2 border-t border-elevate-accent/10">
                    <p className="typography-body leading-relaxed text-gray-300 whitespace-normal break-words text-sm md:text-base lg:text-lg">{faq.answer}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
