// src/components/blog/SEOHead.tsx

import { Helmet } from 'react-helmet-async';
import { SEO_META_TAGS, STRUCTURED_DATA } from '@/config/seoMetaConfig';

interface SEOHeadProps {
  pageKey?: keyof typeof SEO_META_TAGS;
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'blog';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  tags?: string[];
  noIndex?: boolean;
}

export const SEOHead = ({ 
  pageKey,
  title, 
  description, 
  keywords = [], 
  image, 
  url, 
  type = "website",
  author = "Raj Dalal",
  publishedTime,
  modifiedTime,
  category,
  tags = [],
  noIndex = false
}: SEOHeadProps) => {
  
  // Get current URL if not provided
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://xlevatetech.com');
  
  // Determine page key if not provided
  const getPageKeyFromUrl = (): keyof typeof SEO_META_TAGS | null => {
    if (currentUrl === 'https://xlevatetech.com' || currentUrl === 'https://xlevatetech.com/') return 'homepage';
    if (currentUrl.includes('/about')) return 'about';
    if (currentUrl.includes('/services')) return 'services';
    if (currentUrl.includes('/industries')) return 'industries';
    if (currentUrl.includes('/automation-roi-calculator')) return 'calculator';
    if (currentUrl.includes('/case-studies')) return 'caseStudies';
    if (currentUrl.includes('/contact')) return 'contact';
    if (currentUrl.includes('/blog')) return 'blog';
    return null;
  };

  const resolvedPageKey = pageKey || getPageKeyFromUrl();
  const pageMeta = resolvedPageKey ? SEO_META_TAGS[resolvedPageKey] : null;
  
  // Use config data or fallback to props
  const finalTitle = pageMeta?.title || title || 'Xlevate Tech - AI Automation Consulting';
  const finalDescription = pageMeta?.description || description || 'AI automation consulting for businesses';
  const finalUrl = pageMeta?.canonical || currentUrl;
  const finalImage = pageMeta?.og.image || image || "https://xlevatetech.com/images/xlevate-social-home.png";
  const finalKeywords = keywords.length > 0 ? keywords.join(', ') : '';
  
  // Get structured data
  const pageStructuredData = resolvedPageKey && STRUCTURED_DATA[resolvedPageKey as keyof typeof STRUCTURED_DATA] 
    ? STRUCTURED_DATA[resolvedPageKey as keyof typeof STRUCTURED_DATA] 
    : { ...STRUCTURED_DATA.default, name: finalTitle, description: finalDescription, url: finalUrl };

  // Enhanced structured data for articles
  const enhancedStructuredData = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": finalTitle,
    "description": finalDescription,
    "url": finalUrl,
    "image": finalImage,
    "author": {
      "@type": "Person",
      "name": author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Xlevate Tech",
      "url": "https://xlevatetech.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://xlevatetech.com/xlevate_logo1.svg"
      }
    },
    ...(publishedTime && { "datePublished": publishedTime }),
    ...(modifiedTime && { "dateModified": modifiedTime }),
    ...(category && { "articleSection": category }),
    ...(tags.length > 0 && { "keywords": tags })
  } : pageStructuredData;

  // Development mode logging and visual indicator
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    console.group('🔍 SEO Head - Development Mode');
    console.log('Page Key:', resolvedPageKey);
    console.log('Title:', finalTitle);
    console.log('Description:', finalDescription);
    console.log('URL:', finalUrl);
    console.log('Image:', finalImage);
    console.log('Keywords:', finalKeywords);
    console.log('Type:', type);
    console.log('Structured Data:', enhancedStructuredData);
    console.groupEnd();
  }

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{finalTitle}</title>
        <meta name="title" content={finalTitle} />
        <meta name="description" content={finalDescription} />
        {finalKeywords && <meta name="keywords" content={finalKeywords} />}
        <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
        <meta name="author" content={author} />
        <link rel="canonical" href={finalUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={finalUrl} />
        <meta property="og:title" content={pageMeta?.og.title || finalTitle} />
        <meta property="og:description" content={pageMeta?.og.description || finalDescription} />
        <meta property="og:image" content={finalImage} />
        <meta property="og:site_name" content="Xlevate Tech" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={finalUrl} />
        <meta name="twitter:title" content={pageMeta?.twitter.title || finalTitle} />
        <meta name="twitter:description" content={pageMeta?.twitter.description || finalDescription} />
        <meta name="twitter:image" content={pageMeta?.twitter.image || finalImage} />
        <meta name="twitter:creator" content="@xlevatetech" />
        <meta name="twitter:site" content="@xlevatetech" />

        {/* Article specific meta tags */}
        {type === 'article' && (
          <>
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            {category && <meta property="article:section" content={category} />}
            {tags.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
            <meta property="article:author" content={author} />
          </>
        )}

        {/* Performance optimizations */}
        <link rel="preload" as="image" href={finalImage} />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(enhancedStructuredData)}
        </script>
      </Helmet>

      {/* Development mode visual indicator */}
      {isDevelopment && (
        <div 
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#70EDFF',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'monospace',
            zIndex: 9999,
            border: '1px solid #70EDFF',
            pointerEvents: 'none'
          }}
        >
          SEO: {resolvedPageKey || 'auto-detected'}
        </div>
      )}
    </>
  );
};
