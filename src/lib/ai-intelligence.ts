import { supabase } from '@/integrations/supabase/client';

// Types for AI Intelligence
export interface SessionMemory {
  userId: string;
  sessionId: string;
  context: {
    industry?: string;
    preferences?: string[];
    painPoints?: string[];
    engagementLevel: number;
    lastInteraction: Date;
    messageCount: number;
  };
  leadScore: number;
  escalationTriggers: string[];
  consentStatus: {
    dataCollection: boolean;
    marketing: boolean;
    analytics: boolean;
  };
}

export interface LeadScore {
  score: number;
  factors: {
    engagement: number;
    intent: number;
    budget: number;
    authority: number;
    timeline: number;
  };
  category: 'hot' | 'warm' | 'cold' | 'disqualified';
  nextAction: string;
}

export interface EscalationTrigger {
  type: 'frustration' | 'unmet_need' | 'keyword' | 'sentiment' | 'budget' | 'timeline';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
}

// LLM Configuration
export const LLM_CONFIG = {
  primary: {
    model: 'gpt-4o-mini',
    maxTokens: 1000,
    temperature: 0.7,
    costCap: 0.01 // $0.01 per request
  },
  fallback: {
    model: 'perplexity-sonar-pro',
    maxTokens: 1000,
    temperature: 0.7,
    costCap: 0.02 // $0.02 per request
  }
};

// Session Memory Management
export class SessionMemoryManager {
  private static instance: SessionMemoryManager;
  private sessions: Map<string, SessionMemory> = new Map();

  static getInstance(): SessionMemoryManager {
    if (!SessionMemoryManager.instance) {
      SessionMemoryManager.instance = new SessionMemoryManager();
    }
    return SessionMemoryManager.instance;
  }

  async getSession(sessionId: string): Promise<SessionMemory | null> {
    if (this.sessions.has(sessionId)) {
      return this.sessions.get(sessionId)!;
    }

    // Load from database - TODO: implement session_memory table
    // const { data, error } = await supabase
    //   .from('session_memory')
    //   .select('*')
    //   .eq('session_id', sessionId)
    //   .single();

    // if (error || !data) return null;

    // Temporary fallback until table is created
    return null;
  }

  async updateSession(sessionId: string, updates: Partial<SessionMemory>): Promise<void> {
    const current = await this.getSession(sessionId);
    const updated = { ...current, ...updates };

    this.sessions.set(sessionId, updated as SessionMemory);

    // Persist to database - TODO: implement session_memory table
    // await supabase
    //   .from('session_memory')
    //   .upsert({
    //     session_id: sessionId,
    //     user_id: updated.userId,
    //     context: updated.context,
    //     lead_score: updated.leadScore,
    //     escalation_triggers: updated.escalationTriggers,
    //     consent_status: updated.consentStatus,
    //     updated_at: new Date().toISOString()
    //   });
  }
}

// Lead Scoring Engine
export class LeadScoringEngine {
  static calculateScore(session: SessionMemory, message: string): LeadScore {
    const factors = {
      engagement: this.calculateEngagementScore(session),
      intent: this.calculateIntentScore(message),
      budget: this.calculateBudgetScore(message),
      authority: this.calculateAuthorityScore(message),
      timeline: this.calculateTimelineScore(message)
    };

    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0) / 5;

    return {
      score: totalScore,
      factors,
      category: this.categorizeLead(totalScore),
      nextAction: this.determineNextAction(totalScore, factors)
    };
  }

  private static calculateEngagementScore(session: SessionMemory): number {
    const { messageCount, engagementLevel } = session.context;
    return Math.min((messageCount * 10 + engagementLevel) / 20, 100);
  }

  private static calculateIntentScore(message: string): number {
    const intentKeywords = [
      'buy', 'purchase', 'implement', 'start', 'need', 'want', 'looking for',
      'solution', 'automation', 'process', 'efficiency', 'save time', 'cost'
    ];
    
    const matches = intentKeywords.filter(keyword => 
      message.toLowerCase().includes(keyword)
    ).length;
    
    return Math.min(matches * 20, 100);
  }

  private static calculateBudgetScore(message: string): number {
    const budgetKeywords = [
      'budget', 'cost', 'price', 'investment', 'roi', 'return', 'afford',
      'expensive', 'cheap', 'value', 'worth', 'spend', 'pay'
    ];
    
    const hasBudgetMention = budgetKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    return hasBudgetMention ? 80 : 30;
  }

  private static calculateAuthorityScore(message: string): number {
    const authorityKeywords = [
      'ceo', 'founder', 'owner', 'director', 'manager', 'head of',
      'decision', 'approve', 'final', 'responsible', 'lead'
    ];
    
    const matches = authorityKeywords.filter(keyword => 
      message.toLowerCase().includes(keyword)
    ).length;
    
    return Math.min(matches * 25, 100);
  }

  private static calculateTimelineScore(message: string): number {
    const urgentKeywords = ['asap', 'urgent', 'immediate', 'now', 'quick', 'fast'];
    const hasUrgency = urgentKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
    
    return hasUrgency ? 90 : 50;
  }

  private static categorizeLead(score: number): 'hot' | 'warm' | 'cold' | 'disqualified' {
    if (score >= 80) return 'hot';
    if (score >= 60) return 'warm';
    if (score >= 30) return 'cold';
    return 'disqualified';
  }

  private static determineNextAction(score: number, factors: any): string {
    if (score >= 80) return 'immediate_human_contact';
    if (score >= 60) return 'schedule_demo';
    if (score >= 30) return 'nurture_sequence';
    return 'disqualify';
  }
}

