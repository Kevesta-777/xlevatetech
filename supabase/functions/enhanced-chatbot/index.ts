
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

// Enhanced configuration for conversation management
const MAX_TOKENS = 50; // Reduced for concise responses
const TEMPERATURE = 0.1;
const REQUEST_TIMEOUT = 2000; // 2 second timeout for performance requirement

const CLARIFICATION_TRIGGERS = ['phases', 'unclear', 'vague', 'confusing'];
const JOB_TRIGGERS = ['job', 'career', 'hiring', 'employment', 'work', 'position'];
const ESCALATION_TRIGGERS = [
  'complex', 'technical', 'advanced', 'detailed', 'specific implementation',
  'integration', 'api', 'custom solution', 'enterprise', 'compliance'
];

// Utility function to clean response content
function cleanResponse(content: string): string {
  // Remove all emojis except from greeting
  let cleaned = content.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  
  // Replace em-dashes with regular hyphens
  cleaned = cleaned.replace(/—/g, '-');
  
  // Limit to 35 words
  const words = cleaned.trim().split(/\s+/);
  if (words.length > 35) {
    cleaned = words.slice(0, 35).join(' ') + '...';
  }
  
  return cleaned.trim();
}

// Check for clarification needs
function needsClarification(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return CLARIFICATION_TRIGGERS.some(trigger => lowerMessage.includes(trigger));
}

// Check for job-related inquiries
function isJobInquiry(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return JOB_TRIGGERS.some(trigger => lowerMessage.includes(trigger));
}

// Check if escalation is needed
function needsEscalation(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return ESCALATION_TRIGGERS.some(trigger => lowerMessage.includes(trigger));
}

// Generate contextual suggestions
function generateSuggestions(sessionData: any): string[] {
  const suggestions = [
    "View our pricing",
    "See recent case studies", 
    "Calculate my potential ROI",
    "What services do you offer?",
    "Book a 15-minute discovery call"
  ];

  // Customize based on industry
  if (sessionData?.industry === 'Finance') {
    suggestions.unshift("See finance automation examples");
  } else if (sessionData?.industry === 'Healthcare & Pharma') {
    suggestions.unshift("Healthcare compliance solutions");
  } else if (sessionData?.industry === 'Real Estate') {
    suggestions.unshift("Real estate automation tools");
  }

  return suggestions.slice(0, 3); // Limit to 3 suggestions
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, currentPage, sessionData, calendlyLink } = await req.json();
    console.log(`Processing message: ${message.substring(0, 100)}...`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle specific response patterns
    if (needsClarification(message)) {
      const clarificationResponse = "I'm sorry, could you please provide more context or specify which phases you are referring to?";
      
      await supabase.from('messages').insert({
        session_id: sessionId,
        content: clarificationResponse,
        role: 'assistant'
      });

      return new Response(JSON.stringify({ 
        response: clarificationResponse,
        sessionId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (isJobInquiry(message)) {
      const jobResponse = "We specialize in Automation Services and do not provide job placement services. If you have any questions related to AI and Automations, feel free to ask!";
      
      await supabase.from('messages').insert({
        session_id: sessionId,
        content: jobResponse,
        role: 'assistant'
      });

      return new Response(JSON.stringify({ 
        response: jobResponse,
        sessionId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (needsEscalation(message)) {
      const escalationResponse = `Let me connect you with a specialist who can provide detailed guidance. Please book a consultation: ${calendlyLink}`;
      
      await supabase.from('escalation_logs').insert({
        session_id: sessionId,
        question: message.substring(0, 500),
        user_message: message,
        escalation_reason: 'Technical complexity detected'
      });

      await supabase.from('messages').insert({
        session_id: sessionId,
        content: escalationResponse,
        role: 'assistant'
      });

      return new Response(JSON.stringify({ 
        response: escalationResponse,
        sessionId,
        isEscalated: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Save user message
    await supabase.from('messages').insert({
      session_id: sessionId,
      content: message,
      role: 'user',
      extracted_entities: sessionData
    });

    // Get conversation history (last 5 messages for context)
    const { data: history } = await supabase
      .from('messages')
      .select('content, role')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true })
      .limit(5);

    // Search knowledge base for relevant answers
    const { data: knowledgeResults } = await supabase
      .from('knowledge_base')
      .select('question, answer, category')
      .textSearch('question', message, { type: 'websearch' })
      .limit(2);

    // Build context based on current page and session data
    let pageContext = '';
    switch (currentPage) {
      case '/':
        pageContext = 'Focus on business value and ROI potential.';
        break;
      case '/services':
        pageContext = 'Explain implementation timelines and service packages.';
        break;
      case '/automation-roi-calculator':
        pageContext = 'Help with ROI calculations and optimization.';
        break;
      default:
        pageContext = 'Provide helpful automation guidance.';
    }

    // Build knowledge context
    let knowledgeContext = '';
    if (knowledgeResults && knowledgeResults.length > 0) {
      knowledgeContext = `\n\nRelevant information:\n${knowledgeResults
        .map(kb => `Q: ${kb.question}\nA: ${kb.answer}`)
        .join('\n\n')}`;
    }

    // Create system prompt with session context
    const conversationContext = history?.map(h => `${h.role}: ${h.content}`).join('\n') || '';
    const userInfo = sessionData?.name ? `User: ${sessionData.name}${sessionData.industry ? ` (${sessionData.industry})` : ''}` : '';
    
    const systemPrompt = `You are Xlevate Scout, a concise AI automation consultant for XLevate Tech.

RESPONSE RULES:
- Maximum 35 words per response
- NO emojis in responses
- Use hyphens (-) not em-dashes (—)
- Be direct and professional
- Focus on automation solutions

CONTEXT: ${pageContext}
${userInfo}
${conversationContext ? `Previous: ${conversationContext.slice(-200)}` : ''}

KNOWLEDGE BASE:
${knowledgeContext}

For service inquiries, direct to: https://xlevatetech.com/services
For complex questions, escalate to specialist consultation.

Keep responses concise, actionable, and business-focused.`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    console.log(`Calling OpenAI with ${messages.length} messages`);

    // Add timeout for performance requirement
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
      }),
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let assistantMessage = data.choices[0].message.content;
    
    // Clean the response according to requirements
    assistantMessage = cleanResponse(assistantMessage);

    console.log(`OpenAI response: ${assistantMessage.substring(0, 100)}...`);

    // Generate contextual suggestions
    const suggestions = generateSuggestions(sessionData);

    // Save assistant response
    await supabase.from('messages').insert({
      session_id: sessionId,
      content: assistantMessage,
      role: 'assistant',
      extracted_entities: { suggestions, sessionData }
    });

    // Log analytics
    await supabase.from('conversation_analytics').insert({
      session_id: sessionId,
      question_type: 'general',
      response_time_ms: Date.now() - performance.now(),
      tokens_used: data.usage?.total_tokens || 0,
      escalated: false
    });

    return new Response(JSON.stringify({ 
      response: assistantMessage,
      sessionId,
      suggestions,
      cached: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in enhanced-chatbot function:', error);
    
    const fallbackMessage = `I'm experiencing a brief issue. Please try again or contact us directly at raj.dalal@xlevatetech.com`;

    return new Response(JSON.stringify({ 
      response: fallbackMessage,
      error: 'Service temporarily unavailable',
      sessionId: req.sessionId
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
