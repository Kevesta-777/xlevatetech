import { supabase } from '@/integrations/supabase/client';

// CRM Integration Types
export interface CRMLead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  industry: string;
  leadScore: number;
  source: string;
  tags: string[];
  notes: string;
  createdAt: Date;
  lastContacted?: Date;
}

export interface CRMSyncResult {
  success: boolean;
  crmId?: string;
  error?: string;
  syncedAt: Date;
}

export interface WebhookPayload {
  event: 'lead_created' | 'lead_updated' | 'lead_converted' | 'session_completed';
  data: CRMLead | any;
  timestamp: Date;
  signature?: string;
}

// CRM Integration Manager
export class CRMIntegrationManager {
  private static instance: CRMIntegrationManager;
  private webhooks: Map<string, string> = new Map();

  static getInstance(): CRMIntegrationManager {
    if (!CRMIntegrationManager.instance) {
      CRMIntegrationManager.instance = new CRMIntegrationManager();
    }
    return CRMIntegrationManager.instance;
  }

  // HubSpot Integration
  async syncToHubSpot(lead: CRMLead): Promise<CRMSyncResult> {
    try {
      const hubspotApiKey = process.env.HUBSPOT_API_KEY;
      if (!hubspotApiKey) {
        throw new Error('HubSpot API key not configured');
      }

      const contactData = {
        properties: {
          firstname: lead.firstName,
          lastname: lead.lastName,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
          industry: lead.industry,
          leadscore: lead.leadScore.toString(),
          lead_source: lead.source,
          hs_lead_status: this.mapLeadScoreToStatus(lead.leadScore),
          notes: lead.notes
        }
      };

      const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hubspotApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        crmId: result.id,
        syncedAt: new Date()
      };
    } catch (error) {
      console.error('HubSpot sync failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        syncedAt: new Date()
      };
    }
  }

  // Salesforce Integration
  async syncToSalesforce(lead: CRMLead): Promise<CRMSyncResult> {
    try {
      const salesforceConfig = {
        instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
        accessToken: process.env.SALESFORCE_ACCESS_TOKEN
      };

      if (!salesforceConfig.instanceUrl || !salesforceConfig.accessToken) {
        throw new Error('Salesforce configuration not complete');
      }

      const leadData = {
        FirstName: lead.firstName,
        LastName: lead.lastName,
        Email: lead.email,
        Phone: lead.phone,
        Company: lead.company,
        Industry: lead.industry,
        LeadSource: lead.source,
        Description: lead.notes,
        Status: this.mapLeadScoreToSalesforceStatus(lead.leadScore)
      };

      const response = await fetch(`${salesforceConfig.instanceUrl}/services/data/v58.0/sobjects/Lead`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${salesforceConfig.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadData)
      });

      if (!response.ok) {
        throw new Error(`Salesforce API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        crmId: result.id,
        syncedAt: new Date()
      };
    } catch (error) {
      console.error('Salesforce sync failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        syncedAt: new Date()
      };
    }
  }

  // Airtable Integration
  async syncToAirtable(lead: CRMLead): Promise<CRMSyncResult> {
    try {
      const airtableConfig = {
        baseId: process.env.AIRTABLE_BASE_ID,
        apiKey: process.env.AIRTABLE_API_KEY,
        tableName: process.env.AIRTABLE_TABLE_NAME || 'Leads'
      };

      if (!airtableConfig.baseId || !airtableConfig.apiKey) {
        throw new Error('Airtable configuration not complete');
      }

      const recordData = {
        fields: {
          'First Name': lead.firstName,
          'Last Name': lead.lastName,
          'Email': lead.email,
          'Phone': lead.phone,
          'Company': lead.company,
          'Industry': lead.industry,
          'Lead Score': lead.leadScore,
          'Source': lead.source,
          'Notes': lead.notes,
          'Created Date': lead.createdAt.toISOString()
        }
      };

      const response = await fetch(
        `https://api.airtable.com/v0/${airtableConfig.baseId}/${airtableConfig.tableName}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${airtableConfig.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(recordData)
        }
      );

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        crmId: result.id,
        syncedAt: new Date()
      };
    } catch (error) {
      console.error('Airtable sync failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        syncedAt: new Date()
      };
    }
  }

  // Generic Webhook Integration
  async sendWebhook(payload: WebhookPayload, webhookUrl: string): Promise<CRMSyncResult> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': this.generateSignature(payload)
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.statusText}`);
      }

      return {
        success: true,
        syncedAt: new Date()
      };
    } catch (error) {
      console.error('Webhook failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        syncedAt: new Date()
      };
    }
  }

  // Batch Sync
  async syncLeadToAllCRMs(lead: CRMLead): Promise<{
    hubspot: CRMSyncResult;
    salesforce: CRMSyncResult;
    airtable: CRMSyncResult;
    webhooks: CRMSyncResult[];
  }> {
    const [hubspot, salesforce, airtable] = await Promise.allSettled([
      this.syncToHubSpot(lead),
      this.syncToSalesforce(lead),
      this.syncToAirtable(lead)
    ]);

    // Send webhooks
    const webhookResults = await this.sendAllWebhooks({
      event: 'lead_created',
      data: lead,
      timestamp: new Date()
    });

    return {
      hubspot: hubspot.status === 'fulfilled' ? hubspot.value : { success: false, error: 'Failed', syncedAt: new Date() },
      salesforce: salesforce.status === 'fulfilled' ? salesforce.value : { success: false, error: 'Failed', syncedAt: new Date() },
      airtable: airtable.status === 'fulfilled' ? airtable.value : { success: false, error: 'Failed', syncedAt: new Date() },
      webhooks: webhookResults
    };
  }

  // Register Webhook
  registerWebhook(name: string, url: string): void {
    this.webhooks.set(name, url);
  }

  // Remove Webhook
  removeWebhook(name: string): boolean {
    return this.webhooks.delete(name);
  }

  // Get all webhook URLs
  getWebhookUrls(): string[] {
    return Array.from(this.webhooks.values());
  }

  // Helper Methods
  private mapLeadScoreToStatus(score: number): string {
    if (score >= 80) return 'NEW';
    if (score >= 60) return 'OPEN';
    if (score >= 30) return 'WORKING';
    return 'UNQUALIFIED';
  }

  private mapLeadScoreToSalesforceStatus(score: number): string {
    if (score >= 80) return 'New';
    if (score >= 60) return 'Open - Not Contacted';
    if (score >= 30) return 'Working - Contacted';
    return 'Unqualified';
  }

  private async sendAllWebhooks(payload: WebhookPayload): Promise<CRMSyncResult[]> {
    const webhookUrls = this.getWebhookUrls();
    const results = await Promise.allSettled(
      webhookUrls.map(url => this.sendWebhook(payload, url))
    );

    return results.map(result => 
      result.status === 'fulfilled' ? result.value : { success: false, error: 'Failed', syncedAt: new Date() }
    );
  }

  private generateSignature(payload: WebhookPayload): string {
    const secret = process.env.WEBHOOK_SECRET || 'default-secret';
    const data = JSON.stringify(payload);
    
    // Simple HMAC-like signature (use crypto-js in production)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return btoa(`${hash}:${secret}`);
  }
}

// Conversion Boosters
export class ConversionBooster {
  private static instance: ConversionBooster;

  static getInstance(): ConversionBooster {
    if (!ConversionBooster.instance) {
      ConversionBooster.instance = new ConversionBooster();
    }
    return ConversionBooster.instance;
  }

  // Personalization Tokens
  generatePersonalizedMessage(template: string, userData: {
    firstName?: string;
    industry?: string;
    lastConversation?: string;
    preferences?: string[];
  }): string {
    let message = template;

    // Replace personalization tokens
    if (userData.firstName) {
      message = message.replace(/\{\{firstName\}\}/g, userData.firstName);
    }

    if (userData.industry) {
      message = message.replace(/\{\{industry\}\}/g, userData.industry);
    }

    if (userData.lastConversation) {
      message = message.replace(/\{\{lastConversation\}\}/g, userData.lastConversation);
    }

    // Add industry-specific case studies
    if (userData.industry) {
      const caseStudy = this.getIndustryCaseStudy(userData.industry);
      message = message.replace(/\{\{caseStudy\}\}/g, caseStudy);
    }

    return message;
  }

  // Welcome Back Message
  generateWelcomeBackMessage(userData: {
    firstName?: string;
    lastVisit?: Date;
    lastConversation?: string;
    industry?: string;
  }): string {
    const templates = [
      `Welcome back, {{firstName}}! 👋 I remember we were discussing {{lastConversation}}. Would you like to continue where we left off?`,
      `Hi {{firstName}}! Great to see you again. I have some new insights about {{industry}} automation that might interest you.`,
      `Welcome back! I noticed you were interested in {{lastConversation}} last time. Have you made any progress on that?`
    ];

    const template = templates[Math.floor(Math.random() * templates.length)];
    return this.generatePersonalizedMessage(template, userData);
  }

  // Dynamic Chat Triggers
  shouldTriggerChat(userBehavior: {
    timeOnPage: number;
    scrollDepth: number;
    exitIntent: boolean;
    pageViews: number;
    returningUser: boolean;
  }): boolean {
    const { timeOnPage, scrollDepth, exitIntent, pageViews, returningUser } = userBehavior;

    // Exit intent trigger
    if (exitIntent && scrollDepth > 30) {
      return true;
    }

    // Time-based trigger
    if (timeOnPage > 30000 && scrollDepth > 50) { // 30 seconds + 50% scroll
      return true;
    }

    // Returning user trigger
    if (returningUser && pageViews > 2) {
      return true;
    }

    // Scroll depth trigger
    if (scrollDepth > 70) {
      return true;
    }

    return false;
  }

  // Industry-specific Case Studies
  private getIndustryCaseStudy(industry: string): string {
    const caseStudies: Record<string, string> = {
      'tech': 'We helped a SaaS company automate their customer onboarding, reducing manual work by 80% and improving conversion rates by 35%.',
      'healthcare': 'A healthcare provider automated their patient scheduling system, reducing no-shows by 40% and improving staff efficiency by 60%.',
      'finance': 'A fintech startup automated their compliance reporting, saving 20 hours per week and reducing errors by 95%.',
      'retail': 'An e-commerce retailer automated their inventory management, reducing stockouts by 70% and increasing sales by 25%.',
      'manufacturing': 'A manufacturing company automated their quality control process, reducing defects by 50% and improving production speed by 30%.'
    };

    return caseStudies[industry.toLowerCase()] || 
           'We\'ve helped companies across various industries automate their processes, typically seeing 40-80% efficiency improvements.';
  }

  // Smart Follow-up Suggestions
  generateFollowUpSuggestions(userData: {
    industry?: string;
    painPoints?: string[];
    leadScore: number;
    lastInteraction: Date;
  }): string[] {
    const suggestions: string[] = [];

    if (userData.leadScore >= 80) {
      suggestions.push('Schedule a personalized demo');
      suggestions.push('Get a custom ROI calculation');
    } else if (userData.leadScore >= 60) {
      suggestions.push('Download our industry guide');
      suggestions.push('See relevant case studies');
    } else {
      suggestions.push('Learn about automation benefits');
      suggestions.push('Get a free workflow audit');
    }

    if (userData.industry) {
      suggestions.push(`See ${userData.industry} automation examples`);
    }

    if (userData.painPoints?.length) {
      suggestions.push('Get solutions for your specific challenges');
    }

    return suggestions;
  }

  // A/B Testing for Messages
  async getOptimizedMessage(messageType: 'welcome' | 'followup' | 'escalation', userSegment: string): Promise<string> {
    try {
      // TODO: Implement message_variants table
      // const { data } = await supabase
      //   .from('message_variants')
      //   .select('content, performance_score')
      //   .eq('message_type', messageType)
      //   .eq('user_segment', userSegment)
      //   .order('performance_score', { ascending: false })
      //   .limit(1)
      //   .single();

      // return data?.content || this.getDefaultMessage(messageType);
      return this.getDefaultMessage(messageType);
    } catch (error) {
      return this.getDefaultMessage(messageType);
    }
  }

  private getDefaultMessage(messageType: 'welcome' | 'followup' | 'escalation'): string {
    const defaults = {
      welcome: "Hi! I'm here to help you explore automation solutions. What brings you here today?",
      followup: "I'd love to help you further. Would you like to see some examples or schedule a consultation?",
      escalation: "I understand this is important. Let me connect you with our team right away."
    };

    return defaults[messageType];
  }
} 