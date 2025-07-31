
import { useState, useEffect } from "react";
import { Calculator, TrendingUp, Clock, DollarSign } from "lucide-react";

export const ROICalculator = () => {
  const [hoursWasted, setHoursWasted] = useState(40);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [employees, setEmployees] = useState(10);
  const [animatedSavings, setAnimatedSavings] = useState(0);

  const weeklySavings = hoursWasted * hourlyRate * employees;
  const monthlySavings = weeklySavings * 4.33;
  const yearlySavings = monthlySavings * 12;

  // Animate the savings counter
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = yearlySavings / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep < steps) {
        setAnimatedSavings(prev => Math.min(prev + increment, yearlySavings));
        currentStep++;
      } else {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [yearlySavings]);

  return (
    <div className="bg-gradient-to-br from-elevate-dark/90 to-elevate-dark/70 backdrop-blur-sm border border-elevate-accent/20 rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <Calculator className="h-8 w-8 text-elevate-accent" />
          <h3 className="text-2xl font-bold text-white">ROI Calculator</h3>
        </div>
        <p className="text-gray-300">See how much you could save with automation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Hours wasted per employee/week</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-elevate-accent" />
              <input
                type="range"
                min="10"
                max="80"
                value={hoursWasted}
                onChange={(e) => setHoursWasted(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>10</span>
                <span className="text-elevate-accent font-bold">{hoursWasted}h</span>
                <span>80</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Average hourly rate ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-elevate-accent" />
              <input
                type="range"
                min="25"
                max="200"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>$25</span>
                <span className="text-elevate-accent font-bold">${hourlyRate}</span>
                <span>$200</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Number of employees</label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-elevate-accent" />
              <input
                type="range"
                min="1"
                max="100"
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>1</span>
                <span className="text-elevate-accent font-bold">{employees}</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Display */}
        <div className="bg-gradient-to-br from-elevate-accent/20 to-purple-500/20 rounded-xl p-6 border border-elevate-accent/30">
          <h4 className="text-xl font-bold text-white mb-6 text-center">Your Potential Savings</h4>
          
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-elevate-accent mb-2">
                ${Math.round(animatedSavings).toLocaleString()}
              </div>
              <div className="text-gray-300">Per Year</div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">${Math.round(monthlySavings).toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Monthly</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">${Math.round(weeklySavings).toLocaleString()}</div>
                <div className="text-gray-400 text-sm">Weekly</div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20">
            <button className="w-full bg-elevate-accent hover:bg-elevate-accent-light text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Get Your Custom Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
