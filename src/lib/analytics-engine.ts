import { supabase } from '@/integrations/supabase/client';
import { SessionMemory, LeadScore, EscalationTrigger } from './ai-intelligence';

// Analytics Types
export interface LeadAnalytics {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  averageLeadScore: number;
  topIndustries: Array<{ industry: string; count: number }>;
  sourceBreakdown: Array<{ source: string; count: number }>;
  funnelStepConversion: Array<{ step: string; conversionRate: number }>;
}

export interface SessionAnalytics {
  sessionId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  messageCount: number;
  leadScore: number;
  conversionPath: string[];
  disposition: 'converted' | 'qualified' | 'disqualified' | 'pending';
  tags: string[];
  sentiment: number;
  dropOffPoint?: string;
  responseTime: number;
}

export interface GrowthMetrics {
  period: '7d' | '30d' | '90d';
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  growthRate: number;
  topSources: Array<{ source: string; growth: number }>;
  topIndustries: Array<{ industry: string; growth: number }>;
}

export interface ConversionMetrics {
  chatToCall: number;
  chatToDemo: number;
  chatToDownload: number;
  averageResponseTime: number;
  sentimentScores: Array<{ score: number; count: number }>;
  dropOffPoints: Array<{ point: string; count: number }>;
}

// Analytics Engine
export class AnalyticsEngine {
  private static instance: AnalyticsEngine;

  static getInstance(): AnalyticsEngine {
    if (!AnalyticsEngine.instance) {
      AnalyticsEngine.instance = new AnalyticsEngine();
    }
    return AnalyticsEngine.instance;
  }

