import { Clock, User, Share2, Linkedin, Twitter, Mail } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';

interface FeaturedArticleProps {
  article: {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    company?: string;
    readTime: number;
    category: string;
    image: string;
    publishDate: string;
    tags: string[];
    slug: string;
    sourceUrl?: string;
  };
}

export const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/blog/${article.slug}`;
    const text = `${article.title} - ${article.excerpt}`;

    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <Card className="mb-12 bg-white/5 border-white/10 overflow-hidden group">
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-primary via-primary/80 to-accent relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-sm opacity-80">Daily Tech Giant Spotlight</div>
            <div className="text-lg font-semibold">{article.company || 'Tech Innovation'}</div>
          </div>
        </div>
        <Badge className="absolute top-4 left-4 bg-accent text-black font-semibold">Featured Article</Badge>
        <div className="absolute top-4 right-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            {showShareMenu && (
              <div className="absolute right-0 top-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2 z-10">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('linkedin')}
                    className="text-white hover:bg-white/20"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                    className="text-white hover:bg-white/20"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('email')}
                    className="text-white hover:bg-white/20"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-4">
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {article.category}
          </Badge>
          <div className="flex items-center text-gray-400 text-sm">
            <User className="h-4 w-4 mr-1" />
            {article.author} {article.company && `• ${article.company}`}
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {article.readTime} min read
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">{article.title}</h2>
        <p className="text-gray-300 mb-6 text-lg leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-white/30 text-gray-300">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex gap-3">
            <Button 
              className="bg-primary hover:bg-primary/80 px-6 py-2"
              onClick={() => window.location.href = `/blog/${article.slug}`}
            >
              Read Full Article
            </Button>
            {article.sourceUrl && (
              <Button 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-4 py-2"
                onClick={() => window.open(article.sourceUrl, '_blank')}
              >
                View Original
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};