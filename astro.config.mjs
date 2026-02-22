// @ts-check

import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { SITE_URL } from "./src/consts"

import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap(), icon()],

  vite: {
    plugins: [tailwindcss()],
  },
});