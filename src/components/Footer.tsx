
import React from 'react';
import { Link } from "react-router-dom";
import Logo from "./Logo";
import WaveDesign from "./WaveDesign";
import { SocialMediaIcons } from "./footer/SocialMediaIcons";
import { TrustBadges } from "./footer/TrustBadges";
import { Newsletter } from "./footer/Newsletter";
import { OrganizationSchema } from "./footer/OrganizationSchema";
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
    // Scroll to top smoothly
  
  return (
    <footer className="bg-[#1a1f2c] relative overflow-hidden" role="contentinfo" aria-label="Website footer">
      <OrganizationSchema />
      
      {/* Wave Design Background */}
      <WaveDesign />
      
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
          
          {/* Column 1: Explore */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 border-b border-gray-700 pb-3">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/services" 
                  className="text-gray-300 hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1f2c] min-h-[44px] flex items-center px-2 py-1 rounded-md"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/industries" 
                  className="text-gray-300 hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1f2c] min-h-[44px] flex items-center px-2 py-1 rounded-md"
                >
                  Industries
                </Link>
              </li>
              <li>
                <Link 
                  to="/case-studies" 
                  className="text-gray-300 hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1f2c] min-h-[44px] flex items-center px-2 py-1 rounded-md"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-gray-300 hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1f2c] min-h-[44px] flex items-center px-2 py-1 rounded-md"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1f2c] min-h-[44px] flex items-center px-2 py-1 rounded-md"
                >
                  About Xlevate Tech
                </Link>
              </li>
              <li>
                <Link 
                  to="/automation-roi-calculator" 
                  className="text-gray-300 hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1f2c] min-h-[44px] flex items-center px-2 py-1 rounded-md"
                >
                  ROI Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Contact Information */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 border-b border-gray-700 pb-3">
              Contact
            </h3>
            <div className="space-y-4">
              <a 
                href="mailto:raj.dalal@xlevatetech.com" 
                className="flex items-center text-gray-300 hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1f2c] min-h-[44px] px-2 py-1 rounded-md"
                aria-label="Send email to raj.dalal@xlevatetech.com"
              >
                <svg className="h-6 w-6 mr-3 text-[#4A90E2] flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <use href="/assets/sprite.svg#icon-mail" />
                </svg>
                <span>raj.dalal@xlevatetech.com</span>
              </a>
              
              <a 
                href="tel:+18479210915" 
                className="flex items-center text-gray-300 hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1f2c] min-h-[44px] px-2 py-1 rounded-md"
                aria-label="Call (847) 921-0915"
              >
                <svg className="h-5 w-5 mr-3 text-[#4A90E2]" fill="none" viewBox="0 0 24 24">
                  <use href="/assets/sprite.svg#icon-phone" />
                </svg>
                <span>(847) 921-0915</span>
              </a>
              
              <div className="flex items-center text-gray-300 min-h-[44px] px-2 py-1">
                <svg className="h-5 w-5 mr-3 text-[#4A90E2]" fill="none" viewBox="0 0 24 24">
                  <use href="/assets/sprite.svg#icon-tick" />
                </svg>
                <span>Response time: &lt;24 hours</span>
              </div>
            </div>
          </div>

          {/* Column 3: Trust & Standards */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 border-b border-gray-700 pb-3">
              Trust & Standards
            </h3>
            <TrustBadges />
          </div>

          {/* Column 4: Stay In Touch */}
          <div>
            <h3 className="text-white font-bold text-base mb-6 border-b border-gray-700 pb-3">
              Stay In Touch
            </h3>
            <div className="space-y-6">
              <Newsletter />
              <div>
                <p className="text-sm text-gray-300 mb-3">Follow us:</p>
                <SocialMediaIcons />
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="mt-16 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Logo className="w-[160px] h-auto mx-auto md:mx-0" linkUrl="https://xlevatetech.com/" />
            </div>
            
            <div className="text-center md:text-right">
              <div className="text-gray-400 text-sm mb-2">
                <p>© {currentYear} Xlevate Tech. All rights reserved.</p>
                <p className="text-xs">Xlevate Tech is a brand of Elevate-X Tech Solutions LLC</p>
              </div>
              
          {/* Legal Links with Pipe Separators */}
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-1 text-xs text-gray-500">
            <Link 
              to="/privacy-policy" 
              className="hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] px-2 py-1 rounded min-h-[32px] flex items-center"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600">|</span>
            <Link 
              to="/terms-and-conditions" 
              className="hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] px-2 py-1 rounded min-h-[32px] flex items-center"
            >
              Terms & Conditions
            </Link>
            <span className="text-gray-600">|</span>
            <Link 
              to="/accessibility-statement" 
              className="hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] px-2 py-1 rounded min-h-[32px] flex items-center"
            >
              Accessibility
            </Link>
            <span className="text-gray-600">|</span>
            <Link 
              to="/disclaimer" 
              className="hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] px-2 py-1 rounded min-h-[32px] flex items-center"
            >
              Disclaimer
            </Link>
            <span className="text-gray-600">|</span>
            <a 
              href="https://calendly.com/raj-dalal-xlevatetech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#4A90E2] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] px-2 py-1 rounded min-h-[32px] flex items-center font-semibold"
            >
              Book Now
            </a>
          </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
