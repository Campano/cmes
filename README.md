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

In `.mdx` pages, `<Site field="email" />` prints a value from `src/data/site.json`.
Post categories are tags; each one has an archive page at `/{category}/`.
A post's URL comes from its front matter `slug`, not from the folder name.

TODO: replace the placeholder `contactFormUrl` in `src/data/site.json` with the real Google Form URL.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs `npm ci && npm run build` on every PR and push to `main`; broken links or images fail the build. Cloudflare Pages deploys (production from `main`, previews for PRs). The Node version lives in `.nvmrc`.
