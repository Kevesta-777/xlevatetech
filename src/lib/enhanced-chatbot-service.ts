import { supabase } from '@/integrations/supabase/client';
import {
  SessionMemoryManager,
  LeadScoringEngine,
  EscalationDetector,
  ContentModerator,
  PrivacyManager,
  SessionMemory,
  LeadScore,
  EscalationTrigger,
  LLM_CONFIG
} from './ai-intelligence';

export interface EnhancedChatbotRequest {
  message: string;
  sessionId: string;
  currentPage: string;
  calendlyLink: string;
  messageCount: number;
}

export interface EnhancedChatbotResponse {
  response: string;
  isEscalated: boolean;
  escalationReason?: string;
  leadScore?: LeadScore;
  suggestions?: string[];
  questionType?: string;
  topic?: string;
  requiresConsent?: boolean;
  privacyNotice?: string;
}

export class EnhancedChatbotService {
  private memoryManager = SessionMemoryManager.getInstance();
  private currentCost = 0;
  private readonly COST_LIMIT = 0.10; // $0.10 per session

  async processMessage(request: EnhancedChatbotRequest): Promise<EnhancedChatbotResponse> {
    const { message, sessionId, currentPage, calendlyLink, messageCount } = request;

    // 1. Content Moderation
    const moderation = ContentModerator.moderateContent(message);
    if (moderation.isBlocked) {
      return {
        response: "I'm sorry, but I cannot process that message. Please rephrase your question.",
        isEscalated: true,
        escalationReason: moderation.reason
      };
    }

    const sanitizedMessage = moderation.sanitizedMessage || message;

    // 2. Get/Update Session Memory
    let session = await this.memoryManager.getSession(sessionId);
    if (!session) {
      session = {
        userId: sessionId,
        sessionId,
        context: {
          engagementLevel: 0,
          lastInteraction: new Date(),
          messageCount: 0
        },
        leadScore: 0,
        escalationTriggers: [],
        consentStatus: {
          dataCollection: false,
          marketing: false,
          analytics: false
        }
      };
    }

    // Update session context
    session.context.messageCount = messageCount;
    session.context.lastInteraction = new Date();
    session.context.engagementLevel = Math.min(session.context.engagementLevel + 5, 100);

    // 3. Lead Scoring
    const leadScore = LeadScoringEngine.calculateScore(session, sanitizedMessage);
    session.leadScore = leadScore.score;

    // 4. Escalation Detection
    const escalationTriggers = EscalationDetector.detectTriggers(sanitizedMessage, session);
    session.escalationTriggers.push(...escalationTriggers.map(t => t.message));

    // 5. Check for immediate escalation
    const criticalEscalation = escalationTriggers.find(t => t.severity === 'critical');
    if (criticalEscalation) {
      await this.triggerEscalation(session, criticalEscalation);
      return {
        response: "I understand this is important. Let me connect you with our team right away.",
        isEscalated: true,
        escalationReason: criticalEscalation.message
      };
    }

    // 6. Check consent requirements
    const consent = await PrivacyManager.checkConsent(sessionId);
    if (!consent.dataCollection && messageCount > 3) {
      return {
        response: "To provide you with the best assistance, I need your consent to collect and process your information. Would you like to proceed?",
        requiresConsent: true,
        privacyNotice: PrivacyManager.getPrivacyNotice(),
        isEscalated: false
      };
    }

    // 7. Generate AI Response with Hybrid LLM Routing
    const aiResponse = await this.generateAIResponse(sanitizedMessage, session, currentPage, calendlyLink);

    // 8. Update session memory
    await this.memoryManager.updateSession(sessionId, session);

    // 9. Check for escalation based on lead score
    if (leadScore.category === 'hot' && leadScore.score >= 85) {
      await this.triggerEscalation(session, {
        type: 'intent',
        severity: 'high',
        message: 'High-value lead detected',
        timestamp: new Date()
      });
    }

    return {
      response: aiResponse.response,
      isEscalated: aiResponse.isEscalated || leadScore.category === 'hot',
      escalationReason: aiResponse.escalationReason,
      leadScore,
      suggestions: aiResponse.suggestions,
      questionType: aiResponse.questionType,
      topic: aiResponse.topic
    };
  }

  private async generateAIResponse(
    message: string, 
    session: SessionMemory, 
    currentPage: string, 
    calendlyLink: string
  ): Promise<EnhancedChatbotResponse> {
    try {
      // Check cost limits
      if (this.currentCost >= this.COST_LIMIT) {
        return {
          response: "I've reached my usage limit for this session. Please contact our team directly for assistance.",
          isEscalated: true,
          escalationReason: 'Cost limit reached'
        };
      }

      // Prepare context for AI with enhanced understanding
      const context = this.buildEnhancedContext(session, currentPage, calendlyLink, message);
      
      // Try primary LLM first
      let response = await this.callPrimaryLLM(message, context);
      
      // If primary fails or needs web search, use fallback
      if (!response || this.needsWebSearch(message)) {
        response = await this.callFallbackLLM(message, context);
      }

      // Update cost tracking
      this.currentCost += LLM_CONFIG.primary.costCap;

      return response;
    } catch (error) {
      console.error('AI response generation failed:', error);
      return {
        response: "I'm having trouble processing your request right now. Please try again or contact our team.",
        isEscalated: true,
        escalationReason: 'AI service error'
      };
    }
  }

