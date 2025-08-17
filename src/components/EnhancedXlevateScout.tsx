import React, { useState, useEffect, useRef } from 'react';
import { X, Send, AlertTriangle, Clipboard, HelpCircle, Lightbulb, DollarSign, Wrench, Scale, Minimize2, Maximize2, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { MessageRenderer } from '@/components/chatbot/MessageRenderer';
import { ResourceButton } from '@/components/chatbot/ClickableResource';
import { EnhancedChatbotService } from '@/lib/enhanced-chatbot-service';
import { PrivacyManager, ContentModerator } from '@/lib/ai-intelligence';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isEscalated?: boolean;
  messageCount?: number;
  messageType?: string;
  questionType?: string;
  suggestions?: string[];
  topic?: string;
  buttons?: { text: string; url: string }[];
  requiresConsent?: boolean;
  privacyNotice?: string;
}

interface ChatbotProps {
  calendlyLink?: string;
}

type LeadStage = 'captured' | 'qualified' | 'disqualified' | 'contacted' | 'meeting_booked';
type LeadSource = 'form' | 'chatbot' | 'linkedin' | 'email';
type LeadInsert = {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  industry_sector: string | null;
  location: string | null;
  company_size: string | null;
  website_url: string | null;
  role_title: string | null;
  social_links: string | null;
  pain_points: string | null;
  budget_timeline: string | null;
  notes: string | null;
  score?: number | null;
  stage?: LeadStage;
  source: LeadSource;
  campaign_id?: string | null;
  last_contacted_at?: string | null;
  calendly_link: string | null;
  opt_out?: boolean;
};

type MinimalInsertResult = { error: { message?: string } | null };
type MinimalInsert = (rows: LeadInsert[]) => Promise<MinimalInsertResult>;
type MinimalFrom = (table: string) => { insert: MinimalInsert };

