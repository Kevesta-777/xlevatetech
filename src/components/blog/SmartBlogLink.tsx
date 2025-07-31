
import React, { useState, useEffect } from 'react';
import { ExternalLink, AlertTriangle } from 'lucide-react';
import { linkValidator } from '@/utils/linkValidator';

interface SmartBlogLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showValidation?: boolean;
}

export const SmartBlogLink: React.FC<SmartBlogLinkProps> = ({ 
  href, 
  children, 
  className = "",
  showValidation = false 
}) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    const validateLink = async () => {
      try {
        const result = await linkValidator.validateLink(href);
        setIsValid(result.isValid);
        setRedirectUrl(result.redirectUrl || null);
      } catch (error) {
        console.warn('Link validation failed:', error);
        setIsValid(false);
      }
    };

    if (href && href.startsWith('http')) {
      validateLink();
    } else {
      setIsValid(true); // Assume internal links are valid
    }
  }, [href]);

  const finalUrl = redirectUrl || href;
  const isExternal = finalUrl.startsWith('http') && !finalUrl.includes('xlevatetech.com');

  // If link is invalid, provide fallback
  if (isValid === false) {
    const fallbackContent = linkValidator.generateFallbackContent('All');
    const fallbackUrl = fallbackContent.length > 0 ? fallbackContent[0].url : '/blog';
    
    return (
      <a 
        href={fallbackUrl}
        className={`${className} inline-flex items-center gap-1`}
        title="Original link unavailable - redirecting to related content"
      >
        {children}
        {showValidation && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
      </a>
    );
  }

  return (
    <a 
      href={finalUrl}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`${className} inline-flex items-center gap-1`}
    >
      {children}
      {isExternal && <ExternalLink className="h-3 w-3" />}
      {showValidation && isValid === null && (
        <div className="h-3 w-3 animate-pulse bg-gray-400 rounded-full" />
      )}
    </a>
  );
};
