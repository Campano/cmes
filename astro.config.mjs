import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import { remarkRewriteImages, siteTagsPlugin } from './src/lib/markdown.js';
import { postMediaIntegration } from './src/lib/post-media.js';

export default defineConfig({
  site: 'https://cmesoller.com',
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory' },
  server: { port: 3000, host: true },
  preview: { port: 3000, host: true },
  redirects: {
    '/club/': '/el-club/',
    '/blog/': '/noticies/',
    '/actualitat/': '/noticies/actualitat/',
    '/barranquisme/': '/noticies/barranquisme/',
    '/curses-per-muntanya/': '/noticies/curses-per-muntanya/',
    '/escalada/': '/noticies/escalada/',
    '/senderisme/': '/noticies/senderisme/',
  },
  integrations: [mdx(), postMediaIntegration()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkRewriteImages],
    }),
  },
  vite: {
    plugins: [
      siteTagsPlugin(),
      {
        name: 'admin-dev-route',
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            const raw = req.url ?? '';
            const path = raw.split('?')[0];
            // Dev router treats /admin/ as [page]; public/admin/index.html is the CMS shell.
            if (path === '/admin' || path === '/admin/') {
              const qs = raw.includes('?') ? raw.slice(raw.indexOf('?')) : '';
              req.url = `/admin/index.html${qs}`;
            }
            next();
          });
        },
      },
    ],
  },
});
