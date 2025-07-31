
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  useEffect(() => {
    // Update meta tags for SEO
    document.title = "Privacy Policy | Xlevate Tech";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Read Xlevate Tech\'s privacy policy to understand how we collect, use, and protect your personal information. Learn about our commitment to data security and privacy.');
    }
  }, []);

  return (
    <div className="bg-elevate-dark min-h-screen">
      <Navbar />
      <div className="container max-w-3xl mx-auto px-4 pt-24 pb-16">
        <div className="bg-elevate-dark/50 backdrop-blur-lg rounded-lg p-8 shadow-lg border border-elevate-accent/10">
          <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy for Xlevate Tech</h1>
          <p className="text-gray-400 mb-4">Effective Date: April 2025</p>
          
          <div className="prose prose-invert">
            <p className="text-gray-300 mb-6">
              Xlevate Tech ("we", "us", "our") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Information Collection:</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>We collect personal information that you voluntarily provide (e.g., email addresses through contact forms).</li>
              <li>We do not sell, rent, or share your personal information.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Use of Information:</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
              <li>To respond to your inquiries.</li>
              <li>To provide services and support.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Security:</h2>
            <p className="text-gray-300 mb-6">
              We use commercially reasonable efforts to protect your information.
            </p>
            
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Contact:</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy, contact us at{' '}
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

export default PrivacyPolicy;
