/**
 * Comprehensive Link Validation System
 * Handles RSS feed validation, link checking, and error management
 */

export interface LinkValidationResult {
  isValid: boolean;
  status: number;
  redirectUrl?: string;
  error?: string;
  domainAuthority?: number;
  lastChecked: Date;
  responseTime?: number;
  archiveUrl?: string;
}

export interface RSSFeedHealth {
  feedUrl: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  lastChecked: Date;
  totalItems: number;
  validItems: number;
  averageResponseTime: number;
  uptime: number;
  errors: string[];
}

export interface SourceValidation {
  url: string;
  originalUrl: string;
  backupUrl?: string;
  sourceStatus: 'active' | 'broken' | 'checking' | 'archived';
  lastValidated: Date;
  retryCount: number;
  redirectChain?: string[];
}

class AdvancedLinkValidator {
  private static instance: AdvancedLinkValidator;
  private validationCache = new Map<string, LinkValidationResult>();
  private feedHealthCache = new Map<string, RSSFeedHealth>();
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;
  private retryDelays = [1000, 2000, 4000, 8000, 16000]; // Exponential backoff

  static getInstance(): AdvancedLinkValidator {
    if (!AdvancedLinkValidator.instance) {
      AdvancedLinkValidator.instance = new AdvancedLinkValidator();
    }
    return AdvancedLinkValidator.instance;
  }

  /**
   * Validate a single URL with comprehensive checking
   */
  async validateUrl(url: string, useCache = true): Promise<LinkValidationResult> {
    // Check cache first
    if (useCache) {
      const cached = this.validationCache.get(url);
      if (cached && (Date.now() - cached.lastChecked.getTime()) < this.cacheExpiry) {
        return cached;
      }
    }

    const startTime = Date.now();
    
    try {
      // Use fetch with proper headers and timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'XlevateTech-LinkValidator/1.0',
          'Accept': '*/*',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal,
        mode: 'no-cors' // Handle CORS for external links
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      // Handle response
      let isValid = false;
      let archiveUrl: string | undefined;

      // Accept various successful status codes
      if (response.type === 'opaque') {
        // no-cors request succeeded
        isValid = true;
      } else if (response.ok || response.status === 301 || response.status === 302) {
        isValid = true;
      } else if (response.status === 404 || response.status >= 500) {
        // Try to find archived version
        archiveUrl = await this.findArchivedVersion(url);
        isValid = !!archiveUrl;
      }

      const result: LinkValidationResult = {
        isValid,
        status: response.status || 200,
        redirectUrl: response.redirected ? response.url : undefined,
        domainAuthority: this.calculateDomainAuthority(url),
        lastChecked: new Date(),
        responseTime,
        archiveUrl
      };

      // Cache the result
      this.validationCache.set(url, result);
      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Try archive as fallback
      const archiveUrl = await this.findArchivedVersion(url);
      
      const result: LinkValidationResult = {
        isValid: !!archiveUrl,
        status: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date(),
        responseTime,
        archiveUrl
      };

      this.validationCache.set(url, result);
      return result;
    }
  }

