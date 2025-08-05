
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Minus, Sparkles } from 'lucide-react';

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  monthlyPrice?: number;
  category: 'core' | 'addon';
  popular?: boolean;
}

const serviceOptions: ServiceOption[] = [
  // AI & Automation Enablement Tiers
  {
    id: 'ai-starter',
    name: 'AI Starter Plan',
    description: 'Basic AI chatbot, workflow automation, 2-3 week delivery',
    basePrice: 3999,
    monthlyPrice: 499,
    category: 'core',
    popular: true
  },
  {
    id: 'ai-professional',
    name: 'AI Professional Plan',
    description: 'Advanced AI workflows, real-time monitoring',
    basePrice: 5999,
    monthlyPrice: 699,
    category: 'core'
  },
  {
    id: 'ai-enterprise',
    name: 'AI Premium Plan',
    description: 'Full AI ecosystem, predictive analytics, dedicated support',
    basePrice: 9999,
    monthlyPrice: 999,
    category: 'core'
  },
  // System Migration Tiers
  {
    id: 'migration-standard',
    name: 'Standard Migration',
    description: 'Up to 50GB data, basic validation, 1-week completion',
    basePrice: 3999,
    category: 'core'
  },
  {
    id: 'migration-complex',
    name: 'Complex Migration',
    description: 'Unlimited data, advanced mapping, zero downtime guarantee',
    basePrice: 6999,
    category: 'core'
  },
  // Process Optimization Tiers
  {
    id: 'process-analysis',
    name: 'Process Analysis',
    description: 'Workflow mapping, efficiency recommendations',
    basePrice: 3499,
    monthlyPrice: 599,
    category: 'core'
  },
  {
    id: 'process-full',
    name: 'Full Optimization',
    description: 'Process redesign, automation implementation',
    basePrice: 5999,
    monthlyPrice: 899,
    category: 'core'
  },
  {
    id: 'process-continuous',
    name: 'Continuous Improvement',
    description: 'Ongoing optimization, performance monitoring',
    basePrice: 9999,
    monthlyPrice: 1199,
    category: 'core'
  },
  // QA Testing Tiers
  {
    id: 'qa-essential',
    name: 'Essential Testing',
    description: 'Basic functionality, compatibility testing',
    basePrice: 1999,
    category: 'core'
  },
  {
    id: 'qa-comprehensive',
    name: 'Comprehensive QA',
    description: 'Full test suite, automated frameworks, accessibility compliance',
    basePrice: 3999,
    category: 'core'
  },
  {
    id: 'qa-premium',
    name: 'Premium QA',
    description: 'Advanced testing, performance optimization, security audits',
    basePrice: 5999,
    category: 'core'
  },
  // Add-on Services
  {
    id: 'training',
    name: 'Extended Team Training',
    description: 'Additional user training and documentation',
    basePrice: 1000,
    category: 'addon'
  },
  {
    id: 'priority-support',
    name: 'Priority Support (12 months)',
    description: '24/7 priority support and faster response times',
    basePrice: 1500,
    category: 'addon'
  },
  {
    id: 'custom-integration',
    name: 'Custom API Integration',
    description: 'Connect additional third-party services',
    basePrice: 2000,
    category: 'addon'
  }
];

