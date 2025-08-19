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

interface BlogPost {
	id: string;
	title: string;
	excerpt: string;
	slug: string;
	category: string;
	source_url?: string;
	author: string;
	published_date: string;
	is_featured: boolean;
	created_at: string;
	updated_at: string;
	readTime?: number;
	tags?: string[];
}

// Raw type from Supabase blog_posts table
interface SupabaseBlogPost {
	id: string;
	external_id: string;
	title: string;
	source_url: string;
	content: string | null;
	published_date: string;
	excerpt: string | null;
	tags: string[] | null;
	created_at: string;
	updated_at: string;
	author: string | null;
}

const slugify = (text: string) =>
	text
		.toString()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)+/g, '');

const pickCategoryFromTags = (tags: string[] | null | undefined): string => {
	if (!tags || tags.length === 0) return 'Technology';
	const normalized = tags.map(t => t.toLowerCase());
	if (normalized.includes('health')) return 'Healthcare';
	if (normalized.includes('finance')) return 'Finance';
	if (normalized.includes('real-estate') || normalized.includes('real estate')) return 'Real-estate';
	if (normalized.includes('industry-insight') || normalized.includes('insight')) return 'Industry-insight';
	if (normalized.includes('technology') || normalized.includes('tech')) return 'Technology';
	return 'Technology';
};

