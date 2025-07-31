
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, ExternalLink } from 'lucide-react';
import { SmartBlogLink } from './SmartBlogLink';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  published_date: string;
  is_featured: boolean;
  source_url?: string;
  slug: string;
  readTime?: number;
  publishDate?: string;
  tags?: string[];
}

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const readTime = post.readTime || Math.ceil((post.excerpt?.length || 500) / 200);
  const tags = post.tags || [post.category, 'Automation', 'AI'];
  const displayDate = post.published_date || post.publishDate || new Date().toISOString();

  const getCategoryColor = (category: string) => {
    const colors = {
      'healthcare': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'finance': 'bg-green-500/20 text-green-400 border-green-500/30',
      'real-estate': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'technology': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'industry-insight': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'automation': 'bg-elevate-accent/20 text-elevate-accent border-elevate-accent/30',
      'government': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      'security': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[category.toLowerCase() as keyof typeof colors] || 'bg-elevate-accent/20 text-elevate-accent border-elevate-accent/30';
  };

  return (
    <div className="bg-elevate-dark backdrop-blur-sm border border-elevate-accent/20 rounded-xl p-6 hover:border-elevate-accent/40 transition-all duration-300 h-full flex flex-col transform hover:translate-y-[-4px] group">
      <div className="flex items-start justify-between mb-4">
        <span className={`${getCategoryColor(post.category)} border text-xs font-medium px-2 py-1 rounded-md`}>
          {post.category}
        </span>
        <div className="flex items-center text-xs text-gray-400">
          <Clock className="h-3 w-3 mr-1" />
          <span>{readTime} min read</span>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-elevate-accent transition-colors line-clamp-2 leading-tight">
        {post.source_url ? (
          <SmartBlogLink href={post.source_url} className="hover:text-elevate-accent">
            {post.title}
          </SmartBlogLink>
        ) : (
          post.title
        )}
      </h3>
      
      <p className="text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed flex-1">
        {post.excerpt}
      </p>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="text-xs bg-elevate-accent/10 border border-elevate-accent/20 text-elevate-accent px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400 pt-3 border-t border-elevate-accent/20">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1" />
            <span className="font-medium">{post.author}</span>
          </div>
          <time dateTime={displayDate}>
            {formatDate(displayDate)}
          </time>
        </div>
        
        {post.source_url && (
          <div className="flex justify-end pt-3">
            <SmartBlogLink 
              href={post.source_url}
              className="inline-flex items-center gap-2 bg-elevate-accent hover:bg-elevate-accent-light text-white py-2 px-4 rounded-lg transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-elevate-accent focus:ring-offset-2 focus:ring-offset-elevate-dark"
              showValidation={false}
            >
              Learn More
              <ExternalLink className="h-4 w-4" />
            </SmartBlogLink>
          </div>
        )}
      </div>
    </div>
  );
};
