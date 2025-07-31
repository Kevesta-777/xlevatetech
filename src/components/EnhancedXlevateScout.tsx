import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Calendar, AlertTriangle, Clipboard, HelpCircle, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isEscalated?: boolean;
  messageCount?: number;
  messageType?: 'instruction' | 'question' | 'escalation' | 'default' | 'definition' | 'cost' | 'process' | 'comparative';
  questionType?: string;
  suggestions?: string[];
  topic?: string;
}

interface ChatbotProps {
  calendlyLink?: string;
}

export const EnhancedXlevateScout: React.FC<ChatbotProps> = ({ 
  calendlyLink = "https://calendly.com/raj-dalal-xlevatetech" 
}) => {
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
  const [currentPlaceholder, setCurrentPlaceholder] = useState("Ask about automation savings, timelines, or your project...");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const startTimeRef = useRef<number>(Date.now());

  // Smart placeholder rotation
  useEffect(() => {
    const placeholders = [
      "Ask about automation savings, timelines, or your project...",
      "Question about ROI timelines or implementation?",
      "Curious about automation costs or benefits?"
    ];
    
    let currentIndex = 0;
    const rotateInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % placeholders.length;
      setCurrentPlaceholder(placeholders[currentIndex]);
    }, 30000);

    return () => clearInterval(rotateInterval);
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
          
          if (firstAssistantMessage && firstAssistantMessage.content.includes("What's your name?")) {
            setHasAskedName(true);
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
        }
      } catch (error) {
        console.error('Error loading history:', error);
        setMessages([{
          id: '1',
          content: getWelcomeMessage(),
          role: 'assistant',
          timestamp: new Date()
        }]);
      }
    };

    if (isOpen && messages.length === 0) {
      loadHistory();
    }
  }, [isOpen, sessionId]);

  const getWelcomeMessage = () => {
    if (!hasAskedName) {
      setHasAskedName(true);
      return "🤖 Hi! I'm Xlevate Scout. What's your name?";
    }
    return "How can I help you with automation today?";
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Check if we've reached the 5-message limit
    const userMessageCount = messageCount + 1;
    if (userMessageCount > 5) {
      const limitMessage: Message = {
        id: crypto.randomUUID(),
        content: `You've reached the 5-message limit for this session. For further assistance:\n\n📧 Email: <a href="mailto:raj.dalal@xlevatetech.com" class="chatbot-link" aria-label="Email consultant">raj.dalal@xlevatetech.com</a>\n\n📅 <a href="${calendlyLink}" target="_blank" rel="noopener noreferrer" class="chatbot-link" aria-label="Schedule consultation">Schedule with Consultant</a>`,
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
    setIsLoading(true);

    try {
      console.log('Calling enhanced-chatbot function with:', { message: messageToSend.substring(0, 50), messageCount: userMessageCount });
      
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );
      
      const requestPromise = supabase.functions.invoke('enhanced-chatbot', {
        body: {
          message: messageToSend,
          sessionId,
          currentPage: location.pathname,
          calendlyLink,
          messageCount: userMessageCount
        }
      });

      const response = await Promise.race([requestPromise, timeoutPromise]) as any;
      console.log('Function response received');

      if (response.error) {
        console.error('Function returned error:', response.error);
        throw response.error;
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response.data?.response || 'Response received',
        role: 'assistant',
        timestamp: new Date(),
        isEscalated: response.data?.isEscalated || false,
        messageType: response.data?.questionType || 'default',
        questionType: response.data?.questionType,
        suggestions: response.data?.suggestions,
        topic: response.data?.topic
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update topic only - no suggestions to avoid blocking UI
      if (response.data?.topic) {
        setCurrentTopic(response.data.topic);
      }
      // Disable suggestions entirely to prevent UI blocking
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
        return <span className="text-lg">💡</span>;
      case 'cost':
        return <span className="text-lg">💰</span>;
      case 'process':
        return <span className="text-lg">🔧</span>;
      case 'comparative':
        return <span className="text-lg">⚖️</span>;
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

  const getProgressWidth = () => {
    return Math.min((messageCount / 5) * 100, 100);
  };

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
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        .slide-up {
          animation: slideUp 300ms ease-out;
        }
        .pulse-animation {
          animation: breathe 3s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .slide-up, .pulse-animation {
            animation: none !important;
          }
        }
      `}</style>

      {/* Chat Toggle Button - Enhanced Robot Design */}
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

      {/* Chat Interface */}
      {isOpen && (
        <div 
          className="fixed bottom-[100px] right-[30px] z-40 w-[380px] h-[500px] max-w-[90vw] max-h-[70vh] chatbot-modal rounded-lg shadow-xl flex flex-col slide-up md:w-[380px] md:h-[500px]"
          role="dialog"
          aria-labelledby="chatbot-title"
          aria-describedby="chatbot-description"
          aria-live="polite"
        >
          {/* Header */}
          <div className="chatbot-header p-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              {/* Enhanced Robot Avatar */}
              <div className="relative min-w-[32px]">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white relative overflow-hidden bg-white/20">
                  {/* Robot Face */}
                  <div className="flex gap-1 mb-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></div>
                  </div>
                  <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-white/80 rounded"></div>
                  {/* Antenna */}
                  <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-1.5 bg-white/60"></div>
                  <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white/60 rounded-full"></div>
                </div>
                {/* Status indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex-1">
                <h3 id="chatbot-title" className="font-bold text-xl text-white">Xlevate Scout</h3>
                <p id="chatbot-description" className="text-sm text-white/90">AI Automation Consultant</p>
              </div>
              <button
                ref={closeButtonRef}
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20 rounded chatbot-focusable flex items-center justify-center md:h-6 md:w-6"
                aria-label="Close chatbot"
                type="button"
              >
                <X className="h-5 w-5 md:h-4 md:w-4" aria-hidden="true" />
              </button>
            </div>
            
            {/* Topic Indicator Bar */}
            <div className="mt-3 px-3 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <span className="text-xs opacity-75">Currently discussing:</span>
                <span className="font-medium">{currentTopic.charAt(0).toUpperCase() + currentTopic.slice(1)}</span>
                {isLoading && (
                  <div className="flex gap-1 ml-auto">
                    <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce delay-200"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto chatbot-message-area p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="relative flex-shrink-0 min-w-[32px]">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white relative overflow-hidden bg-gradient-to-br from-[hsl(221_100%_40%)] to-[hsl(211_100%_50%)]">
                      {message.isEscalated ? (
                        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <>
                          {/* Robot Face */}
                          <div className="flex gap-0.5 mb-0.5">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-1.5 h-0.5 bg-white/80 rounded"></div>
                        </>
                      )}
                      {!message.isEscalated && (
                        <>
                          <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-1.5 bg-white/60"></div>
                          <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white/60 rounded-full"></div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm transition-all duration-300 ${
                    message.role === 'user'
                      ? 'chatbot-user-bubble ml-auto'
                      : message.isEscalated
                        ? 'chatbot-escalation'
                        : message.messageType === 'definition'
                          ? 'bg-green-50 border border-green-200 text-green-800'
                          : message.messageType === 'cost'
                            ? 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                            : message.messageType === 'process'
                              ? 'bg-blue-50 border border-blue-200 text-blue-800'
                              : 'chatbot-bot-bubble'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {getMessageIcon(message.messageType)}
                    <div className="flex-1">
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: formatMessageContent(message.content, message.messageType) 
                        }}
                      />
                      {/* Show suggestions for assistant messages */}
                      {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs opacity-75 font-medium">Suggested follow-ups:</p>
                          <div className="space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs p-2 bg-white/50 hover:bg-white/80 rounded border border-gray-200 transition-colors duration-200"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-gray-600" aria-hidden="true" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="relative flex-shrink-0">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white relative overflow-hidden bg-gradient-to-br from-[hsl(221_100%_40%)] to-[hsl(211_100%_50%)]">
                    {/* Thinking robot face */}
                    <div className="flex gap-0.5 mb-0.5">
                      <div className="w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
                      <div className="w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-75"></div>
                    </div>
                    <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-1 h-0.5 bg-white/80 rounded"></div>
                    {/* Animated antenna */}
                    <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-white/60 animate-pulse"></div>
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="chatbot-bot-bubble p-3 rounded-lg text-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Smart Suggestions Area - Disabled to prevent UI blocking */}
          {false && isShowingSuggestions && suggestions.length > 0 && (
            <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-blue-700">Quick questions:</span>
                <button
                  onClick={() => setIsShowingSuggestions(false)}
                  className="ml-auto text-blue-500 hover:text-blue-700"
                  aria-label="Hide suggestions"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="block w-full text-left text-xs p-2 bg-white hover:bg-blue-100 rounded border border-blue-200 transition-colors duration-200 text-blue-700"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="chatbot-footer p-4 border-t border-gray-200">
            {/* Message Counter */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Messages: {messageCount}/5</span>
                {messageCount >= 4 && (
                  <span className="text-xs text-orange-600 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Escalates to human after limit
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-[hsl(221_100%_40%)] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressWidth()}%` }}
                ></div>
              </div>
            </div>

            {/* Input */}
            <div className="relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentPlaceholder}
                disabled={isLoading || messageCount >= 5}
                className={`chatbot-input pr-12 h-12 px-4 py-3 text-base font-normal leading-6 text-[#2C3E50] bg-white border rounded-lg focus:outline-none ${messageCount >= 5 ? 'bg-gray-100 border-gray-300 cursor-not-allowed placeholder:text-gray-400' : 'border-[#E0E0E0] focus:ring-2 focus:ring-[#0080FF] focus:border-transparent placeholder:text-[#767676]'}`}
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '1.5',
                  paddingRight: '50px',
                  paddingLeft: '16px',
                  height: '48px'
                }}
                aria-label="Ask your automation question"
                aria-describedby="disclaimer-text"
                autoCapitalize="sentences"
                spellCheck="true"
                autoComplete="off"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim() || messageCount >= 5}
                size="sm"
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 border-0 shadow-none rounded ${messageCount >= 5 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-transparent hover:bg-gray-100 text-[#0066CC] focus:ring-2 focus:ring-dashed focus:ring-[#004499]'}`}
                aria-label="Send message"
                type="button"
              >
                {messageCount >= 5 ? (
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>

            {/* Disclaimer */}
            <p id="disclaimer-text" className="text-xs text-gray-500 mt-2 italic text-center">
              AI assistant for informational purposes only. Not legal/financial advice.
            </p>
          </div>
        </div>
      )}
    </>
  );
};