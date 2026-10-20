// GET /api/callback – GitHub redirects here; hands the token to Decap via the postMessage handshake.
export async function onRequestGet({request, env}) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const cookieState = request.headers.get('Cookie')?.match(/__Host-decap_state=([\w-]+)/)?.[1];
  let status = 'error';
  let content = {message: 'Invalid OAuth state, please try again.'};

  if (code && cookieState && cookieState === url.searchParams.get('state')) {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'cmes-decap'},
      body: JSON.stringify({client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code}),
    });
    const data = await res.json().catch(() => ({}));
    if (data.access_token) [status, content] = ['success', {token: data.access_token, provider: 'github'}];
    else content = {message: data.error_description || data.error || 'GitHub token exchange failed.'};
  }

  const message = JSON.stringify(`authorization:github:${status}:${JSON.stringify(content)}`).replace(/</g, '\\u003c');
  const html = `<!doctype html><meta charset="utf-8"><p>Autenticant…</p><script>
window.addEventListener('message', (e) => {
  if (e.origin === location.origin) window.opener.postMessage(${message}, e.origin);
});
window.opener.postMessage('authorizing:github', location.origin);
</script>`;
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': '__Host-decap_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}