export const ServicePackageBuilder = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>(['ai-starter']);
  const [showPricing, setShowPricing] = useState(false);

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculatePricing = () => {
    const selected = serviceOptions.filter(service => selectedServices.includes(service.id));
    const totalBase = selected.reduce((sum, service) => sum + service.basePrice, 0);
    const totalMonthly = selected.reduce((sum, service) => sum + (service.monthlyPrice || 0), 0);
    
    // Multi-service bundle discount (15% for 2+ services)
    const coreServices = selected.filter(s => s.category === 'core');
    const bundleDiscount = coreServices.length >= 2 ? totalBase * 0.15 : 0;
    
    return {
      basePrice: totalBase,
      monthlyPrice: totalMonthly,
      bundleDiscount,
      finalBase: totalBase - bundleDiscount,
      selectedCount: selected.length
    };
  };

  const pricing = calculatePricing();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="bg-elevate-dark border-elevate-accent/20 w-full max-w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
          <Package className="h-10 w-10 sm:h-5 sm:w-5 text-elevate-accent flex-shrink-0" />
          Interactive Service Package Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Core Services */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <span>Core Services</span>
              <Badge variant="secondary" className="text-xs w-fit">Choose 1 or more</Badge>
            </h3>
            <div className="grid gap-2 sm:gap-3">
              {serviceOptions.filter(service => service.category === 'core').map(service => (
                <div
                  key={service.id}
                  className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedServices.includes(service.id)
                      ? 'border-elevate-accent bg-elevate-accent/10'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      className="mt-1 scale-90 sm:scale-100 min-w-[20px] min-h-[20px]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h4 className="text-white font-medium text-sm sm:text-base">{service.name}</h4>
                        {service.popular && (
                          <Badge className="bg-elevate-accent/20 text-elevate-accent border-elevate-accent/30 text-xs w-fit">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm mb-2">{service.description}</p>
                       <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                         <span className="text-elevate-accent font-semibold">
                           {formatCurrency(service.basePrice)} setup
                         </span>
                         {service.monthlyPrice && (
                           <span className="text-gray-400">
                             + {formatCurrency(service.monthlyPrice)}/month
                           </span>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add-on Services */}
          <div>
            <h3 className="text-white font-semibold mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <span>Add-on Services</span>
              <Badge variant="outline" className="text-xs w-fit">Optional</Badge>
            </h3>
            <div className="grid gap-2 sm:gap-3">
              {serviceOptions.filter(service => service.category === 'addon').map(service => (
                <div
                  key={service.id}
                  className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedServices.includes(service.id)
                      ? 'border-elevate-accent bg-elevate-accent/10'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      className="mt-1 scale-90 sm:scale-100 min-w-[20px] min-h-[20px]"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium mb-1 text-sm sm:text-base">{service.name}</h4>
                      <p className="text-gray-300 text-xs sm:text-sm mb-2">{service.description}</p>
                       <span className="text-elevate-accent font-semibold text-sm">
                         {formatCurrency(service.basePrice)} setup
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="border-t border-gray-600 pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h3 className="text-white font-semibold text-base sm:text-lg">Package Summary</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPricing(!showPricing)}
                className="w-fit text-xs sm:text-sm"
              >
                {showPricing ? <Minus className="h-3 w-3 sm:h-4 sm:w-4" /> : <Plus className="h-3 w-3 sm:h-4 sm:w-4" />}
                <span className="ml-1">{showPricing ? 'Hide' : 'Show'} Pricing</span>
              </Button>
            </div>

            {showPricing && (
                <div className="space-y-3">
                <div className="flex justify-between items-center text-gray-300 text-sm">
                  <span>Base Price ({pricing.selectedCount} services)</span>
                  <span>{formatCurrency(pricing.basePrice)}</span>
                </div>
                
                {pricing.bundleDiscount > 0 && (
                  <div className="flex justify-between items-center text-green-400 text-sm">
                    <span>Multi-Service Bundle Discount (15%)</span>
                    <span>-{formatCurrency(pricing.bundleDiscount)}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex justify-between items-center text-white font-semibold text-base sm:text-lg">
                    <span>Total Setup Cost</span>
                    <span className="text-elevate-accent">{formatCurrency(pricing.finalBase)}</span>
                  </div>
                  
                  {pricing.monthlyPrice > 0 && (
                    <div className="flex justify-between items-center text-gray-300 mt-2 text-sm">
                      <span>Monthly Ongoing</span>
                      <span>{formatCurrency(pricing.monthlyPrice)}/month</span>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <Button className="w-full bg-elevate-accent hover:bg-elevate-accent-light text-white text-sm sm:text-base py-2 sm:py-3">
                    Get Custom Proposal for This Package
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
