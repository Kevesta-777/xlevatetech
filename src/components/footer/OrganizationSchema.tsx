
import React from 'react';

export const OrganizationSchema: React.FC = () => {
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
      "availableLanguage": "English"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "sameAs": [
      "https://www.linkedin.com/in/rajdalal1/",
      "https://www.linkedin.com/company/xlevate-tech",
      "https://twitter.com/XlevateTech"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};
