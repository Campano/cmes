// GET /api/token – fetched by /admin/index.html to sign the editor in without Sveltia's sign-in screen.
// Same Access JWT check as auth.js; same-origin only, never cached.
import {verify} from './auth.js';

export async function onRequestGet({request, env}) {
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  const ok =
    request.headers.get('Sec-Fetch-Site') === 'same-origin' &&
    jwt && env.GITHUB_TOKEN && (await verify(jwt, env).catch(() => false));
  const headers = {'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'};
  return ok ? Response.json({token: env.GITHUB_TOKEN}, {headers}) : new Response('Forbidden', {status: 403, headers});
}
