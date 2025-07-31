import { useState } from 'react';
import { Heart, Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ArticleEngagementProps {
  articleId: string;
  initialLikes?: number;
  initialBookmarked?: boolean;
  className?: string;
}

export const ArticleEngagement = ({ 
  articleId, 
  initialLikes = 0, 
  initialBookmarked = false,
  className = '' 
}: ArticleEngagementProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsLiked(!isLiked);
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
      
      // Store in localStorage for persistence
      const likedArticles = JSON.parse(localStorage.getItem('xlevate-liked-articles') || '[]');
      if (isLiked) {
        const updated = likedArticles.filter((id: string) => id !== articleId);
        localStorage.setItem('xlevate-liked-articles', JSON.stringify(updated));
      } else {
        localStorage.setItem('xlevate-liked-articles', JSON.stringify([...likedArticles, articleId]));
      }

      toast({
        title: isLiked ? "Like removed" : "Article liked!",
        description: isLiked ? "Removed from your liked articles." : "Added to your liked articles.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to update like status. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsBookmarked(!isBookmarked);
      
      // Store in localStorage for persistence
      const bookmarkedArticles = JSON.parse(localStorage.getItem('xlevate-bookmarked-articles') || '[]');
      if (isBookmarked) {
        const updated = bookmarkedArticles.filter((id: string) => id !== articleId);
        localStorage.setItem('xlevate-bookmarked-articles', JSON.stringify(updated));
      } else {
        localStorage.setItem('xlevate-bookmarked-articles', JSON.stringify([...bookmarkedArticles, articleId]));
      }

      toast({
        title: isBookmarked ? "Bookmark removed" : "Article bookmarked!",
        description: isBookmarked ? "Removed from your reading list." : "Added to your reading list.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to update bookmark status. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Like Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center gap-2 transition-all duration-200 ${
          isLiked 
            ? 'text-red-400 hover:text-red-300' 
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <Heart 
          className={`h-4 w-4 transition-all duration-200 ${
            isLiked ? 'fill-current scale-110' : ''
          }`} 
        />
        <span className="text-sm font-medium">{likes}</span>
      </Button>

      {/* Bookmark Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        disabled={isLoading}
        className={`transition-all duration-200 ${
          isBookmarked 
            ? 'text-accent hover:text-accent/80' 
            : 'text-gray-400 hover:text-white'
        }`}
        aria-label={isBookmarked ? "Remove bookmark" : "Bookmark article"}
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-4 w-4 transition-all duration-200 scale-110" />
        ) : (
          <Bookmark className="h-4 w-4 transition-all duration-200" />
        )}
      </Button>
    </div>
  );
};