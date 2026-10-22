// GET /api/token – fetched by /admin/index.html to sign the editor in without Sveltia's sign-in screen.
// Same Access JWT check as auth.js; same-origin only, never cached.
import {check} from './auth.js';

export async function onRequestGet({request, env}) {
  // JWT first, so opening /api/token directly in the browser shows the real reason.
  const reason = (await check(request, env)) || (request.headers.get('Sec-Fetch-Site') !== 'same-origin' && 'not-same-origin');
  const headers = {'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'};
  return reason
    ? new Response(`Forbidden: ${reason}`, {status: 403, headers})
    : Response.json({token: env.GITHUB_TOKEN}, {headers});
}
