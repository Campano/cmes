import { getPosts } from '../lib/posts.js';
import site from '../../content/site.json';

function xml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET({ site: origin }) {
  const posts = await getPosts();
  const base = String(origin ?? 'https://cmesoller.com').replace(/\/$/, '');
  const items = posts
    .map((p) => {
      const link = `${base}${p.permalink}`;
      return `<item>
        <title>${xml(p.data.title)}</title>
        <link>${xml(link)}</link>
        <guid>${xml(link)}</guid>
        <pubDate>${new Date(p.data.date).toUTCString()}</pubDate>
        ${p.data.description ? `<description>${xml(p.data.description)}</description>` : ''}
      </item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${xml(site.title)}</title>
    <link>${xml(base)}/</link>
    <description>${xml(site.tagline)}</description>
    <language>ca</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
