// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { SITE_URL } from "./src/consts"

import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap({
    changefreq: "monthly",
    priority: 0.9,
    lastmod: new Date()
  }), icon(), preact()],
  vite: {
    plugins: [tailwindcss()],
  },
});