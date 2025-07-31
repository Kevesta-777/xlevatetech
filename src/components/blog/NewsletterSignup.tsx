import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [industry, setIndustry] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const industries = [
    'Healthcare',
    'Finance & Banking',
    'Real Estate',
    'Manufacturing',
    'Technology',
    'Government',
    'Education',
    'Retail & E-commerce',
    'Professional Services',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !industry || !consent) {
      toast({
        title: "Please complete all fields",
        description: "Email, industry selection, and consent are required.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('newsletter')
        .insert([{ email, industry }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        toast({
          title: "Successfully subscribed!",
          description: "You'll receive our weekly automation insights soon.",
        });
        
        // Reset form
        setEmail('');
        setIndustry('');
        setConsent(false);
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again later or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <Card className="bg-card border-border shadow-lg">
              <CardContent className="p-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to the Community!
                </h2>
                <p className="text-muted-foreground">
                  Thank you for subscribing. You'll receive our first newsletter within the next week.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left Side - Content */}
                <div className="p-8 lg:p-12">
                  <div className="flex items-center gap-3 mb-6">
                    <Mail className="h-8 w-8 text-primary" />
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                      Automation Intelligence Newsletter
                    </h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 text-lg">
                    Get weekly insights on automation trends, implementation strategies, and industry case studies.
                  </p>
                  
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      Expert analysis on emerging automation technologies
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      Step-by-step implementation guides
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      Exclusive case studies from industry leaders
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      Industry benchmarks and performance metrics
                    </li>
                  </ul>
                </div>
                
                {/* Right Side - Form */}
                <div className="bg-primary/5 p-2 lg:p-12">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className='px-6'>
                      <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background border-border"
                      />
                    </div>
                    
                    <div className='px-6'>
                      <label htmlFor="industry" className="block text-sm font-medium text-foreground mb-2">
                        Industry *
                      </label>
                      <Select value={industry} onValueChange={setIndustry} required>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((ind) => (
                            <SelectItem key={ind} value={ind.toLowerCase().replace(/\s+/g, '-')}>
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-start space-x-3 px-6">
                      <Checkbox
                        id="consent"
                        checked={consent}
                        onCheckedChange={(checked) => setConsent(checked as boolean)}
                        required
                        className="h-3 w-3 mt-0.5"
                      />
                      <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
                        I agree to receive email communications about automation insights, industry trends, and related content. I can unsubscribe at any time.
                      </label>
                    </div>
                    <div className='px-6'>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !email || !industry || !consent}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Subscribe to Newsletter
                        </>
                      )}
                    </Button>
                    </div>
                  </form>
                  <div className="text-xs text-muted-foreground text-center py-6">
                      We respect your privacy. Unsubscribe at any time.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};