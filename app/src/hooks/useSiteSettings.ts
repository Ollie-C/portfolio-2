import { useQuery } from '@tanstack/react-query';
import { client } from '../lib/sanity';

export interface HeroUpdate {
  enabled: boolean;
  message?: string;
  messageJa?: string;
  link?: string;
  linkText?: string;
}

export interface SiteSettings {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  heroUpdate?: HeroUpdate;
  contactEmail?: string;
  googleAnalyticsId?: string;
}

async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await client.fetch(`
      *[_type == "siteSettings"][0] {
        title,
        description,
        keywords,
        author,
        heroUpdate {
          enabled,
          message,
          messageJa,
          link,
          linkText
        },
        contactEmail,
        googleAnalyticsId
      }
    `);

    return settings || {};
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
