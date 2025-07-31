
import React from 'react';
import './FooterAnimations.css';

const WaveDesign = () => {
  return (
    <div 
      className="relative w-full h-16 sm:h-20 overflow-hidden circuit-design" 
      aria-hidden="true"
      role="presentation"
    >
      <svg
        className="absolute bottom-0 w-full h-full"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <defs>
          <linearGradient id="circuit-gradient-primary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#70EDFF" stopOpacity="0.9" />
            <stop offset="25%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#1e3a8a" stopOpacity="0.7" />
            <stop offset="75%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#70EDFF" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="circuit-gradient-secondary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#70EDFF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main circuit pathways with enhanced detail */}
        <g stroke="url(#circuit-gradient-primary)" strokeWidth="2" fill="none" filter="url(#glow)">
          <path d="M0,40 L120,40 L140,20 L240,20 L260,40 L380,40 L400,60 L520,60 L540,40 L660,40 L680,20 L800,20 L820,40 L940,40 L960,60 L1080,60 L1100,40 L1220,40 L1240,20 L1440,20" />
          <path d="M0,60 L100,60 L120,40 L220,40 L240,60 L360,60 L380,40 L480,40 L500,60 L620,60 L640,40 L740,40 L760,60 L880,60 L900,40 L1000,40 L1020,60 L1140,60 L1160,40 L1260,40 L1280,60 L1440,60" />
          <path d="M0,20 L80,20 L100,40 L200,40 L220,20 L340,20 L360,40 L460,40 L480,20 L600,20 L620,40 L720,40 L740,20 L860,20 L880,40 L980,40 L1000,20 L1120,20 L1140,40 L1240,40 L1260,20 L1440,20" />
        </g>
        
        {/* Circuit nodes with enhanced glow */}
        <g fill="url(#circuit-gradient-primary)" filter="url(#glow)">
          <circle cx="140" cy="20" r="3" />
          <circle cx="260" cy="40" r="3" />
          <circle cx="400" cy="60" r="3" />
          <circle cx="540" cy="40" r="3" />
          <circle cx="680" cy="20" r="3" />
          <circle cx="820" cy="40" r="3" />
          <circle cx="960" cy="60" r="3" />
          <circle cx="1100" cy="40" r="3" />
          <circle cx="1240" cy="20" r="3" />
        </g>
        
        {/* Secondary circuit layer */}
        <g stroke="url(#circuit-gradient-secondary)" strokeWidth="1.5" fill="none" opacity="0.8">
          <path d="M60,30 L180,30 L200,50 L300,50 L320,30 L440,30 L460,50 L580,50 L600,30 L720,30 L740,50 L860,50 L880,30 L1000,30 L1020,50 L1140,50 L1160,30 L1280,30 L1300,50 L1440,50" />
          <path d="M40,50 L160,50 L180,30 L280,30 L300,50 L420,50 L440,30 L560,30 L580,50 L700,50 L720,30 L840,30 L860,50 L980,50 L1000,30 L1120,30 L1140,50 L1260,50 L1280,30 L1440,30" />
        </g>
        
        {/* Micro circuits and connection points */}
        <g stroke="url(#circuit-gradient-primary)" strokeWidth="1" fill="none" opacity="0.7">
          <rect x="137" y="17" width="6" height="6" rx="1" />
          <rect x="257" y="37" width="6" height="6" rx="1" />
          <rect x="397" y="57" width="6" height="6" rx="1" />
          <rect x="537" y="37" width="6" height="6" rx="1" />
          <rect x="677" y="17" width="6" height="6" rx="1" />
          <rect x="817" y="37" width="6" height="6" rx="1" />
          <rect x="957" y="57" width="6" height="6" rx="1" />
          <rect x="1097" y="37" width="6" height="6" rx="1" />
          <rect x="1237" y="17" width="6" height="6" rx="1" />
        </g>
        
        {/* Additional circuit traces for complexity */}
        <g stroke="url(#circuit-gradient-secondary)" strokeWidth="0.8" fill="none" opacity="0.6">
          <path d="M0,35 L50,35 L60,25 L110,25 L120,35 L170,35 L180,45 L230,45 L240,35 L290,35 L300,25 L350,25 L360,35 L410,35 L420,45 L470,45 L480,35 L530,35 L540,25 L590,25 L600,35 L650,35 L660,45 L710,45 L720,35 L770,35 L780,25 L830,25 L840,35 L890,35 L900,45 L950,45 L960,35 L1010,35 L1020,25 L1070,25 L1080,35 L1130,35 L1140,45 L1190,45 L1200,35 L1250,35 L1260,25 L1310,25 L1320,35 L1370,35 L1380,45 L1440,45" />
        </g>
      </svg>
    </div>
  );
};

export default WaveDesign;
