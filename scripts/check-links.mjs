import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';

const dist = join(process.cwd(), 'dist');
if (!existsSync(dist)) {
  console.error('check-links: dist/ missing');
  process.exit(1);
}

const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (extname(p) === '.html') htmlFiles.push(p);
  }
};
walk(dist);

const skip = (url) =>
  /^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(url) ||
  url.startsWith('//') ||
  url.startsWith('/api/') ||
  url.startsWith('/cdn-cgi/');

function existsInDist(pathname) {
  const clean = pathname.split('?')[0].split('#')[0];
  if (clean === '/') return existsSync(join(dist, 'index.html'));
  const rel = clean.replace(/^\//, '');
  const direct = join(dist, rel);
  if (existsSync(direct) && statSync(direct).isFile()) return true;
  if (existsSync(join(direct, 'index.html'))) return true;
  if (!rel.endsWith('/') && existsSync(join(dist, rel + '.html'))) return true;
  if (!rel.endsWith('/') && existsSync(join(dist, rel, 'index.html'))) return true;
  return false;
}

const broken = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const from = '/' + dirname(file.slice(dist.length + 1)).replace(/\\/g, '/');
  const page = from.endsWith('/.') || from === '/.' ? '/' : from.endsWith('/') ? from : `${from}/`;
  for (const match of html.matchAll(/\s(?:href|src)="([^"]*)"/gi)) {
    const url = match[1].trim();
    if (!url || skip(url) || !url.startsWith('/')) continue;
    if (!existsInDist(url)) broken.push(`${page} → ${url}`);
  }
}

if (broken.length) {
  console.error(`check-links: ${broken.length} broken internal link(s):`);
  for (const b of [...new Set(broken)].sort()) console.error('  ' + b);
  process.exit(1);
}

console.log(`check-links: ok (${htmlFiles.length} html files)`);
