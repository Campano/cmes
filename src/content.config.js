import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    pattern: '*/index.md',
    base: './content/noticies',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    description: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: '*.{md,mdx}',
    base: './content/pages',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, ''),
  }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, pages };
