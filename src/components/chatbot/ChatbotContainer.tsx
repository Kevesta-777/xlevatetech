
import React, { useState, useEffect } from 'react';
import { MessageCircle, Calendar, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatInterface } from './ChatInterface';
import { AssessmentFlow } from './AssessmentFlow';
import { useToast } from '@/hooks/use-toast';

export interface LeadData {
  industry?: string;
  painPoint?: string;
  teamSize?: string;
  email?: string;
}

const ChatbotContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'welcome' | 'assessment' | 'chat'>('welcome');
  const [leadData, setLeadData] = useState<LeadData>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();

  // Professional intelligent responses
  const professionalResponses = [
    "Analysis complete. Your automation roadmap is ready for review.",
    "Efficiency protocols engaged. Prepare for optimized workflows.",
    "Data processed. Intelligent automation solutions incoming.",
    "Workflow optimization calculated. Results exceed expectations.",
    "Smart automation deployment ready. Maximum efficiency achieved.",
    "Advanced process analysis complete. Your time savings await."
  ];

  const getRandomResponse = () => {
    return professionalResponses[Math.floor(Math.random() * professionalResponses.length)];
  };

  // Create chime sound
  const playChime = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
      if (event.key === 'Enter' && event.ctrlKey && !isOpen) {
        handleToggleBot();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleToggleBot = () => {
    if (!isOpen) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    setIsOpen(!isOpen);
  };

  const handleTalkToHuman = () => {
    window.open('https://calendly.com/raj-dalal-xlevatetech', '_blank');
    
    toast({
      title: "Connecting you to our experts",
      description: "Redirecting to schedule your consultation with our automation specialists.",
    });
  };

  const generatePDF = () => {
    const { industry, painPoint, teamSize } = leadData;
    
    toast({
      title: "Automation Roadmap Generated",
      description: `Your personalized ${industry} efficiency blueprint is ready for download.`,
    });

    console.log('Generating PDF with data:', leadData);
  };

  const saveLead = async (data: LeadData) => {
    try {
      console.log('Saving lead data:', data);
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'Xlevate Scout Chatbot',
          timestamp: new Date().toISOString(),
          intent: 'High-Intent'
        })
      });

      // Play chime sound on successful submission
      try {
        playChime();
      } catch (error) {
        console.log('Audio not available:', error);
      }

      toast({
        title: "Data Secured",
        description: getRandomResponse(),
      });

      return true;
    } catch (error) {
      console.error('Error saving lead:', error);
      toast({
        title: "Connection Error",
        description: "Unable to save data. Please try again or contact support.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <>
      {/* Chat Toggle Button - Fixed positioning for mobile */}
      <button
        onClick={handleToggleBot}
        className="fixed bottom-6 right-6 z-50 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-110"
        aria-label={isOpen ? "Close Xlevate Scout chat" : "Open Xlevate Scout chat (Ctrl+Enter)"}
        aria-expanded={isOpen}
        title="Xlevate Scout - Your Intelligent Automation Assistant"
      >
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center border-2 border-blue-500 w-14 h-14 md:w-16 md:h-16">
          {/* Professional Robot Head */}
          <div className="relative w-7 h-7 md:w-8 md:h-8">
            {/* Main head body */}
            <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-400 rounded-lg relative border border-gray-500 shadow-inner">
              {/* Blue stripe across forehead */}
              <div className="absolute top-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500"></div>
              
              {/* Eyes - professional blue design */}
              <div className="absolute top-2 left-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-md shadow-blue-500 border border-blue-600"></div>
              <div className="absolute top-2 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-md shadow-blue-500 border border-blue-600"></div>
              
              {/* Center scanner/sensor */}
              <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full shadow-sm shadow-blue-400"></div>
              
              {/* Mouth grille - horizontal lines */}
              <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 space-y-0.5">
                <div className="w-3 h-0.5 bg-gray-600 rounded-full"></div>
                <div className="w-2.5 h-0.5 bg-gray-600 rounded-full mx-auto"></div>
                <div className="w-2 h-0.5 bg-gray-600 rounded-full mx-auto"></div>
              </div>
              
              {/* Side panels/ears */}
              <div className="absolute top-1 -left-0.5 w-1 h-3 bg-gray-400 rounded-l-lg border border-gray-500"></div>
              <div className="absolute top-1 -right-0.5 w-1 h-3 bg-gray-400 rounded-r-lg border border-gray-500"></div>
              
              {/* Top antenna/sensor */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-1 bg-blue-500 rounded-full"></div>
              
              {/* Metallic highlights */}
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/30 rounded-full blur-sm"></div>
              <div className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 bg-white/20 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      </button>

      {/* Screen animation overlay */}
      {isAnimating && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-slide-in-right"></div>
        </div>
      )}

      {/* Chat Interface with proper mobile positioning */}
      {isOpen && (
        <div 
          className="fixed bottom-4 right-4 z-40 transition-all duration-500 ease-out transform scale-100 opacity-100 translate-y-0 w-[calc(100vw-2rem)] max-w-[420px] h-[500px] max-h-[calc(100vh-4rem)]"
          role="dialog"
          aria-labelledby="chatbot-title"
          aria-describedby="chatbot-description"
        >
          <div className="bg-white rounded-lg shadow-2xl border border-gray-300 h-full flex flex-col overflow-hidden relative">
            {/* Professional blue header stripe */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            
            {/* Animated X button in top right */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 z-50 text-gray-500 hover:text-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 hover:bg-gray-100 group"
              aria-label="Close chat"
              title="Close assistant"
            >
              <X className="h-4 w-4 transform transition-transform duration-200 group-hover:rotate-90" aria-hidden="true" />
            </button>

            {/* Header with professional styling */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 pr-12">
              <div className="flex items-center">
                <div>
                  <h2 id="chatbot-title" className="font-semibold text-base text-white">Xlevate Scout</h2>
                  <p id="chatbot-description" className="text-sm text-blue-100">Intelligent Automation Assistant</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {currentView === 'welcome' && (
                <div className="p-5 h-full flex flex-col justify-center bg-white">
                  <div className="text-center mb-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">
                      Ready to optimize your workflows?
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      I'll analyze your processes and recommend intelligent automation solutions tailored to your business.
                    </p>
                    <p className="text-xs text-blue-600 font-medium">
                      Advanced AI • Proven Results • Expert Insights
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => setCurrentView('assessment')}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 text-sm font-medium shadow-md"
                      aria-describedby="start-assessment-desc"
                    >
                      <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                      Start Smart Assessment
                    </Button>
                    <span id="start-assessment-desc" className="sr-only">Begin the intelligent automation assessment</span>

                    <Button
                      onClick={handleTalkToHuman}
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 text-sm bg-white"
                    >
                      <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                      Schedule Consultation
                    </Button>
                  </div>
                </div>
              )}

              {currentView === 'assessment' && (
                <AssessmentFlow
                  leadData={leadData}
                  setLeadData={setLeadData}
                  onComplete={(data) => {
                    saveLead(data);
                    generatePDF();
                  }}
                  onBack={() => setCurrentView('welcome')}
                />
              )}

              {currentView === 'chat' && (
                <ChatInterface
                  leadData={leadData}
                  onBack={() => setCurrentView('welcome')}
                />
              )}
            </div>
            
            {/* Professional bottom stripe */}
            <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotContainer;
