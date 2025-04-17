import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2025-04-17',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  if (!source) {
    return {
      url: () => '',
    };
  }
  return builder.image(source);
}