  // Lead Analytics
  async getLeadAnalytics(timeframe: '7d' | '30d' | '90d' = '30d'): Promise<LeadAnalytics> {
    const startDate = this.getStartDate(timeframe);
    
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(lead => lead.stage === 'qualified' || lead.stage === 'contacted' || lead.stage === 'meeting_booked').length;
    const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0;
    const averageLeadScore = leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / totalLeads;

    // Industry breakdown
    const industryCount = leads.reduce((acc, lead) => {
      const industry = lead.industry_sector || 'Unknown';
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topIndustries = Object.entries(industryCount)
      .map(([industry, count]) => ({ industry, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Source breakdown
    const sourceCount = leads.reduce((acc, lead) => {
      const source = lead.source || 'unknown';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sourceBreakdown = Object.entries(sourceCount)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    // Funnel step conversion
    const funnelSteps = ['captured', 'qualified', 'contacted', 'meeting_booked'];
    const funnelStepConversion = funnelSteps.map(step => {
      const stepCount = leads.filter(lead => lead.stage === step).length;
      return { step, conversionRate: totalLeads > 0 ? (stepCount / totalLeads) * 100 : 0 };
    });

    return {
      totalLeads,
      qualifiedLeads,
      conversionRate,
      averageLeadScore,
      topIndustries,
      sourceBreakdown,
      funnelStepConversion
    };
  }

  // Session Analytics
  async recordSession(session: SessionMemory, leadScore: LeadScore, messages: any[]): Promise<void> {
    // TODO: Implement session_analytics table
    // const sessionAnalytics: Partial<SessionAnalytics> = {
    //   sessionId: session.sessionId,
    //   userId: session.userId,
    //   startTime: session.context.lastInteraction,
    //   messageCount: session.context.messageCount,
    //   leadScore: leadScore.score,
    //   conversionPath: this.extractConversionPath(messages),
    //   disposition: this.determineDisposition(leadScore),
    //   tags: this.extractTags(messages),
    //   sentiment: this.calculateSentiment(messages),
    //   responseTime: this.calculateAverageResponseTime(messages)
    // };

    // await supabase.from('session_analytics').upsert({
    //   session_id: session.sessionId,
    //   user_id: session.userId,
    //   start_time: sessionAnalytics.startTime?.toISOString(),
    //   message_count: sessionAnalytics.messageCount,
    //   lead_score: sessionAnalytics.leadScore,
    //   conversion_path: sessionAnalytics.conversionPath,
    //   disposition: sessionAnalytics.disposition,
    //   tags: sessionAnalytics.tags,
    //   sentiment: sessionAnalytics.sentiment,
    //   response_time: sessionAnalytics.responseTime,
    //   created_at: new Date().toISOString()
    // });
  }

  // Growth Metrics
  async getGrowthMetrics(period: '7d' | '30d' | '90d'): Promise<GrowthMetrics> {
    const currentStart = this.getStartDate(period);
    const previousStart = new Date(currentStart.getTime() - (currentStart.getTime() - new Date().getTime()));

    const [currentData, previousData] = await Promise.all([
      this.getLeadAnalytics(period),
      this.getLeadAnalyticsForPeriod(previousStart, currentStart)
    ]);

    const growthRate = previousData.totalLeads > 0 
      ? ((currentData.totalLeads - previousData.totalLeads) / previousData.totalLeads) * 100 
      : 0;

    return {
      period,
      totalLeads: currentData.totalLeads,
      qualifiedLeads: currentData.qualifiedLeads,
      conversionRate: currentData.conversionRate,
      growthRate,
      topSources: this.calculateSourceGrowth(currentData.sourceBreakdown, previousData.sourceBreakdown),
      topIndustries: this.calculateIndustryGrowth(currentData.topIndustries, previousData.topIndustries)
    };
  }

  // Conversion Metrics
  async getConversionMetrics(timeframe: '7d' | '30d' | '90d' = '30d'): Promise<ConversionMetrics> {
    // TODO: Implement session_analytics table
    // const startDate = this.getStartDate(timeframe);

    // const { data: sessions, error } = await supabase
    //   .from('session_analytics')
    //   .select('*')
    //   .gte('start_time', startDate.toISOString());

    // if (error) throw error;

    // Return mock data for now
    return {
      chatToCall: 0,
      chatToDemo: 0,
      chatToDownload: 0,
      averageResponseTime: 0,
      sentimentScores: [],
      dropOffPoints: []
    };
  }

  // Hot Lead Detection
  async detectHotLeads(): Promise<Array<{ sessionId: string; score: number; industry: string; urgency: string }>> {
    // TODO: Implement session_analytics table
    // const { data: sessions, error } = await supabase
    //   .from('session_analytics')
    //   .select('*')
    //   .gte('lead_score', 80)
    //   .eq('disposition', 'pending')
    //   .order('lead_score', { ascending: false })
    //   .limit(10);

    // if (error) throw error;

    // Return mock data for now
    return [];
  }

  // Real-time Dashboard Data
  async getRealTimeMetrics(): Promise<{
    activeSessions: number;
    leadsToday: number;
    conversionsToday: number;
    averageResponseTime: number;
    hotLeads: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      activeSessions,
      leadsToday,
      conversionsToday,
      responseTime,
      hotLeads
    ] = await Promise.all([
      this.getActiveSessions(),
      this.getLeadsCount(today),
      this.getConversionsCount(today),
      this.getAverageResponseTime(),
      this.getHotLeadsCount()
    ]);

    return {
      activeSessions,
      leadsToday,
      conversionsToday,
      averageResponseTime: responseTime,
      hotLeads
    };
  }

  // Helper Methods
  private getStartDate(timeframe: '7d' | '30d' | '90d'): Date {
    const now = new Date();
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    return new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  }

  private extractConversionPath(messages: any[]): string[] {
    const path: string[] = [];
    const keywords = {
      call: ['call', 'schedule', 'book', 'meeting'],
      demo: ['demo', 'demonstration', 'show', 'presentation'],
      download: ['download', 'resource', 'guide', 'whitepaper'],
      pricing: ['pricing', 'cost', 'quote', 'estimate']
    };

    messages.forEach(message => {
      const content = message.content.toLowerCase();
      Object.entries(keywords).forEach(([action, words]) => {
        if (words.some(word => content.includes(word))) {
          path.push(action);
        }
      });
    });

    return [...new Set(path)]; // Remove duplicates
  }

  private determineDisposition(leadScore: LeadScore): 'converted' | 'qualified' | 'disqualified' | 'pending' {
    if (leadScore.category === 'hot') return 'qualified';
    if (leadScore.category === 'warm') return 'pending';
    if (leadScore.category === 'cold') return 'pending';
    return 'disqualified';
  }

  private extractTags(messages: any[]): string[] {
    const tags: string[] = [];
    const content = messages.map(m => m.content).join(' ').toLowerCase();

    // Industry detection
    const industries = ['tech', 'healthcare', 'finance', 'retail', 'manufacturing', 'education'];
    const detectedIndustry = industries.find(industry => content.includes(industry));
    if (detectedIndustry) tags.push(`industry:${detectedIndustry}`);

    // Topic detection
    const topics = ['automation', 'ai', 'process', 'efficiency', 'cost', 'roi'];
    topics.forEach(topic => {
      if (content.includes(topic)) tags.push(`topic:${topic}`);
    });

    return tags;
  }

  private calculateSentiment(messages: any[]): number {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'happy', 'satisfied'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'disappointed'];
    
    let totalSentiment = 0;
    let messageCount = 0;

    messages.forEach(message => {
      const words = message.content.toLowerCase().split(/\s+/);
      const positiveCount = words.filter(word => positiveWords.includes(word)).length;
      const negativeCount = words.filter(word => negativeWords.includes(word)).length;
      totalSentiment += (positiveCount - negativeCount) / words.length;
      messageCount++;
    });

    return messageCount > 0 ? totalSentiment / messageCount : 0;
  }

  private calculateAverageResponseTime(messages: any[]): number {
    if (messages.length < 2) return 0;

    let totalTime = 0;
    let responseCount = 0;

    for (let i = 1; i < messages.length; i += 2) { // Every other message is assistant response
      if (messages[i] && messages[i - 1]) {
        const responseTime = new Date(messages[i].timestamp).getTime() - new Date(messages[i - 1].timestamp).getTime();
        totalTime += responseTime;
        responseCount++;
      }
    }

    return responseCount > 0 ? totalTime / responseCount : 0;
  }

  private async getActiveSessions(): Promise<number> {
    // TODO: Implement session_analytics table
    // const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    // const { count } = await supabase
    //   .from('session_analytics')
    //   .select('*', { count: 'exact', head: true })
    //   .gte('start_time', fiveMinutesAgo.toISOString());
    
    // return count || 0;
    return 0;
  }

  private async getLeadsCount(since: Date): Promise<number> {
    const { count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since.toISOString());
    
    return count || 0;
  }

  private async getConversionsCount(since: Date): Promise<number> {
    const { count } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since.toISOString())
      .in('stage', ['contacted', 'meeting_booked']);
    
    return count || 0;
  }

  private async getAverageResponseTime(): Promise<number> {
    // TODO: Implement session_analytics table
    // const { data } = await supabase
    //   .from('session_analytics')
    //   .select('response_time')
    //   .not('response_time', 'is', null);

    // if (!data || data.length === 0) return 0;

    // const totalTime = data.reduce((sum, session) => sum + (session.response_time || 0), 0);
    // return totalTime / data.length;
    return 0;
  }

  private async getHotLeadsCount(): Promise<number> {
    // TODO: Implement session_analytics table
    // const { count } = await supabase
    //   .from('session_analytics')
    //   .select('*', { count: 'exact', head: true })
    //   .gte('lead_score', 80)
    //   .eq('disposition', 'pending');
    
    // return count || 0;
    return 0;
  }

  private determineUrgency(score: number, sentiment: number): string {
    if (score >= 90) return 'critical';
    if (score >= 80) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  }

  private groupSentimentScores(sentiments: number[]): Array<{ score: number; count: number }> {
    const groups = {
      'very_negative': 0,
      'negative': 0,
      'neutral': 0,
      'positive': 0,
      'very_positive': 0
    };

    sentiments.forEach(sentiment => {
      if (sentiment <= -0.5) groups.very_negative++;
      else if (sentiment <= -0.1) groups.negative++;
      else if (sentiment <= 0.1) groups.neutral++;
      else if (sentiment <= 0.5) groups.positive++;
      else groups.very_positive++;
    });

    return [
      { score: -0.75, count: groups.very_negative },
      { score: -0.3, count: groups.negative },
      { score: 0, count: groups.neutral },
      { score: 0.3, count: groups.positive },
      { score: 0.75, count: groups.very_positive }
    ];
  }

  private analyzeDropOffPoints(sessions: any[]): Array<{ point: string; count: number }> {
    const dropOffs: Record<string, number> = {};

    sessions.forEach(session => {
      if (session.drop_off_point) {
        dropOffs[session.drop_off_point] = (dropOffs[session.drop_off_point] || 0) + 1;
      }
    });

    return Object.entries(dropOffs)
      .map(([point, count]) => ({ point, count }))
      .sort((a, b) => b.count - a.count);
  }

  private async getLeadAnalyticsForPeriod(startDate: Date, endDate: Date): Promise<LeadAnalytics> {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .lt('created_at', endDate.toISOString());

    if (error) throw error;

    // Similar logic to getLeadAnalytics but for specific period
    const totalLeads = leads.length;
    const qualifiedLeads = leads.filter(lead => 
      ['qualified', 'contacted', 'meeting_booked'].includes(lead.stage)
    ).length;

    return {
      totalLeads,
      qualifiedLeads,
      conversionRate: totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0,
      averageLeadScore: leads.reduce((sum, lead) => sum + (lead.score || 0), 0) / totalLeads,
      topIndustries: [],
      sourceBreakdown: [],
      funnelStepConversion: []
    };
  }

  private calculateSourceGrowth(current: Array<{ source: string; count: number }>, previous: Array<{ source: string; count: number }>): Array<{ source: string; growth: number }> {
    const growth: Array<{ source: string; growth: number }> = [];
    
    current.forEach(currentSource => {
      const previousSource = previous.find(p => p.source === currentSource.source);
      const previousCount = previousSource?.count || 0;
      const growthRate = previousCount > 0 
        ? ((currentSource.count - previousCount) / previousCount) * 100 
        : 100;
      
      growth.push({ source: currentSource.source, growth: growthRate });
    });

    return growth.sort((a, b) => b.growth - a.growth);
  }

  private calculateIndustryGrowth(current: Array<{ industry: string; count: number }>, previous: Array<{ industry: string; count: number }>): Array<{ industry: string; growth: number }> {
    const growth: Array<{ industry: string; growth: number }> = [];
    
    current.forEach(currentIndustry => {
      const previousIndustry = previous.find(p => p.industry === currentIndustry.industry);
      const previousCount = previousIndustry?.count || 0;
      const growthRate = previousCount > 0 
        ? ((currentIndustry.count - previousCount) / previousCount) * 100 
        : 100;
      
      growth.push({ industry: currentIndustry.industry, growth: growthRate });
    });

    return growth.sort((a, b) => b.growth - a.growth);
  }
} 