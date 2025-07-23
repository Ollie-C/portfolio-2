import { client } from '../lib/sanity';

export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
}

export async function generateSitemap(): Promise<SitemapUrl[]> {
  const baseUrl = 'https://olliecross.dev';
  const sitemap: SitemapUrl[] = [
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

  try {
    // Fetch all active projects
    const projects = await client.fetch(`
      *[_type == "project" && (active == true || !defined(active))] {
        slug,
        _updatedAt
      }
    `);

    // Add project URLs to sitemap
    projects.forEach((project: any) => {
      sitemap.push({
        url: `${baseUrl}/project/${project.slug.current}`,
        lastmod: project._updatedAt,
        changefreq: 'monthly',
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return sitemap;
}

export function generateSitemapXML(sitemap: SitemapUrl[]): string {
  const xmlUrls = sitemap
    .map((item) => {
      const lastmod = item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : '';
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

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}
