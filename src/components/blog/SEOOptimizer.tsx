
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOOptimizerProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'blog';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  tags?: string[];
}

export const SEOOptimizer = ({
  title,
  description,
  keywords = [],
  image = "/xlevate_logo1.svg",
  url = "https://xlevatetech.com",
  type = "website",
  author = "Raj Dalal",
  publishedTime,
  modifiedTime,
  category,
  tags = []
}: SEOOptimizerProps) => {
  const fullTitle = `${title} | Xlevate Tech`;
  const keywordsString = keywords.join(', ');

  // Performance monitoring
  useEffect(() => {
    // Track Core Web Vitals
    if (typeof window !== 'undefined' && 'web-vital' in window) {
      const trackWebVital = (metric: any) => {
        console.log(`${metric.name}: ${metric.value}`);
        // In production, send to analytics
      };

      // Monitor LCP, FID, CLS
      try {
        import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
          onCLS(trackWebVital);
          onINP(trackWebVital);
          onLCP(trackWebVital);
          onFCP(trackWebVital);
          onTTFB(trackWebVital);
        });
      } catch (error) {
        console.log('Web Vitals not available');
      }
    }
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? "Article" : "WebPage",
    "headline": title,
    "description": description,
    "url": url,
    "image": image,
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
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywordsString} />}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Xlevate Tech" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
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
      <link rel="preload" as="image" href={image} />
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};