  /**
   * Validate RSS feed and its content
   */
  async validateRSSFeed(feedUrl: string): Promise<RSSFeedHealth> {
    const startTime = Date.now();
    
    try {
      // Fetch RSS feed
      const response = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'XlevateTech-RSSValidator/1.0',
          'Accept': 'application/rss+xml, application/xml, text/xml'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const feedContent = await response.text();
      const responseTime = Date.now() - startTime;

      // Parse RSS feed
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(feedContent, "text/xml");

      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('RSS feed parsing failed');
      }

      // Extract items and validate their links
      const items = xmlDoc.querySelectorAll('item, entry'); // Support both RSS and Atom
      const validationPromises: Promise<LinkValidationResult>[] = [];
      
      for (const item of Array.from(items).slice(0, 10)) { // Validate first 10 items
        const link = item.querySelector('link')?.textContent?.trim() || 
                    item.querySelector('link')?.getAttribute('href');
        
        if (link) {
          validationPromises.push(this.validateUrl(link));
        }
      }

      const validationResults = await Promise.all(validationPromises);
      const validItems = validationResults.filter(result => result.isValid).length;

      const feedHealth: RSSFeedHealth = {
        feedUrl,
        status: this.determineFeedStatus(validItems, items.length),
        lastChecked: new Date(),
        totalItems: items.length,
        validItems,
        averageResponseTime: responseTime,
        uptime: validItems / items.length * 100,
        errors: validationResults
          .filter(result => result.error)
          .map(result => result.error!)
      };

      this.feedHealthCache.set(feedUrl, feedHealth);
      return feedHealth;

    } catch (error) {
      const feedHealth: RSSFeedHealth = {
        feedUrl,
        status: 'offline',
        lastChecked: new Date(),
        totalItems: 0,
        validItems: 0,
        averageResponseTime: Date.now() - startTime,
        uptime: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };

      this.feedHealthCache.set(feedUrl, feedHealth);
      return feedHealth;
    }
  }

  /**
   * Find archived version of URL using Wayback Machine
   */
  private async findArchivedVersion(url: string): Promise<string | undefined> {
    try {
      const archiveApi = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
      const response = await fetch(archiveApi);
      const data = await response.json();
      
      if (data.archived_snapshots?.closest?.available) {
        return data.archived_snapshots.closest.url;
      }
    } catch (error) {
      console.warn('Failed to find archived version:', error);
    }
    
    return undefined;
  }

  /**
   * Calculate domain authority score
   */
  private calculateDomainAuthority(url: string): number {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      // Enhanced authority mapping
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
        'inman.com': 72,
        'forbes.com': 85,
        'bloomberg.com': 88,
        'reuters.com': 87,
        'wsj.com': 89,
        'ft.com': 86
      };

      return authorityMap[domain] || this.calculateDomainScore(domain);
    } catch {
      return 0;
    }
  }

  /**
   * Calculate domain score based on various factors
   */
  private calculateDomainScore(domain: string): number {
    let score = 50; // Base score
    
    // TLD scoring
    if (domain.endsWith('.edu')) score += 20;
    else if (domain.endsWith('.org')) score += 15;
    else if (domain.endsWith('.gov')) score += 25;
    else if (domain.endsWith('.com')) score += 10;
    
    // Length penalty (shorter domains often more authoritative)
    if (domain.length < 10) score += 5;
    else if (domain.length > 20) score -= 5;
    
    // Common patterns
    if (domain.includes('news')) score += 5;
    if (domain.includes('research')) score += 10;
    if (domain.includes('institute')) score += 8;
    
    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Determine feed status based on validation results
   */
  private determineFeedStatus(validItems: number, totalItems: number): RSSFeedHealth['status'] {
    if (totalItems === 0) return 'offline';
    
    const validityRatio = validItems / totalItems;
    
    if (validityRatio >= 0.9) return 'healthy';
    if (validityRatio >= 0.7) return 'warning';
    if (validityRatio >= 0.3) return 'critical';
    return 'offline';
  }

  /**
   * Batch validate multiple URLs with queue management
   */
  async validateBatch(urls: string[]): Promise<Map<string, LinkValidationResult>> {
    const results = new Map<string, LinkValidationResult>();
    
    // Add to queue with rate limiting
    const batchPromises = urls.map(url => 
      this.addToQueue(() => this.validateUrl(url))
    );
    
    const validationResults = await Promise.all(batchPromises);
    
    urls.forEach((url, index) => {
      results.set(url, validationResults[index]);
    });
    
    return results;
  }

  /**
   * Add validation task to queue with rate limiting
   */
  private async addToQueue<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  /**
   * Process validation queue with rate limiting
   */
  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const task = this.requestQueue.shift();
      if (task) {
        await task();
        // Rate limit: 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    this.isProcessingQueue = false;
  }

  /**
   * Get cached validation result
   */
  getCachedResult(url: string): LinkValidationResult | undefined {
    const cached = this.validationCache.get(url);
    if (cached && (Date.now() - cached.lastChecked.getTime()) < this.cacheExpiry) {
      return cached;
    }
    return undefined;
  }

  /**
   * Get feed health status
   */
  getFeedHealth(feedUrl: string): RSSFeedHealth | undefined {
    return this.feedHealthCache.get(feedUrl);
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.validationCache.clear();
    this.feedHealthCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { urls: number; feeds: number; hitRate: number } {
    return {
      urls: this.validationCache.size,
      feeds: this.feedHealthCache.size,
      hitRate: 0.85 // Mock hit rate - in production calculate actual rate
    };
  }
}

export const advancedLinkValidator = AdvancedLinkValidator.getInstance();