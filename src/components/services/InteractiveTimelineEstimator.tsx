
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface TimelinePhase {
  name: string;
  duration: string;
  description: string;
  deliverables: string[];
}

const serviceTimelines: Record<string, TimelinePhase[]> = {
  'ai-automation': [
    {
      name: 'Discovery & Planning',
      duration: '1-2 weeks',
      description: 'Process analysis and workflow mapping',
      deliverables: ['Workflow Assessment', 'Technical Requirements', 'Implementation Plan']
    },
    {
      name: 'Development & Integration',
      duration: '2-4 weeks',
      description: 'Custom AI workflow creation and system integration',
      deliverables: ['Custom Workflows', 'System Integrations', 'Testing Framework']
    },
    {
      name: 'Testing & Optimization',
      duration: '1-2 weeks',
      description: 'Performance testing and optimization',
      deliverables: ['Quality Assurance', 'Performance Metrics', 'User Training']
    },
    {
      name: 'Launch & Support',
      duration: 'Ongoing',
      description: '6 months included support and monitoring',
      deliverables: ['Go-Live Support', 'Performance Monitoring', 'Monthly Reports']
    }
  ],
  'system-migration': [
    {
      name: 'Data Assessment',
      duration: '3-5 days',
      description: 'Legacy system analysis and data mapping',
      deliverables: ['Data Audit', 'Migration Plan', 'Risk Assessment']
    },
    {
      name: 'Migration Setup',
      duration: '1-2 weeks',
      description: 'Platform configuration and data preparation',
      deliverables: ['System Setup', 'Data Cleanup', 'Validation Rules']
    },
    {
      name: 'Data Transfer',
      duration: '3-7 days',
      description: 'Secure data migration and validation',
      deliverables: ['Data Migration', 'Validation Reports', 'Audit Trail']
    },
    {
      name: 'Go-Live Support',
      duration: '1 week',
      description: 'Launch support and user training',
      deliverables: ['Launch Support', 'User Training', 'Documentation']
    }
  ]
};

export const InteractiveTimelineEstimator = () => {
  const [selectedService, setSelectedService] = useState<string>('ai-automation');
  const [currentPhase, setCurrentPhase] = useState<number>(0);

  const timeline = serviceTimelines[selectedService] || [];

  return (
    <div className="timeline-estimator-mobile">
      <Card className="bg-elevate-dark border-elevate-accent/20">
        <CardHeader className="pb-3 px-4">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <Clock className="h-10 w-10 sm:h-5 sm:w-5 text-elevate-accent flex-shrink-0" />
            <span>Implementation Timeline Estimator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="mobile-content">
          <div className="space-y-4">
            {/* Service Selection - Mobile Optimized */}
            <div className="flex flex-col gap-3">
              <Button
                variant={selectedService === 'ai-automation' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedService('ai-automation');
                  setCurrentPhase(0);
                }}
                className="mobile-button"
              >
                AI Automation Timeline
              </Button>
              <Button
                variant={selectedService === 'system-migration' ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedService('system-migration');
                  setCurrentPhase(0);
                }}
                className="mobile-button"
              >
                System Migration Timeline
              </Button>
            </div>

            {/* Timeline Visualization */}
            <div className="space-y-4">
              {timeline.map((phase, index) => (
                <div
                  key={index}
                  className={`timeline-phase-card relative p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                    index === currentPhase
                      ? 'border-elevate-accent bg-elevate-accent/10'
                      : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                  }`}
                  onClick={() => setCurrentPhase(index)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      index === currentPhase ? 'bg-elevate-accent text-elevate-dark' : 'bg-gray-600 text-gray-300'
                    }`}>
                      {index < currentPhase ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    
                    <div className="timeline-phase-content">
                      <div className="timeline-phase-header">
                        <h4 className="timeline-phase-title text-white">{phase.name}</h4>
                        <span className="timeline-phase-duration text-elevate-accent font-medium">{phase.duration}</span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mt-2">{phase.description}</p>
                      
                      {index === currentPhase && (
                        <div className="timeline-deliverables">
                          <h5 className="text-white text-sm font-medium mb-3">Key Deliverables:</h5>
                          <ul className="space-y-2">
                            {phase.deliverables.map((deliverable, idx) => (
                              <li key={idx} className="timeline-deliverable-item">
                                <ArrowRight className="h-4 w-4 text-elevate-accent mt-0.5 flex-shrink-0" />
                                <span className="timeline-deliverable-text text-gray-300 text-sm">{deliverable}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {index < timeline.length - 1 && (
                    <div className="absolute left-6 top-full w-0.5 h-4 bg-gray-600 transform -translate-x-1/2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
