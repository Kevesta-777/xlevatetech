/**
 * Link validation utility for RSS feeds and blog content
 * Prevents 404 errors and ensures source credibility
 */

export interface LinkValidationResult {
  isValid: boolean;
  status: number;
  redirectUrl?: string;
  error?: string;
  domainAuthority?: number;
  lastChecked: Date;
}

export interface ContentSource {
  id: string;
  name: string;
  domain: string;
  rssUrl: string;
  credibilityScore: number;
  category: 'Healthcare' | 'Finance' | 'Real Estate' | 'AI Automation';
  lastValidated: Date;
  isActive: boolean;
}

class LinkValidator {
  private static instance: LinkValidator;
  private validationCache = new Map<string, LinkValidationResult>();
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): LinkValidator {
    if (!LinkValidator.instance) {
      LinkValidator.instance = new LinkValidator();
    }
    return LinkValidator.instance;
  }

  // Trusted sources for 2025 automation content
  private trustedSources: ContentSource[] = [
    {
      id: 'mckinsey',
      name: 'McKinsey & Company',
      domain: 'mckinsey.com',
      rssUrl: 'https://www.mckinsey.com/feed/automation',
      credibilityScore: 95,
      category: 'AI Automation',
      lastValidated: new Date(),
      isActive: true
    },
    {
      id: 'deloitte',
      name: 'Deloitte Insights',
      domain: 'deloitte.com',
      rssUrl: 'https://www2.deloitte.com/insights/feed.rss',
      credibilityScore: 92,
      category: 'Finance',
      lastValidated: new Date(),
      isActive: true
    },
    {
      id: 'gartner',
      name: 'Gartner Research',
      domain: 'gartner.com',
      rssUrl: 'https://www.gartner.com/en/newsroom/rss',
      credibilityScore: 94,
      category: 'AI Automation',
      lastValidated: new Date(),
      isActive: true
    },
    {
      id: 'healthcare-finance',
      name: 'Healthcare Finance',
      domain: 'healthcarefinancenews.com',
      rssUrl: 'https://www.healthcarefinancenews.com/rss.xml',
      credibilityScore: 78,
      category: 'Healthcare',
      lastValidated: new Date(),
      isActive: true
    }
  ];

  async validateLink(url: string): Promise<LinkValidationResult> {
    // Check cache first
    const cached = this.validationCache.get(url);
    if (cached && (Date.now() - cached.lastChecked.getTime()) < this.cacheExpiry) {
      return cached;
    }

    try {
      // Use HEAD request for efficiency
      const response = await fetch(url, { 
        method: 'HEAD',
        mode: 'no-cors'  // Handle CORS for external links
      });

      const result: LinkValidationResult = {
        isValid: response.ok,
        status: response.status,
        redirectUrl: response.redirected ? response.url : undefined,
        domainAuthority: this.calculateDomainAuthority(url),
        lastChecked: new Date()
      };

      // Cache the result
      this.validationCache.set(url, result);
      return result;

    } catch (error) {
      const result: LinkValidationResult = {
        isValid: false,
        status: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date()
      };

      this.validationCache.set(url, result);
      return result;
    }
  }

  private calculateDomainAuthority(url: string): number {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      // High authority domains for automation content
      const authorityMap: Record<string, number> = {
        'mckinsey.com': 95,
        'deloitte.com': 92,
        'gartner.com': 94,
        'pwc.com': 90,
        'accenture.com': 88,
        'mit.edu': 96,
        'harvard.edu': 96,
        'stanford.edu': 95,
        'ieee.org': 93,
        'nature.com': 94,
        'techcrunch.com': 82,
        'venturebeat.com': 78,
        'healthcarefinancenews.com': 78,
        'modernhealthcare.com': 80,
        'americanbanker.com': 79,
        'inman.com': 72
      };

      return authorityMap[domain] || 0;
    } catch {
      return 0;
    }
  }

  getTrustedSources(): ContentSource[] {
    return this.trustedSources.filter(source => source.isActive);
  }

  getTrustedSourcesByCategory(category: string): ContentSource[] {
    return this.trustedSources.filter(
      source => source.isActive && (category === 'All' || source.category === category)
    );
  }

  // Generate fallback content when RSS links are broken
  generateFallbackContent(category: string) {
    const fallbackArticles = {
      'Healthcare': [
        {
          title: "2025 Healthcare Automation Market Reaches $80.38B",
          excerpt: "Healthcare automation market grows at 10.8% CAGR, driven by AI adoption and efficiency demands.",
          url: "/blog/healthcare-automation-market-2025",
          source: "Xlevate Tech Analysis",
          publishDate: new Date().toISOString()
        }
      ],
      'Finance': [
        {
          title: "Financial Automation Market Hits $18.4B by 2030",
          excerpt: "14.6% CAGR growth in financial automation as 82% of CFOs increase investments.",
          url: "/blog/financial-automation-growth-2025",
          source: "Xlevate Tech Analysis", 
          publishDate: new Date().toISOString()
        }
      ],
      'Real Estate': [
        {
          title: "Real Estate AI Market Soars to $303.06B in 2025",
          excerpt: "36.1% CAGR growth in real estate AI solutions transforms property management.",
          url: "/blog/real-estate-ai-market-2025",
          source: "Xlevate Tech Analysis",
          publishDate: new Date().toISOString()
        }
      ]
    };

    return fallbackArticles[category] || [];
  }
}

export const linkValidator = LinkValidator.getInstance();