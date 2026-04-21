import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import keystatic from '@keystatic/astro';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const keystaticConfigAbs = path.resolve(__dirname, 'keystatic.config.ts');

function vitePluginKeystaticVirtualConfig() {
  return {
    name: 'virtual-keystatic-config',
    enforce: 'pre',
    resolveId(id) {
      if (id === 'virtual:keystatic-config') {
        return keystaticConfigAbs;
      }
    },
  };
}

export default defineConfig({
  site: process.env.SITE || undefined,
  output: 'static',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  integrations: [react(), mdx(), keystatic()],
  vite: {
    plugins: [vitePluginKeystaticVirtualConfig(), tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    ssr: {
      noExternal: ['@keystatic/astro', '@keystatic/core'],
    },
  },
});
