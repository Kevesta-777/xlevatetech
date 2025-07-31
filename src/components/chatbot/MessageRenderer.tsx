
import React from 'react';
import { LinkDetector } from '@/utils/linkDetector';

interface MessageRendererProps {
  content: string;
  className?: string;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({ 
  content, 
  className = '' 
}) => {
  // Convert text to clickable HTML
  const processedContent = LinkDetector.convertTextToClickableHTML(content);
  
  return (
    <div
      className={`whitespace-pre-wrap ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};
