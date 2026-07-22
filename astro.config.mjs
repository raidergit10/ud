// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GANTI dengan domain final Anda (dipakai untuk canonical, Open Graph, sitemap & robots.txt).
  // Tanpa slash di akhir, contoh: 'https://undanganfahrulainun.com'
  site: 'https://undanganulfahrul.ijlalcode.my.id',
  vite: {
    plugins: [tailwindcss()]
  }
});