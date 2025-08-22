import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Clock, CheckCircle, Lock, Award, Users, Zap } from "lucide-react";
import Globe from "../components/Globe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  console.log('TEST - Contact page loaded');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Set document title
    document.title = "Contact - Xlevate Tech | Start Your Automation Journey";
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get your free automation consultation with Xlevate Tech. Transform your operations with AI and process automation solutions.');
    }
  }, []);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Get form data
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string || '';
    const phone = formData.get('phone') as string || '';
    const industry = formData.get('industry') as string || '';
    const message = formData.get('message') as string;

    // Parse name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Save to Supabase leads table
    const { error } = await supabase
      .from('leads')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase().trim(),
        company_name: company.trim() || null,
        phone: phone.trim() || null,
        industry_sector: industry || null,
        pain_points: message.trim(),
        source: 'form',
        stage: 'captured',
        notes: 'Submitted via website contact form',
        opt_out: false,
        budget_qualified: false
      });

    if (error) {
      throw error;
    }

    // Success
    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours with your free consultation details."
    });
    
    // Reset form
    form.reset();

  } catch (error) {
    console.error('Contact form submission error:', error);
    toast({
      title: "Error",
      description: "Sorry, there was an error sending your message. Please try again."
    });
  } finally {
    setIsSubmitting(false);
  }
};

