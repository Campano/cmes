// GET /api/auth – opened by Sveltia CMS in a popup. Cloudflare Access has already logged the editor in;
// we verify its JWT again (refuse if Access is misconfigured) and hand the CMS the shared GitHub token.
const b64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const json = (s) => JSON.parse(new TextDecoder().decode(b64(s)));

export async function verify(jwt, {CF_ACCESS_TEAM_DOMAIN: team, CF_ACCESS_AUD: aud}) {
  const [h, p, sig] = jwt.split('.');
  const header = json(h);
  const claims = json(p);
  if (header.alg !== 'RS256' || claims.iss !== team || ![claims.aud].flat().includes(aud) || !(claims.exp > Date.now() / 1000)) return false;
  const {keys} = await (await fetch(`${team}/cdn-cgi/access/certs`)).json();
  const alg = {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'};
  const key = await crypto.subtle.importKey('jwk', keys.find((k) => k.kid === header.kid), alg, false, ['verify']);
  return crypto.subtle.verify(alg, key, b64(sig), new TextEncoder().encode(`${h}.${p}`));
}

export async function onRequestGet({request, env}) {
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  const ok = jwt && env.GITHUB_TOKEN && (await verify(jwt, env).catch(() => false));
  const [status, content] = ok
    ? ['success', {token: env.GITHUB_TOKEN, provider: 'github'}]
    : ['error', {error: 'Accés denegat: torna a entrar a /admin/.', provider: 'github'}];
  // Decap-compatible handshake: answer only the opener, on this same origin.
  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`).replace(/</g, '\\u003c');
  const html = `<!doctype html><meta charset="utf-8"><p>Autenticant…</p><script>
window.addEventListener('message', (e) => {
  if (e.source === window.opener && e.origin === location.origin) window.opener.postMessage(${message}, e.origin);
});
window.opener.postMessage('authorizing:github', location.origin);
</script>`;
  return new Response(html, {headers: {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store'}});
}
