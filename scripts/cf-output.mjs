import { cpSync, existsSync } from 'node:fs';

const dist = existsSync('dist');
const buildBefore = existsSync('build');
const onPages = Boolean(process.env.CF_PAGES);

// #region agent log
const payload = {
  sessionId: '15155e',
  runId: 'pre-fix',
  hypothesisId: 'A',
  location: 'scripts/cf-output.mjs',
  message: 'output dirs after astro build',
  data: { dist, buildBefore, onPages, node: process.version },
  timestamp: Date.now(),
};
console.log('cf-output', JSON.stringify(payload.data));
fetch('http://127.0.0.1:7908/ingest/63ddbb8f-c47f-4720-8df1-9ce1f52001e0', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '15155e' },
  body: JSON.stringify(payload),
}).catch(() => {});
// #endregion

// Pages project is still set to output "build" (Docusaurus leftover).
if (onPages && dist && !buildBefore) {
  cpSync('dist', 'build', { recursive: true });
  console.log('cf-output: copied dist -> build');
}
