import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { MessageRenderer } from '@/components/chatbot/MessageRenderer';
import { ResourceButton } from '@/components/chatbot/ClickableResource';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  buttons?: { text: string; url: string }[];
  type?: 'welcome' | 'question' | 'recommendation' | 'escalation' | 'error';
}

interface SessionData {
  name?: string;
  industry?: string;
  needs?: string;
  conversationStep: number;
}

export const XlevateScout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [sessionData, setSessionData] = useState<SessionData>({ conversationStep: 0 });
  const [hasShownInitially, setHasShownInitially] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Session storage keys
  const SESSION_KEY = 'xlevate_scout_session';
  const MESSAGE_COUNT_KEY = 'xlevate_message_count';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load session data and message count
  useEffect(() => {
    const savedSession = sessionStorage.getItem(SESSION_KEY);
    const savedCount = sessionStorage.getItem(MESSAGE_COUNT_KEY);
    
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        setSessionData(parsed);
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }
    
    if (savedCount) {
      setMessageCount(parseInt(savedCount, 10));
    }
  }, []);

  // Save session data to sessionStorage
  const saveSessionData = (data: SessionData) => {
    setSessionData(data);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  };

  // Removed auto-show functionality - chatbot only opens when clicked

  // Smart placeholders
  const placeholders = [
    "Ask about automation solutions...",
    "How can AI help my business?",
    "Tell me about your services...",
    "What's your implementation process?",
    "How much time can I save?"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Initialize conversation when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: Message = {
        id: '1',
        content: "🤖 Hi! I'm Xlevate Scout. How can I assist you today?",
        role: 'assistant',
        timestamp: new Date(),
        type: 'welcome'
      };
      setMessages([initialMessage]);

      // Continue conversation based on session data
      setTimeout(() => {
        if (!sessionData.name && sessionData.conversationStep === 0) {
          askForName();
        } else if (sessionData.name && !sessionData.industry && sessionData.conversationStep <= 1) {
          askForIndustry();
        } else if (sessionData.name && sessionData.industry && !sessionData.needs && sessionData.conversationStep <= 2) {
          askForNeeds();
        }
      }, 1000);
    }
  }, [isOpen, sessionData]);

  const askForName = () => {
    const nameMessage: Message = {
      id: crypto.randomUUID(),
      content: "May I have your name?",
      role: 'assistant',
      timestamp: new Date(),
      type: 'question'
    };
    setMessages(prev => [...prev, nameMessage]);
    saveSessionData({ ...sessionData, conversationStep: 1 });
  };

  const askForIndustry = () => {
    const industryMessage: Message = {
      id: crypto.randomUUID(),
      content: `Great, ${sessionData.name}. What industry are you interested in?`,
      role: 'assistant',
      timestamp: new Date(),
      type: 'question',
      buttons: [
        { text: 'Finance', url: '#finance' },
        { text: 'Healthcare & Pharma', url: '#healthcare' },
        { text: 'Real Estate', url: '#realestate' },
        { text: 'Other', url: '#other' }
      ]
    };
    setMessages(prev => [...prev, industryMessage]);
    saveSessionData({ ...sessionData, conversationStep: 2 });
  };

  const askForNeeds = () => {
    const needsMessage: Message = {
      id: crypto.randomUUID(),
      content: `Thanks, ${sessionData.name}. What are your individual automation needs?`,
      role: 'assistant',
      timestamp: new Date(),
      type: 'question'
    };
    setMessages(prev => [...prev, needsMessage]);
    saveSessionData({ ...sessionData, conversationStep: 3 });
  };

  const handleButtonClick = (buttonText: string, url: string) => {
    // Handle industry selection
    if (url.startsWith('#')) {
      const industry = buttonText;
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content: industry,
        role: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      const updatedSession = { ...sessionData, industry, conversationStep: 2 };
      saveSessionData(updatedSession);
      
      setTimeout(() => {
        askForNeeds();
      }, 500);
      return;
    }

    // Handle other button clicks
    if (url.startsWith('http')) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const newMessageCount = messageCount + 1;
    setMessageCount(newMessageCount);
    sessionStorage.setItem(MESSAGE_COUNT_KEY, newMessageCount.toString());
    
    // Handle conversation flow
    if (!sessionData.name && sessionData.conversationStep === 1) {
      const updatedSession = { ...sessionData, name: inputValue, conversationStep: 1 };
      saveSessionData(updatedSession);
      setInputValue('');
      setTimeout(() => {
        askForIndustry();
      }, 500);
      return;
    }

    if (sessionData.name && sessionData.industry && !sessionData.needs && sessionData.conversationStep === 3) {
      const updatedSession = { ...sessionData, needs: inputValue, conversationStep: 4 };
      saveSessionData(updatedSession);
      
      // Log to chat_logs table
      console.log('Chat session completed:', {
        session_id: sessionId,
        name: sessionData.name,
        industry: sessionData.industry,
        needs: inputValue,
        transcript: messages.concat([userMessage]),
        consent_given: true
      });

      setInputValue('');
      
      // Provide final response with action buttons
      const finalMessage: Message = {
        id: crypto.randomUUID(),
        content: `Thank you, ${sessionData.name}. Based on your ${sessionData.industry} background and automation needs, I can help connect you with our specialists.`,
        role: 'assistant',
        timestamp: new Date(),
        type: 'recommendation',
        buttons: [
          { text: 'View our pricing', url: '#pricing' },
          { text: 'See recent case studies', url: '/case-studies' },
          { text: 'Calculate my potential ROI', url: '/automation-roi-calculator' },
          { text: 'What services do you offer?', url: 'https://xlevatetech.com/services' },
          { text: 'Book a 15-minute discovery call', url: 'https://calendly.com/raj-dalal-xlevatetech' }
        ]
      };
      setMessages(prev => [...prev, finalMessage]);
      return;
    }

    // Check message limit
    if (newMessageCount >= 5) {
      const escalationMessage: Message = {
        id: crypto.randomUUID(),
        content: "I'd love to continue helping you! For more detailed assistance, let's connect you with one of our automation specialists who can provide personalized guidance.",
        role: 'assistant',
        timestamp: new Date(),
        type: 'escalation',
        buttons: [
          { text: 'Book a consultation', url: 'https://calendly.com/raj-dalal-xlevatetech' },
          { text: 'View our services', url: 'https://xlevatetech.com/services' }
        ]
      };
      setMessages(prev => [...prev, escalationMessage]);
      setInputValue('');
      return;
    }

    setInputValue('');
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('enhanced-chatbot', {
        body: {
          message: inputValue,
          sessionId,
          currentPage: location.pathname,
          sessionData,
          calendlyLink: 'https://calendly.com/raj-dalal-xlevatetech'
        }
      });

      if (response.error) throw response.error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response.data.response,
        role: 'assistant',
        timestamp: new Date(),
        type: response.data.isEscalated ? 'escalation' : 'recommendation',
        buttons: response.data.suggestions ? response.data.suggestions.map((text: string) => ({
          text,
          url: text.includes('pricing') ? '#pricing' :
               text.includes('case studies') ? '/case-studies' :
               text.includes('ROI') ? '/automation-roi-calculator' :
               text.includes('services') ? 'https://xlevatetech.com/services' :
               text.includes('call') ? 'https://calendly.com/raj-dalal-xlevatetech' : '#'
        })) : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        role: 'assistant',
        timestamp: new Date(),
        type: 'error'
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

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'welcome':
        return '👋';
      case 'question':
        return '❓';
      case 'recommendation':
        return '💡';
      case 'escalation':
        return '🚀';
      case 'error':
        return '⚠️';
      default:
        return '';
    }
  };

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
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes pulse-animation {
          0%, 100% { 
            box-shadow: 0 0 0 0 hsla(220, 90%, 56%, 0.7);
          }
          50% { 
            box-shadow: 0 0 0 15px hsla(220, 90%, 56%, 0);
          }
        }
        
        .breathe {
          animation: breathe 3s ease-in-out infinite;
        }
        
        .slide-up {
          animation: slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .pulse-ring {
          animation: pulse-animation 2s infinite;
        }
        
        .chatbot-modal {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          background: linear-gradient(135deg, hsl(220, 30%, 98%) 0%, hsl(220, 15%, 96%) 100%);
          border: 1px solid hsl(220, 13%, 91%);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .chatbot-header {
          background: linear-gradient(135deg, hsl(220, 90%, 56%) 0%, hsl(262, 90%, 56%) 100%);
          border-bottom: 3px solid hsl(220, 90%, 40%);
        }
        
        .chatbot-message-area {
          background: linear-gradient(to bottom, hsl(220, 30%, 98%), hsl(220, 20%, 97%));
        }
        
        .chatbot-input {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          font-size: 16px !important;
          background: hsl(0, 0%, 100%) !important;
          border: 2px solid hsl(220, 13%, 91%) !important;
          color: hsl(220, 9%, 46%) !important;
        }
        
        .chatbot-input:focus {
          border-color: hsl(220, 90%, 56%) !important;
          box-shadow: 0 0 0 3px hsla(220, 90%, 56%, 0.1) !important;
        }
      `}</style>

      {/* Enhanced Chat Toggle Button with Original Robot Design */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className="fixed bottom-6 right-6 z-50 p-0 border-0 h-20 w-20 rounded-full shadow-2xl transition-all duration-500 focus:outline-none breathe pulse-ring"
        style={{
          background: 'linear-gradient(135deg, hsl(220, 90%, 56%) 0%, hsl(262, 90%, 56%) 100%)',
          border: '3px solid hsl(0, 0%, 100%)',
        }}
        size="lg"
        aria-label={isOpen ? "Close Xlevate Scout chat" : "Open Xlevate Scout chat"}
        role="button"
        tabIndex={0}
      >
        {isOpen ? (
          <X className="h-8 w-8 text-white" />
        ) : (
          <div className="relative">
            {/* Original Robot Design */}
            <div className="w-12 h-12 relative">
              {/* Robot Head */}
              <div className="w-10 h-10 mx-auto bg-white rounded-lg relative border-2 border-gray-300">
                {/* Antenna */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-white rounded-full"></div>
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                
                {/* Eyes */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                
                {/* Mouth */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-gray-600 rounded-full"></div>
                
                {/* Side panels */}
                <div className="absolute top-1 -left-1 w-1 h-6 bg-white rounded-l-full border border-gray-300"></div>
                <div className="absolute top-1 -right-1 w-1 h-6 bg-white rounded-r-full border border-gray-300"></div>
              </div>
              
              {/* Robot Body */}
              <div className="w-8 h-3 mx-auto mt-1 bg-white rounded-b-lg border-2 border-t-0 border-gray-300">
                <div className="flex justify-center pt-0.5">
                  <div className="w-1 h-1 bg-green-400 rounded-full mr-1"></div>
                  <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                </div>
              </div>
              
              {/* Arms */}
              <div className="absolute top-6 -left-2 w-2 h-4 bg-white rounded-full border border-gray-300"></div>
              <div className="absolute top-6 -right-2 w-2 h-4 bg-white rounded-full border border-gray-300"></div>
            </div>
            
            {/* Activity indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        )}
      </Button>

      {/* Enhanced Chat Interface with Original Styling */}
      {isOpen && (
        <div 
          className={`fixed bottom-24 right-6 z-40 transition-all duration-500 ease-out slide-up ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
          } chatbot-modal rounded-2xl flex flex-col overflow-hidden`}
          role="dialog"
          aria-labelledby="chatbot-title"
          aria-describedby="chatbot-description"
        >
          {/* Enhanced Header with Original Robot Avatar */}
          <div className="chatbot-header p-4 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-2 left-4 w-20 h-20 bg-white rounded-full"></div>
              <div className="absolute bottom-2 right-4 w-16 h-16 bg-white rounded-full"></div>
            </div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm p-1">
                  <img 
                    src="/xlevate_logo1.svg" 
                    alt="Xlevate Tech Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h2 id="chatbot-title" className="font-bold text-lg text-white">Xlevate Scout</h2>
                  <p id="chatbot-description" className="text-sm text-blue-100">AI Automation Consultant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsMinimized(!isMinimized)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 h-8 w-8"
                  aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 h-8 w-8"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            {!isMinimized && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-blue-100">Conversation Progress</span>
                  <span className="text-xs text-blue-100">{messageCount}/5 messages</span>
                </div>
                <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5 backdrop-blur-sm">
                  <div 
                    className="bg-white h-1.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.min((messageCount / 5) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {!isMinimized && (
            <>
              {/* Messages Container with Original Styling */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 chatbot-message-area">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-md ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white ml-auto'
                            : 'bg-white text-gray-800 border border-gray-100'
                        }`}
                      >
                        {message.role === 'user' ? (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        ) : (
                          <MessageRenderer content={message.content} />
                        )}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0 shadow-md">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {message.buttons && (
                      <div className="flex flex-wrap gap-2 mt-2 ml-11">
                        {message.buttons.map((button, index) => (
                          <ResourceButton
                            key={index}
                            text={button.text}
                            url={button.url}
                            variant="outline"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="bg-white text-gray-800 p-3 rounded-2xl text-sm shadow-md border border-gray-100">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Input Section with Original Styling */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2 mb-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholders[currentPlaceholder]}
                    className="flex-1 text-sm chatbot-input rounded-xl"
                    disabled={isLoading || messageCount >= 5}
                    maxLength={500}
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={!inputValue.trim() || isLoading || messageCount >= 5}
                    size="sm"
                    className="px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-md"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Enhanced Footer */}
                <div className="text-center space-y-1">
                  <p className="text-xs text-gray-500">
                    🔒 Secure & Confidential • Powered by Advanced AI
                  </p>
                  {messageCount >= 5 && (
                    <p className="text-xs text-orange-600 font-medium">
                      💬 Message limit reached. Book a consultation for detailed assistance!
                    </p>
                  )}
                  <p className="text-xs text-gray-400">
                    Enterprise automation solutions • Human experts available 24/7
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
