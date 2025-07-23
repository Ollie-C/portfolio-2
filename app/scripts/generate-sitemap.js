import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'a1odqyb1',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: false, // We want fresh data for sitemap
});

const baseUrl = 'https://olliecross.dev';

async function generateSitemap() {
  try {
    console.log('Generating sitemap...');

    const sitemap = [
      {
        url: baseUrl,
        changefreq: 'weekly',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/#about`,
        changefreq: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/#projects`,
        changefreq: 'weekly',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/#skills`,
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/#contact`,
        changefreq: 'monthly',
        priority: 0.6,
      },
    ];

    // Fetch all active projects
    const projects = await client.fetch(`
      *[_type == "project" && (active == true || !defined(active))] {
        slug,
        _updatedAt
      }
    `);

    console.log(`Found ${projects.length} projects`);

    // Add project URLs to sitemap
    projects.forEach((project) => {
      sitemap.push({
        url: `${baseUrl}/project/${project.slug.current}`,
        lastmod: project._updatedAt,
        changefreq: 'monthly',
        priority: 0.8,
      });
    });

    // Generate XML
    const xmlUrls = sitemap
      .map((item) => {
        const lastmod = item.lastmod
          ? `<lastmod>${item.lastmod}</lastmod>`
          : '';
        const changefreq = item.changefreq
          ? `<changefreq>${item.changefreq}</changefreq>`
          : '';
        const priority = item.priority
          ? `<priority>${item.priority}</priority>`
          : '';

        return `  <url>
    <loc>${item.url}</loc>
    ${lastmod}
    ${changefreq}
    ${priority}
  </url>`;
      })
      .join('\n');

    const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;

    // Write to public directory
    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemapXML);

    console.log(`Sitemap generated successfully at ${outputPath}`);
    console.log(`Total URLs: ${sitemap.length}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