// Escalation Detection
export class EscalationDetector {
  static detectTriggers(message: string, session: SessionMemory): EscalationTrigger[] {
    const triggers: EscalationTrigger[] = [];

    // Frustration detection
    if (this.detectFrustration(message)) {
      triggers.push({
        type: 'frustration',
        severity: 'high',
        message: 'User frustration detected',
        timestamp: new Date()
      });
    }

    // Keyword-based escalation
    const keywordTriggers = this.detectKeywords(message);
    triggers.push(...keywordTriggers);

    // Sentiment analysis
    const sentiment = this.analyzeSentiment(message);
    if (sentiment < -0.5) {
      triggers.push({
        type: 'sentiment',
        severity: 'medium',
        message: 'Negative sentiment detected',
        timestamp: new Date()
      });
    }

    return triggers;
  }

  private static detectFrustration(message: string): boolean {
    const frustrationKeywords = [
      'frustrated', 'annoyed', 'angry', 'upset', 'disappointed',
      'not working', 'broken', 'useless', 'waste of time'
    ];
    
    return frustrationKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  private static detectKeywords(message: string): EscalationTrigger[] {
    const keywordMap = {
      'budget': { type: 'budget' as const, severity: 'medium' as const },
      'timeline': { type: 'timeline' as const, severity: 'medium' as const },
      'urgent': { type: 'timeline' as const, severity: 'high' as const },
      'ceo': { type: 'keyword' as const, severity: 'high' as const },
      'decision': { type: 'keyword' as const, severity: 'medium' as const }
    };

    const triggers: EscalationTrigger[] = [];
    
    Object.entries(keywordMap).forEach(([keyword, config]) => {
      if (message.toLowerCase().includes(keyword)) {
        triggers.push({
          type: config.type,
          severity: config.severity,
          message: `Keyword trigger: ${keyword}`,
          timestamp: new Date()
        });
      }
    });

    return triggers;
  }

  private static analyzeSentiment(message: string): number {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'happy', 'satisfied'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'disappointed'];
    
    const words = message.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    return (positiveCount - negativeCount) / words.length;
  }
}

// Content Moderation
export class ContentModerator {
  private static blockedKeywords = [
    'spam', 'scam', 'hack', 'illegal', 'fraud', 'malware', 'virus',
    'inappropriate', 'offensive', 'harassment', 'threat'
  ];

  static moderateContent(message: string): { 
    isBlocked: boolean; 
    reason?: string; 
    sanitizedMessage?: string 
  } {
    const lowerMessage = message.toLowerCase();
    
    // Check for blocked keywords
    const blockedKeyword = this.blockedKeywords.find(keyword => 
      lowerMessage.includes(keyword)
    );
    
    if (blockedKeyword) {
      return {
        isBlocked: true,
        reason: `Message contains blocked keyword: ${blockedKeyword}`
      };
    }

    // Basic PII detection (simplified)
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card
      /\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g // Phone
    ];

    const hasPII = piiPatterns.some(pattern => pattern.test(message));
    
    if (hasPII) {
      return {
        isBlocked: true,
        reason: 'Message contains potential PII'
      };
    }

    // Sanitize message (remove excessive punctuation, etc.)
    const sanitized = message
      .replace(/[!]{2,}/g, '!')
      .replace(/[?]{2,}/g, '?')
      .trim();

    return {
      isBlocked: false,
      sanitizedMessage: sanitized
    };
  }
}

// Privacy and Consent Management
export class PrivacyManager {
  static async checkConsent(sessionId: string): Promise<{
    dataCollection: boolean;
    marketing: boolean;
    analytics: boolean;
  }> {
    const memoryManager = SessionMemoryManager.getInstance();
    const session = await memoryManager.getSession(sessionId);
    
    return session?.consentStatus || {
      dataCollection: false,
      marketing: false,
      analytics: false
    };
  }

  static async updateConsent(
    sessionId: string, 
    consent: Partial<{ dataCollection: boolean; marketing: boolean; analytics: boolean }>
  ): Promise<void> {
    const memoryManager = SessionMemoryManager.getInstance();
    const session = await memoryManager.getSession(sessionId);
    
    if (session) {
      await memoryManager.updateSession(sessionId, {
        consentStatus: { ...session.consentStatus, ...consent }
      });
    }
  }

  static getPrivacyNotice(): string {
    return `Privacy Notice: We collect and process your data in accordance with our privacy policy. 
    You can withdraw consent at any time. Data is encrypted and stored securely. 
    For more information, visit our privacy policy.`;
  }
} 