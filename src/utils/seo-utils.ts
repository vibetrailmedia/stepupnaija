/**
 * SEO Utilities for Step Up Naija
 * 
 * Optimized for Nigerian search queries and social media sharing
 */

interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  alternateLocales?: string[];
}

interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

// Default SEO metadata for Step Up Naija
export const DEFAULT_SEO: SEOMetadata = {
  title: 'Step Up Naija - Empowering Nigerian Citizens for Democratic Change',
  description: 'Join the #13K Credible Challenge to select 13,000 credible leaders across Nigeria\'s 774 Local Government Areas. Participate in civic engagement, vote on community projects, and build a better Nigeria.',
  keywords: [
    'Nigeria democracy',
    'civic engagement',
    'community projects',
    'leadership development',
    'voter education',
    'local government',
    'Nigerian politics',
    'community funding',
    'social change',
    'youth empowerment'
  ],
  image: '/assets/images/step-up-naija-social.jpg',
  type: 'website',
  author: 'Step Up Naija Team',
  locale: 'en_NG',
  alternateLocales: ['ha_NG', 'yo_NG', 'ig_NG'] // Hausa, Yoruba, Igbo
};

// Update document metadata
export function updateSEOMetadata(metadata: Partial<SEOMetadata>) {
  const seo = { ...DEFAULT_SEO, ...metadata };
  
  // Update document title
  document.title = seo.title;
  
  // Update or create meta tags
  updateMetaTag('description', seo.description);
  
  if (seo.keywords) {
    updateMetaTag('keywords', seo.keywords.join(', '));
  }
  
  if (seo.author) {
    updateMetaTag('author', seo.author);
  }
  
  if (seo.publishedTime) {
    updateMetaTag('article:published_time', seo.publishedTime);
  }
  
  if (seo.modifiedTime) {
    updateMetaTag('article:modified_time', seo.modifiedTime);
  }
  
  // Open Graph tags for social media
  updateMetaTag('og:title', seo.title, 'property');
  updateMetaTag('og:description', seo.description, 'property');
  updateMetaTag('og:type', seo.type || 'website', 'property');
  updateMetaTag('og:locale', seo.locale || 'en_NG', 'property');
  
  if (seo.image) {
    updateMetaTag('og:image', seo.image, 'property');
    updateMetaTag('og:image:alt', seo.title, 'property');
    updateMetaTag('og:image:width', '1200', 'property');
    updateMetaTag('og:image:height', '630', 'property');
  }
  
  if (seo.url) {
    updateMetaTag('og:url', seo.url, 'property');
  }
  
  // Twitter Card tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', seo.title);
  updateMetaTag('twitter:description', seo.description);
  
  if (seo.image) {
    updateMetaTag('twitter:image', seo.image);
  }
  
  // Additional Nigerian context
  updateMetaTag('geo.country', 'NG');
  updateMetaTag('geo.region', 'NG');
  updateMetaTag('dc.language', seo.locale || 'en-NG');
  
  // Alternate language links
  if (seo.alternateLocales) {
    seo.alternateLocales.forEach(locale => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = locale.toLowerCase().replace('_', '-');
      link.href = `${window.location.origin}/${locale.split('_')[0]}${window.location.pathname}`;
      document.head.appendChild(link);
    });
  }
}

// Helper function to update meta tags
function updateMetaTag(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.content = content;
}

// Generate structured data for better search results
export function generateStructuredData(type: string, data: any): StructuredData {
  const baseData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
  };
  
  return { ...baseData, ...data };
}

// Common structured data generators
export const structuredDataGenerators = {
  // Organization data for Step Up Naija
  organization: (): StructuredData => generateStructuredData('Organization', {
    name: 'Step Up Naija',
    description: 'A civic engagement platform empowering Nigerian citizens for democratic change',
    url: 'https://stepupnaija.ng',
    logo: 'https://stepupnaija.ng/assets/images/logo.png',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'Dr. Rasheed Adegoke'
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressRegion: 'Lagos State'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+234-xxx-xxx-xxxx',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hausa', 'Yoruba', 'Igbo']
    },
    sameAs: [
      'https://twitter.com/stepupnaija',
      'https://facebook.com/stepupnaija',
      'https://instagram.com/stepupnaija'
    ]
  }),
  
  // Event data for civic engagement activities
  event: (eventData: any): StructuredData => generateStructuredData('Event', {
    name: eventData.title,
    description: eventData.description,
    startDate: eventData.startDate,
    endDate: eventData.endDate,
    location: {
      '@type': 'Place',
      name: eventData.location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'NG'
      }
    },
    organizer: {
      '@type': 'Organization',
      name: 'Step Up Naija'
    },
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode'
  }),
  
  // Article data for blog posts and content
  article: (articleData: any): StructuredData => generateStructuredData('Article', {
    headline: articleData.title,
    description: articleData.description,
    author: {
      '@type': 'Person',
      name: articleData.author || 'Step Up Naija Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Step Up Naija',
      logo: {
        '@type': 'ImageObject',
        url: 'https://stepupnaija.ng/assets/images/logo.png'
      }
    },
    datePublished: articleData.publishedTime,
    dateModified: articleData.modifiedTime || articleData.publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleData.url
    },
    image: articleData.image ? {
      '@type': 'ImageObject',
      url: articleData.image,
      width: 1200,
      height: 630
    } : undefined
  }),
  
  // FAQ data for common questions
  faq: (faqData: Array<{ question: string; answer: string }>): StructuredData => generateStructuredData('FAQPage', {
    mainEntity: faqData.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }),
  
  // Project/Service data for community initiatives
  service: (serviceData: any): StructuredData => generateStructuredData('Service', {
    name: serviceData.title,
    description: serviceData.description,
    provider: {
      '@type': 'Organization',
      name: 'Step Up Naija Community'
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria'
    },
    serviceType: 'Community Development',
    category: 'Civic Engagement'
  })
};

// Insert structured data into page
export function insertStructuredData(data: StructuredData | StructuredData[]) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(Array.isArray(data) ? data : [data]);
  document.head.appendChild(script);
}

// SEO-friendly URL generation
export function generateSEOFriendlyURL(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim() // Remove leading/trailing spaces
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Generate page-specific keywords based on content
export function generateKeywords(content: string, additionalKeywords: string[] = []): string[] {
  const commonNigerianTerms = [
    'nigeria', 'nigerian', 'lagos', 'abuja', 'kano', 'ibadan',
    'democracy', 'governance', 'community', 'development',
    'youth', 'leaders', 'civic', 'engagement', 'politics'
  ];
  
  // Extract keywords from content (simple implementation)
  const words = content
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were'].includes(word));
  
  // Count word frequency
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Get most frequent words
  const frequentWords = Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
  
  return [
    ...commonNigerianTerms,
    ...frequentWords,
    ...additionalKeywords
  ].slice(0, 20); // Limit to 20 keywords
}

// Social media sharing URLs
export const socialSharingUrls = {
  twitter: (url: string, text: string) => 
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&hashtags=StepUpNaija,Nigeria,Democracy`,
  
  facebook: (url: string) => 
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  
  whatsapp: (url: string, text: string) => 
    `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  
  linkedin: (url: string, title: string, summary: string) => 
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`,
  
  telegram: (url: string, text: string) => 
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
};