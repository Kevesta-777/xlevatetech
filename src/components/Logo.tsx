
import React from "react";

interface LogoProps {
  className?: string;
  linkUrl?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "", linkUrl = "https://xlevatetech.com/" }) => {
  const logoElement = (
    <img 
      src="/xlevate_logo1.svg" 
      alt="Xlevate Tech Logo - AI Automation Solutions" 
      className={`h-auto w-[144px] sm:w-[168px] md:w-[192px] lg:w-[216px] xl:w-[240px] max-h-[72px] sm:max-h-[76px] ${className}`}
      width={220}
      height={50}
      loading="eager"
      {...({ fetchpriority: "high" } as any)}
    />
  );
  
  if (linkUrl) {
    return (
      <a 
        href={linkUrl}
        className="flex items-center focus:outline-none focus:ring-3 focus:ring-[#0A2463] focus:ring-offset-2 focus:ring-offset-elevate-dark rounded-md"
        rel="noopener noreferrer"
        aria-label="Xlevate Tech homepage"
      >
        {logoElement}
      </a>
    );
  }
  
  return logoElement;
};

export default Logo;
