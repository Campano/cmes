import { getCollection } from 'astro:content';
import site from '../../content/site.json';
import { slugify, withSlash } from './slug.js';

export { slugify, withSlash };

export const newsPath = '/noticies/';

export function categoryPath(slug) {
  return withSlash(`${newsPath}${slug}`);
}

export const categories = [
  { label: 'Club', slug: 'club' },
  ...site.sections.map((s) => ({
    label: s.label,
    slug: String(s.to).replace(/^\/|\/$/g, '').split('/').pop(),
  })),
];

export function folderOf(entry) {
  const fp = String(entry.filePath || entry.id).replace(/\\/g, '/');
  const fromPath = fp.match(/(?:^|\/)noticies\/([^/]+)\//);
  if (fromPath) return fromPath[1];
  const dated = String(entry.id).match(/(\d{4}-\d{2}-\d{2}-[^/]+)/);
  if (dated) return dated[1];
  return String(entry.id).replace(/\/index$/, '');
}

export function permalinkOf(entry) {
  return withSlash(`${newsPath}${folderOf(entry)}`);
}

export function imageOf(entry) {
  const image = entry.data.image;
  if (!image) return undefined;
  if (/^(https?:)?\//i.test(image) || /^[a-z]+:/i.test(image)) return image;
  return `/_posts/${folderOf(entry)}/${image.replace(/^\.\//, '')}`;
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString('ca', { dateStyle: 'long', timeZone: 'UTC' });
}

export function isoDate(d) {
  return new Date(d).toISOString().slice(0, 10);
}

export async function getPosts() {
  const entries = await getCollection('posts');
  return entries
    .map((entry) => ({
      ...entry,
      permalink: permalinkOf(entry),
      imageUrl: imageOf(entry),
    }))
    .sort((a, b) => b.data.date - a.data.date);
}

export function postsInCategory(posts, slug) {
  return posts.filter((p) => p.data.tags.some((t) => slugify(t) === slug));
}

export function categoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}
