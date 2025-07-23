import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
}

export const useSEO = (config: SEOConfig) => {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    if (config.title) {
      document.title = config.title.includes('Ollie Cross')
        ? config.title
        : `${config.title} | Ollie Cross`;
    }

    // Update meta description
    if (config.description) {
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute('content', config.description);
      }
    }

    // Update meta keywords
    if (config.keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', config.keywords.join(', '));
      }
    }

    // Update Open Graph tags
    if (config.title) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', config.title);
      }
    }

    if (config.description) {
      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      );
      if (ogDescription) {
        ogDescription.setAttribute('content', config.description);
      }
    }

    if (config.image) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', config.image);
      }
    }

    // Update Twitter Card tags
    if (config.title) {
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', config.title);
      }
    }

    if (config.description) {
      const twitterDescription = document.querySelector(
        'meta[name="twitter:description"]'
      );
      if (twitterDescription) {
        twitterDescription.setAttribute('content', config.description);
      }
    }

    if (config.image) {
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (twitterImage) {
        twitterImage.setAttribute('content', config.image);
      }
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute(
        'href',
        `https://olliecross.dev${location.pathname}`
      );
    }

    // Handle noindex
    if (config.noindex) {
      const robots = document.querySelector('meta[name="robots"]');
      if (robots) {
        robots.setAttribute('content', 'noindex, nofollow');
      }
    } else {
      const robots = document.querySelector('meta[name="robots"]');
      if (robots) {
        robots.setAttribute('content', 'index, follow');
      }
    }

    // Update Open Graph URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute(
        'content',
        `https://olliecross.dev${location.pathname}`
      );
    }

    // Update Twitter URL
    const twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute(
        'content',
        `https://olliecross.dev${location.pathname}`
      );
    }
  }, [config, location.pathname]);

  return null;
};
