// GET /api/auth – starts the GitHub OAuth flow for Decap CMS (opened in a popup).
export function onRequestGet({request, env}) {
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.search = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${url.origin}/api/callback`,
    scope: url.searchParams.get('scope') === 'public_repo' ? 'public_repo' : 'repo',
    state,
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.href,
      'Set-Cookie': `__Host-decap_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
