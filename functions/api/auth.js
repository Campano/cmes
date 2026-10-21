// GET /api/auth – starts the GitHub OAuth flow for the CMS (opened in a popup).
export function onRequestGet({request, env}) {
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.search = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${url.origin}/api/callback`,
    // Sveltia asks for e.g. `repo,user`; grant only the repo scope.
    scope: url.searchParams.get('scope')?.split(',').includes('public_repo') ? 'public_repo' : 'repo',
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
