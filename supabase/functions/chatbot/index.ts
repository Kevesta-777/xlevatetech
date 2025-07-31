import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, currentPage } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get or create conversation
    let conversation;
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('*')
      .eq('session_id', sessionId)
      .single();

    if (!existingConv) {
      const { data: newConv } = await supabase
        .from('conversations')
        .insert({ session_id: sessionId })
        .select()
        .single();
      conversation = newConv;
    } else {
      conversation = existingConv;
    }

    // Save user message
    await supabase.from('messages').insert({
      session_id: sessionId,
      content: message,
      role: 'user'
    });

    // Get conversation history
    const { data: history } = await supabase
      .from('messages')
      .select('content, role')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    // Search knowledge base for relevant answers
    const { data: knowledgeResults } = await supabase
      .from('knowledge_base')
      .select('question, answer, category')
      .textSearch('question', message, { type: 'websearch' })
      .limit(3);

    // Build context based on current page
    let pageContext = '';
    switch (currentPage) {
      case '/':
        pageContext = `You are on the XLevate Tech homepage. Focus on:
        • Calculating potential savings
        • Exploring industry solutions  
        • Answering technical questions`;
        break;
      case '/services':
        pageContext = `You are on the Services page. Focus on:
        • Explaining implementation steps
        • Sharing typical ROI timelines
        • Comparing different solutions`;
        break;
      case '/roi-calculator':
        pageContext = `You are on the ROI Calculator page. Focus on:
        • Explaining input parameters
        • Suggesting optimization areas
        • Interpreting calculation results`;
        break;
      default:
        pageContext = 'You are browsing XLevate Tech. I can help with automation solutions, ROI calculations, and implementation guidance.';
    }

    // Build knowledge context
    let knowledgeContext = '';
    if (knowledgeResults && knowledgeResults.length > 0) {
      knowledgeContext = `\n\nRelevant knowledge base information:\n${knowledgeResults
        .map(kb => `Q: ${kb.question}\nA: ${kb.answer}`)
        .join('\n\n')}`;
    }

    // Create system prompt
    const systemPrompt = `You are Xlevate Scout, an AI automation consultant for XLevate Tech. 

PERSONALITY:
- Professional yet approachable (like a senior consultant)
- Concise responses (1-3 sentences max)  
- Value-focused (always tie back to ROI)
- Action-oriented (guide to next steps)

CURRENT CONTEXT:
${pageContext}

RESPONSE RULES:
- Never say "I don't know" → Instead: "Let me research that. Meanwhile, here's related info..."
- Avoid yes/no questions → Use open-ended prompts
- Suggest concrete next steps after 3 exchanges
- Always include ROI/value proposition

${knowledgeContext}

Keep responses conversational and helpful. If asked for human help, respond: "I'll notify Raj personally. May I share what you'd like to discuss?"`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).slice(-10), // Last 10 messages for context
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Save assistant response
    await supabase.from('messages').insert({
      session_id: sessionId,
      content: assistantMessage,
      role: 'assistant'
    });

    return new Response(JSON.stringify({ 
      response: assistantMessage,
      sessionId 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chatbot function:', error);
    return new Response(JSON.stringify({ 
      error: 'Something went wrong. Please try again.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});