import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { structureTool } from 'sanity/structure';

// https://astro.build/config
export default defineConfig({
  integrations: [
    sanity({
      projectId: 'a1odqyb1', // Replace this with your actual project ID
      dataset: 'production',
      // Set useCdn to false if you're building statically
      apiVersion: '2025-03-02',
      useCdn: false,
      studioBasePath: '/studio',
    }),
    react({
      include: ['**/*.tsx', '**/*.jsx'],
    }),
    tailwind(),
  ],
});
