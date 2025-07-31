
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SEOOptimizer } from '@/components/blog/SEOOptimizer';
import ScrollToTop from '@/components/ScrollToTop';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-elevate-dark">
      <SEOOptimizer
        title="Cookie Policy - Data Collection & Privacy | Xlevate Tech"
        description="Learn about how Xlevate Tech uses cookies and similar technologies to improve your browsing experience and website functionality."
        type="website"
        url="https://xlevatetech.com/cookie-policy"
      />
      
      <Navbar />
      
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Cookie Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              This Cookie Policy explains how Xlevate Tech uses cookies and similar technologies 
              when you visit our website at xlevatetech.com.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files that are placed on your device when you visit a website. 
              They help websites remember your preferences and improve your browsing experience.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Cookies</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Essential Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies are necessary for the website to function properly and cannot be disabled:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Session management and security</li>
              <li>Form submission and data processing</li>
              <li>Basic website functionality</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Analytics Cookies</h3>
            <p className="text-gray-700 mb-4">
              We use analytics cookies to understand how visitors interact with our website:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Google Analytics (anonymized data)</li>
              <li>Page visit tracking and user behavior analysis</li>
              <li>Website performance monitoring</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Functional Cookies</h3>
            <p className="text-gray-700 mb-4">
              These cookies enhance your user experience:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Remembering your preferences and settings</li>
              <li>Customizing content based on your interests</li>
              <li>Improving website navigation</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              Some cookies are set by third-party services we use:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>Calendly:</strong> For appointment scheduling functionality</li>
              <li><strong>Google Analytics:</strong> For website traffic analysis</li>
              <li><strong>LinkedIn:</strong> For social media integration</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Managing Cookies</h2>
            <p className="text-gray-700 mb-4">
              You can control cookies through your browser settings:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li>Block all cookies or specific types</li>
              <li>Delete existing cookies</li>
              <li>Set preferences for future cookie storage</li>
            </ul>
            
            <p className="text-gray-700 mb-4">
              Please note that disabling certain cookies may affect website functionality 
              and your user experience.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookie Retention</h2>
            <p className="text-gray-700 mb-4">
              Different cookies have different retention periods:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
              <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent cookies:</strong> Remain until expiration or manual deletion</li>
              <li><strong>Analytics cookies:</strong> Typically expire after 2 years</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Email: <a href="mailto:raj.dalal@xlevatetech.com" className="text-blue-600 underline">raj.dalal@xlevatetech.com</a></li>
              <li>Phone: <a href="tel:+18479210915" className="text-blue-600 underline">(847) 921-0915</a></li>
            </ul>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
              <p className="text-sm text-gray-700">
                <strong>Last updated:</strong> January 2025<br/>
                This Cookie Policy may be updated periodically to reflect changes in our practices or applicable laws.
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

export default CookiePolicy;
