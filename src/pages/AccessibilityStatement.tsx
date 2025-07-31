
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SEOOptimizer } from '@/components/blog/SEOOptimizer';
import ScrollToTop from '@/components/ScrollToTop';

const AccessibilityStatement = () => {
  return (
    <div className="min-h-screen bg-elevate-dark">
      <SEOOptimizer
        title="Accessibility Statement - WCAG 2.2 AA Compliance | Xlevate Tech"
        description="Our commitment to digital accessibility and WCAG 2.2 AA compliance for all users of Xlevate Tech's website and services."
        type="website"
        url="https://xlevatetech.com/accessibility-statement"
      />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Accessibility Statement
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Xlevate Tech is committed to ensuring digital accessibility for people with disabilities. 
              We continually improve the user experience for everyone and apply relevant accessibility standards.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Conformance Status</h2>
            <p className="text-gray-700 mb-4">
              The Web Content Accessibility Guidelines (WCAG) define requirements for designers and developers 
              to improve accessibility for people with disabilities. This website strives to conform to WCAG 2.2 
              Level AA standards.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Accessibility Features</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Keyboard navigation support throughout the website</li>
              <li>Screen reader compatibility with proper ARIA labels</li>
              <li>High color contrast ratios (minimum 4.5:1 for normal text)</li>
              <li>Resizable text up to 200% without loss of functionality</li>
              <li>Focus indicators for all interactive elements</li>
              <li>Alternative text for all informative images</li>
              <li>Consistent navigation and page structure</li>
              <li>Clear headings and semantic markup</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Feedback and Contact</h2>
            <p className="text-gray-700 mb-4">
              We welcome your feedback on the accessibility of our website. If you encounter 
              accessibility barriers, please contact us:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Email: <a href="mailto:raj.dalal@xlevatetech.com" className="text-blue-600 underline">raj.dalal@xlevatetech.com</a></li>
              <li>Phone: <a href="tel:+18479210915" className="text-blue-600 underline">(847) 921-0915</a></li>
              <li>Response time: We aim to respond within 24 hours</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Technical Specifications</h2>
            <p className="text-gray-700 mb-4">
              Accessibility of this website relies on the following technologies:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>HTML5</li>
              <li>WAI-ARIA (Web Accessibility Initiative – Accessible Rich Internet Applications)</li>
              <li>CSS3</li>
              <li>JavaScript (with graceful degradation)</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitations and Alternatives</h2>
            <p className="text-gray-700 mb-4">
              Despite our efforts, some limitations may remain. If you experience difficulty 
              accessing any part of our website, please contact us for alternative formats 
              or assistance.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
              <p className="text-sm text-gray-700">
                <strong>Last updated:</strong> January 2025<br/>
                This statement was prepared in accordance with WCAG 2.2 guidelines and is reviewed regularly.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default AccessibilityStatement;
