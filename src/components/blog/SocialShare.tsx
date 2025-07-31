
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Share2, Twitter, Linkedin, Facebook, Link, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  title,
  url,
  description = '',
  className = ''
}) => {
  const { toast } = useToast();

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\n' + url)}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Article link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const openShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={`bg-white/5 border-white/10 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-white">Share this article</span>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openShare('twitter')}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Twitter className="h-3 w-3 mr-1" />
            Twitter
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => openShare('linkedin')}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Linkedin className="h-3 w-3 mr-1" />
            LinkedIn
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => openShare('facebook')}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Facebook className="h-3 w-3 mr-1" />
            Facebook
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => openShare('email')}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Mail className="h-3 w-3 mr-1" />
            Email
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Link className="h-3 w-3 mr-1" />
            Copy Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
