
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, DollarSign, TrendingUp, Clock } from 'lucide-react';

export const CostSavingsCalculator = () => {
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(20);
  const [hourlyRate, setHourlyRate] = useState<number>(150);
  const [projectDuration, setProjectDuration] = useState<number>(12);
  const [savings, setSavings] = useState({
    hourlyTotal: 0,
    xlevateTotal: 0,
    totalSavings: 0,
    percentageSavings: 0
  });

  useEffect(() => {
    const hourlyTotal = hoursPerWeek * 52 * (projectDuration / 12) * hourlyRate;
    const xlevateTotal = 6000 + (800 * projectDuration); // Process optimization example with new pricing
    const totalSavings = hourlyTotal - xlevateTotal;
    const percentageSavings = hourlyTotal > 0 ? (totalSavings / hourlyTotal) * 100 : 0;

    setSavings({
      hourlyTotal,
      xlevateTotal,
      totalSavings,
      percentageSavings
    });
  }, [hoursPerWeek, hourlyRate, projectDuration]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="bg-elevate-dark border-elevate-accent/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="h-10 w-10 sm:h-5 sm:w-5 text-elevate-accent flex-shrink-0" />
          Cost Savings Calculator
          <span className="text-sm text-gray-400 font-normal ml-2">vs Hourly Billing</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="hours" className="text-white">Hours per week needed</Label>
              <Input
                id="hours"
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="bg-gray-800 border-gray-600 text-white mt-1"
                min="1"
                max="80"
              />
            </div>
            
            <div>
              <Label htmlFor="rate" className="text-white">Consultant hourly rate ($)</Label>
              <Input
                id="rate"
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="bg-gray-800 border-gray-600 text-white mt-1"
                min="50"
                max="500"
              />
            </div>
            
            <div>
              <Label htmlFor="duration" className="text-white">Project duration (months)</Label>
              <Input
                id="duration"
                type="number"
                value={projectDuration}
                onChange={(e) => setProjectDuration(Number(e.target.value))}
                className="bg-gray-800 border-gray-600 text-white mt-1"
                min="1"
                max="24"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-red-400" />
                <span className="text-red-400 font-medium">Hourly Billing Cost</span>
              </div>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(savings.hourlyTotal)}</p>
              <p className="text-sm text-gray-400">{hoursPerWeek} hrs/week × {projectDuration} months</p>
            </div>

            <div className="p-4 bg-elevate-accent/10 border border-elevate-accent/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-elevate-accent" />
                <span className="text-elevate-accent font-medium">Xlevate Fixed Price</span>
              </div>
              <p className="text-2xl font-bold text-elevate-accent">{formatCurrency(savings.xlevateTotal)}</p>
              <p className="text-sm text-gray-400">Setup + monthly optimization</p>
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-medium">Your Savings</span>
              </div>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(savings.totalSavings)}</p>
              <p className="text-sm text-gray-400">
                {savings.percentageSavings > 0 ? `${savings.percentageSavings.toFixed(0)}% savings` : 'No savings'}
              </p>
            </div>
          </div>
        </div>

        {savings.percentageSavings > 0 && (
          <div className="mt-6 p-4 bg-elevate-accent/5 border border-elevate-accent/10 rounded-lg">
            <h4 className="text-white font-semibold mb-2">Additional Benefits with Fixed-Fee Model:</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• No billing surprises or scope creep charges</li>
              <li>• Predictable budget planning and cash flow</li>
              <li>• Incentivized efficiency (we work faster, not longer)</li>
              <li>• 6 months support included at no extra cost</li>
              <li>• Success guarantee with 30% time reduction promise</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
