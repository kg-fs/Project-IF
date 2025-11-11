// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      // Optional: Add any custom Tailwind config here
      // config: { /* ... */ }
    })
  ],

  
});