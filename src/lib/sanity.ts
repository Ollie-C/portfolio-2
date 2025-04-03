import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// We get these values from astro.config.mjs, but need to define them here as well
// for direct use in React components
export const sanityConfig = {
  projectId: 'a1odqyb1',
  dataset: 'production',
  apiVersion: '2023-04-01',
  useCdn: import.meta.env.PROD, // Use CDN in production for better performance
};

// Create a client with the configuration
export const sanityClient = createClient(sanityConfig);

// Helper function for image URL building
export function urlFor(source: SanityImageSource) {
  return imageUrlBuilder(sanityClient).image(source);
}
