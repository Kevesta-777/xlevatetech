
import React from 'react';

interface AnimatedArrowProps {
  className?: string;
  size?: number;
}

const AnimatedArrow = ({ className = "", size = 16 }: AnimatedArrowProps) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110"
      >
        <defs>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M7 17L17 7M17 7H8M17 7V16"
          stroke="url(#arrowGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 group-hover:stroke-[3]"
        />
        <circle
          cx="17"
          cy="7"
          r="1.5"
          fill="currentColor"
          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </svg>
    </div>
  );
};

export default AnimatedArrow;
