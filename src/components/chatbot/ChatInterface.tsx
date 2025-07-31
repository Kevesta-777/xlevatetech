
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ArrowLeft, Calendar } from 'lucide-react';
import type { LeadData } from './ChatbotContainer';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: () => void;
    icon?: React.ReactNode;
  }>;
}

interface ChatInterfaceProps {
  leadData: LeadData;
  onBack: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  leadData,
  onBack
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: `Welcome back! Based on your ${leadData.industry} background and ${leadData.teamSize} team, I can help you dive deeper into automation opportunities.`,
      sender: 'bot',
      timestamp: new Date(),
      actions: [
        {
          label: 'Book 15-min Demo',
          action: () => window.open('https://calendly.com/raj-dalal-xlevatetech', '_blank'),
          icon: <Calendar className="h-3 w-3" />
        }
      ]
    };
    setMessages([welcomeMessage]);
  }, [leadData]);

  const addMessage = (text: string, sender: 'user' | 'bot', actions?: Message['actions']) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      actions
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const message = userMessage.toLowerCase();
      
      if (message.includes('automation') || message.includes('process')) {
        addMessage(
          `For ${leadData.industry} teams, we typically automate ${leadData.painPoint?.toLowerCase()} first. This alone saves most teams 20-30 hours monthly. Want to see how this works for your exact workflows?`,
          'bot',
          [
            {
              label: 'Book Demo',
              action: () => window.open('https://calendly.com/raj-dalal-xlevatetech', '_blank'),
              icon: <Calendar className="h-3 w-3" />
            }
          ]
        );
      } else if (message.includes('cost') || message.includes('price')) {
        addMessage(
          'Investment varies by scope. Most teams see 300-500% ROI within 3 months. Our assessment shows potential for significant time savings in your workflow.',
          'bot'
        );
      } else if (message.includes('time') || message.includes('hours')) {
        addMessage(
          `Based on your ${leadData.teamSize} team size, we typically reclaim 20-40 hours monthly through smart automation. This frees up your team for strategic work that actually grows revenue.`,
          'bot'
        );
      } else {
        addMessage(
          'Great question. Every automation project is unique. Let me connect you with our automation specialist who can provide specific insights for your situation.',
          'bot',
          [
            {
              label: 'Talk to Specialist',
              action: () => window.open('https://calendly.com/raj-dalal-xlevatetech', '_blank'),
              icon: <Calendar className="h-3 w-3" />
            }
          ]
        );
      }
    }, 800 + Math.random() * 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    addMessage(inputValue, 'user');
    generateBotResponse(inputValue);
    setInputValue('');
  };

  return (
    <div className="h-full flex flex-col bg-[#1a1f2c]">
      {/* Header */}
      <div className="p-3 border-b border-gray-700">
        <button
          onClick={onBack}
          className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A2463] rounded p-1"
          aria-label="Go back to main menu"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-2.5 text-sm ${
              message.sender === 'user'
                ? 'bg-[#0A2463] text-white'
                : 'bg-gray-800 text-gray-200'
            }`}>
              <p>{message.text}</p>
              
              {message.actions && (
                <div className="mt-2 space-y-1">
                  {message.actions.map((action, index) => (
                    <Button
                      key={index}
                      onClick={action.action}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start bg-transparent border-gray-600 text-gray-300 hover:bg-[#0A2463] hover:text-white hover:border-[#0A2463] text-xs"
                    >
                      {action.icon && <span className="mr-1">{action.icon}</span>}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
              
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-lg p-2.5">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about automation opportunities..."
            className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#0A2463] text-sm"
            disabled={isTyping}
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-[#0A2463] hover:bg-[#1E3A8A] p-2"
            aria-label="Send message"
          >
            <Send className="h-3 w-3" />
          </Button>
        </form>
      </div>
    </div>
  );
};
