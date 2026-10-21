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
Every change becomes a pull request (`publish_mode: editorial_workflow`); the editor guide is [docs/guia-editors.md](docs/guia-editors.md).
GitHub login goes through two Cloudflare Pages Functions on the same site: `functions/api/auth.js` and `functions/api/callback.js`.
Alternative without OAuth: **Sign In with Token**, pasting a GitHub personal access token (classic `repo` scope, or fine-grained
with Contents + Pull requests read/write on this repo). The token stays in that browser.
To upgrade, bump the version in `static/admin/index.html` and recompute the SRI hash:
`curl -sL <script URL> | openssl dgst -sha384 -binary | openssl base64 -A`.

**Local test** (writes straight to your working tree, no GitHub, no PRs; Chrome/Edge only):
`npm start`, open http://localhost:3000/admin/index.html → **Work with Local Repository** → pick the repo folder.

**One-time setup (CEO)**

1. GitHub OAuth App (Settings → Developer settings → OAuth Apps → New): homepage `https://<site>`,
   callback URL `https://<site>/api/callback`. One app per domain (e.g. one for `*.pages.dev`, one for `cmesoller.com`).
2. Cloudflare Pages → project → Settings → Variables and secrets (Production): `GITHUB_CLIENT_ID`,
   `GITHUB_CLIENT_SECRET` (as a secret). Redeploy afterwards.
3. Scope: the functions request `repo` (needed for a private repo). If the repo is public, set
   `auth_scope: public_repo` in `static/admin/config.yml` to ask for less.
4. Editors: GitHub → repo Settings → Collaborators → add each editor's GitHub account with **Write** access.
5. Branch protection on `main` (Settings → Branches/Rules): require a pull request with 1 approval, require the
   CI `build` status check, and don't allow bypassing. Without it, an editor's "Publica" merges straight to `main`.

**OAuth manual test** (after deploy): open `/admin/` → "Inicia la sessió amb GitHub" → GitHub asks to authorise the app →
the popup closes and the CMS loads. Then save a test post and check that a `cms/…` branch and a PR appear on GitHub;
`/api/callback?code=x&state=y` opened directly must contain `authorization:github:error` (view source), never a token.

TODO: replace the placeholder `contactFormUrl` in `src/data/site.json` with the real Google Form URL.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs `npm ci && npm run build` on every PR and push to `main`; broken links or images fail the build. Cloudflare Pages deploys (production from `main`, previews for PRs). The Node version lives in `.nvmrc`.