const isFeaturedFromTags = (tags: string[] | null | undefined): boolean => {
	if (!tags) return false;
	return tags.some(t => t.toLowerCase() === 'featured');
};

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
	const tags = post.tags || [post.category.charAt(0).toUpperCase() + post.category.slice(1), 'Automation', 'AI'];
	const displayDate = post.published_date || new Date().toISOString();

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
				{post.source_url ? (
					<a href={post.source_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
						{post.title}
					</a>
				) : (
					<a href="/blog" className="hover:underline">
						{post.title}
					</a>
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

	// Enhanced fallback data matching Xlevate's branding for blog_posts shape
	const fallbackRawPosts: SupabaseBlogPost[] = [
		{
			id: 'xlevate-1',
			external_id: null,
			title: 'Healthcare Automation: Reducing Administrative Burden by 70%',
			source_url: 'https://xlevatetech.com/case-studies/healthcare-automation',
			content: null,
			published_date: '2025-01-15T00:00:00Z',
			excerpt: 'Discover how leading healthcare organizations are leveraging AI automation to streamline patient management, reduce documentation time, and improve compliance while maintaining HIPAA standards.',
			tags: ['Healthcare', 'Automation', 'Case Study', 'featured'],
			created_at: '2025-01-15T00:00:00Z',
			updated_at: '2025-01-15T00:00:00Z',
			author: 'Xlevate Healthcare Team'
		},
		{
			id: 'xlevate-2',
			external_id: null,
			title: 'Financial Services: AI-Powered Compliance Automation',
			source_url: 'https://xlevatetech.com/services/finance-automation',
			content: null,
			published_date: '2025-01-10T00:00:00Z',
			excerpt: 'Learn how financial institutions are using automation to ensure regulatory compliance, reduce audit preparation time by 60%, and maintain accuracy across complex reporting requirements.',
			tags: ['Finance', 'Compliance', 'FINRA', 'Automation', 'featured'],
			created_at: '2025-01-10T00:00:00Z',
			updated_at: '2025-01-10T00:00:00Z',
			author: 'Finance Automation Experts'
		},
		{
			id: 'xlevate-3',
			external_id: null,
			title: 'Real Estate Portfolio Management: From Excel to Automation',
			source_url: 'https://xlevatetech.com/case-studies/real-estate',
			content: null,
			published_date: '2025-01-08T00:00:00Z',
			excerpt: 'Transform your real estate operations with intelligent automation. See how property managers are saving 30+ hours monthly while improving tenant satisfaction and operational efficiency.',
			tags: ['Real-estate', 'Property Management', 'Portfolio', 'Automation'],
			created_at: '2025-01-08T00:00:00Z',
			updated_at: '2025-01-08T00:00:00Z',
			author: 'Real Estate Technology'
		},
		{
			id: 'xlevate-4',
			external_id: null,
			title: '2025 AI Automation Trends: What Leaders Need to Know',
			source_url: 'https://xlevatetech.com/insights/2025-automation-trends',
			content: null,
			published_date: '2025-01-05T00:00:00Z',
			excerpt: 'Stay ahead of the curve with insights into emerging AI automation technologies, implementation strategies, and ROI benchmarks that are shaping business operations in 2025.',
			tags: ['Industry-insight', 'AI', 'Trends', '2025', 'Strategy', 'featured'],
			created_at: '2025-01-05T00:00:00Z',
			updated_at: '2025-01-05T00:00:00Z',
			author: 'Xlevate Research Team'
		},
		{
			id: 'xlevate-5',
			external_id: null,
			title: 'No-Code Automation: Zapier vs Make.com vs Custom Solutions',
			source_url: 'https://xlevatetech.com/insights/automation-platforms',
			content: null,
			published_date: '2025-01-03T00:00:00Z',
			excerpt: 'Compare popular automation platforms and learn when to choose no-code solutions versus custom development for your business automation needs.',
			tags: ['Technology', 'No-Code', 'Zapier', 'Make.com', 'Comparison'],
			created_at: '2025-01-03T00:00:00Z',
			updated_at: '2025-01-03T00:00:00Z',
			author: 'Automation Platform Experts'
		},
		{
			id: 'xlevate-6',
			external_id: null,
			title: 'Quality Assurance in Automated Workflows: Best Practices',
			source_url: 'https://xlevatetech.com/services/qa-strategy',
			content: null,
			published_date: '2025-01-01T00:00:00Z',
			excerpt: 'Ensure your automation implementations are bulletproof with comprehensive QA strategies, testing frameworks, and error handling best practices.',
			tags: ['Technology', 'QA', 'Testing', 'Quality Assurance', 'Best Practices'],
			created_at: '2025-01-01T00:00:00Z',
			updated_at: '2025-01-01T00:00:00Z',
			author: 'QA Strategy Team'
		},
		{
			id: 'xlevate-7',
			external_id: null,
			title: 'Data Migration Success: From Legacy Systems to Modern Platforms',
			source_url: 'https://xlevatetech.com/services/data-migration',
			content: null,
			published_date: '2024-12-28T00:00:00Z',
			excerpt: 'Navigate complex data migrations with confidence. Learn proven strategies for moving from Excel chaos to modern, audit-ready systems without data loss.',
			tags: ['Technology', 'Data Migration', 'Legacy Systems', 'Data Cleanup', 'Strategy'],
			created_at: '2024-12-28T00:00:00Z',
			updated_at: '2024-12-28T00:00:00Z',
			author: 'Data Migration Specialists'
		},
		{
			id: 'xlevate-8',
			external_id: null,
			title: 'ROI Calculator: Measuring Automation Success in 2025',
			source_url: 'https://xlevatetech.com/automation-roi-calculator',
			content: null,
			published_date: '2024-12-25T00:00:00Z',
			excerpt: 'Calculate the real impact of your automation investments with our comprehensive ROI framework. Includes templates and benchmarks from actual client implementations.',
			tags: ['Industry-insight', 'ROI', 'Calculator', 'Metrics', 'Business Intelligence', 'featured'],
			created_at: '2024-12-25T00:00:00Z',
			updated_at: '2024-12-25T00:00:00Z',
			author: 'Business Intelligence Team'
		}
	];

	// Use enhanced hook with fallback functionality targeting blog_posts
	const {
		data: rawPosts,
		isLoading,
		error
	} = useSupabaseWithFallback<SupabaseBlogPost>({
		table: 'blog_posts',
		select: '*',
		orderBy: { column: 'published_date', ascending: false },
		cacheKey: 'blog_posts',
		fallbackData: fallbackRawPosts,
		maxRetries: 3,
		retryDelay: 1000
	});

	// Process and enhance the posts data from Supabase -> UI shape
	const processedPosts: BlogPost[] = rawPosts.map(raw => {
		const category = pickCategoryFromTags(raw.tags);
		const computedExcerpt = raw.excerpt || (raw.content ? raw.content.slice(0, 200) + '…' : '');
		const readTime = Math.ceil(((raw.content?.length || computedExcerpt.length || 500)) / 200);
		return {
			id: raw.id,
			title: raw.title,
			excerpt: computedExcerpt,
			slug: slugify(raw.title),
			category,
			source_url: raw.source_url,
			author: raw.author || 'Xlevate Team',
			published_date: raw.published_date,
			is_featured: isFeaturedFromTags(raw.tags),
			created_at: raw.created_at,
			updated_at: raw.updated_at,
			readTime,
			tags: raw.tags || [category, 'Automation', 'AI']
		};
	});

	// Debug logging for Supabase data
	useEffect(() => {
		if (rawPosts.length > 0 && !isLoading) {
			console.log('Supabase blog_posts loaded:', rawPosts.length, 'rows');
			console.log('Sample blog_post row:', rawPosts[0]);
		}
	}, [rawPosts, isLoading]);

	// Get categorized posts
	const latestArticles = processedPosts.slice(0, 16);
	const featuredArticles = processedPosts.filter(post => post.is_featured).slice(0, 8);
	const industryInsights = processedPosts.filter(post => post.category === 'Industry-insight').slice(0, 8);

	// Filter function for search
	useEffect(() => {
		if (searchTerm) {
			const filtered = processedPosts.filter(post =>
				post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
				post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
				post.category.toLowerCase().includes(searchTerm.toLowerCase())
			);
			setFilteredPosts(filtered);
		} else {
			setFilteredPosts(latestArticles);
		}
	}, [searchTerm, processedPosts, latestArticles]);

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
					{/* Error Display */}
					{error && (
						<div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
							<p className="text-red-400 text-center">
								Unable to load blog posts. Showing fallback content.
							</p>
						</div>
					)}
					
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
									{isLoading ? (
										<div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
											{Array(6).fill(0).map((_, i) => (
												<div key={i} className="bg-elevate-dark border border-elevate-accent/20 rounded-xl p-6 animate-pulse">
													<div className="h-4 bg-elevate-accent/20 rounded w-20 mb-4"></div>
													<div className="h-6 bg-elevate-accent/20 rounded w-3/4 mb-3"></div>
													<div className="h-20 bg-elevate-accent/20 rounded mb-4"></div>
													<div className="h-4 bg-elevate-accent/20 rounded w-1/2"></div>
												</div>
											))}
										</div>
									) : (
										<div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
											{featuredArticles.map((post) => (
												<BrandedBlogPostCard key={post.id} post={post} />
											))}
										</div>
									)}
								</TabsContent>

								{/* Industry Insights Tab */}
								<TabsContent value="insights" className="mt-6">
									{isLoading ? (
										<div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
											{Array(6).fill(0).map((_, i) => (
												<div key={i} className="bg-elevate-dark border border-elevate-accent/20 rounded-xl p-6 animate-pulse">
													<div className="h-4 bg-elevate-accent/20 rounded w-20 mb-4"></div>
													<div className="h-6 bg-elevate-accent/20 rounded w-3/4 mb-3"></div>
													<div className="h-20 bg-elevate-accent/20 rounded mb-4"></div>
													<div className="h-4 bg-elevate-accent/20 rounded w-1/2"></div>
												</div>
											))}
										</div>
									) : (
										<div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
											{industryInsights.map((post) => (
												<BrandedBlogPostCard key={post.id} post={post} />
											))}
										</div>
									)}
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
		</div>
	);
};

export default Blog;