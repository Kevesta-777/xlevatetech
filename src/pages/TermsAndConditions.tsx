
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsAndConditions = () => {
  useEffect(() => {
    // Update meta tags for SEO
    document.title = "Terms and Conditions | Xlevate Tech";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Review Xlevate Tech\'s terms and conditions to understand our service agreements, website usage policies, and legal requirements for using our services.');
    }
  }, []);

  return (
    <div className="bg-elevate-dark min-h-screen">
      <Navbar />
      <div className="container max-w-3xl mx-auto px-4 pt-24 pb-16">
        <div className="bg-elevate-dark/50 backdrop-blur-lg rounded-lg p-8 shadow-lg border border-elevate-accent/10">
          <h1 className="text-3xl font-bold text-white mb-6">Terms and Conditions for Xlevate Tech</h1>
          <p className="text-gray-400 mb-4">Effective Date: April 2025</p>
          
          <div className="prose prose-invert">
            <p className="text-gray-300 mb-6">
              Welcome to Xlevate Tech. By accessing our website, you agree to comply with and be bound by the following terms and conditions.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Use of Site:</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>You may use our site for lawful purposes only.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Intellectual Property:</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>All content on this website is owned by Xlevate Tech.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Limitation of Liability:</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>We are not responsible for any damages arising from the use of our website.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Changes to Terms:</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>We may update these terms at any time without notice.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Contact:</h2>
            <p className="text-gray-300">
              If you have any questions, contact us at{' '}
              <a 
                href="mailto:raj.dalal@xlevatetech.com" 
                className="text-elevate-accent hover:text-elevate-accent-light transition-colors"
              >
                raj.dalal@xlevatetech.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
