
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SEOOptimizer } from '@/components/blog/SEOOptimizer';
import ScrollToTop from '@/components/ScrollToTop';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-elevate-dark">
      <SEOOptimizer
        title="Professional Services Disclaimer | Xlevate Tech"
        description="Important disclaimers about Xlevate Tech's AI automation consulting services, limitations, and professional responsibilities."
        type="website"
        url="https://xlevatetech.com/disclaimer"
      />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Professional Services Disclaimer
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm text-gray-700">
                <strong>Important Notice:</strong> Please read this disclaimer carefully before engaging with Xlevate Tech's services. 
                By using our services, you acknowledge that you have read, understood, and agree to these terms.
              </p>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Service Scope and Limitations</h2>
            <p className="text-gray-700 mb-4">
              Xlevate Tech provides AI automation consulting, documentation, implementation support, 
              and workflow optimization services. Our services are designed to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Analyze and optimize internal business processes</li>
              <li>Implement no-code and low-code automation solutions</li>
              <li>Provide documentation and training for internal teams</li>
              <li>Prepare organizations for third-party reviews and audits</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Do NOT Provide</h2>
            <p className="text-gray-700 mb-4">
              Xlevate Tech explicitly does NOT provide:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Certified security audits or penetration testing</li>
              <li>Legal compliance certifications or regulatory approvals</li>
              <li>Legal advice or interpretation of regulations</li>
              <li>Guaranteed compliance with specific industry standards</li>
              <li>Software development or custom coding services</li>
              <li>Financial advice or investment recommendations</li>
              <li>Medical device compliance or healthcare certifications</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Results and Performance</h2>
            <p className="text-gray-700 mb-4">
              While we strive for excellence in all our implementations:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Results may vary based on organizational factors, existing systems, and implementation complexity</li>
              <li>Time savings and efficiency improvements depend on current process maturity</li>
              <li>ROI calculations are estimates based on typical scenarios and may not reflect actual outcomes</li>
              <li>Success metrics are dependent on proper implementation and user adoption</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Regulatory and Compliance Matters</h2>
            <p className="text-gray-700 mb-4">
              For matters requiring regulatory certification, legal guidance, or compliance validation:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Consult with licensed professionals in your jurisdiction</li>
              <li>Engage certified auditors for compliance verification</li>
              <li>Seek legal counsel for regulatory interpretation</li>
              <li>Work with industry-specific consultants for specialized requirements</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All automation frameworks, methodologies, templates, and proprietary processes developed by 
              Xlevate Tech are protected under intellectual property law and remain the exclusive property 
              of Elevate-X Tech Solutions LLC.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Technology and Integration</h2>
            <p className="text-gray-700 mb-4">
              Our automation solutions integrate with third-party platforms and services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>We are not responsible for changes to third-party platforms or APIs</li>
              <li>Integration performance depends on external service availability</li>
              <li>Additional costs may apply for premium features of third-party services</li>
              <li>Data security and privacy policies of integrated platforms apply</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              Xlevate Tech's liability is limited to the direct costs of services provided. We are not liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Indirect, consequential, or incidental damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages resulting from improper implementation or use</li>
              <li>Third-party service failures or data breaches</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Industry-Specific Considerations</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Healthcare</h3>
            <p className="text-gray-700 mb-4">
              Our healthcare automation solutions are designed for administrative and operational processes only. 
              We do not provide HIPAA compliance certification or clinical decision support systems.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Finance</h3>
            <p className="text-gray-700 mb-4">
              Financial automation solutions focus on operational efficiency and do not constitute financial advice. 
              Regulatory compliance verification requires independent assessment by qualified professionals.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Real Estate</h3>
            <p className="text-gray-700 mb-4">
              Real estate automation solutions are designed for process optimization and client management. 
              Legal document processing and compliance verification require licensed professional review.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact for Clarification</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about the scope of our services or need clarification on any disclaimer items:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Email: <a href="mailto:raj.dalal@xlevatetech.com" className="text-blue-600 underline">raj.dalal@xlevatetech.com</a></li>
              <li>Phone: <a href="tel:+18479210915" className="text-blue-600 underline">(847) 921-0915</a></li>
              <li>Schedule a consultation to discuss your specific requirements</li>
            </ul>
            
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-8">
              <p className="text-sm text-gray-700">
                <strong>Last updated:</strong> January 2025<br/>
                This disclaimer is reviewed regularly and may be updated to reflect changes in our service offerings or applicable laws. 
                Continued use of our services constitutes acceptance of any updates.
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

export default Disclaimer;
