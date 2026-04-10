import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
}

const pageSEO: Record<string, SEOProps> = {
  '/': {
    title: 'InterQ - AI Recruitment & Assessment Platform',
    description: 'Streamline hiring with AI-powered assessments, interviews, and candidate matching. Reduce bad hires by 40%. Try demo now.',
    image: '/og-landing.png'
  },
  '/product': {
    title: 'Product - InterQ Features & Capabilities',
    description: 'AI interviews, skill assessments, ATS integration, bias reduction, fraud detection.',
    image: '/og-product.png'
  },
  '/pricing': {
    title: 'Pricing - InterQ Plans for Enterprises & SMEs',
    description: 'Transparent pricing for recruitment platforms. Free trial available.',
    image: '/og-pricing.png'
  },
  '/about': {
    title: 'About InterQ - Our Mission & Team',
    description: 'Learn about the team behind the leading AI recruitment platform.',
    image: '/og-about.png'
  },
  // Dashboard pages use generic
  '/dashboard': {
    title: 'Dashboard - InterQ Recruitment Platform',
    description: 'Your hiring dashboard: jobs, candidates, interviews, reports.'
  },
  '/jobs': {
    title: 'Jobs Management - Post & Track Open Positions'
  },
  // Add more as needed
  default: {
    title: 'InterQ - Complete Recruitment Solution',
    description: 'AI-powered hiring platform for modern teams.'
  }
};

export default function SEOHead({ title, description, image, canonical }: SEOProps = {}) {
  const location = useLocation();
  const pathname = location.pathname;
  const seoData = pageSEO[pathname as keyof typeof pageSEO] || pageSEO.default || {};

  const finalTitle = title || seoData.title || 'InterQ';
  const finalDesc = description || seoData.description;
  const finalImage = image || seoData.image || '/og-default.png';
  const finalCanonical = canonical || `https://interq.com${pathname}`;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalImage} />
      
      {/* Canonical */}
      <link rel="canonical" href={finalCanonical} />
      
      {/* Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'InterQ',
          url: 'https://interq.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://interq.com/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        })}
      </script>
    </Helmet>
  );
}

