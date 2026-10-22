import { createReadStream, existsSync, mkdirSync, cpSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const MEDIA = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

export function blogRoot(cwd = process.cwd()) {
  return resolve(cwd, 'blog');
}

export function copyPostMedia(destRoot, cwd = process.cwd()) {
  const src = blogRoot(cwd);
  const dest = join(destRoot, '_posts');
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const from = join(dir, name);
      if (statSync(from).isDirectory()) {
        walk(from);
        continue;
      }
      if (!MEDIA[extname(name).toLowerCase()]) continue;
      const to = join(dest, relative(src, from));
      mkdirSync(join(to, '..'), { recursive: true });
      cpSync(from, to);
    }
  };
  walk(src);
}

export function servePostMedia(req, res, next, cwd = process.cwd()) {
  const url = req.url?.split('?')[0] ?? '';
  if (!url.startsWith('/_posts/')) return next();
  const root = blogRoot(cwd);
  const rel = decodeURIComponent(url.slice('/_posts/'.length));
  const file = resolve(root, rel);
  if (file !== root && !file.startsWith(root + sep)) return next();
  if (!existsSync(file) || statSync(file).isDirectory()) return next();
  const type = MEDIA[extname(file).toLowerCase()] || 'application/octet-stream';
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', 'public, max-age=3600');
  createReadStream(file).pipe(res);
}

export function postMediaIntegration() {
  return {
    name: 'cmes-post-media',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((req, res, next) => servePostMedia(req, res, next));
      },
      'astro:build:done': ({ dir }) => {
        copyPostMedia(fileURLToPath(dir));
      },
    },
  };
}
