import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { SEOOptimizer } from '@/components/blog/SEOOptimizer';
import { ReadingProgress } from '@/components/blog/ReadingProgress';
import { SocialShare } from '@/components/blog/SocialShare';
import { PopularResources } from '@/components/blog/PopularResources';
import { NewsletterSignup } from '@/components/blog/NewsletterSignup';
import { ErrorBoundary } from '@/components/blog/ErrorBoundary';
import { useSupabaseWithFallback } from '@/hooks/useSupabaseWithFallback';
import { EnhancedXlevateScout } from '@/components/EnhancedXlevateScout';
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

// Branded Blog Post Card Component
const BrandedBlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const readTime = post.readTime || Math.ceil((post.excerpt?.length || 500) / 200);
  const tags = post.tags || [post.category.charAt(0).toUpperCase()+ post.category.slice(1), 'Automation', 'AI'];
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
    <div className="bg-gray-800 backdrop-blur-sm border border-elevate-accent/20 rounded-xl p-6 hover:border-elevate-accent/40 transition-all duration-300 h-full flex flex-col transform hover:translate-y-[-4px] group">
      <div className="flex items-start justify-between mb-4">
        <span className={`${getCategoryColor(post.category)} border text-xs font-medium px-2 py-1 rounded-md`}>
          {post.category}
        </span>
        <div className="flex items-center text-xs text-gray-400">
          <span>{readTime} min read</span>
        </div>
      </div>  
      
      <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-elevate-accent transition-colors line-clamp-2 leading-tight">
        {post.title}
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
        <div className='flex justify-between border-t border-elevate-accent/20'>
          <div className="flex flex-col items-start justify-between text-sm text-gray-400 pt-3">
            <span className="font-medium">{post.author}</span>
            <time dateTime={displayDate}>
              {formatDate(displayDate)}
            </time>
          </div>
        {post.source_url && (
          <div className="flex justify-end pt-5">
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center border border-elevate-accent/20 bg-elevate-accent/10 text-elevate-accent px-3 rounded-lg transition-all duration-300 text-xs transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-elevate-accent focus:ring-offset-2 focus:ring-offset-elevate-dark"
            >
            Read More
            </a>
          </div>
        )}
        </div>  
        

      </div>
    </div>
  );
};

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  // Enhanced fallback data matching Xlevate's branding
  const fallbackPosts: BlogPost[] = [
    {
      id: 'xlevate-1',
      title: 'Healthcare Automation: Reducing Administrative Burden by 70%',
      excerpt: 'Discover how leading healthcare organizations are leveraging AI automation to streamline patient management, reduce documentation time, and improve compliance while maintaining HIPAA standards.',
      author: 'Xlevate Healthcare Team',
      category: 'Healthcare',
      published_date: '2025-01-15T00:00:00Z',
      is_featured: true,
      source_url: 'https://xlevatetech.com/case-studies/healthcare-automation',
      slug: 'healthcare-automation-case-study',
      tags: ['Healthcare', 'HIPAA', 'Automation', 'Case Study']
    },
    {
      id: 'xlevate-2',
      title: 'Financial Services: AI-Powered Compliance Automation',
      excerpt: 'Learn how financial institutions are using automation to ensure regulatory compliance, reduce audit preparation time by 60%, and maintain accuracy across complex reporting requirements.',
      author: 'Finance Automation Experts',
      category: 'Finance',
      published_date: '2025-01-10T00:00:00Z',
      is_featured: true,
      source_url: 'https://xlevatetech.com/services/finance-automation',
      slug: 'financial-compliance-automation',
      tags: ['Finance', 'Compliance', 'FINRA', 'Automation']
    },
    {
      id: 'xlevate-3',
      title: 'Real Estate Portfolio Management: From Excel to Automation',
      excerpt: 'Transform your real estate operations with intelligent automation. See how property managers are saving 30+ hours monthly while improving tenant satisfaction and operational efficiency.',
      author: 'Real Estate Technology',
      category: 'Real-estate',
      published_date: '2025-01-08T00:00:00Z',
      is_featured: false,
      source_url: 'https://xlevatetech.com/case-studies/real-estate',
      slug: 'real-estate-portfolio-automation',
      tags: ['Real Estate', 'Property Management', 'Portfolio', 'Automation']
    },
    {
      id: 'xlevate-4',
      title: '2025 AI Automation Trends: What Leaders Need to Know',
      excerpt: 'Stay ahead of the curve with insights into emerging AI automation technologies, implementation strategies, and ROI benchmarks that are shaping business operations in 2025.',
      author: 'Xlevate Research Team',
      category: 'Industry-insight',
      published_date: '2025-01-05T00:00:00Z',
      is_featured: true,
      source_url: 'https://xlevatetech.com/insights/2025-automation-trends',
      slug: 'ai-automation-trends-2025',
      tags: ['AI', 'Trends', '2025', 'Strategy']
    },
    {
      id: 'xlevate-5',
      title: 'No-Code Automation: Zapier vs Make.com vs Custom Solutions',
      excerpt: 'Compare popular automation platforms and learn when to choose no-code solutions versus custom development for your business automation needs.',
      author: 'Automation Platform Experts',
      category: 'Technology',
      published_date: '2025-01-03T00:00:00Z',
      is_featured: false,
      source_url: 'https://xlevatetech.com/insights/automation-platforms',
      slug: 'no-code-automation-comparison',
      tags: ['No-Code', 'Zapier', 'Make.com', 'Comparison']
    },
    {
      id: 'xlevate-6',
      title: 'Quality Assurance in Automated Workflows: Best Practices',
      excerpt: 'Ensure your automation implementations are bulletproof with comprehensive QA strategies, testing frameworks, and error handling best practices.',
      author: 'QA Strategy Team',
      category: 'Technology',
      published_date: '2025-01-01T00:00:00Z',
      is_featured: false,
      source_url: 'https://xlevatetech.com/services/qa-strategy',
      slug: 'qa-automation-best-practices',
      tags: ['QA', 'Testing', 'Quality Assurance', 'Best Practices']
    },
    {
      id: 'xlevate-7',
      title: 'Data Migration Success: From Legacy Systems to Modern Platforms',
      excerpt: 'Navigate complex data migrations with confidence. Learn proven strategies for moving from Excel chaos to modern, audit-ready systems without data loss.',
      author: 'Data Migration Specialists',
      category: 'Technology',
      published_date: '2024-12-28T00:00:00Z',
      is_featured: false,
      source_url: 'https://xlevatetech.com/services/data-migration',
      slug: 'data-migration-best-practices',
      tags: ['Data Migration', 'Legacy Systems', 'Data Cleanup', 'Strategy']
    },
    {
      id: 'xlevate-8',
      title: 'ROI Calculator: Measuring Automation Success in 2025',
      excerpt: 'Calculate the real impact of your automation investments with our comprehensive ROI framework. Includes templates and benchmarks from actual client implementations.',
      author: 'Business Intelligence Team',
      category: 'Industry-insight',
      published_date: '2024-12-25T00:00:00Z',
      is_featured: true,
      source_url: 'https://xlevatetech.com/automation-roi-calculator',
      slug: 'automation-roi-calculator-guide',
      tags: ['ROI', 'Calculator', 'Metrics', 'Business Intelligence']
    }
  ];

  // Use enhanced hook with fallback functionality
  const {
    data: posts,
    isLoading,
    error
  } = useSupabaseWithFallback<BlogPost>({
    table: 'posts',
    select: '*',
    orderBy: { column: 'published_date', ascending: false },
    cacheKey: 'blog_posts',
    fallbackData: fallbackPosts,
    maxRetries: 3,
    retryDelay: 1000
  });

  // Get categorized posts
  const latestArticles = posts.slice(0, 16);
  const featuredArticles = posts.filter(post => post.is_featured).slice(0, 8);
  const industryInsights = posts.filter(post => post.category === 'industry-insight').slice(0, 8);

  // Filter function for search
  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(latestArticles);
    }
  }, [searchTerm, posts, latestArticles]);

  return (
    <div className="min-h-screen bg-elevate-dark">
      <ReadingProgress />
      
      <Helmet>
        <title>Automation Insights & Industry Trends | Xlevate Tech (2025)</title>
        <meta name="description" content="Discover cutting-edge AI automation strategies, implementation guides, and exclusive case studies for 2025. Expert analysis across healthcare, finance, and real estate sectors with industry benchmarks." />
        <meta name="keywords" content="AI automation 2025, automation trends, case studies, implementation strategies, industry benchmarks, workflow optimization, business automation" />
      </Helmet>

      <SEOOptimizer
        title="Automation Insights & Industry Trends | Xlevate Tech (2025)"
        description="Discover cutting-edge AI automation strategies, implementation guides, and exclusive case studies for 2025. Expert analysis across healthcare, finance, and real estate sectors with industry benchmarks."
        keywords={[
          "AI automation 2025",
          "automation trends",
          "case studies",
          "implementation strategies",
          "industry benchmarks",
          "workflow optimization",
          "business automation"
        ]}
        type="website"
        url="https://xlevatetech.com/blog"
      />

      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6">
            Automation Insights &{" "}
            <span className="text-elevate-accent">Industry Trends</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mx-auto mb-8">
            Expert strategies, case studies, and implementation guides for 2025
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="w-2 h-2 bg-elevate-accent rounded-full"></span>
              <span>16+ Detailed Articles</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="w-2 h-2 bg-elevate-accent rounded-full"></span>
              <span>8+ Expert Resources</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="w-2 h-2 bg-elevate-accent rounded-full"></span>
              <span>Updated Weekly</span>
            </div>
          </div>
          
          <a 
            href="https://calendly.com/raj-dalal-xlevatetech" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-elevate-accent hover:bg-elevate-accent-light text-white py-4 px-8 rounded-lg transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-elevate-accent focus:ring-offset-2 focus:ring-offset-elevate-dark"
          >
            <Calendar className="h-5 w-5" />
            Get Expert Strategy Session
          </a>
        </div>
        <div className="flex mt-12 max-w-6xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-24">
          <div className="relative flex-1 items-center">
            <Search className="absolute inset-0 left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search articles by title, author, or category..."
              className="pl-10 bg-elevate-dark border-elevate-accent/20 text-white placeholder:text-gray-400 focus:border-elevate-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-elevate-accent/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-elevate-accent/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      <main className="max-w-screen-2xl mx-auto px-8 sm:px-12 lg:px-16 xl:px-24 py-4 lg:py-8">
        <ErrorBoundary>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="latest" className="w-full">
                <TabsList className="flex justify-around w-full bg-elevate-dark border border-elevate-accent/20 h-20 sm:h-14 md:h-12 mb-8">
                  <TabsTrigger 
                    value="latest" 
                    className="data-[state=active]:bg-elevate-accent data-[state=active]:text-white text-wrap md:font-medium text-gray-300 h-16 sm:h-14 md:h-12"
                  >
                      Latest Articles ({latestArticles.length})
                  </TabsTrigger>
                  {/* Separator */}
                  <span className="hidden sm:inline-block h-8 border-l border-elevate-accent/20 mx-2 self-center" aria-hidden="true" />
                  <TabsTrigger 
                    value="featured" 
                    className="data-[state=active]:bg-elevate-accent data-[state=active]:text-white text-wrap font-medium text-gray-300 h-16 sm:h-14 md:h-12"
                  >
                    Featured ({featuredArticles.length})
                  </TabsTrigger>
                  {/* Separator */}
                  <span className="hidden sm:inline-block h-8 border-l border-elevate-accent/20 mx-2 self-center" aria-hidden="true" />
                  <TabsTrigger 
                    value="insights" 
                    className="data-[state=active]:bg-elevate-accent data-[state=active]:text-white text-wrap font-medium text-gray-300 h-16 sm:h-14 md:h-12"
                  >
                    Industry Insights ({industryInsights.length})
                  </TabsTrigger>
                </TabsList>

                {/* Latest Articles Tab */}
                <TabsContent value="latest" className="mt-6">                 
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="bg-elevate-dark border border-elevate-accent/20 rounded-xl p-6 animate-pulse">
                          <div className="h-4 bg-elevate-accent/20 rounded w-20 mb-4"></div>
                          <div className="h-6 bg-elevate-accent/20 rounded w-3/4 mb-3"></div>
                          <div className="h-20 bg-elevate-accent/20 rounded mb-4"></div>
                          <div className="h-4 bg-elevate-accent/20 rounded w-1/2"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        {searchTerm ? `No articles found matching "${searchTerm}"` : 'No articles available'}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                      {filteredPosts.map((post) => (
                        <BrandedBlogPostCard key={post.id} post={post} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Featured Articles Tab */}
                <TabsContent value="featured" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {featuredArticles.map((post) => (
                      <BrandedBlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                </TabsContent>

                {/* Industry Insights Tab */}
                <TabsContent value="insights" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                    {industryInsights.map((post) => (
                      <BrandedBlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-72 xl:w-80">
              <div className="sticky top-32">
                <ErrorBoundary fallback={
                  <div className="p-4 text-center text-gray-400">
                    <p>Resources temporarily unavailable</p>
                  </div>
                }>
                  <PopularResources />
                </ErrorBoundary>
              </div>
            </aside>
          </div>
        </ErrorBoundary>

        {/* Newsletter Section */}
        <div className="mt-16 pt-8 border-t border-elevate-accent/20">
          <NewsletterSignup />
        </div>

        {/* Social Share Section */}
        <div className="mt-16 pt-8 border-t border-elevate-accent/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Share These Insights</h2>
            <p className="text-gray-300">Help others discover automation strategies</p>
          </div>
          <div className="flex justify-center">
            <SocialShare
              url={typeof window !== 'undefined' ? window.location.href : 'https://xlevatetech.com/blog'}
              title="Automation Insights & Industry Trends | Xlevate Tech"
              description="Discover cutting-edge AI automation strategies and implementation guides"
            />
          </div>
        </div>
      </main>

      <Footer />
      <ScrollToTop />
      <EnhancedXlevateScout/>
    </div>
  );
};

export default Blog;