import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Sparkles, Calculator, TrendingUp, Clock, DollarSign, BarChart3, Building2, HeartPulse, TrendingDown, Download, Database, Settings, Zap, Target, PieChart, Activity, MousePointer, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { EnhancedXlevateScout } from "@/components/EnhancedXlevateScout";
import DataSourcesModal from "@/components/roi/DataSourcesModal";
import AnimatedMetric from "@/components/roi/AnimatedMetric";
import DataFlowAnimation from "@/components/roi/DataFlowAnimation";
import ROICharts from "@/components/roi/ROICharts";
const ROICalculator = () => {
  const [annualRevenue, setAnnualRevenue] = useState([2000000]);
  const [employees, setEmployees] = useState("11-50");
  const [industry, setIndustry] = useState("finance");
  const [weeklyHours, setWeeklyHours] = useState([40]);
  const [showDataSources, setShowDataSources] = useState(false);
  const [stickyResults, setStickyResults] = useState(false);

  // Updated 2025 industry data with citations
  const industryData = {
    finance: {
      timeReduction: {
        min: 45,
        max: 70
      },
      errorReduction: {
        min: 50,
        max: 80
      },
      avgROI: 195,
      costPerError: 2800,
      hourlyRate: 92,
      icon: TrendingUp,
      color: "#4A90E2",
      description: "Financial services automation",
      citations: ["McKinsey 2025", "Deloitte FinTech Report"]
    },
    healthcare: {
      timeReduction: {
        min: 55,
        max: 75
      },
      errorReduction: {
        min: 65,
        max: 85
      },
      avgROI: 225,
      costPerError: 3500,
      hourlyRate: 85,
      icon: HeartPulse,
      color: "#00C9A7",
      description: "Healthcare process automation",
      citations: ["Gartner Healthcare IT 2025", "PwC Health Study"]
    },
    realestate: {
      timeReduction: {
        min: 40,
        max: 65
      },
      errorReduction: {
        min: 45,
        max: 75
      },
      avgROI: 175,
      costPerError: 2100,
      hourlyRate: 72,
      icon: Building2,
      color: "#70EDFF",
      description: "Real estate technology adoption",
      citations: ["NAR Tech Survey 2025", "PropTech Analytics"]
    }
  };
  const currentIndustry = industryData[industry as keyof typeof industryData];
  const avgTimeReduction = (currentIndustry.timeReduction.min + currentIndustry.timeReduction.max) / 2;
  const avgErrorReduction = (currentIndustry.errorReduction.min + currentIndustry.errorReduction.max) / 2;

  // Enhanced calculations with 2025 market data
  const annualHours = weeklyHours[0] * 52;
  const timeSavings = Math.round(annualHours * (avgTimeReduction / 100));
  const costSavings = timeSavings * currentIndustry.hourlyRate;
  const errorCostReduction = Math.round(annualRevenue[0] * 0.025 * avgErrorReduction / 100);
  const totalSavings = costSavings + errorCostReduction;
  const implementationCost = Math.min(annualRevenue[0] * 0.12, 180000); // Updated 2025 costs
  const roi = Math.round((totalSavings - implementationCost) / implementationCost * 100);
  const paybackMonths = Math.ceil(implementationCost / (totalSavings / 12));
  const currentCosts = annualHours * currentIndustry.hourlyRate;
  const projectedCosts = (annualHours - timeSavings) * currentIndustry.hourlyRate;

  // Scroll effect for sticky results
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setStickyResults(scrollPosition > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const generatePDFReport = () => {
    // Placeholder for PDF generation functionality
    console.log('Generating PDF report with current calculations...');
  };
  return <TooltipProvider>
      <div className="min-h-screen bg-elevate-dark relative">
        <Helmet>
          <title>Automated ROI Calculator 2025 | Xlevate Tech</title>
          <meta name="description" content="Calculate your 2025 AI automation ROI with live market data. Industry benchmarks for Finance, Healthcare & Real Estate." />
          <script type="application/ld+json">
            {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Automation ROI Calculator 2025",
            "url": "https://xlevatetech.com/automation-roi-calculator",
            "description": "Calculate potential savings from AI automation with 2025 industry benchmarks",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web Browser"
          })}
          </script>
        </Helmet>

        {/* Data Flow Animation Background - Removed for better performance */}

        {/* Sticky Results Summary */}
        {stickyResults && <div className="roi-sticky-results">
            <div className="container mx-auto roi-sticky-content">
              <div className="roi-sticky-metrics">
                <span className="text-white">ROI: <strong className="text-[#70EDFF]">{roi}%</strong></span>
                <span className="text-white">Savings: <strong className="text-[#70EDFF]">${totalSavings.toLocaleString()}/year</strong></span>
                <span className="text-white">Payback: <strong className="text-[#70EDFF]">{paybackMonths} months</strong></span>
              </div>
              <Button onClick={generatePDFReport} className="roi-sticky-button bg-[#4A90E2] hover:bg-[#4A90E2]/90">
                <Download className="w-4 h-4 mr-1" />
                Download Report
              </Button>
            </div>
          </div>}

        <header>pt-[64px] md:pt-0
          <Navbar />
        </header>
        
        <main className="relative z-10 pt-[64px] md:pt-0">
          <div className="roi-calculator-container mx-auto pt-24 md:pt-32 lg:pt-40 pb-20 px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16 mt-8 md:mt-12">
              <div id="title-wrapper" className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="text-[#70EDFF] w-12 h-12 sm:w-10 sm:h-10 ml-4 " />
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white">
                  2025 AI Automation ROI Calculator
                </h1>  
              </div>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                Calculate your potential savings with real-time market data and industry benchmarks
              </p>
              
              {/* Controls Bar */}
              <div className="flex items-center justify-center gap-6 mb-4">
                <Button variant="outline" size="sm" onClick={() => setShowDataSources(true)} className="border-white/20 text-white hover:bg-white/10">
                  <Database className="w-4 h-4 mr-2" />
                  Data Sources
                </Button>
              </div>
            </div>

            {/* Main Calculator Section */}
            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {/* Input Panel */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calculator className="h-12 w-12 sm:w-6 sm:h-6 text-[#70EDFF]" />
                    Business Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Annual Revenue with Tooltip */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <label className="text-white font-medium">
                        Annual Revenue: ${annualRevenue[0].toLocaleString()}
                      </label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Your company's total annual revenue used for calculating relative automation impact</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="roi-slider-container">
                      <Slider value={annualRevenue} onValueChange={setAnnualRevenue} max={10000000} min={500000} step={100000} className="w-full" />
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>$500K</span>
                      <span>$10M+</span>
                    </div>
                  </div>

                  {/* Employees */}
                  <div>
                    <label className="text-white font-medium mb-3 block items-center gap-2">
                      Number of Employees
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Team size affects implementation complexity and potential savings</p>
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <Select value={employees} onValueChange={setEmployees}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-elevate-dark border-white/20">
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="200+">200+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Industry Selection with Icons */}
                  <div>
                    <label className="text-white font-medium mb-4 block">Select Your Industry</label>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(industryData).map(([key, data]) => {
                      const Icon = data.icon;
                      const isSelected = industry === key;
                      return <button key={key} onClick={() => setIndustry(key)} className={`px-2 py-4 rounded-lg border transition-all duration-300 ${isSelected ? 'border-[#70EDFF] bg-[#70EDFF]/20 transform scale-105' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}>
                            <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-[#70EDFF]' : 'text-gray-400'}`} />
                            <div className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                              {key === 'finance' ? 'Finance' : key === 'healthcare' ? 'Healthcare' : 'Real Estate'}
                            </div>
                          </button>;
                    })}
                    </div>
                  </div>

                  {/* Weekly Manual Hours with Real-time Update */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <label className="text-white font-medium">
                        Weekly Manual Hours: {weeklyHours[0]} hours
                      </label>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Time spent on repetitive tasks that could be automated</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="roi-slider-container">
                      <Slider value={weeklyHours} onValueChange={setWeeklyHours} max={100} min={10} step={5} className="w-full" />
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>10 hrs/week</span>
                      <span>100 hrs/week</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Dashboard */}
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-center gap-2">
                    <TrendingUp className="h-12 w-12 sm:w-6 sm:h-6 text-[#70EDFF]" />
                    Your 2025 ROI Projection
                    <Tooltip>
                      <TooltipTrigger>
                        <Database className="w-4 h-4 text-gray-400 ml-auto" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm">
                          <p>Data sources: {currentIndustry.citations.join(', ')}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="roi-metrics-grid grid grid-cols-2 gap-4">
                    <AnimatedMetric icon={Clock} value={timeSavings} label="Hours Saved/Year" className="roi-metric-card bg-blue-500/20 border border-blue-500/30" iconClassName="text-[#70EDFF]" delay={200} />
                    <AnimatedMetric icon={DollarSign} value={costSavings} label="Labor Cost Savings" prefix="$" className="roi-metric-card bg-green-500/20 border border-green-500/30" iconClassName="text-green-400" delay={400} />
                  </div>

                  <AnimatedMetric icon={BarChart3} value={roi} label="12-Month ROI" suffix="%" className="roi-metric-card bg-purple-500/20 border border-purple-500/30" iconClassName="text-purple-400" delay={600} />

                  <div className="roi-metrics-grid grid grid-cols-2 gap-4">
                    <AnimatedMetric icon={Target} value={paybackMonths} label="Payback Period (months)" className="roi-metric-card bg-orange-500/20 border border-orange-500/30" iconClassName="text-orange-400" delay={800} />
                    <AnimatedMetric icon={TrendingDown} value={Math.round(avgErrorReduction)} label="Error Reduction" suffix="%" className="roi-metric-card bg-cyan-500/20 border border-cyan-500/30" iconClassName="text-cyan-400" delay={1000} />
                  </div>

                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-[#70EDFF]" />
                      <span className="text-sm text-gray-300">Industry Benchmark: {currentIndustry.avgROI}% ROI</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      *Based on 2025 {currentIndustry.description} data
                    </div>
                  </div>

                  <Button onClick={generatePDFReport} className="roi-button w-full bg-[#4A90E2] hover:bg-[#4A90E2]/90 text-white" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Charts */}
            <ROICharts industry={industry} timeSavings={timeSavings} costSavings={costSavings} errorReduction={avgErrorReduction} roi={roi} currentCosts={currentCosts} projectedCosts={projectedCosts} />

            {/* 2025 Industry Benchmarks */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-12 hover:bg-white/10 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                  <PieChart className="h-12 w-12 sm:w-6 sm:h-6 text-[#70EDFF]" />
                  2025 Industry Benchmarks
                  <Tooltip>
                    <TooltipTrigger>
                      <MousePointer className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Click industry names for detailed insights</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="roi-benchmarks-table">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-4 px-4 font-semibold">Metric</th>
                        <th className="text-center py-4 px-4 font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <TrendingUp className="w-4 h-4 text-[#4A90E2]" />
                            Finance
                          </div>
                        </th>
                        <th className="text-center py-4 px-4 font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <HeartPulse className="w-4 h-4 text-[#00C9A7]" />
                            Healthcare
                          </div>
                        </th>
                        <th className="text-center py-4 px-4 font-semibold">
                          <div className="flex items-center justify-center gap-2">
                            <Building2 className="w-4 h-4 text-[#70EDFF]" />
                            Real Estate
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-medium">Time Reduction</td>
                        <td className="text-center py-4 px-4">45-70%</td>
                        <td className="text-center py-4 px-4">55-75%</td>
                        <td className="text-center py-4 px-4">40-65%</td>
                      </tr>
                      <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-medium">Error Reduction</td>
                        <td className="text-center py-4 px-4">50-80%</td>
                        <td className="text-center py-4 px-4">65-85%</td>
                        <td className="text-center py-4 px-4">45-75%</td>
                      </tr>
                      <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-medium">Hourly Rate</td>
                        <td className="text-center py-4 px-4">${industryData.finance.hourlyRate}</td>
                        <td className="text-center py-4 px-4">${industryData.healthcare.hourlyRate}</td>
                        <td className="text-center py-4 px-4">${industryData.realestate.hourlyRate}</td>
                      </tr>
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-medium">Avg. ROI (2025)</td>
                        <td className="text-center py-4 px-4 text-green-400 font-bold">{industryData.finance.avgROI}%</td>
                        <td className="text-center py-4 px-4 text-green-400 font-bold">{industryData.healthcare.avgROI}%</td>
                        <td className="text-center py-4 px-4 text-green-400 font-bold">{industryData.realestate.avgROI}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-[#70EDFF]" />
                    <span className="text-sm font-semibold text-white">2025 Market Update</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Industry benchmarks updated with latest Q4 2024 and Q1 2025 automation deployment data. 
                    ROI calculations include advanced AI integration costs and next-generation process automation benefits.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2025 Case Study Snapshots */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Building2 className="h-12 w-12 sm:w-8 sm:h-8 text-[#70EDFF] group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-[#70EDFF] font-bold text-lg">Real Estate</h3>
                      <span className="text-xs text-gray-400">37% ROI</span>
                    </div>
                  </div>
                  <ul className="text-gray-300 space-y-3">
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-bold">34K annual savings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      15-20 hrs/wk time savings
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-400" />
                      75% error reduction
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <HeartPulse className="h-12 w-12 sm:w-8 sm:h-8 text-[#00C9A7] group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-[#00C9A7] font-bold text-lg">Pharmacy</h3>
                      <span className="text-xs text-gray-400">40% ROI</span>
                    </div>
                  </div>
                  <ul className="text-gray-300 space-y-3">
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-bold">28K annual savings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      20+ hrs/wk time savings
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-400" />
                      75-80% error reduction
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-12 w-12 sm:w-8 sm:h-8 text-[#4A90E2] group-hover:scale-110 transition-transform" />
                    <div>
                      <h3 className="text-[#4A90E2] font-bold text-lg">Wealth Management</h3>
                      <span className="text-xs text-gray-400">76% ROI</span>
                    </div>
                  </div>
                  <ul className="text-gray-300 space-y-3">
                    <li className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-bold">42K annual savings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-400" />
                      12-15 hrs/wk time savings
                    </li>
                    <li className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-400" />
                      90% error reduction
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced CTA Section */}
            <Card className="bg-gradient-to-r from-[#4A90E2] to-[#70EDFF] border-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-white/5"></div>
              <CardContent className="p-5 sm:p-10 text-center relative z-10">
                <div className="flex items-start justify-center sm:items-center gap-0 sm:gap-2 mb-6">
                  <Sparkles className="absolute w-12 h-12 sm:w-8 sm:h-8 text-white" />
                  <h2 className="text-3xl md:text-4xl font-bold text-white">  
                    Start Your Automation Journey
                  </h2>

                </div>
                <p className="text-white/90 mb-8 max-w-3xl mx-auto text-lg">
                  Get a personalized 2025 automation roadmap with detailed implementation timeline, 
                  cost projections, and industry-specific recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button onClick={generatePDFReport} size="lg" variant="secondary" className="bg-white text-[#4A90E2] hover:bg-white/90 min-w-[200px]">
                    <Download className="w-5 h-5 mr-2" />
                    Download Full Report
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#4A90E2] min-w-[200px]" asChild>
                    <a href="https://calendly.com/raj-dalal-xlevatetech" target="_blank" rel="noopener noreferrer">
                      <Activity className="w-5 h-5 mr-2" />
                      Schedule Assessment
                    </a>
                  </Button>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/70">
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Free consultation
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    30-minute session
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    Custom ROI analysis
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <footer>
          <Footer />
        </footer>
        <ScrollToTop />
        <EnhancedXlevateScout />
        {/* Data Sources Modal */}
        <DataSourcesModal open={showDataSources} onOpenChange={setShowDataSources} />
      </div>
    </TooltipProvider>;
};
export default ROICalculator;