export interface LinkMatch {
  type: 'url' | 'email' | 'phone' | 'resource';
  text: string;
  url: string;
  start: number;
  end: number;
}

export interface ResourceMapping {
  keywords: string[];
  url: string;
  description: string;
}

export class LinkDetector {
  private static resourceMappings: ResourceMapping[] = [
    {
      keywords: ['pricing', 'price', 'cost', 'pricing page', 'our pricing'],
      url: '/#pricing',
      description: 'View our pricing'
    },
    {
      keywords: ['case studies', 'case study', 'examples', 'success stories'],
      url: '/case-studies',
      description: 'See our case studies'
    },
    {
      keywords: ['roi calculator', 'calculate roi', 'potential roi', 'roi calculation'],
      url: '/automation-roi-calculator',
      description: 'Calculate your ROI'
    },
    {
      keywords: ['services', 'our services', 'what we offer', 'service offerings'],
      url: '/services',
      description: 'Our services'
    },
    {
      keywords: ['consultation', 'book consultation', 'schedule call', 'discovery call', 'book call'],
      url: 'https://calendly.com/raj-dalal-xlevatetech',
      description: 'Book a consultation'
    },
    {
      keywords: ['contact', 'contact us', 'get in touch', 'reach out'],
      url: '/contact',
      description: 'Contact us'
    },
    {
      keywords: ['about', 'about us', 'our company', 'our team'],
      url: '/about',
      description: 'About us'
    },
    {
      keywords: ['industries', 'industry solutions', 'sectors'],
      url: '/industries',
      description: 'Industry solutions'
    }
  ];

  static detectLinks(text: string): LinkMatch[] {
    const matches: LinkMatch[] = [];
    
    // URL detection
    const urlRegex = /https?:\/\/[^\s<>"']+/gi;
    let match;
    while ((match = urlRegex.exec(text)) !== null) {
      matches.push({
        type: 'url',
        text: match[0],
        url: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }

    // Email detection
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;
    while ((match = emailRegex.exec(text)) !== null) {
      matches.push({
        type: 'email',
        text: match[0],
        url: `mailto:${match[0]}`,
        start: match.index,
        end: match.index + match[0].length
      });
    }

    // Phone detection
    const phoneRegex = /\b(?:\+?1[-.\s]?)?(?:\(?[0-9]{3}\)?[-.\s]?)?[0-9]{3}[-.\s]?[0-9]{4}\b/gi;
    while ((match = phoneRegex.exec(text)) !== null) {
      matches.push({
        type: 'phone',
        text: match[0],
        url: `tel:${match[0].replace(/\D/g, '')}`,
        start: match.index,
        end: match.index + match[0].length
      });
    }

    // Resource detection
    this.resourceMappings.forEach(mapping => {
      mapping.keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        while ((match = regex.exec(text)) !== null) {
          matches.push({
            type: 'resource',
            text: match[0],
            url: mapping.url,
            start: match.index,
            end: match.index + match[0].length
          });
        }
      });
    });

    // Sort by start position and remove overlaps
    return matches
      .sort((a, b) => a.start - b.start)
      .filter((match, index, arr) => {
        // Remove overlapping matches, keeping the first one
        if (index === 0) return true;
        const prev = arr[index - 1];
        return match.start >= prev.end;
      });
  }

  static convertTextToClickableHTML(text: string): string {
    const matches = this.detectLinks(text);
    if (matches.length === 0) return text;

    let result = '';
    let lastIndex = 0;

    matches.forEach(match => {
      // Add text before the match
      result += text.slice(lastIndex, match.start);
      
      // Add the clickable link
      const isExternal = match.url.startsWith('http') && !match.url.includes('xlevatetech.com');
      const target = isExternal ? '_blank' : '_self';
      const rel = isExternal ? 'noopener noreferrer' : '';
      
      result += `<a href="${match.url}" target="${target}" ${rel ? `rel="${rel}"` : ''} class="text-blue-600 hover:text-blue-800 underline font-medium">${match.text}</a>`;
      
      lastIndex = match.end;
    });

    // Add remaining text
    result += text.slice(lastIndex);
    
    return result;
  }
}