  private buildEnhancedContext(session: SessionMemory, currentPage: string, calendlyLink: string, currentMessage: string): string {
    const context = {
      userIndustry: session.context.industry,
      userPreferences: session.context.preferences,
      painPoints: session.context.painPoints,
      engagementLevel: session.context.engagementLevel,
      leadScore: session.leadScore,
      currentPage,
      calendlyLink,
      currentMessage,
      conversationHistory: session.context.lastInteraction,
      messageCount: session.context.messageCount,
      // Add intent detection hints
      intentHints: this.detectIntent(currentMessage),
      // Add response guidelines
      responseGuidelines: this.getResponseGuidelines(session, currentMessage)
    };

    // Check if this is a conversational prompt (for lead capture flow)
    const isConversationalPrompt = currentMessage.includes('Xlevate Scout') || 
                                  currentMessage.includes('AI automation consultant') ||
                                  currentMessage.includes('natural conversation') ||
                                  currentMessage.includes('lead capture flow');

    if (isConversationalPrompt) {
      return `Conversational Context: ${JSON.stringify(context, null, 2)}

You are Xlevate Scout, an AI automation consultant having a natural conversation with a potential client. Your goal is to be helpful, conversational, and guide them through the lead capture process naturally.

Conversation Guidelines:
- Be friendly and approachable, not robotic
- Understand and respond to any type of user input naturally
- If they give a greeting, respond warmly and ask for their name
- If they're unsure about something, provide helpful examples
- If they ask questions, answer them naturally
- Guide them through the process step by step
- Be understanding if they seem confused or hesitant
- Use their name if you have it
- Provide relevant examples based on their industry (if known)

Current Message: "${currentMessage}"

Remember: You're having a real conversation, not just collecting data. Be human, be helpful, be conversational.`;
    }

    // Check if this is an analysis prompt (for lead capture flow)
    const isAnalysisPrompt = currentMessage.includes('analyzing a user\'s response') || 
                            currentMessage.includes('lead capture chatbot flow') ||
                            currentMessage.includes('JSON object');

    if (isAnalysisPrompt) {
      return `Analysis Context: ${JSON.stringify(context, null, 2)}

You are analyzing user input for a lead capture chatbot. Your task is to determine if the user's response is valid for the current step.

Guidelines for Analysis:
- Be strict about what constitutes valid input
- Generic responses like "yes", "no", "ok", "maybe" are usually invalid
- Greetings and clarification requests should be flagged as invalid
- Look for meaningful, specific information relevant to the step
- Provide helpful suggested responses for invalid inputs
- Always respond with valid JSON format

Current Message: "${currentMessage}"`;
    }

    return `Enhanced Context: ${JSON.stringify(context, null, 2)}

Response Guidelines:
- Be conversational and helpful
- If user seems confused, provide clarification
- If user gives incomplete information, ask for more details
- If user is in lead capture flow, guide them appropriately
- Provide specific examples when helpful
- Keep responses concise but informative
- Use the user's name if available: ${session.context.industry ? 'Yes' : 'No'}
- Industry context: ${session.context.industry || 'Not specified'}
- Current engagement level: ${session.context.engagementLevel}/100`;
  }

  private detectIntent(message: string): {
    isGreeting: boolean;
    isQuestion: boolean;
    isClarification: boolean;
    isComplaint: boolean;
    isRequest: boolean;
    confidence: number;
  } {
    const lowerMessage = message.toLowerCase();
    
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
    const questions = ['what', 'how', 'why', 'when', 'where', 'who', 'which', '?'];
    const clarifications = ['what do you mean', 'i don\'t understand', 'can you explain', 'not sure', 'dunno', 'idk'];
    const complaints = ['not working', 'broken', 'problem', 'issue', 'error', 'frustrated', 'annoyed'];
    const requests = ['help', 'need', 'want', 'looking for', 'searching for', 'trying to'];
    
    const isGreeting = greetings.some(greeting => lowerMessage.includes(greeting));
    const isQuestion = questions.some(q => lowerMessage.includes(q));
    const isClarification = clarifications.some(c => lowerMessage.includes(c));
    const isComplaint = complaints.some(c => lowerMessage.includes(c));
    const isRequest = requests.some(r => lowerMessage.includes(r));
    
    // Calculate confidence based on multiple indicators
    let confidence = 0;
    if (isGreeting) confidence += 0.3;
    if (isQuestion) confidence += 0.4;
    if (isClarification) confidence += 0.5;
    if (isComplaint) confidence += 0.6;
    if (isRequest) confidence += 0.4;
    
    return {
      isGreeting,
      isQuestion,
      isClarification,
      isComplaint,
      isRequest,
      confidence: Math.min(confidence, 1.0)
    };
  }

