
import React from 'react';

export const FooterSchema: React.FC = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Xlevate Tech",
    "legalName": "Elevate-X Tech Solutions LLC",
    "url": "https://xlevatetech.com",
    "logo": "https://xlevatetech.com/xlevate_logo1.svg",
    "description": "AI automation solutions and consulting for business workflow optimization in finance, healthcare, and real estate industries.",
    "foundingDate": "2025",
    "founder": {
      "@type": "Person",
      "name": "Raj Dalal",
      "jobTitle": "Founder & CEO",
      "sameAs": "https://www.linkedin.com/in/rajdalal1/"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-847-921-0915",
      "email": "raj.dalal@xlevatetech.com",
      "contactType": "Customer Service",
      "availableLanguage": "English",
      "hoursAvailable": {
        "@type": "OpeningHoursSpecification",
        "description": "Response time: <24 hours"
      }
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "areaServed": [
      {
        "@type": "Service",
        "name": "AI Automation Consulting",
        "serviceType": "Finance Automation"
      },
      {
        "@type": "Service", 
        "name": "AI Automation Consulting",
        "serviceType": "Healthcare Automation"
      },
      {
        "@type": "Service",
        "name": "AI Automation Consulting", 
        "serviceType": "Real Estate Automation"
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/in/rajdalal1/",
      "https://www.linkedin.com/company/xlevate-tech",
      "https://twitter.com/XlevateTech"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "ratingCount": "47"
    },
    "knowsAbout": [
      "AI Automation",
      "Business Process Optimization", 
      "No-Code Automation",
      "Workflow Automation",
      "Digital Transformation"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};
