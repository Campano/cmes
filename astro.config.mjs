import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { remarkInjectLayout, remarkRewriteImages, siteTagsPlugin } from './src/lib/markdown.js';
import { postMediaIntegration } from './src/lib/post-media.js';

export default defineConfig({
  site: 'https://cmesoller.com',
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory' },
  server: { port: 3000, host: true },
  preview: { port: 3000, host: true },
  integrations: [mdx(), postMediaIntegration()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkInjectLayout, remarkRewriteImages],
    }),
  },
  vite: {
    plugins: [siteTagsPlugin()],
  },
});
