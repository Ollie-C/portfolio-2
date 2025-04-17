import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource as OriginalSanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2025-04-17',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

// Re-export the SanityImageSource type from @sanity/image-url
export type SanityImageSource = OriginalSanityImageSource;

export function urlFor(source: SanityImageSource) {
  if (!source) {
    return {
      url: () => '',
    };
  }
  return builder.image(source);
}