return <div className="min-h-screen bg-elevate-dark">
       <header>
        <Navbar />
      </header>
      
      <main role="main" className="pt-20">
        {/* Header Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6">
              Start Your{" "}
              <span className="text-elevate-accent">Automation Journey</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Ready to transform your operations? Let's discuss your biggest challenges and create a custom solution.
            </p>
          </div>
        </section>

        {/* Main Contact Section - Two Column Layout */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              {/* LEFT COLUMN - Contact Form */}
              <div className="bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 rounded-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white font-medium">
                      Name <span className="text-red-400">*</span>
                    </Label>
                    <Input id="name" name="name" type="text" required className="bg-elevate-dark/80 border-elevate-accent/30 text-white placeholder-gray-400 focus:border-elevate-accent" placeholder="Your full name" />
                  </div>

                  {/* Business Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-medium">
                      Business Email <span className="text-red-400">*</span>
                    </Label>
                    <Input id="email" name="email" type="email" required className="bg-elevate-dark/80 border-elevate-accent/30 text-white placeholder-gray-400 focus:border-elevate-accent" placeholder="your.email@company.com" />
                  </div>

                  {/* Company Field */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white font-medium">
                      Company <span className="text-red-400">*</span>
                    </Label>
                    <Input id="company" name="company" type="text" required className="bg-elevate-dark/80 border-elevate-accent/30 text-white placeholder-gray-400 focus:border-elevate-accent" placeholder="Your company name" />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white font-medium">
                      Phone <span className="text-gray-400">(optional)</span>
                    </Label>
                    <Input id="phone" name="phone" type="tel" className="bg-elevate-dark/80 border-elevate-accent/30 text-white placeholder-gray-400 focus:border-elevate-accent" placeholder="(555) 123-4567" />
                  </div>

                  {/* Industry Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-white font-medium">
                      Industry
                    </Label>
                    <Select name="industry">
                      <SelectTrigger className="bg-elevate-dark/80 border-elevate-accent/30 text-white focus:border-elevate-accent">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-elevate-dark border-elevate-accent/30">
                        <SelectItem value="finance" className="text-white hover:bg-elevate-accent/20">Finance</SelectItem>
                        <SelectItem value="healthcare" className="text-white hover:bg-elevate-accent/20">Healthcare</SelectItem>
                        <SelectItem value="real-estate" className="text-white hover:bg-elevate-accent/20">Real Estate</SelectItem>
                        <SelectItem value="pharmaceutical" className="text-white hover:bg-elevate-accent/20">Pharmaceutical</SelectItem>
                        <SelectItem value="other" className="text-white hover:bg-elevate-accent/20">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Interest Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="interest" className="text-white font-medium">
                      Primary Interest
                    </Label>
                    <Select name="interest">
                      <SelectTrigger className="bg-elevate-dark/80 border-elevate-accent/30 text-white focus:border-elevate-accent">
                        <SelectValue placeholder="What interests you most?" />
                      </SelectTrigger>
                      <SelectContent className="bg-elevate-dark border-elevate-accent/30">
                        <SelectItem value="automation" className="text-white hover:bg-elevate-accent/20">Automation</SelectItem>
                        <SelectItem value="data" className="text-white hover:bg-elevate-accent/20">Data</SelectItem>
                        <SelectItem value="process" className="text-white hover:bg-elevate-accent/20">Process</SelectItem>
                        <SelectItem value="qa" className="text-white hover:bg-elevate-accent/20">QA</SelectItem>
                        <SelectItem value="other" className="text-white hover:bg-elevate-accent/20">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white font-medium">
                      Describe your biggest operational challenge
                    </Label>
                    <Textarea id="message" name="message" rows={4} className="bg-elevate-dark/80 border-elevate-accent/30 text-white placeholder-gray-400 focus:border-elevate-accent resize-none" placeholder="Tell us about the operational bottlenecks, manual processes, or inefficiencies that are costing your business time and money..." />
                  </div>

                  {/* Privacy Policy Notice */}
                  <div className="text-sm text-gray-400 leading-relaxed">
                    By submitting your personal information to Xlevate Tech, you are agreeing to Xlevate Tech's Privacy Policy on how your information may be used<span className="text-red-400">*</span>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-elevate-accent hover:bg-elevate-accent-light text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none">
                    {isSubmitting ? "Sending..." : "Request a Proposal"}
                  </Button>

                  {/* Trust Elements */}
                  <div className="flex items-center justify-center gap-6 pt-4 border-t border-elevate-accent/20">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Lock className="h-4 w-4 text-elevate-accent" />
                      <span>Private</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <CheckCircle className="h-4 w-4 text-elevate-accent" />
                      <span>Verified</span>
                    </div>
                  </div>
                </form>
              </div>

              {/* RIGHT COLUMN - Contact Info */}
              <div className="space-y-8">
                
                {/* Direct Contact Info */}
                <div className="bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Direct Contact</h3>
                  
                  <div className="space-y-4">
                    <a href="mailto:raj.dalal@xlevatetech.com" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                      <Mail className="h-5 w-5 text-elevate-accent group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">sales@xlevatetech.com</span>
                    </a>
                    
                    <a href="tel:+18479210915" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300 group">
                      <Phone className="h-5 w-5 text-elevate-accent group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">847-921-0915</span>
                    </a>
                    
                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin className="h-5 w-5 text-elevate-accent" />
                      <span className="font-medium">Servicing Chicago & Nationwide</span>
                    </div>
                  </div>

                  {/* Globe Component */}
                  <div className="mt-8">
                    <Globe />
                  </div>

                  {/* Response Guarantee */}
                  <div className="mt-6 pt-6 border-t border-elevate-accent/20">
                    <div className="flex items-center gap-3 text-elevate-accent mb-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">24-hour response time</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock className="h-5 w-5 text-elevate-accent" />
                      <div>
                        <div>Business Hours: Mon-Fri 9am-6pm CST</div>
                        <div>Sat-Sun: By Appointment</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Trust & Credibility Section */}
                <div className="bg-gradient-to-br from-elevate-dark to-elevate-dark/50 border border-elevate-accent/20 rounded-2xl p-8">
                  <h3 className="text-xl font-bold text-white mb-6 text-center">Why Choose Xlevate Tech?</h3>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-elevate-accent/5 border border-elevate-accent/10 hover:bg-elevate-accent/10 transition-colors duration-300">
                      <div className="p-2 rounded-full bg-elevate-accent/20">
                        <Award className="h-6 w-6 text-elevate-accent" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Proven Results</h4>
                        <p className="text-gray-400 text-sm">20+ hours saved monthly for our clients</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-elevate-accent/5 border border-elevate-accent/10 hover:bg-elevate-accent/10 transition-colors duration-300">
                      <div className="p-2 rounded-full bg-elevate-accent/20">
                        <Users className="h-6 w-6 text-elevate-accent" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Expert Team</h4>
                        <p className="text-gray-400 text-sm">Certified automation specialists with 10+ years experience</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-elevate-accent/5 border border-elevate-accent/10 hover:bg-elevate-accent/10 transition-colors duration-300">
                      <div className="p-2 rounded-full bg-elevate-accent/20">
                        <Zap className="h-6 w-6 text-elevate-accent" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">Rapid Implementation</h4>
                        <p className="text-gray-400 text-sm">See results in 2-6 weeks with our agile approach</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-elevate-accent/20 text-center">
                    <div className="flex items-center justify-center gap-2 text-elevate-accent">
                      <Lock className="h-5 w-5 animate-pulse" />
                      <span className="font-semibold">100% Confidential Consultation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer>
        <Footer />
      </footer>
      <ScrollToTop />
    </div>;
};
export default Contact;