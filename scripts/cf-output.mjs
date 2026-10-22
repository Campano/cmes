import { cpSync, existsSync } from 'node:fs';

// Pages may still have Output directory = "build" (Docusaurus leftover). Astro writes dist/.
if (process.env.CF_PAGES && existsSync('dist') && !existsSync('build')) {
  cpSync('dist', 'build', { recursive: true });
}
