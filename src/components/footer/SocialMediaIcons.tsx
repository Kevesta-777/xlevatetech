
import React from 'react';

interface SocialMediaIconsProps {
  className?: string;
}

export const SocialMediaIcons: React.FC<SocialMediaIconsProps> = ({ className = "" }) => {
  const socialLinks = [
    {
      name: 'LinkedIn - Xlevate Tech',
      url: 'https://linkedin.com/company/xlevate-tech',
      icon: 'icon-linkedin',
      ariaLabel: 'Follow Xlevate Tech company on LinkedIn'
    },
    {
      name: 'X (Twitter)',
      url: 'https://twitter.com/XlevateTech',
      icon: 'icon-x',
      ariaLabel: 'Follow @XlevateTech on X'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/XlevateTech',
      icon: 'icon-facebook',
      ariaLabel: 'Follow Xlevate Tech on Facebook'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/xlevatetech/',
      icon: 'icon-instagram',
      ariaLabel: 'Follow @xlevatetech on Instagram'
    }
  ];

  return (
    <div className={`flex gap-4 ${className}`}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-[44px] h-[44px] flex items-center justify-center bg-gray-800 hover:bg-[#4A90E2] rounded-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A90E2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1f2c] group"
          aria-label={social.ariaLabel}
        >
          <svg className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors duration-300" fill="none" viewBox="0 0 24 24">
            <use href={`/assets/sprite.svg#${social.icon}`} />
          </svg>
        </a>
      ))}
    </div>
  );
};
