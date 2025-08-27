// src/components/blog/SEOHead.tsx

import { Helmet } from 'react-helmet-async';
import { SEO_META_TAGS, STRUCTURED_DATA } from '@/config/seoMetaConfig';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url: string;
  type?: string;
}

export const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = "website" 
}: SEOHeadProps) => {
  
  // Determine which page we're on based on URL
  const getPageKey = (): keyof typeof SEO_META_TAGS | null => {
    if (url === 'https://xlevatetech.com' || url === 'https://xlevatetech.com/') return 'homepage';
    if (url.includes('/about')) return 'about';
    if (url.includes('/services')) return 'services';
    if (url.includes('/industries')) return 'industries';
    if (url.includes('/automation-roi-calculator')) return 'calculator';
    if (url.includes('/case-studies')) return 'caseStudies';
    if (url.includes('/contact')) return 'contact';
    if (url.includes('/blog')) return 'blog';
    return null;
  };

  const pageKey = getPageKey();
  const pageMeta = pageKey ? SEO_META_TAGS[pageKey] : null;
  const pageStructuredData = pageKey && STRUCTURED_DATA[pageKey as keyof typeof STRUCTURED_DATA] 
    ? STRUCTURED_DATA[pageKey as keyof typeof STRUCTURED_DATA] 
    : { ...STRUCTURED_DATA.default, name: title, description, url };

  return (
    <Helmet>
      {/* Title and Basic Meta */}
      <title>{pageMeta?.title || title}</title>
      <meta name="description" content={pageMeta?.description || description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={pageMeta?.canonical || url} />

      {/* OpenGraph Meta */}
      <meta property="og:title" content={pageMeta?.og.title || title} />
      <meta property="og:description" content={pageMeta?.og.description || description} />
      <meta property="og:url" content={pageMeta?.og.url || url} />
      <meta property="og:image" content={pageMeta?.og.image || image || "https://xlevatetech.com/images/xlevate-social-home.png"} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Xlevate Tech" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageMeta?.twitter.title || title} />
      <meta name="twitter:description" content={pageMeta?.twitter.description || description} />
      <meta name="twitter:image" content={pageMeta?.twitter.image || image || "https://xlevatetech.com/images/xlevate-social-home.png"} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(pageStructuredData)}
      </script>
    </Helmet>
  );
};
