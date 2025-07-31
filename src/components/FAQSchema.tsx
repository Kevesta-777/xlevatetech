
import React from "react";

// This component will inject the FAQ schema as JSON-LD
const FAQSchema = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What types of businesses do you typically work with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We work with small to mid-sized companies in finance, healthcare, real estate, and compliance-heavy industries that need to streamline manual operations and workflows."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to know how to code or have a developer on staff?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nope. Our solutions are built using low-code and no-code tools like Zapier, Make.com, and GPT agents. You don't need any technical background to benefit."
        }
      },
      {
        "@type": "Question",
        "name": "What's included in the free automation audit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We'll analyze your current workflows, identify 2–3 time-draining tasks, and give you a plan to automate them using AI tools. No strings attached."
        }
      },
      {
        "@type": "Question",
        "name": "Are your services compliant with HIPAA, FINRA, or SEC standards?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We help teams prepare for audits by improving documentation, workflows, and internal tracking — but we do not provide licensed compliance or legal services."
        }
      },
      {
        "@type": "Question",
        "name": "How fast can we launch automations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most of our clients see their first automations live within 2–3 weeks. Our goal is to get you ROI as quickly as possible."
        }
      }
    ]
  };

  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default FAQSchema;
