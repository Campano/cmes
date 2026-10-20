# AGENT_LOG.md — chronological log (append only)

## 2026-10-20
- Kickoff. Repo empty, no remote, no `gh`.
- Created AGENT.md / AGENT_LOG.md.
- Launched background worker: audit of cmesoller.com → `docs/audit.md`.
- Asked CEO: git host/account, domain/DNS access, hosting preference, editors, languages, budget, forms/analytics.
- Audit done → docs/audit.md. Launched worker "clone": Docusaurus scaffold + content import via public WP REST API (local, no remote yet).
- 15:36 clone worker halted: an unknown second writer (not in my agent tree) is editing blog/, static/img/uploads/, /tmp/cmes-import. Still active at 15:37. Clone worker left: Docusaurus 3.10.2 deps (5), 51 posts, git branch main, stale submodule removed. Asked CEO who it is.
- 15:40 CEO: no other writer. Likely cause: clone worker's own backgrounded shell. Resumed clone worker with updated decisions (contactFormUrl placeholder, no events import, drop cookie-prefs page).
- Lesson: tell workers to use sufficient block_until_ms and check for their own background shells.
- 15:43 Clone worker again saw an outside writer: a Cursor "Agents Window" (opened 15:33) running docusaurus build/serve and editing config, styles, home page. (The AGENT.md and .git/config edits were mine: notes and the origin remote.) Worker made no changes. Escalated to the CEO.
- 15:44 RESOLVED: the "outside writer" was the clone worker's original run, still going while its resumed copy ran. It committed d9bb397 (232 files, build OK, 67 old URLs kept). Not yet applied: Google Form link (contactFormUrl), dropping the cookie page. Next: per-post image layout (research running), then a fix-up pass.
- Lesson: never resume a worker before confirming its previous run has stopped.
- CEO round 2 → D9–D14. Waiting on repo URL. Events collection + Google Form link deferred to CMS step (clone worker unaware).
- CEO answers recorded as D1–D8 in AGENT.md. Open: editor auth option (D5), GitHub repo creation (no `gh` locally).
- Clone worker (2026-10-20): Docusaurus 3.10.2 (classic, JS, no docs plugin) scaffolded at repo root, dark theme tuned to the CMES palette, self-hosted Poppins/Lato (OFL).
  - Imported 51 posts (`blog/`, front matter title/date/slug/tags/image/description) and 10 pages (`src/pages/`, hand-cleaned from Elementor) via the public WP REST API; 145 referenced files in `static/img/uploads/` (24 MB). Import script kept outside the repo (/tmp/cmes-import).
  - URLs preserved natively: blog at `/`, per-post `slug: /{category}/{slug}`, categories = tags at `/{category}/` (`tagsBasePath: '/'`); `plugins/blog.js` drops the 2 routes that collide with the home. `/blog/` = post archive. Settings in `src/data/site.json` (footer, `<Site field>` in MDX).
  - Dropped: calendar events, Instagram feed, analytics, cookie banner, contact form (mailto). `static/_redirects`: /feed/, /inici/, /politica-de-privacidad/, /wp-content/uploads/*.
  - Build passes with onBrokenLinks 'throw'; screenshots `docs/audit-screenshots/clone-*.png`. Committed on `main`.
- 15:58 Clone fix-up (D15): posts moved to `blog/YYYY-MM-DD-slug/index.md` with co-located images (`cover.*` + inline); shared images in `static/img/` (+ `pages/`); `static/img/uploads/` removed. `parseFrontMatter` hook adds `./` to a bare `image` (tested both ways with a clean cache: without the hook og:image breaks, with it it's hashed).
  - Contact page: Google Form button from `contactFormUrl` in `src/data/site.json` (placeholder, TODO in README). `preferencies-de-cookies` dropped (301 to /); its link in the cookie policy is now plain text.
  - Dropped the `/wp-content/uploads/*` redirect: post images now get hashed asset URLs, so no simple DRY rule exists (open issue for hot-linked images).
  - Build OK (onBrokenLinks throw), 51/51 post URLs + 5 category pages verified; screenshots clone-home.png / clone-post.png refreshed. Committed locally, not pushed.
