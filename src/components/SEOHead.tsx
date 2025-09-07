import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEOHead({
  title = 'Step Up Naija - Civic Engagement Platform',
  description = 'Join 13,000 credible Nigerian leaders in building a better future. Participate in civic activities, earn rewards, and drive positive change in your community.',
  image = '/og-image.png',
  url,
  type = 'website',
  author,
  publishedTime,
  modifiedTime
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', 'Nigeria, civic engagement, democracy, leadership, governance, transparency, community development');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', 'en');
    updateMetaTag('revisit-after', '7 days');

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', 'Step Up Naija', true);
    updateMetaTag('og:locale', 'en_NG', true);
    
    if (url) {
      updateMetaTag('og:url', url, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Article specific tags
    if (type === 'article') {
      if (author) {
        updateMetaTag('article:author', author, true);
      }
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
    }

    // Structured data for organization
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Step Up Naija",
      "description": description,
      "url": "https://stepupnaija.com",
      "logo": `${window.location.origin}/logo.png`,
      "sameAs": [
        "https://twitter.com/stepupnaija",
        "https://facebook.com/stepupnaija",
        "https://linkedin.com/company/stepupnaija"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "info@stepupnaija.com"
      }
    };

    // Update or create JSON-LD script
    let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url || window.location.href;

  }, [title, description, image, url, type, author, publishedTime, modifiedTime]);

  return null; // This component doesn't render anything
}

export default SEOHead;