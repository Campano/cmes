# CMES – cmesoller.com

Website of the Club de Muntanya i Escalada Sóller, built with [Docusaurus](https://docusaurus.io/).

```sh
npm install
npm start          # dev server at http://localhost:3000
npm run build      # static site in build/
npm run serve      # preview the build
```

## Content

| What | Where |
|---|---|
| News posts, one folder each with its images (`cover.jpg` = featured image) | `blog/YYYY-MM-DD-slug/index.md` |
| Pages (URL = file name) | `src/pages/` |
| Home intro text | `src/pages/_inici.md` |
| Shared images and files (logo, page photos, PDF) | `static/img/` |
| Site settings (email, address, IBAN, contact form URL, social links, sections) | `src/data/site.json` |
| Redirects for old WordPress URLs (Cloudflare Pages) | `static/_redirects` |

| Agenda events (page `/agenda/`, past events collapsed) | `src/data/events.json` |

In `.mdx` pages, `<Site field="email" />` prints a value from `src/data/site.json`.
Post categories are tags; each one has an archive page at `/{category}/`.
A post's URL comes from its front matter `slug`; without one (new CMS posts) it is
`/{first tag}/{folder name without the date}/` (`parseFrontMatter` in `docusaurus.config.js`).

## CMS (Sveltia)

Editors use [Sveltia CMS](https://sveltiacms.app/) at `/admin/` (`static/admin/`, loaded from a pinned CDN with SRI, no npm dependency).
**Desa** commits straight to `main` and the site redeploys in 1–2 minutes; the editor guide is [docs/guia-editors.md](docs/guia-editors.md).
Safety nets: CI on every push, Cloudflare keeps serving the last good deployment if a build fails, and `git revert`.
Editors need no GitHub account: [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/) (one-time PIN
by email) protects `/admin/` and `/api/`. `/admin/index.html` then fetches a shared GitHub token from `functions/api/token.js`
(same-origin only, never cached) and stores it as Sveltia's session, so the CMS opens without its own sign-in screen.
Both `token.js` and the fallback **Inicia la sessió amb GitHub** popup (`functions/api/auth.js`) check the Access JWT again
(signature, `aud`, `iss`, expiry). **Tanca la sessió** also logs out of Access.
To upgrade Sveltia, bump the version in `static/admin/index.html` and recompute the SRI hash:
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

**Security note**: the GitHub token reaches each editor's browser (that is how a git-based CMS works) and stays in its
local storage until **Tanca la sessió**; `/api/token` only answers same-origin requests with a valid Access JWT and is never cached.
Removing an editor from the Access policy doesn't revoke a token they already loaded: rotate it then, and at least yearly
(new token → update `GITHUB_TOKEN` → redeploy → delete the old one). Open CMS tabs pick up the new token on reload; with a
revoked token and no new one, the CMS falls back to its sign-in screen with an error.
Commits are authored by the token owner; Zero Trust → Logs → Access shows who logged in and when.

TODO: replace the placeholder `contactFormUrl` in `src/data/site.json` with the real Google Form URL.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs `npm ci && npm run build` on every PR and push to `main`; broken links or images fail the build. Cloudflare Pages deploys (production from `main`, previews for PRs). The Node version lives in `.nvmrc`.
