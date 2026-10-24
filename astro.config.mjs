import { defineConfig } from 'astro/config';

// Before deploying, replace this placeholder or provide the exact GitHub Pages host.
export default defineConfig({
  site: process.env.GITHUB_PAGES_SITE || 'https://YOUR_USERNAME.github.io',
  base: '/haomeili-plant-guide',
  output: 'static',
  trailingSlash: 'always',
});
