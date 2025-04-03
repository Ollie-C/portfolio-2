import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { structureTool } from 'sanity/structure';

// We can't use useSanityClient directly in TypeScript files
// Instead, we'll use the same configuration as in astro.config.mjs
export const sanityConfig = {
  projectId: 'a1odqyb1', // Replace this with your actual project ID
  dataset: 'production',
  // Set useCdn to false if you're building statically
  apiVersion: '2025-03-02',
  useCdn: false,
  // plugins: [structureTool()],
  studioBasePath: '/studio',
};

// Create a client with the configuration
export const client = createClient(sanityConfig);

// Function to build image URLs
export function urlFor(source: SanityImageSource) {
  return imageUrlBuilder(client).image(source);
}

// Reusable query method
export async function sanityFetch<T>({
  query,
  params = {},
}: {
  query: string;
  params?: Record<string, any>;
}): Promise<T> {
  return client.fetch<T>(query, params);
}
