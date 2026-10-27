# CMES – cmesoller.com

Website of the Club de Muntanya i Escalada Sóller, built with [Astro](https://astro.build/).

```sh
npm install
npm start          # dev server at http://localhost:3000
npm run build      # static site in dist/ (fails on broken internal links)
npm run serve      # preview the build (also at :3000)
```

## Cloudflare Pages

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Output directory | `dist` (or leave `build`: the build copies `dist` → `build` on Pages) |
| Node version | `.nvmrc` (24) |

Keep the project **static** (`dist` + root `functions/`). Do not add the Astro Cloudflare adapter: Access auth lives in `functions/api/*` as Pages Functions.
Do not add `wrangler.toml`: it moves env vars out of the dashboard and Functions then miss `CF_ACCESS_*` / `GITHUB_TOKEN`.

Auth env vars stay in the dashboard (Production): `GITHUB_TOKEN`, `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`.

## Content

| What | Where |
|---|---|
| News posts, one folder each with its images (`cover.jpg` = featured image) | `content/noticies/YYYY-MM-DD-slug/index.md` |
| Pages (URL = file name) | `content/pages/` |
| Home intro text | `content/pages/_inici.md` |
| Shared images (logo, page photos) | `public/img/` |
| PDFs (estatuts, reglament…) | `public/docs/` |
| Site settings (email, address, IBAN, contact form URL, social links, sections) | `content/site.json` |
| Redirects for old WordPress URLs (Cloudflare Pages) | `public/_redirects` |
| Calendar events (page `/calendari/`, past events collapsed) | `content/events.json` |

In `.mdx` pages, `<Site field="email" />` prints a value from `content/site.json`.
Post categories are tags; each one has an archive page at `/noticies/{category}/`.
A post's URL is `/noticies/{folder}/` (`permalinkOf` in `src/lib/posts.js`). List URLs
`/blog/` and `/{category}/` redirect to `/noticies/` and `/noticies/{category}/`.

## CMS (Sveltia)

Editors use [Sveltia CMS](https://sveltiacms.app/) at `/admin/` (`public/admin/`, loaded from a pinned CDN with SRI, no npm dependency).
**Desa** commits straight to `main` and the site redeploys in 1–2 minutes; the editor guide is [docs/guia-editors.md](docs/guia-editors.md).
Safety nets: CI on every push, Cloudflare keeps serving the last good deployment if a build fails, and `git revert`.
Editors need no GitHub account: [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/) (one-time PIN
by email) protects `/admin/` and `/api/`. `/admin/index.html` then fetches a shared GitHub token from `functions/api/token.js`
(same-origin only, never cached) and stores it as Sveltia's session, so the CMS opens without its own sign-in screen.
Both `token.js` and the fallback **Inicia la sessió amb GitHub** popup (`functions/api/auth.js`) check the Access JWT again
(signature, `aud`, `iss`, expiry). **Tanca la sessió** also logs out of Access.
To upgrade Sveltia, bump the version in `public/admin/index.html` and recompute the SRI hash:
`curl -sL <script URL> | openssl dgst -sha384 -binary | openssl base64 -A`.
After every Sveltia upgrade, check the `sveltia-cms.user` session key: `/admin/` must still open without the sign-in button.

**Local test** (writes straight to your working tree, no GitHub; Chrome/Edge only):
`npm start`, open http://localhost:3000/admin/index.html → **Work with Local Repository** → pick the repo folder.

**One-time setup (CEO)**

1. **GitHub token**: GitHub (owner or bot account) → Settings → Developer settings → Fine-grained tokens → Generate:
   resource owner `Campano`, expiration 1 year (custom date), only repository `Campano/cmes`, permissions
   **Contents: Read and write** (Metadata: Read-only is added automatically), nothing else. Add a calendar reminder 2 weeks before it expires.
2. **Cloudflare Zero Trust** (free plan): pick a team name (e.g. `cmes` → `https://cmes.cloudflareaccess.com`).
   Settings → Authentication → Login methods → add **One-time PIN**. Access → Applications → Add → **Self-hosted**:
   destinations `<prod domain>/admin` and `<prod domain>/api` (e.g. `cmes.pages.dev`; add `cmesoller.com` at cutover),
   login method One-time PIN, policy **Allow** → Include → Emails → the editors' emails. Save and copy the
   **Application Audience (AUD) Tag**.
3. **Cloudflare Pages** → project → Settings → Variables and secrets, **Production** only: `GITHUB_TOKEN` (type Secret),
   `CF_ACCESS_TEAM_DOMAIN` = `https://<team>.cloudflareaccess.com`, `CF_ACCESS_AUD` = the AUD tag. Delete `GITHUB_CLIENT_ID`
   and `GITHUB_CLIENT_SECRET`. Redeploy (Deployments → latest → Retry deployment).
4. **Delete the GitHub OAuth App** (Settings → Developer settings → OAuth Apps) and remove editors' GitHub collaborator access.
5. **Branch protection on `main`**: remove "Require a pull request" and do not require status checks (both block the token's
   direct pushes); CI stays informational. Keep "Block force pushes" and "Restrict deletions".

**Manual test** (after deploy): in a private window open `/admin/` → Cloudflare asks for an email and a code →
the CMS loads directly (no sign-in button). Save a test post and check the commit on `main`. **Tanca la sessió** → Cloudflare's
logout page; opening `/admin/` again asks for a new code.
`curl -i https://<site>/api/auth` and `curl -i https://<site>/api/token` must redirect to the Cloudflare login, never return a token.
**If the sign-in screen still shows**, open `/api/token` in the logged-in browser; the reason after `Forbidden:` (also shown in the
GitHub popup's "Accés denegat (…)") says what to fix: `no-env:<VAR>` var missing in Production (or not redeployed) · `no-jwt` the
Access app doesn't cover `/api` · `bad-iss` wrong team domain (`cmes`, `cmes.cloudflareaccess.com` and `https://…/` all work) ·
`bad-aud` wrong AUD tag (copy it from this Access app) · `certs-fetch` team domain unreachable · `expired` log in again ·
`bad-jwt`/`bad-alg`/`bad-sig` forged or corrupt token · `not-same-origin` JWT is valid (expected when opened directly).

**Security note**: the GitHub token reaches each editor's browser (that is how a git-based CMS works) and stays in its
local storage until **Tanca la sessió**; `/api/token` only answers same-origin requests with a valid Access JWT and is never cached.
Removing an editor from the Access policy doesn't revoke a token they already loaded: rotate it then, and at least yearly
(new token → update `GITHUB_TOKEN` → redeploy → delete the old one). Open CMS tabs pick up the new token on reload; with a
revoked token and no new one, the CMS falls back to its sign-in screen with an error.
Commits are authored by the token owner; Zero Trust → Logs → Access shows who logged in and when.

TODO: replace the placeholder `contactFormUrl` in `content/site.json` with the real Google Form URL.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs `npm ci && npm run build` on every PR and push to `main`; broken internal links fail the build. Cloudflare Pages deploys (production from `main`, previews for PRs). The Node version lives in `.nvmrc`.
