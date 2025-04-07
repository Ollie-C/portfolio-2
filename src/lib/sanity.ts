import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
