
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError('');
    
    try {
      const { error: submissionError } = await supabase.functions.invoke('newsletter', {
        body: { email }
      });

      if (submissionError) {
        throw new Error(submissionError.message);
      }
      
      setIsSuccess(true);
      setEmail('');
    } catch (err: any) {
      console.error('Newsletter subscription error:', err);
      setError(err.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-900/20 border border-green-500/30 rounded-md p-4 text-center">
        <svg className="w-6 h-6 text-accent-green mx-auto mb-2" fill="none" viewBox="0 0 24 24">
          <use href="/assets/sprite.svg#icon-tick" />
        </svg>
        <p className="text-sm font-medium text-green-300">Thank you for subscribing!</p>
        <p className="text-xs text-green-400 mt-1">You'll receive our newsletter with the latest insights.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative w-full">
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Your email address"
          aria-label="Email"
          className="h-12 pl-4 pr-12 w-full bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 hover:border-[#4A90E2] focus:border-[#4A90E2] focus:ring-[#4A90E2] transition-all duration-300"
        />
        <svg 
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none z-10" 
          fill="none" 
          viewBox="0 0 24 24"
          style={{ transform: 'translateY(-50%)' }}
        >
          <use href="/assets/sprite.svg#icon-mail" />
        </svg>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting || !email}
        aria-label="Subscribe"
        className="h-12 min-w-[44px] w-full bg-[#4A90E2] hover:bg-[#3A80D2] text-white font-medium transition-all duration-300 touch-manipulation"
      >
        {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
      </Button>
      {/* {error && (
        <p className="text-red-400 text-xs">{error}</p>
      )} */}
      { isSubmitting && <p className="text-gray-500 text-xs text-center">
        Subscribe to Newsletter functionality to be implemented.
      </p> }
      <p className="text-gray-500 text-xs text-center">
        GDPR compliant. We don't share your data.
      </p>
    </form>
  );
};
