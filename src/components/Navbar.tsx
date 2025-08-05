
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Sparkles } from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isExpertiseOpen, setIsExpertiseOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close menu when clicking outside or on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('#mobile-menu') && !target.closest('[data-mobile-menu-button]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('click', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleMenuItemClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (href.startsWith('http')) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      // Smooth scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    setIsOpen(false);
  };

  return (
    <>
      <nav 
        className={`header-container fixed w-full z-50 transition-all duration-300 ${
          isSticky ? "bg-elevate-dark shadow-lg" : "bg-elevate-dark/90 backdrop-blur-md"
        }`}
        style={{ 
          top: 0,
          minHeight: '80px'
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <style>{`
          /* Enhanced responsive navbar styling */
          .header-container {
            padding: 12px 16px 12px 16px; /* Mobile - consistent padding */
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-direction: column;
          }

          .top-bar {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            padding-bottom: 8px;
          }

          .main-nav-row {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .logo-container {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin: 0;
            padding: 0;
          }

          .nav-links-container {
            display: flex;
            align-items: center;
            margin-left: auto;
            margin-right: 24px;
          }

          .hero-section {
            padding: 20px 16px; /* Match header padding exactly */
            text-align: left;
          }

          .hero-section .container {
            padding-left: 0; /* Remove container padding to align with navbar */
            padding-right: 0;
            margin-left: 16px; /* Match navbar logo position */
            margin-right: 16px;
          }

          /* Enhanced mobile logo sizing */
          @media (max-width: 768px) {
            .mobile-logo {
              width: 160px !important; /* Increased from 120px */
              max-width: 160px !important;
            }
            .top-bar {
              display: none;
            }
            .header-container {
              flex-direction: row;
            }
            .nav-links-container {
              display: none;
            }
          }
          
          @media (max-width: 480px) {
            .mobile-logo {
              width: 140px !important; /* Increased from 100px */
              max-width: 140px !important;
            }
          }
          
          @media (max-width: 375px) {
            .mobile-logo {
              width: 120px !important; /* Minimum readable size */
              max-width: 120px !important;
            }
          }

          /* Responsive breakpoints */
          @media (min-width: 768px) {
            .header-container { 
              padding: 16px 32px 16px 24px; /* Added right padding for desktop */
            }
            .hero-section { 
              padding: 30px 24px; 
            }
            .hero-section .container {
              margin-left: 24px;
              margin-right: 24px;
            }
          }

          @media (min-width: 1024px) {
            .header-container { 
              padding: 20px 48px 20px 32px; /* More right padding for larger screens */
            }
            .hero-section { 
              padding: 40px 32px; 
              text-align: left; 
            }
            .hero-section .container {
              margin-left: 32px;
              margin-right: 32px;
            }
          }
          
          /* Large desktop styles */
          @media (min-width: 1440px) {
            .header-container {
              padding: 24px 80px 24px 100px; /* Generous right padding for large screens */
            }
            .hero-section .container {
              margin-left: 100px;
              margin-right: 100px;
            }
          }
          
          /* Hamburger menu optimization with better spacing */
          @media (max-width: 768px) {
            .hamburger-button {
              width: 44px !important;
              height: 44px !important;
              min-width: 44px !important;
              min-height: 44px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 10px !important;
              margin-right: 8px !important; /* Add margin to prevent screen edge hugging */
            }
          }
          
          @media (max-width: 375px) {
            .hamburger-button {
              width: 40px !important;
              height: 40px !important;
              min-width: 40px !important;
              min-height: 40px !important;
              padding: 8px !important;
              margin-right: 12px !important; /* More margin on smaller screens */
            }
          }

          /* Desktop navigation spacing */
          .desktop-nav {
            margin-right: 16px; /* Prevent hugging right edge */
          }

          @media (min-width: 768px) {
            .desktop-nav {
              margin-right: 24px;
            }
          }

          @media (min-width: 1024px) {
            .desktop-nav {
              margin-right: 32px;
            }
          }
        `}</style>
        

        {/* Main Navigation Row */}
        <div className="main-nav-row">
          <div className="logo-container">
            <Logo 
              linkUrl="https://xlevatetech.com/" 
              className="mobile-logo w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] xl:w-[240px]" 
            />
          </div>

          {/* Desktop Navigation Links */}
          <div className="nav-links-container hidden md:flex items-center space-x-6" role="menubar">
            <a 
              href="/about" 
              className="text-white hover:text-[#4A90E2] transition-colors duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#70EDFF] focus:ring-offset-2 focus:ring-offset-elevate-dark rounded-md px-2 py-1"
              role="menuitem"
              aria-label="About page"
            >
              About
            </a>
            <div 
              className="relative"
              onMouseEnter={() => setIsExpertiseOpen(true)}
              onMouseLeave={() => setIsExpertiseOpen(false)}
            >
              <button 
                className="text-white hover:text-[#4A90E2] transition-colors duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#70EDFF] focus:ring-offset-2 focus:ring-offset-elevate-dark rounded-md px-2 py-1 flex items-center gap-1"
                role="menuitem"
                aria-label="Expertise menu"
                aria-expanded={isExpertiseOpen}
              >
                Expertise
                <ChevronDown size={16} className={`transition-transform duration-200 ${isExpertiseOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-200 ${
                isExpertiseOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
              }`}>
                <div className="py-2">
                  <a 
                    href="/services" 
                    className="block px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-[#4A90E2] transition-colors duration-200 text-sm font-medium"
                  >
                    Services
                  </a>
                  <a 
                    href="/industries" 
                    className="block px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-[#4A90E2] transition-colors duration-200 text-sm font-medium"
                  >
                    Industries
                  </a>
                </div>
              </div>
            </div>
            <a 
              href="/automation-roi-calculator" 
              className="text-white hover:text-[#4A90E2] transition-colors duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#70EDFF] focus:ring-offset-2 focus:ring-offset-elevate-dark rounded-md px-2 py-1 flex items-center gap-1"
              role="menuitem"
              aria-label="ROI Calculator"
            >
              <Sparkles size={14} className="text-[#70EDFF]" />
              ROI Calculator
            </a>
            <a 
              href="/case-studies" 
              className="text-white hover:text-[#4A90E2] transition-colors duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#70EDFF] focus:ring-offset-2 focus:ring-offset-elevate-dark rounded-md px-2 py-1"
              role="menuitem"
              aria-label="Case Studies page"
            >
              Case Studies
            </a>
            <a 
              href="/blog" 
              className="text-white hover:text-[#4A90E2] transition-colors duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#70EDFF] focus:ring-offset-2 focus:ring-offset-elevate-dark rounded-md px-2 py-1"
              role="menuitem"
              aria-label="Blog page"
            >
              Blog
            </a>
            <a 
              href="/contact" 
              className="text-white hover:text-[#4A90E2] transition-colors duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#70EDFF] focus:ring-offset-2 focus:ring-offset-elevate-dark rounded-md px-2 py-1"
              role="menuitem"
              aria-label="Contact Us page"
            >
              Contact Us
            </a>
          </div>

          {/* Mobile Menu Button - Enhanced spacing */}
          <button 
            onClick={toggleMenu}
            data-mobile-menu-button
            className="hamburger-button md:hidden text-white relative z-50 focus:outline-none focus:ring-2 focus:ring-[#70EDFF] focus:ring-offset-2 focus:ring-offset-elevate-dark rounded-md transition-all duration-300 hover:bg-white/10"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              cursor: 'pointer'
            }}
          >
            {/* Icon with smooth transition */}
            <div className="relative transition-transform duration-300 ease-in-out" style={{ pointerEvents: 'none' }}>
              {isOpen ? (
                <X size={20} aria-hidden="true" className="transform transition-all duration-300 ease-in-out" />
              ) : (
                <Menu size={20} aria-hidden="true" className="transform transition-all duration-300 ease-in-out" />
              )}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMenu}
        aria-hidden="true"
        style={{ touchAction: 'manipulation' }}
      />

      {/* Mobile Navigation - Slide in from right with better positioning */}
      <div 
        id="mobile-menu"
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-elevate-dark/95 backdrop-blur-md z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0 opacity-100 visible shadow-2xl" : "translate-x-full opacity-0 invisible"
        }`}
        role="menu"
        aria-label="Mobile navigation menu"
        style={{ 
          touchAction: 'manipulation',
          marginRight: '8px' // Prevent edge hugging
        }}
      >
        <div className="flex flex-col h-full pt-20 px-6 py-4">
          {/* Navigation Links */}
          <div className="space-y-4">
            <a 
              href="/about"
              className="block w-full text-left text-white hover:text-[#4A90E2] py-4 border-b border-gray-700/20 transition-all duration-300 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#70EDFF] px-2 hover:bg-white/5"
              role="menuitem"
              aria-label="About page"
              onClick={closeMenu}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                cursor: 'pointer',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              About
            </a>
            
            <div className="border-b border-gray-700/20">
              <button 
                onClick={() => setIsExpertiseOpen(!isExpertiseOpen)}
                className="block w-full text-left text-white hover:text-[#4A90E2] py-4 transition-all duration-300 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#70EDFF] px-2 hover:bg-white/5 flex items-center justify-between"
                role="menuitem"
                aria-label="Expertise menu"
                aria-expanded={isExpertiseOpen}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  cursor: 'pointer',
                  minHeight: '56px'
                }}
              >
                Expertise
                <ChevronDown size={20} className={`transition-transform duration-200 ${isExpertiseOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Mobile Submenu */}
              <div className={`overflow-hidden transition-all duration-300 ${
                isExpertiseOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="pl-4 pb-2">
                  <a 
                    href="/services"
                    className="block w-full text-left text-gray-300 hover:text-[#4A90E2] py-3 transition-all duration-300 text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#70EDFF] px-2 hover:bg-white/5"
                    role="menuitem"
                    aria-label="Services page"
                    onClick={closeMenu}
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      cursor: 'pointer',
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    Services
                  </a>
                  
                  <a 
                    href="/industries"
                    className="block w-full text-left text-gray-300 hover:text-[#4A90E2] py-3 transition-all duration-300 text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#70EDFF] px-2 hover:bg-white/5"
                    role="menuitem"
                    aria-label="Industries page"
                    onClick={closeMenu}
                    style={{ 
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                      cursor: 'pointer',
                      minHeight: '48px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    Industries
                  </a>
                </div>
              </div>
            </div>
            
            <a 
              href="/automation-roi-calculator"
              className="block w-full text-left text-white hover:text-[#4A90E2] py-4 border-b border-gray-700/20 transition-all duration-300 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#70EDFF] px-2 hover:bg-white/5"
              role="menuitem"
              aria-label="ROI Calculator"
              onClick={closeMenu}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                cursor: 'pointer',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} className="text-[#70EDFF]" />
              ROI Calculator
            </a>
            
            <a 
              href="/case-studies"
              className="block w-full text-left text-white hover:text-[#4A90E2] py-4 border-b border-gray-700/20 transition-all duration-300 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#70EDFF] px-2 hover:bg-white/5"
              role="menuitem"
              aria-label="Case Studies page"
              onClick={closeMenu}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                cursor: 'pointer',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Case Studies
            </a>
            
            <a 
              href="/blog"
              className="block w-full text-left text-white hover:text-[#4A90E2] py-4 border-b border-gray-700/20 transition-all duration-300 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#70EDFF] px-2 hover:bg-white/5"
              role="menuitem"
              aria-label="Blog page"
              onClick={closeMenu}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                cursor: 'pointer',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Blog
            </a>
            
            <a 
              href="/contact"
              className="block w-full text-left text-white hover:text-[#4A90E2] py-4 border-b border-gray-700/20 transition-all duration-300 text-lg font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-[#70EDFF] px-2 hover:bg-white/5"
              role="menuitem"
              aria-label="Contact Us page"
              onClick={closeMenu}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                cursor: 'pointer',
                minHeight: '56px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Contact Us
            </a>
            
            
            {/* CTA Button */}
            <div className="pt-4">
              <button 
                onClick={(e) => handleMenuItemClick(e, 'https://calendly.com/raj-dalal-xlevatetech')}
                className="block w-full bg-[#0A2463] hover:bg-[#1E3A8A] text-white py-4 px-6 rounded-lg transition-all duration-300 text-lg font-medium text-center shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#70EDFF]"
                role="menuitem"
                aria-label="Get a free automation audit"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  touchAction: 'manipulation',
                  cursor: 'pointer',
                  minHeight: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Free Audit
                <span className="animate-wave inline-block will-change-transform" style={{transformOrigin: 'bottom center'}} aria-hidden="true">👋</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;