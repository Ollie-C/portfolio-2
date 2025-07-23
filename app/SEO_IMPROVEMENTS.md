# SEO Improvements Documentation

This document outlines the comprehensive SEO improvements implemented in the portfolio website.

## 🎯 Overview

The portfolio now includes a complete SEO system with dynamic meta tags, structured data, and search engine optimization features.

## 📋 Implemented Features

### 1. Dynamic SEO Component (`SEO.tsx`)

- **Meta Tags**: Title, description, keywords, author
- **Open Graph Tags**: For social media sharing
- **Twitter Card Tags**: Optimized Twitter sharing
- **Structured Data**: JSON-LD schema markup
- **Canonical URLs**: Prevent duplicate content
- **Theme Colors**: Mobile browser theming

### 2. Page-Specific SEO

- **Homepage**: Optimized for portfolio discovery
- **Project Pages**: Dynamic metadata based on project content
- **404 Page**: Proper error page SEO
- **Loading States**: SEO-friendly loading pages

### 3. Technical SEO

- **robots.txt**: Search engine crawling instructions
- **sitemap.xml**: Auto-generated sitemap with all projects
- **manifest.json**: PWA support for mobile
- **Breadcrumbs**: Improved navigation and SEO

### 4. Performance Optimizations

- **Preconnect**: External domain optimization
- **Meta Viewport**: Mobile optimization
- **Theme Colors**: Consistent branding

## 🚀 Usage

### Basic SEO Component

```tsx
import SEO from '../components/SEO';

<SEO
  title='Page Title'
  description='Page description'
  keywords={['keyword1', 'keyword2']}
  image='/path/to/image.jpg'
  url='https://olliecross.dev/page'
/>;
```

### Project Page SEO

```tsx
<SEO
  title={`${projectTitle} | Ollie Cross`}
  description={projectDescription}
  keywords={projectKeywords}
  image={projectImage}
  url={`https://olliecross.dev/project/${project.slug}`}
  type='article'
  publishedTime={project.createdAt}
  modifiedTime={project.updatedAt}
  section='Projects'
  tags={project.tags}
  structuredData={projectStructuredData}
/>
```

### Custom Hook

```tsx
import { useSEO } from '../hooks/useSEO';

useSEO({
  title: 'Dynamic Title',
  description: 'Dynamic description',
  keywords: ['dynamic', 'keywords'],
  noindex: false,
});
```

## 📊 Structured Data

### Person Schema

- Name, job title, description
- Social media profiles
- Skills and expertise
- Location information

### Creative Work Schema (Projects)

- Project name and description
- Author information
- Creation and modification dates
- Technology stack
- Demo and source URLs

## 🔧 Configuration

### Environment Variables

```env
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
```

### Build Process

The sitemap is automatically generated during the build process:

```bash
npm run build
```

### Manual Sitemap Generation

```bash
npm run generate-sitemap
```

## 📈 SEO Checklist

- [x] Meta title and description for all pages
- [x] Open Graph tags for social sharing
- [x] Twitter Card optimization
- [x] Structured data (JSON-LD)
- [x] Canonical URLs
- [x] robots.txt file
- [x] XML sitemap
- [x] Breadcrumb navigation
- [x] Mobile optimization
- [x] PWA manifest
- [x] Theme colors
- [x] Preconnect optimization

## 🎨 Customization

### Updating Default SEO

Edit `app/src/components/SEO.tsx` to modify default values:

- Default title format
- Default description
- Default keywords
- Default structured data

### Adding New Page Types

1. Create new SEO configuration
2. Add structured data schema
3. Update sitemap generation
4. Test with Google's Rich Results Test

## 🔍 Testing

### Google Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Search Console](https://search.google.com/search-console)

### Social Media Testing

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

## 📝 Best Practices

1. **Unique Titles**: Each page has a unique, descriptive title
2. **Descriptive URLs**: Clean, keyword-rich URLs
3. **Image Optimization**: Alt text and proper sizing
4. **Mobile First**: Responsive design with mobile optimization
5. **Fast Loading**: Optimized images and code
6. **Accessibility**: ARIA labels and semantic HTML
7. **Internal Linking**: Breadcrumbs and navigation
8. **Fresh Content**: Regular updates and new projects

## 🔄 Maintenance

### Regular Tasks

- Update sitemap when adding new projects
- Review and update meta descriptions
- Monitor search console for issues
- Test social sharing regularly
- Update structured data as needed

### Monitoring

- Google Search Console for indexing
- Analytics for organic traffic
- PageSpeed Insights for performance
- Social media sharing metrics

## 📚 Resources

- [Google SEO Guide](https://developers.google.com/search/docs)
- [Schema.org](https://schema.org/) - Structured data reference
- [Open Graph Protocol](https://ogp.me/) - Social media optimization
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
