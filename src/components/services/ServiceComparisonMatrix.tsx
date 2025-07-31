
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Star, TrendingDown } from 'lucide-react';

interface ComparisonData {
  feature: string;
  xlevate: string | boolean;
  enterprise: string | boolean;
  regional: string | boolean;
}

const comparisonData: ComparisonData[] = [
  {
    feature: 'AI Automation (Starter)',
    xlevate: '$3,999 + $499/month',
    enterprise: '$3,500-8,000+',
    regional: '$1,500-3,000'
  },
  {
    feature: 'AI Automation (Professional)',
    xlevate: '$5,999 + $699/month',
    enterprise: '$5,000-12,000+',
    regional: '$2,500-5,000'
  },
  {
    feature: 'System Migration (Standard)',
    xlevate: '$3,999 one-time',
    enterprise: '$5,000-15,000+',
    regional: '$2,000-6,000'
  },
  {
    feature: 'System Migration (Complex)',
    xlevate: '$6,999 one-time',
    enterprise: '$10,000-25,000+',
    regional: '$4,000-12,000'
  },
  {
    feature: 'Process Optimization (Analysis)',
    xlevate: '$2,499 + $399/mo',
    enterprise: '$150-350/hour',
    regional: '$75-200/hour'
  },
  {
    feature: 'QA Testing (Essential)',
    xlevate: '$1,999 per project',
    enterprise: '$2,000-5,000+',
    regional: '$800-2,000'
  },
  {
    feature: 'QA Testing (Premium)',
    xlevate: '$5,999 per project',
    enterprise: '$8,000-15,000+',
    regional: '$3,000-8,000'
  },
  {
    feature: 'Fixed-Fee Pricing',
    xlevate: true,
    enterprise: false,
    regional: false
  },
  {
    feature: 'Data Validation Guarantee',
    xlevate: true,
    enterprise: false,
    regional: true
  },
  {
    feature: 'Success Guarantee (30% time reduction)',
    xlevate: true,
    enterprise: false,
    regional: false
  },
  {
    feature: 'Flexible Support Included',
    xlevate: true,
    enterprise: false,
    regional: true
  }
];

export const ServiceComparisonMatrix = () => {
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);

  const renderCell = (value: string | boolean, isXlevate = false) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className={`h-5 w-5 ${isXlevate ? 'text-elevate-accent' : 'text-green-500'}`} />
      ) : (
        <X className="h-5 w-5 text-red-500" />
      );
    }
    
    return (
      <span className={`${isXlevate ? 'text-elevate-accent font-semibold' : 'text-gray-300'}`}>
        {value}
      </span>
    );
  };

  return (
    <Card className="bg-elevate-dark border-elevate-accent/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Star className="h-10 w-10 sm:h-5 sm:w-5 text-elevate-accent flex-shrink-0" />
          Service Comparison Matrix
          <div className="ml-auto flex items-center gap-1 text-sm bg-green-600/20 text-green-400 px-2 py-1 rounded">
            <TrendingDown className="h-4 w-4" />
            30-45% Savings
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-2 text-gray-300 font-medium">Service Feature</th>
                <th className="text-center py-3 px-2 text-elevate-accent font-semibold">
                  Xlevate Tech
                  <div className="text-xs font-normal text-gray-400 mt-1">Our Pricing</div>
                </th>
                <th className="text-center py-3 px-2 text-gray-300 font-medium">
                  Enterprise Firms
                  <div className="text-xs font-normal text-gray-400 mt-1">Big 4 Consulting</div>
                </th>
                <th className="text-center py-3 px-2 text-gray-300 font-medium">
                  Regional Agencies
                  <div className="text-xs font-normal text-gray-400 mt-1">Local Competitors</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-700/50 transition-colors duration-200 ${
                    highlightedRow === index ? 'bg-elevate-accent/5' : 'hover:bg-gray-800/30'
                  }`}
                  onMouseEnter={() => setHighlightedRow(index)}
                  onMouseLeave={() => setHighlightedRow(null)}
                >
                  <td className="py-4 px-2">
                    <span className="text-white font-medium">{row.feature}</span>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="flex items-center justify-center">
                      {renderCell(row.xlevate, true)}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="flex items-center justify-center">
                      {renderCell(row.enterprise)}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-center">
                    <div className="flex items-center justify-center">
                      {renderCell(row.regional)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 p-4 bg-elevate-accent/10 rounded-lg border border-elevate-accent/20">
          <p className="text-white font-semibold mb-2">Why Choose Xlevate Tech?</p>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>• <span className="text-elevate-accent">45% below enterprise rates</span> with the same quality</li>
            <li>• <span className="text-elevate-accent">Fixed-fee pricing</span> eliminates billing uncertainty</li>
            <li>• <span className="text-elevate-accent">Success guarantee</span> ensures measurable results</li>
            <li>• <span className="text-elevate-accent">Flexible support included</span> at no extra cost</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