export const EnhancedXlevateScout: React.FC<ChatbotProps> = ({ 
  calendlyLink = "https://calendly.com/raj-dalal-xlevatetech" 
}) => {
  const placeholders = [
    'Ask about automation solutions...',
    'How can AI help my business?',
    'Tell me about your services...',
    "What's your implementation process?",
    'How much time can I save?'
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [hasTriggered, setHasTriggered] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [currentTopic, setCurrentTopic] = useState<string>('General Discussion');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isShowingSuggestions, setIsShowingSuggestions] = useState(false);
  const [hasAskedName, setHasAskedName] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const startTimeRef = useRef<number>(Date.now());
  const [isMinimized, setIsMinimized] = useState(false);
  const MAX_MESSAGES = 20;
  type LeadStep = 'idle' | 'awaiting_name' | 'awaiting_company' | 'awaiting_role' | 'awaiting_industry' | 'awaiting_company_size' | 'awaiting_location' | 'awaiting_website' | 'awaiting_needs' | 'awaiting_budget' | 'awaiting_contact_choice' | 'awaiting_email' | 'awaiting_phone' | 'awaiting_additional_info' | 'completed';
  const [leadStep, setLeadStep] = useState<LeadStep>('idle');
  const [lead, setLead] = useState<{ 
    first_name: string; 
    last_name: string; 
    email: string; 
    phone: string; 
    company_name: string; 
    industry_sector: string; 
    location: string; 
    company_size: string; 
    website_url: string; 
    role_title: string; 
    social_links: string; 
    pain_points: string; 
    budget_timeline: string;
    notes: string; 
    calendly_link: string; 
  }>({
    first_name: '', 
    last_name: '', 
    email: '', 
    phone: '', 
    company_name: '',
    industry_sector: '', 
    location: '',
    company_size: '',
    website_url: '',
    role_title: '',
    social_links: '',
    pain_points: '', 
    budget_timeline: '',
    notes: '', 
    calendly_link: calendlyLink 
  });
  
  // New state for AI intelligence features
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [consentStatus, setConsentStatus] = useState({
    dataCollection: false,
    marketing: false,
    analytics: false
  });
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(false);
  const chatbotService = new EnhancedChatbotService();

  // Smart placeholder rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Optimized trigger conditions: 10-second delay OR scroll depth >30%
  useEffect(() => {
    if (hasTriggered) return;

    const handleTrigger = () => {
      setIsVisible(true);
      setHasTriggered(true);
    };

    // Reduced to 10 seconds for faster appearance
    const timer = setTimeout(handleTrigger, 10000);

    // Throttled scroll handler for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
          if (scrollPercent > 30) { // Lower threshold for faster trigger
            handleTrigger();
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasTriggered]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus input after modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Optimized conversation loading - only load when needed
  useEffect(() => {
    const loadHistory = async () => {
      try {
        // Only load last 5 messages for performance
        const { data, error } = await supabase
          .from('messages')
          .select('id, content, role, timestamp')
          .eq('session_id', sessionId)
          .order('timestamp', { ascending: false })
          .limit(5);

        if (error) throw error;

        if (data && data.length > 0) {
          // Check if we've already asked for name by looking at the first assistant message
          const firstAssistantMessage = data
            .reverse()
            .find(msg => msg.role === 'assistant');
          
          if (firstAssistantMessage && (firstAssistantMessage.content.includes("What's your name?") || firstAssistantMessage.content.includes("How can I assist you today?"))) {
            setHasAskedName(true);
            setLeadStep('awaiting_name');
          }
          
          setMessages(data.map(msg => ({
            id: msg.id,
            content: msg.content,
            role: msg.role as 'user' | 'assistant',
            timestamp: new Date(msg.timestamp)
          })));
        } else {
          // Add welcome message if no history
          setMessages([{
            id: '1',
            content: getWelcomeMessage(),
            role: 'assistant',
            timestamp: new Date()
          }]);
          setLeadStep('awaiting_name');
        }
      } catch (error) {
        console.error('Error loading history:', error);
        setMessages([{
          id: '1',
          content: getWelcomeMessage(),
          role: 'assistant',
          timestamp: new Date()
        }]);
        setLeadStep('awaiting_name');
      }
    };

    if (isOpen && messages.length === 0) {
      loadHistory();
    }
  }, [isOpen, sessionId]);

  const getWelcomeMessage = () => {
    if (!hasAskedName) {
      setHasAskedName(true);
      return "🤖 Hi! I'm Xlevate Scout. How can I assist you today?\n What's your name?";
    }
    return "How can I help you with automation today?";
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const isLikelyDisposable = /@(mailinator|guerrillamail|10minutemail|tempmail|yopmail)\./i.test(value);
    return emailRegex.test(value) && !isLikelyDisposable;
  };

  const validatePhone = (value: string) => {
    const digits = value.replace(/[^0-9+]/g, '');
    const e164 = /^\+?[1-9]\d{7,14}$/; // simple international format check, min 8 digits
    return e164.test(digits);
  };

  const insertLead = async () => {
    const payload: LeadInsert = {
      first_name: lead.first_name || null,
      last_name: lead.last_name || null,
      email: lead.email || null,
      phone: lead.phone || null,
      company_name: lead.company_name || null,
      industry_sector: lead.industry_sector || null,
      location: lead.location || null,
      company_size: lead.company_size || null,
      website_url: lead.website_url || window.location.origin,
      role_title: lead.role_title || null,
      social_links: lead.social_links || null,
      pain_points: lead.pain_points || null,
      budget_timeline: lead.budget_timeline || null,
      notes: lead.notes ? `${lead.notes} • from ${location.pathname}` : `from ${location.pathname}`,
      calendly_link: calendlyLink || null,
      source: 'chatbot'
    };
    try {
      const { error } = await supabase.from('leads').insert([payload]);
      if (error) throw error;
      console.log('Lead successfully inserted:', payload);
      return true;
    } catch (e) {
      console.error('Error inserting lead:', e);
      return false;
    }
  };

  const handleLeadCaptureFlow = async (userInput: string) => {
    const trimmed = userInput.trim();

    // Use OpenAI for intelligent conversation understanding and responses
    const conversationResponse = await getConversationalResponse(userInput, leadStep, lead);

    if (conversationResponse.shouldProceed) {
      // Update lead data if provided
      if (conversationResponse.leadUpdates) {
        setLead(prev => ({ ...prev, ...conversationResponse.leadUpdates }));
      }

      // Move to next step if indicated
      if (conversationResponse.nextStep) {
        setLeadStep(conversationResponse.nextStep);
      }

      // If completed, insert lead
      if (conversationResponse.nextStep === 'completed') {
        const leadInserted = await insertLead();
        if (leadInserted) {
          console.log('Lead capture completed successfully');
          // The response already includes success message and action buttons
        } else {
          console.error('Failed to insert lead');
          // Add error message to the conversation
          const errorMessage: Message = {
            id: crypto.randomUUID(),
            content: "I've captured your information, but there was a technical issue saving it. Don't worry - I'll make sure our team gets in touch with you. You can also reach us directly at raj.dalal@xlevatetech.com",
            role: 'assistant',
            timestamp: new Date(),
            messageType: 'error'
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      }
    }

    // Always show the conversational response
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      content: conversationResponse.response,
      role: 'assistant',
      timestamp: new Date(),
      messageType: conversationResponse.messageType || 'conversation',
      buttons: conversationResponse.buttons
    };
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  // GPT-powered conversational response function
  const getConversationalResponse = async (
    userInput: string, 
    currentStep: LeadStep, 
    currentLead: typeof lead
  ): Promise<{
    response: string;
    shouldProceed: boolean;
    nextStep?: LeadStep;
    leadUpdates?: Partial<typeof lead>;
    messageType?: string;
    buttons?: { text: string; url: string }[];
  }> => {
    try {
      const prompt = `You are Xlevate Scout, an AI automation consultant having a natural conversation with a potential client. You're currently in a lead capture flow.

Current Step: ${currentStep}
User's Message: "${userInput}"
Current Lead Data: ${JSON.stringify(currentLead, null, 2)}

Your goal is to have a natural, helpful conversation while capturing brief lead information. Be conversational, understanding, and guide the user through the process naturally.

Step Guidelines:
- Only ask for a field if it is missing in Current Lead Data.
- If the field already has a value, skip to the next logical step.
- Do not re-ask questions once a valid answer has been given.
- Extract information from the user's responses whenever possible without asking again.
- Keep questions short and friendly, confirm info if needed, and move forward.

Step:
- awaiting_name: Ask for their name(first_name, last_name) in a friendly way, handle greetings naturally
- awaiting_company: Ask about their company name and basic company info
- awaiting_role: Ask about their role/title in the company
- awaiting_industry: Ask about their industry, provide examples if they're unsure
- awaiting_company_size: Ask about company size (employees, revenue, etc.)
- awaiting_location: Ask about their location/geography
- awaiting_website: Ask about their website or online presence
- awaiting_needs: Ask about their specific business needs/challenges(brief phrase only, Answer example: "Data collection from multiple sensors is fragmented.")
- awaiting_contact_choice: Offer free audit or discovery call options
- awaiting_email: Ask for contact info to follow up
- awaiting_phone: Ask for phone number (if email was provided) or vice versa
- awaiting_additional_info: Ask for any additional information or questions(social media links, etc.)

Lead Fields to Capture:
- first_name, last_name: User's name
- company_name: Company name
- role_title: Job title/role
- industry_sector: Industry (technology, healthcare, finance, etc.)
- company_size: Company size (employees, revenue)
- location: Geographic location
- website_url: Company website
- pain_points: Business challenges/needs
- email: Email address
- phone: Phone number
- notes: Additional notes and context
- social_links: Social media links
- source: How the lead found you(form, chatbot, linkedin, email  -> found this from the chatbot)

Respond with a JSON object:
{
  "response": "Your conversational response to the user",
  "shouldProceed": boolean (true if ready to move to next step),
  "nextStep": "next_step_name" (if moving to next step),
  "leadUpdates": {"field": "value"} (any lead data to update),
  "messageType": "conversation|question|instruction",
  "buttons": [{"text": "Button Text", "url": "url"}] (optional action buttons)
}

Be natural, helpful, and conversational. Don't be robotic or overly formal. Extract and update lead information intelligently from user responses.`;

      // Call OpenAI ChatGPT API directly
      const response = await callOpenAI(prompt);

      try {
        const parsed = JSON.parse(response);
        return {
          response: parsed.response || "I'm here to help you with automation solutions. How can I assist you today?",
          shouldProceed: parsed.shouldProceed || false,
          nextStep: parsed.nextStep,
          leadUpdates: parsed.leadUpdates,
          messageType: parsed.messageType || 'conversation',
          buttons: parsed.buttons
        };
      } catch (parseError) {
        console.warn('Failed to parse OpenAI response, using fallback');
        return await getFallbackResponse(userInput, currentStep, currentLead);
      }
    } catch (error) {
      console.error('OpenAI conversation failed:', error);
      return await getFallbackResponse(userInput, currentStep, currentLead);
    }
  };

  // Direct OpenAI API call function
  const callOpenAI = async (prompt: string): Promise<string> => {
    try {
      // For security, in production you should use a backend API
      // This is for development/demo purposes
      const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!openaiApiKey) {
        console.error('OpenAI API key not found in environment variables');
        throw new Error('OpenAI API key not configured');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            {
              role: 'system',
              content: 'You are Xlevate Scout, an AI automation consultant. Always respond with valid JSON format as requested.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
          stream: false,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error:', errorData);
        throw new Error(`OpenAI API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw error;
    }
  };

  // Fallback response function - now also uses OpenAI
  const getFallbackResponse = async (
    userInput: string, 
    currentStep: LeadStep, 
    currentLead: typeof lead
  ): Promise<{
    response: string;
    shouldProceed: boolean;
    nextStep?: LeadStep;
    leadUpdates?: Partial<typeof lead>;
    messageType?: string;
    buttons?: { text: string; url: string }[];
  }> => {
    try {
      // Create a simplified prompt for fallback scenarios
      const fallbackPrompt = `You are Xlevate Scout, an AI automation consultant. The main OpenAI call failed, so you need to provide a helpful response.

Current Step: ${currentStep}
User's Message: "${userInput}"
Current Lead Data: ${JSON.stringify(currentLead, null, 2)}

Provide a natural, helpful response. Be conversational and guide the user appropriately.

Step Guidelines:
- awaiting_name: Ask for their name in a friendly way, handle greetings naturally
- awaiting_company: Ask about their company name and basic company info
- awaiting_role: Ask about their role/title in the company
- awaiting_industry: Ask about their industry, provide examples if they're unsure
- awaiting_company_size: Ask about company size (employees, revenue, etc.)
- awaiting_location: Ask about their location/geography
- awaiting_website: Ask about their website or online presence
- awaiting_needs: Ask about their specific business needs/challenges
- awaiting_contact_choice: Offer audit or discovery call options
- awaiting_email: Ask for contact info to follow up
- awaiting_phone: Ask for phone number (if email was provided) or vice versa
- awaiting_additional_info: Ask for any additional information or questions

Lead Fields to Capture:
- first_name, last_name: User's name
- company_name: Company name
- role_title: Job title/role
- industry_sector: Industry (technology, healthcare, finance, etc.)
- company_size: Company size (employees, revenue)
- location: Geographic location
- website_url: Company website
- pain_points: Business challenges/needs
- email: Email address
- phone: Phone number
- notes: Additional notes and context
- social_links: Social media links
- source: How the lead found you(form, chatbot, linkedin, email  -> found this from the chatbot)

Respond with a JSON object:
{
  "response": "Your conversational response to the user",
  "shouldProceed": boolean (true if ready to move to next step),
  "nextStep": "next_step_name" (if moving to next step),
  "leadUpdates": {"field": "value"} (any lead data to update),
  "messageType": "conversation|question|instruction",
  "buttons": [{"text": "Button Text", "url": "url"}] (optional action buttons)
}

Be natural, helpful, and conversational. Extract and update lead information intelligently from user responses.`;

      const response = await callOpenAI(fallbackPrompt);
      
      try {
        const parsed = JSON.parse(response);
        return {
          response: parsed.response || "I'm here to help you with automation solutions. How can I assist you today?",
          shouldProceed: parsed.shouldProceed || false,
          nextStep: parsed.nextStep,
          leadUpdates: parsed.leadUpdates,
          messageType: parsed.messageType || 'conversation',
          buttons: parsed.buttons
        };
      } catch (parseError) {
        console.warn('Failed to parse fallback OpenAI response, using basic fallback');
        return getBasicFallbackResponse(userInput, currentStep, currentLead);
      }
    } catch (error) {
      console.error('Fallback OpenAI call failed:', error);
      return getBasicFallbackResponse(userInput, currentStep, currentLead);
    }
  };

  // Basic fallback response function (only used if OpenAI completely fails)
  const getBasicFallbackResponse = (
    userInput: string, 
    currentStep: LeadStep, 
    currentLead: typeof lead
  ): {
    response: string;
    shouldProceed: boolean;
    nextStep?: LeadStep;
    leadUpdates?: Partial<typeof lead>;
    messageType?: string;
    buttons?: { text: string; url: string }[];
  } => {
    const lowerInput = userInput.toLowerCase();
    
    switch (currentStep) {
      case 'awaiting_name': {
        // Check if it looks like a name
        if (userInput.trim().length > 1 && !['hi', 'hello', 'hey', 'yes', 'no', 'ok', 'maybe', 'nice', 'nice to meet you'].includes(lowerInput)) {
          const parts = userInput.trim().split(/\s+/);
          return {
            response: `Great to meet you, ${parts[0]}! What's your company name?`,
            shouldProceed: true,
            nextStep: 'awaiting_company',
            leadUpdates: { first_name: parts[0], last_name: parts.slice(1).join(' ') },
            messageType: 'conversation'
          };
        } else {
          return {
            response: "Hi there! I'm here to help you with automation solutions. To get started, could you please tell me your name?",
            shouldProceed: false,
            messageType: 'conversation'
          };
        }
      }

      case 'awaiting_company': {
        if (userInput.trim().length > 2 && !['yes', 'no', 'ok', 'maybe', 'not sure'].includes(lowerInput)) {
          return {
            response: 'What\'s your role or title at the company?',
            shouldProceed: true,
            nextStep: 'awaiting_role',
            leadUpdates: { company_name: userInput.trim() },
            messageType: 'question'
          };
        } else {
          return {
            response: "Could you please tell me your company name?",
            shouldProceed: false,
            messageType: 'instruction'
          };
        }
      }

      case 'awaiting_role': {
        if (userInput.trim().length > 2 && !['yes', 'no', 'ok', 'maybe', 'not sure'].includes(lowerInput)) {
          return {
            response: 'What industry are you in? For example: technology, healthcare, finance, retail, etc.',
            shouldProceed: true,
            nextStep: 'awaiting_industry',
            leadUpdates: { role_title: userInput.trim() },
            messageType: 'question'
          };
        } else {
          return {
            response: "Could you please tell me your role or title?",
            shouldProceed: false,
            messageType: 'instruction'
          };
        }
      }

      case 'awaiting_industry': {
        if (userInput.trim().length > 2 && !['yes', 'no', 'ok', 'maybe', 'not sure'].includes(lowerInput)) {
          return {
            response: 'How large is your company? (number of employees, revenue, etc.)',
            shouldProceed: true,
            nextStep: 'awaiting_company_size',
            leadUpdates: { industry_sector: userInput.trim() },
            messageType: 'question'
          };
        } else {
          return {
            response: "Could you please tell me what industry you work in? For example: technology, healthcare, finance, retail, etc.",
            shouldProceed: false,
            messageType: 'instruction'
          };
        }
      }

      case 'awaiting_company_size': {
        if (userInput.trim().length > 2 && !['yes', 'no', 'ok', 'maybe', 'not sure'].includes(lowerInput)) {
          return {
            response: 'Where are you located? (city, state, country)',
            shouldProceed: true,
            nextStep: 'awaiting_location',
            leadUpdates: { company_size: userInput.trim() },
            messageType: 'question'
          };
        } else {
          return {
            response: "Could you please tell me about your company size? (employees, revenue, etc.)",
            shouldProceed: false,
            messageType: 'instruction'
          };
        }
      }

      case 'awaiting_location': {
        if (userInput.trim().length > 2 && !['yes', 'no', 'ok', 'maybe', 'not sure'].includes(lowerInput)) {
          return {
            response: 'Do you have a company website? If so, what is it?',
            shouldProceed: true,
            nextStep: 'awaiting_website',
            leadUpdates: { location: userInput.trim() },
            messageType: 'question'
          };
        } else {
          return {
            response: "Could you please tell me your location? (city, state, country)",
            shouldProceed: false,
            messageType: 'instruction'
          };
        }
      }

      case 'awaiting_website': {
        if (userInput.trim().length > 2 && !['yes', 'no', 'ok', 'maybe', 'not sure'].includes(lowerInput)) {
          return {
            response: 'What are your main business challenges or needs? For example: process automation, customer service, data analysis, etc.',
            shouldProceed: true,
            nextStep: 'awaiting_needs',
            leadUpdates: { website_url: userInput.trim() },
            messageType: 'question'
          };
        } else {
          return {
            response: "Could you please tell me about your website or online presence?",
            shouldProceed: false,
            messageType: 'instruction'
          };
        }
      }

      case 'awaiting_needs': {
        if (userInput.trim().length > 5 && !['yes', 'no', 'ok', 'maybe', 'not sure'].includes(lowerInput)) {
          return {
            response: 'What\'s your budget and timeline for automation solutions?',
            shouldProceed: true,
            nextStep: 'awaiting_budget',
            leadUpdates: { pain_points: userInput.trim() },
            messageType: 'question'
          };
        } else {
          return {
            response: "Could you please describe your specific needs or challenges? For example: 'We spend too much time on manual data entry' or 'Our customer service response times are too slow'.",
            shouldProceed: false,
            messageType: 'instruction'
          };
        }
      }

      case 'awaiting_contact_choice': {
        const choseCall = lowerInput.includes('call') || lowerInput.includes('discovery') || lowerInput.includes('meeting');
        const choseAudit = lowerInput.includes('audit') || lowerInput.includes('workflow') || lowerInput.includes('assessment');
        
        if (choseCall || choseAudit || lowerInput.includes('both')) {
          let notes = currentLead.notes || '';
          if (choseCall) notes = notes ? `${notes}; requested discovery call` : 'requested discovery call';
          if (choseAudit) notes = notes ? `${notes}; requested workflow audit` : 'requested workflow audit';
          if (lowerInput.includes('both')) notes = notes ? `${notes}; requested both audit and call` : 'requested both audit and call';
          
          return {
            response: 'Perfect! Please share your email address so we can follow up with details.',
            shouldProceed: true,
            nextStep: 'awaiting_email',
            leadUpdates: { notes },
            messageType: 'question'
          };
        } else {
          return {
            response: "Could you please let me know if you'd prefer a free workflow audit or a discovery call? You can also say 'both' if you're interested in both options.",
            shouldProceed: false,
            messageType: 'instruction'
          };
        }
      }

      case 'awaiting_email': {
        const hasEmail = /@/.test(userInput) && validateEmail(userInput);
        
        if (hasEmail) {
          return {
            response: 'Great! Could you also provide your phone number for additional contact options?',
            shouldProceed: true,
            nextStep: 'awaiting_phone',
            leadUpdates: { email: userInput.trim() },
            messageType: 'question'
          };
        } else {
          return {
            response: 'That doesn\'t look like a valid email address. Please provide a business email so we can follow up with you.',
            shouldProceed: false,
            messageType: 'instruction'
          };
        }
      }

      case 'awaiting_phone': {
        const hasPhone = validatePhone(userInput);
        
        if (hasPhone || userInput.toLowerCase().includes('no') || userInput.toLowerCase().includes('skip')) {
          const updates: Partial<typeof lead> = {};
          if (hasPhone) updates.phone = userInput.trim();
          
          const firstName = currentLead.first_name || 'there';
          return {
            response: `Thanks, ${firstName}! Your details have been captured. Is there anything else you'd like to share or any questions you have?`,
            shouldProceed: true,
            nextStep: 'awaiting_additional_info',
            leadUpdates: updates,
            messageType: 'conversation'
          };
        } else {
          return {
            response: 'Could you please provide a valid phone number, or say "no" if you prefer not to share it.',
            shouldProceed: false,
            messageType: 'instruction'
          };
        }
      }

      case 'awaiting_additional_info': {
        let notes = currentLead.notes || '';
        if (userInput.trim().length > 0) {
          notes = notes ? `${notes}; additional info: ${userInput.trim()}` : `additional info: ${userInput.trim()}`;
        }
        
        const firstName = currentLead.first_name || 'there';
        return {
          response: `Perfect, ${firstName}! Your lead information has been captured. Would you like to schedule a call or see case studies?`,
          shouldProceed: true,
          nextStep: 'completed',
          leadUpdates: { notes },
          messageType: 'conversation',
          buttons: [
            { text: 'Book a Call', url: calendlyLink },
            { text: 'See Case Studies', url: '/case-studies' }
          ]
        };
      }

      default:
        return {
          response: "I'm here to help you with automation solutions. How can I assist you today?",
          shouldProceed: false,
          messageType: 'conversation'
        };
    }
  };

  const handleConsent = async (consent: { dataCollection: boolean; marketing: boolean; analytics: boolean }) => {
    await PrivacyManager.updateConsent(sessionId, consent);
    setConsentStatus(consent);
    setShowConsentDialog(false);
    
    // Continue with the conversation
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      content: "Thank you! Now I can provide you with personalized assistance. How can I help you with automation today?",
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, assistantMessage]);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Check if we've reached the message limit
    const userMessageCount = messageCount + 1;
    if (userMessageCount > MAX_MESSAGES) {
      const limitMessage: Message = {
        id: crypto.randomUUID(),
        content: `You've reached the ${MAX_MESSAGES}-message limit for this session. For further assistance:\n\nEmail: <a href="mailto:raj.dalal@xlevatetech.com" class="chatbot-link" aria-label="Email consultant">raj.dalal@xlevatetech.com</a>\n\n<a href="${calendlyLink}" target="_blank" rel="noopener noreferrer" class="chatbot-link" aria-label="Schedule consultation">Schedule with Consultant</a>`,
        role: 'assistant',
        timestamp: new Date(),
        isEscalated: true,
        messageType: 'escalation'
      };
      setMessages(prev => [...prev, limitMessage]);
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
      messageCount: userMessageCount,
      messageType: 'question'
    };

    setMessages(prev => [...prev, userMessage]);
    setMessageCount(userMessageCount);
    const messageToSend = inputValue;
    setInputValue('');

    // Intercept for lead capture flow
    if (leadStep !== 'completed' && leadStep !== 'idle') {
      await handleLeadCaptureFlow(messageToSend);
      return;
    }

    setIsLoading(true);

    try {
      // Use enhanced chatbot service
      const response = await chatbotService.processMessage({
        message: messageToSend,
        sessionId,
        currentPage: location.pathname,
        calendlyLink,
        messageCount: userMessageCount
      });

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response.response,
        role: 'assistant',
        timestamp: new Date(),
        isEscalated: response.isEscalated,
        messageType: response.questionType || 'default',
        questionType: response.questionType,
        suggestions: response.suggestions,
        topic: response.topic,
        requiresConsent: response.requiresConsent,
        privacyNotice: response.privacyNotice
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle consent requirement
      if (response.requiresConsent) {
        setShowConsentDialog(true);
      }

      // Handle escalation
      if (response.isEscalated) {
        console.log('Escalation triggered:', response.escalationReason);
      }

      if (response.topic) {
        setCurrentTopic(response.topic);
      }
      setIsShowingSuggestions(false);
      setSuggestions([]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "I'm having trouble connecting right now. Please try again in a moment, or reach out to <a href=\"mailto:raj.dalal@xlevatetech.com\" class=\"chatbot-link\">raj.dalal@xlevatetech.com</a> for immediate assistance.",
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageIcon = (messageType?: string) => {
    switch (messageType) {
      case 'instruction':
        return <Clipboard className="h-3 w-3 text-blue-600" aria-hidden="true" />;
      case 'question':
        return <HelpCircle className="h-3 w-3 text-blue-600" aria-hidden="true" />;
      case 'escalation':
        return <AlertTriangle className="h-3 w-3 text-orange-600" aria-hidden="true" />;
      case 'definition':
        return <Lightbulb className="h-3 w-3 text-blue-600" aria-hidden="true" />;
      case 'cost':
        return <DollarSign className="h-3 w-3 text-blue-600" aria-hidden="true" />;
      case 'process':
        return <Wrench className="h-3 w-3 text-blue-600" aria-hidden="true" />;
      case 'comparative':
        return <Scale className="h-3 w-3 text-blue-600" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const formatMessageContent = (content: string, messageType?: string) => {
    // Format lists and bullet points
    let formattedContent = content.replace(/•/g, '✓');
    
    // Add proper link styling for emails and calendly
    formattedContent = formattedContent.replace(
      /mailto:([^\s<>"]+)/g,
      'mailto:$1" class="chatbot-link'
    );
    
    return formattedContent;
  };

  const getProgressWidth = () => Math.min((messageCount / MAX_MESSAGES) * 100, 100);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setIsShowingSuggestions(false);
    // Auto-send the suggestion
    setTimeout(() => {
      if (suggestion.trim()) {
        sendMessage();
      }
    }, 100);
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes pulse-animation { 0%, 100% { box-shadow: 0 0 0 0 hsla(220, 90%, 56%, 0.7); } 50% { box-shadow: 0 0 0 15px hsla(220, 90%, 56%, 0); } }
        .breathe { animation: breathe 3s ease-in-out infinite; }
        .slide-up { animation: slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .pulse-ring { animation: pulse-animation 2s infinite; }
        .chatbot-modal { font-family: 'Inter', system-ui, -apple-system, sans-serif; background: linear-gradient(135deg, hsl(220, 30%, 98%) 0%, hsl(220, 15%, 96%) 100%); border: 1px solid hsl(220, 13%, 91%); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
        .chatbot-header { background: linear-gradient(135deg, hsl(220, 90%, 56%) 0%, hsl(262, 90%, 56%) 100%); border-bottom: 3px solid hsl(220, 90%, 40%); }
        .chatbot-message-area { background: linear-gradient(to bottom, hsl(220, 30%, 98%), hsl(220, 20%, 97%)); }
        .chatbot-input { font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 16px !important; background: hsl(0, 0%, 100%) !important; border: 2px solid hsl(220, 13%, 91%) !important; color: hsl(220, 9%, 46%) !important; }
        .chatbot-input:focus { border-color: hsl(220, 90%, 56%) !important; box-shadow: 0 0 0 3px hsla(220, 90%, 56%, 0.1) !important; }
        @media (prefers-reduced-motion: reduce) { .slide-up, .pulse-animation { animation: none !important; } }
      `}</style>

      {/* Chat Toggle Button - Logo Only */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-[30px] right-[30px] z-50 cursor-pointer transition-all duration-300 hover:scale-105 chatbot-focusable"
        style={isOpen ? undefined : { background: 'linear-gradient(135deg, hsl(221 100% 40%), hsl(211 100% 50%))' }}
        aria-label={isOpen ? "Close chatbot" : "Open Xlevate Scout chatbot"}
        type="button"
      >
        {isOpen ? (
          <div className="h-12 w-12 rounded-full text-white shadow-lg hover:shadow-xl bg-gradient-to-br from-[hsl(221_100%_40%)] to-[hsl(225_100%_30%)] flex items-center justify-center">
            <X className="h-6 w-6" aria-hidden="true" />
          </div>
        ) : (
          <div className="relative pulse-animation">
            {/* Robot Head */}
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br shadow-lg flex items-center justify-center relative overflow-hidden">
              {/* Robot Eyes */}
              <div className="flex gap-1 mb-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></div>
              </div>
              {/* Robot Mouth */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-white/80 rounded"></div>
              {/* Antenna */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-[hsl(211_100%_80%)]"></div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[hsl(211_100%_80%)] rounded-full"></div>
            </div>
            {/* Robot Body */}
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-gradient-to-b from-[hsl(221_100%_40%)] to-[hsl(225_100%_30%)] rounded-b-md border-t border-white/20">
              {/* Body Details */}
              <div className="flex justify-center mt-0.5">
                <div className="w-0.5 h-0.5 bg-white/60 rounded-full"></div>
              </div>
            </div>
            {/* Robot Arms */}
            <div className="absolute top-3 -left-1 w-1 h-2 bg-[hsl(221_100%_40%)] rounded"></div>
            <div className="absolute top-3 -right-1 w-1 h-2 bg-[hsl(221_100%_40%)] rounded"></div>
          </div>
        )}
      </button>

      {/* Chat Interface - styled similar to XlevateScout */}
      {isOpen && (
        <div 
          className={`fixed bottom-24 right-6 z-40 transition-all duration-500 ease-out slide-up ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          } chatbot-modal rounded-2xl flex flex-col overflow-hidden`}
          role="dialog"
          aria-labelledby="chatbot-title"
          aria-describedby="chatbot-description"
          aria-live="polite"
        >
          {/* Header styled like XlevateScout */}
          <div className="chatbot-header p-4 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-4 w-20 h-20 bg-white rounded-full"></div>
              <div className="absolute bottom-2 right-4 w-16 h-16 bg-white rounded-full"></div>
            </div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm p-1">
                  <img src="/xlevate_logo1.svg" alt="Xlevate Tech Logo" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h2 id="chatbot-title" className="font-bold text-lg text-white">Xlevate Scout</h2>
                  <p id="chatbot-description" className="text-sm text-blue-100">AI Automation Consultant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowPrivacyNotice(!showPrivacyNotice)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 h-8 w-8"
                  aria-label="Privacy notice"
                >
                  <Shield className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setIsMinimized(!isMinimized)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 h-8 w-8"
                  aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  ref={closeButtonRef}
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 h-8 w-8"
                  aria-label="Close chatbot"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-blue-100">Conversation Progress</span>
                  <span className="text-xs text-blue-100">{messageCount}/{MAX_MESSAGES} messages</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5 backdrop-blur-sm">
                  <div className="bg-white h-1.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${Math.min((messageCount / MAX_MESSAGES) * 100, 100)}%` }}></div>
                </div>
              </div>
            )}
          </div>

          {!isMinimized && (
            <>
              {/* Privacy Notice */}
              {showPrivacyNotice && (
                <div className="px-4 py-3 bg-blue-50 border-b border-blue-200">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-800">
                      <p className="font-medium mb-1">Privacy Notice</p>
                      <p>{PrivacyManager.getPrivacyNotice()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sticky CTAs
              <div className="px-4 py-2 bg-white border-b border-gray-200 flex gap-2 justify-between" aria-label="Quick actions">
                <a href={calendlyLink} target="_blank" rel="noopener noreferrer" aria-label="Book a call" className="text-xs text-blue-700 underline">Book a Call</a>
                <a href="/case-studies" aria-label="See case studies" className="text-xs text-blue-700 underline">See Case Studies</a>
                <a href="/resources" aria-label="Explore resources" className="text-xs text-blue-700 underline">Resources</a>
              </div> */}
              
              {/* Messages styled like XlevateScout */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 chatbot-message-area">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-md ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white ml-auto'
                          : 'bg-white text-gray-800 border border-gray-100'
                      }`}>
                        {message.role === 'user' ? (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        ) : (
                          <MessageRenderer content={message.content} />
                        )}
                      </div>
                      {/* Removed extra user icon to keep logo as primary brand icon */}
                    </div>

                    {/* Action Buttons derived from suggestions */}
                    {message.buttons && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-11">
                        {message.buttons.map((button, index) => (
                          <ResourceButton key={index} text={button.text} url={button.url} variant="outline" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="bg-white text-gray-800 p-3 rounded-2xl text-sm shadow-md border border-gray-100">
                      <div className="flex gap-1" aria-label="Assistant is typing">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Consent Dialog */}
              {showConsentDialog && (
                <div className="p-4 bg-yellow-50 border-t border-yellow-200">
                  <div className="text-sm text-yellow-800 mb-3">
                    <p className="font-medium mb-2">Data Collection Consent</p>
                    <p className="mb-3">To provide you with personalized assistance, we need your consent to collect and process your information.</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={consentStatus.dataCollection}
                          onChange={(e) => setConsentStatus(prev => ({ ...prev, dataCollection: e.target.checked }))}
                          className="rounded"
                        />
                        <span>Data Collection (required for assistance)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={consentStatus.marketing}
                          onChange={(e) => setConsentStatus(prev => ({ ...prev, marketing: e.target.checked }))}
                          className="rounded"
                        />
                        <span>Marketing Communications (optional)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={consentStatus.analytics}
                          onChange={(e) => setConsentStatus(prev => ({ ...prev, analytics: e.target.checked }))}
                          className="rounded"
                        />
                        <span>Analytics (optional)</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleConsent(consentStatus)}
                      disabled={!consentStatus.dataCollection}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Accept & Continue
                    </Button>
                    <Button
                      onClick={() => setShowConsentDialog(false)}
                      variant="outline"
                      size="sm"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              )}

              {/* Input Section styled like XlevateScout */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2 mb-3">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholders[currentPlaceholderIndex]}
                    className="flex-1 text-sm md:text-base chatbot-input rounded-xl"
                    disabled={isLoading || messageCount >= MAX_MESSAGES}
                    maxLength={500}
                    aria-label="Ask your automation question"
                    aria-describedby="disclaimer-text"
                    autoCapitalize="sentences"
                    spellCheck="true"
                    autoComplete="off"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!inputValue.trim() || isLoading || messageCount >= MAX_MESSAGES}
                    size="sm"
                    className="px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-md"
                    aria-label="Send message"
                    type="button"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center space-y-1">
                  <p id="disclaimer-text" className="text-xs text-gray-500">Secure & Confidential • Powered by Advanced AI</p>
                  {messageCount >= MAX_MESSAGES && (
                    <p className="text-xs text-orange-600 font-medium">Message limit reached. Book a consultation for detailed assistance.</p>
                  )}
                  <p className="text-xs text-gray-400">Enterprise automation solutions • Human experts available 24/7</p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};