  private getResponseGuidelines(session: SessionMemory, currentMessage: string): string[] {
    const guidelines: string[] = [];
    
    // If this is early in the conversation, be more guiding
    if (session.context.messageCount < 3) {
      guidelines.push('Be welcoming and explain how you can help');
      guidelines.push('Ask clarifying questions if user input is unclear');
    }
    
    // If user seems confused, provide more context
    if (currentMessage.toLowerCase().includes('what do you mean') || 
        currentMessage.toLowerCase().includes('not sure') ||
        currentMessage.toLowerCase().includes('help')) {
      guidelines.push('Provide clear explanations with examples');
      guidelines.push('Offer multiple options when possible');
    }
    
    // If user is in lead capture flow, be more specific
    if (session.leadScore > 0) {
      guidelines.push('Focus on their specific needs and industry');
      guidelines.push('Provide relevant examples based on their context');
    }
    
    // If engagement is low, try to re-engage
    if (session.context.engagementLevel < 30) {
      guidelines.push('Ask engaging questions to increase participation');
      guidelines.push('Provide valuable information to build interest');
    }
    
    return guidelines;
  }

  private buildContext(session: SessionMemory, currentPage: string, calendlyLink: string): string {
    const context = {
      userIndustry: session.context.industry,
      userPreferences: session.context.preferences,
      painPoints: session.context.painPoints,
      engagementLevel: session.context.engagementLevel,
      leadScore: session.leadScore,
      currentPage,
      calendlyLink
    };

    return `Context: ${JSON.stringify(context)}`;
  }

  private async callPrimaryLLM(message: string, context: string): Promise<EnhancedChatbotResponse> {
    try {
      const response = await supabase.functions.invoke('gpt-4o-mini', {
        body: {
          message,
          context,
          maxTokens: LLM_CONFIG.primary.maxTokens,
          temperature: LLM_CONFIG.primary.temperature
        }
      });

      if (response.error) throw response.error;

      return this.parseAIResponse(response.data?.response || '');
    } catch (error) {
      console.error('Primary LLM failed:', error);
      return null;
    }
  }

  private async callFallbackLLM(message: string, context: string): Promise<EnhancedChatbotResponse> {
    try {
      const response = await supabase.functions.invoke('perplexity-sonar-pro', {
        body: {
          message,
          context,
          maxTokens: LLM_CONFIG.fallback.maxTokens,
          temperature: LLM_CONFIG.fallback.temperature,
          webSearch: true
        }
      });

      if (response.error) throw response.error;

      return this.parseAIResponse(response.data?.response || '');
    } catch (error) {
      console.error('Fallback LLM failed:', error);
      throw error;
    }
  }

  private needsWebSearch(message: string): boolean {
    const webSearchKeywords = [
      'latest', 'recent', 'news', 'update', 'current', 'today',
      'price', 'cost', 'pricing', 'market', 'trend'
    ];
    
    return webSearchKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    );
  }

  private parseAIResponse(aiResponse: string): EnhancedChatbotResponse {
    try {
      // Parse structured response if available
      if (aiResponse.includes('{') && aiResponse.includes('}')) {
        const jsonStart = aiResponse.indexOf('{');
        const jsonEnd = aiResponse.lastIndexOf('}') + 1;
        const jsonStr = aiResponse.substring(jsonStart, jsonEnd);
        
        const parsed = JSON.parse(jsonStr);
        return {
          response: parsed.response || aiResponse,
          isEscalated: parsed.isEscalated || false,
          escalationReason: parsed.escalationReason,
          suggestions: parsed.suggestions,
          questionType: parsed.questionType,
          topic: parsed.topic
        };
      }

      // Fallback to simple response
      return {
        response: aiResponse,
        isEscalated: false
      };
    } catch (error) {
      return {
        response: aiResponse,
        isEscalated: false
      };
    }
  }

  private async triggerEscalation(session: SessionMemory, trigger: EscalationTrigger): Promise<void> {
    try {
      // Log escalation
      await supabase.from('escalations').insert({
        session_id: session.sessionId,
        user_id: session.userId,
        trigger_type: trigger.type,
        severity: trigger.severity,
        message: trigger.message,
        lead_score: session.leadScore,
        context: session.context,
        created_at: new Date().toISOString()
      });

      // Send to Slack/CRM (implement based on your setup)
      await this.sendToSlack(session, trigger);
      
      // Update session
      session.escalationTriggers.push(trigger.message);
      await this.memoryManager.updateSession(session.sessionId, session);
    } catch (error) {
      console.error('Escalation failed:', error);
    }
  }

  private async sendToSlack(session: SessionMemory, trigger: EscalationTrigger): Promise<void> {
    // Implement Slack webhook integration
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!webhookUrl) return;

    const payload = {
      text: `🚨 Escalation Required\n\n**Session:** ${session.sessionId}\n**Trigger:** ${trigger.type}\n**Severity:** ${trigger.severity}\n**Message:** ${trigger.message}\n**Lead Score:** ${session.leadScore}\n**Industry:** ${session.context.industry || 'Unknown'}`
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Slack notification failed:', error);
    }
  }
} 