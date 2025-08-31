// src/hooks/useSEO.ts

import { useMemo } from 'react';
import { SEO_META_TAGS, STRUCTURED_DATA } from '@/config/seoMetaConfig';

interface UseSEOProps {
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

export const useSEO = ({
  pageKey,
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author = 'Raj Dalal',
  publishedTime,
  modifiedTime,
  category,
  tags = [],
  noIndex = false
}: UseSEOProps) => {
  
  const seoProps = useMemo(() => {
    // Get current URL if not provided
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://xlevatetech.vercel.app');
    
    // Determine page key if not provided
    const getPageKeyFromUrl = (): keyof typeof SEO_META_TAGS | null => {
      if (currentUrl === 'https://xlevatetech.vercel.app' || currentUrl === 'https://xlevatetech.vercel.app/') return 'homepage';
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
    
    return {
      pageKey: resolvedPageKey,
      title: pageMeta?.title || title,
      description: pageMeta?.description || description,
      keywords: keywords.length > 0 ? keywords : [],
      image: pageMeta?.og.image || image,
      url: pageMeta?.canonical || currentUrl,
      type,
      author,
      publishedTime,
      modifiedTime,
      category,
      tags,
      noIndex,
      // Additional data for convenience
      pageMeta,
      structuredData: resolvedPageKey && STRUCTURED_DATA[resolvedPageKey as keyof typeof STRUCTURED_DATA] 
        ? STRUCTURED_DATA[resolvedPageKey as keyof typeof STRUCTURED_DATA] 
        : STRUCTURED_DATA.default
    };
  }, [pageKey, title, description, keywords, image, url, type, author, publishedTime, modifiedTime, category, tags, noIndex]);

  return seoProps;
};
