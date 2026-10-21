// GET /api/auth – opened by Sveltia CMS in a popup. Cloudflare Access has already logged the editor in;
// we verify its JWT again (refuse if Access is misconfigured) and hand the CMS the shared GitHub token.
const b64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const json = (s) => JSON.parse(new TextDecoder().decode(b64(s)));

// `cmes`, `cmes.cloudflareaccess.com` or `https://cmes.cloudflareaccess.com/` → `https://cmes.cloudflareaccess.com` (= JWT iss).
export const teamUrl = (t = '') => {
  t = t.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return t && `https://${t.includes('.') ? t : `${t}.cloudflareaccess.com`}`;
};

// '' if the request carries a valid Access JWT, else a short reason code (safe to show: no secrets, no JWT contents).
export async function check(request, env) {
  for (const k of ['CF_ACCESS_TEAM_DOMAIN', 'CF_ACCESS_AUD', 'GITHUB_TOKEN']) if (!env[k]?.trim()) return `no-env:${k}`;
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!jwt) return 'no-jwt';
  const team = teamUrl(env.CF_ACCESS_TEAM_DOMAIN);
  let h, p, sig, header, claims;
  try {
    [h, p, sig] = jwt.split('.');
    [header, claims] = [json(h), json(p)];
  } catch {
    return 'bad-jwt';
  }
  const now = Date.now() / 1000;
  if (header.alg !== 'RS256') return 'bad-alg';
  if (claims.iss !== team) return 'bad-iss';
  if (![claims.aud].flat().includes(env.CF_ACCESS_AUD.trim())) return 'bad-aud';
  if (!(claims.exp > now) || claims.nbf > now + 60) return 'expired';
  let keys;
  try {
    ({keys} = await (await fetch(`${team}/cdn-cgi/access/certs`)).json());
  } catch {
    return 'certs-fetch';
  }
  const alg = {name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256'};
  try {
    const key = await crypto.subtle.importKey('jwk', keys.find((k) => k.kid === header.kid), alg, false, ['verify']);
    return (await crypto.subtle.verify(alg, key, b64(sig), new TextEncoder().encode(`${h}.${p}`))) ? '' : 'bad-sig';
  } catch {
    return 'bad-sig';
  }
}

export async function onRequestGet({request, env}) {
  const reason = await check(request, env);
  const [status, content] = reason
    ? ['error', {error: `Accés denegat (${reason}): torna a entrar a /admin/.`, provider: 'github'}]
    : ['success', {token: env.GITHUB_TOKEN, provider: 'github'}];
  // Decap-compatible handshake: answer only the opener, on this same origin.
  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`).replace(/</g, '\\u003c');
  const html = `<!doctype html><meta charset="utf-8"><p>${reason ? `Accés denegat (${reason}).` : 'Autenticant…'}</p><script>
window.addEventListener('message', (e) => {
  if (e.source === window.opener && e.origin === location.origin) window.opener.postMessage(${message}, e.origin);
});
window.opener.postMessage('authorizing:github', location.origin);
</script>`;
  return new Response(html, {headers: {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store'}});
}
