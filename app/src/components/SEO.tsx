import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Ollie Cross | Full-Stack Developer',
  description = 'Full-stack developer based in London, specializing in React, TypeScript, and modern web technologies. View my projects and get in touch.',
  keywords = [
    'developer',
    'react',
    'typescript',
    'full-stack',
    'web development',
    'portfolio',
  ],
  image = '/og-image.jpg',
  url = 'https://olliecross.dev',
  type = 'website',
  author = 'Ollie Cross',
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  structuredData,
}) => {
  const fullTitle = title.includes('Ollie Cross')
    ? title
    : `${title} | Ollie Cross`;
  const fullUrl = url.startsWith('http') ? url : `https://olliecross.dev${url}`;
  const fullImageUrl = image.startsWith('http')
    ? image
    : `https://olliecross.dev${image}`;

  // Default structured data for person/organization
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ollie Cross',
    jobTitle: 'Full-Stack Developer',
    description:
      'Software developer based in London, specializing in React, TypeScript, and modern web technologies.',
    url: 'https://olliecross.dev',
    sameAs: [
      'https://github.com/olliecross',
      'https://linkedin.com/in/olliecross',
      'https://twitter.com/olliecross',
    ],
    knowsAbout: [
      'React',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'Web Development',
      'Full-Stack Development',
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'London',
      addressCountry: 'GB',
    },
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords.join(', ')} />
      <meta name='author' content={author} />
      <link rel='canonical' href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={fullImageUrl} />
      <meta property='og:url' content={fullUrl} />
      <meta property='og:type' content={type} />
      <meta property='og:site_name' content='Ollie Cross Portfolio' />
      <meta property='og:locale' content='en_US' />

      {/* Twitter Card Tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={fullImageUrl} />
      <meta name='twitter:creator' content='@olliecross' />

      {/* Additional Meta Tags */}
      <meta name='robots' content='index, follow' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />

      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <meta property='article:published_time' content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property='article:modified_time' content={modifiedTime} />
      )}
      {type === 'article' && section && (
        <meta property='article:section' content={section} />
      )}
      {type === 'article' &&
        tags.length > 0 &&
        tags.map((tag, index) => (
          <meta key={index} property='article:tag' content={tag} />
        ))}

      {/* Structured Data */}
      <script type='application/ld+json'>
        {JSON.stringify(finalStructuredData)}
      </script>

      {/* Additional SEO improvements */}
      <meta name='theme-color' content='#4752a8' />
      <meta name='msapplication-TileColor' content='#4752a8' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content='Ollie Cross' />
    </Helmet>
  );
};

export default SEO;
