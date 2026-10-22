// GET /api/token – fetched by /admin/index.html to sign the editor in without Sveltia's sign-in screen.
// Same Access JWT check as auth.js; same-origin only, never cached.
import {check} from './auth.js';

export async function onRequestGet({request, env}) {
  // JWT first, so opening /api/token directly in the browser shows the real reason.
  const site = request.headers.get('Sec-Fetch-Site');
  const reason = (await check(request, env)) || (site !== 'same-origin' && 'not-same-origin');
  const headers = {'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Cmes-Reason': reason || 'ok'};
  // #region agent log
  console.log('token.js', JSON.stringify({reason: reason || 'ok', site, hasJwt: Boolean(request.headers.get('Cf-Access-Jwt-Assertion'))}));
  // #endregion
  return reason
    ? new Response(`Forbidden: ${reason}`, {status: 403, headers})
    : Response.json({token: env.GITHUB_TOKEN}, {headers});
}
