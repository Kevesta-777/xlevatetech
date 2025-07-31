
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Brain, Calendar, ExternalLink } from 'lucide-react';
import type { LeadData } from './ChatbotContainer';

interface AssessmentFlowProps {
  leadData: LeadData;
  setLeadData: (data: LeadData) => void;
  onComplete: (data: LeadData) => void;
  onBack: () => void;
}

export const AssessmentFlow: React.FC<AssessmentFlowProps> = ({
  leadData,
  setLeadData,
  onComplete,
  onBack
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const industries = [
    'Finance',
    'Real Estate', 
    'Healthcare',
    'Other'
  ];

  const painPoints = [
    'Data Entry',
    'Compliance',
    'Reporting',
    'Client Communications'
  ];

  const teamSizes = [
    'Solo',
    '2-5 people',
    '6-20 people',
    '20+ people'
  ];

  const handleSelection = (field: keyof LeadData, value: string) => {
    const newData = { ...leadData, [field]: value };
    setLeadData(newData);
    
    // Auto-progress to next step after selection
    if (currentStep < 3) {
      setTimeout(() => setCurrentStep(currentStep + 1), 500);
    } else if (currentStep === 3) {
      // Progress to final step after team size selection
      setTimeout(() => setCurrentStep(4), 500);
    }
  };

  const handleDiscoveryCall = () => {
    window.open('https://calendly.com/raj-dalal-xlevatetech/consult', '_blank');
    onComplete(leadData);
  };

  const getRecommendation = () => {
    const { teamSize } = leadData;
    
    if (teamSize === 'Solo') return '10-15 hours/month';
    if (teamSize === '2-5 people') return '20-30 hours/month';
    if (teamSize === '6-20 people') return '40-60 hours/month';
    return '80+ hours/month';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Progress Bar with blue accents */}
      <div className="p-4 pb-3 flex-shrink-0">
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={currentStep === 1 ? onBack : () => setCurrentStep(currentStep - 1)}
            className="text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-gray-600">Step {currentStep} of 4</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
            role="progressbar"
            aria-valuenow={currentStep}
            aria-valuemin={1}
            aria-valuemax={4}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto px-4">
        {currentStep === 1 && (
          <div className="text-center py-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Which industry describes your business?
            </h3>
            <div className="space-y-3">
              {industries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => handleSelection('industry', industry)}
                  className={`w-full p-3 text-left border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    leadData.industry === industry
                      ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 ring-2 ring-blue-500'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-900 bg-white'
                  }`}
                  role="radio"
                  aria-checked={leadData.industry === industry}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{industry}</span>
                    {leadData.industry === industry && (
                      <CheckCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center py-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              What's your biggest operational challenge?
            </h3>
            <div className="space-y-3">
              {painPoints.map((painPoint) => (
                <button
                  key={painPoint}
                  onClick={() => handleSelection('painPoint', painPoint)}
                  className={`w-full p-3 text-left border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    leadData.painPoint === painPoint
                      ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 ring-2 ring-blue-500'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-900 bg-white'
                  }`}
                  role="radio"
                  aria-checked={leadData.painPoint === painPoint}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{painPoint}</span>
                    {leadData.painPoint === painPoint && (
                      <CheckCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="text-center py-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              What's your team size?
            </h3>
            <div className="space-y-3">
              {teamSizes.map((teamSize) => (
                <button
                  key={teamSize}
                  onClick={() => handleSelection('teamSize', teamSize)}
                  className={`w-full p-3 text-left border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                    leadData.teamSize === teamSize
                      ? 'border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 ring-2 ring-blue-500'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-900 bg-white'
                  }`}
                  role="radio"
                  aria-checked={leadData.teamSize === teamSize}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{teamSize}</span>
                    {leadData.teamSize === teamSize && (
                      <CheckCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center py-4">
            <div className="mb-5">
              {/* Electrified Brain with Neon Green Glow */}
              <div className="relative w-16 h-16 mx-auto mb-3">
                {/* Electric glow base */}
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="absolute inset-0 bg-green-300 rounded-full blur-lg opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                
                {/* Brain container with electric effect */}
                <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse border-2 border-green-300">
                  {/* Electric sparks */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-300 rounded-full animate-ping"></div>
                  <div className="absolute -top-2 right-2 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-300 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  <div className="absolute -bottom-2 left-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
                  <div className="absolute top-1 -right-2 w-1 h-1 bg-green-200 rounded-full animate-ping" style={{ animationDelay: '0.8s' }}></div>
                  <div className="absolute -left-2 bottom-2 w-1 h-1 bg-green-200 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                  
                  {/* Lightning bolts */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-0.5 h-4 bg-gradient-to-b from-green-300 to-transparent rotate-12 animate-pulse"></div>
                  </div>
                  <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-0.5 bg-gradient-to-r from-green-300 to-transparent rotate-45 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  </div>
                  <div className="absolute -bottom-3 right-1/3">
                    <div className="w-0.5 h-4 bg-gradient-to-t from-green-300 to-transparent -rotate-12 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  </div>
                  <div className="absolute -left-3 bottom-1/3">
                    <div className="w-4 h-0.5 bg-gradient-to-l from-green-300 to-transparent -rotate-45 animate-pulse" style={{ animationDelay: '0.9s' }}></div>
                  </div>
                  
                  {/* Brain icon with electric glow */}
                  <Brain className="h-7 w-7 text-white drop-shadow-lg filter brightness-110" aria-hidden="true" />
                  
                  {/* Inner glow */}
                  <div className="absolute inset-2 bg-green-300 rounded-full blur-md opacity-40 animate-pulse" style={{ animationDelay: '0.25s' }}></div>
                </div>
                
                {/* Outer electric field */}
                <div className="absolute -inset-4 border border-green-300 rounded-full opacity-20 animate-ping"></div>
                <div className="absolute -inset-6 border border-green-200 rounded-full opacity-10 animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>
              
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Analysis Complete - Insights Ready
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 mb-3">
                  For <strong className="text-gray-900">{leadData.teamSize}</strong> teams in <strong className="text-gray-900">{leadData.industry}</strong>, 
                  our AI analysis projects <strong className="text-blue-600">{getRecommendation()}</strong> in efficiency gains.
                </p>
                <p className="text-sm text-blue-700 font-medium">
                  Primary optimization target: {leadData.painPoint} workflows
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Discovery Call CTA Section - Only show on step 4 */}
      {currentStep === 4 && (
        <div className="p-4 pt-0 flex-shrink-0">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
              Ready to Save {getRecommendation()}?
            </h3>
            
            <p className="text-sm text-gray-700 text-center mb-4">
              Let's discuss your automation opportunities in a <strong className="text-blue-700">free 15-minute discovery call</strong>
            </p>
            
            {/* Benefits List */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center text-sm text-gray-700">
                <span className="text-green-600 mr-2 font-bold">✓</span>
                <span><strong>Identify Top Automation Opportunities</strong></span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <span className="text-green-600 mr-2 font-bold">✓</span>
                <span><strong>Get Custom Recommendations</strong></span>
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <span className="text-green-600 mr-2 font-bold">✓</span>
                <span><strong>Learn Next Steps</strong></span>
              </div>
            </div>

            {/* Primary CTA Button */}
            <Button
              onClick={handleDiscoveryCall}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3 text-sm font-bold shadow-lg"
            >
              <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
              Book Free Discovery Call
              <ExternalLink className="h-3 w-3 ml-2" aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
