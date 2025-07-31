
import React from 'react';
import { ExternalLink, Mail, Phone, Calculator, Calendar, FileText, Building, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClickableResourceProps {
  href: string;
  children: React.ReactNode;
  type?: 'url' | 'email' | 'phone' | 'resource';
  className?: string;
  showIcon?: boolean;
}

export const ClickableResource: React.FC<ClickableResourceProps> = ({ 
  href, 
  children, 
  type = 'url',
  className = '',
  showIcon = true 
}) => {
  const isExternal = href.startsWith('http') && !href.includes('xlevatetech.com');
  
  const getIcon = () => {
    if (!showIcon) return null;
    
    switch (type) {
      case 'email':
        return <Mail className="h-3 w-3" />;
      case 'phone':
        return <Phone className="h-3 w-3" />;
      case 'resource':
        if (href.includes('roi-calculator')) return <Calculator className="h-3 w-3" />;
        if (href.includes('calendly')) return <Calendar className="h-3 w-3" />;
        if (href.includes('case-studies')) return <FileText className="h-3 w-3" />;
        if (href.includes('industries')) return <Building className="h-3 w-3" />;
        if (href.includes('pricing')) return <DollarSign className="h-3 w-3" />;
        return <ExternalLink className="h-3 w-3" />;
      default:
        return isExternal ? <ExternalLink className="h-3 w-3" /> : null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isExternal) {
      e.preventDefault();
      window.open(href, '_blank', 'noopener,noreferrer');
    } else if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline font-medium transition-colors ${className}`}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {children}
      {getIcon()}
    </a>
  );
};

interface ResourceButtonProps {
  text: string;
  url: string;
  variant?: 'default' | 'secondary' | 'outline';
}

export const ResourceButton: React.FC<ResourceButtonProps> = ({ 
  text, 
  url, 
  variant = 'outline' 
}) => {
  const isExternal = url.startsWith('http') && !url.includes('xlevatetech.com');
  
  const handleClick = () => {
    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (url.startsWith('#')) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = url;
    }
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleClick}
      className="text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
    >
      {text}
      {isExternal && <ExternalLink className="h-3 w-3" />}
    </Button>
  );
};
