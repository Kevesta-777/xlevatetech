
import React, { useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const FooterNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <div className="text-center p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
        <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
        <p className="text-green-300 text-sm font-medium">Successfully subscribed!</p>
        <p className="text-gray-400 text-xs mt-1">You'll receive weekly automation insights.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="h-6 w-6 text-[#70EDFF]" />
        <h3 className="text-white font-semibold text-sm">Weekly Automation Intelligence</h3>
      </div>
      <p className="text-gray-300 text-xs mb-4 leading-relaxed">
        Get exclusive insights, case studies, and implementation guides delivered to your inbox.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="your.email@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#70EDFF] text-sm h-10"
          aria-label="Email address for newsletter subscription"
        />
        <Button
          type="submit"
          disabled={isSubmitting || !email}
          className="w-full bg-[#70EDFF] hover:bg-[#5cd4ff] text-[#1a1f2c] font-semibold text-sm h-10"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Subscribing...
            </>
          ) : (
            'Subscribe Free'
          )}
        </Button>
      </form>
      
      <p className="text-gray-500 text-xs mt-2 text-center">
        GDPR compliant. Unsubscribe anytime.
      </p>
    </div>
  );
};
