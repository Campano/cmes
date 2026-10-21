# AGENT.md — Architect memory (source of truth)

## Mission
Replace https://cmesoller.com/ with a Docusaurus site + Sveltia CMS (Decap-compatible; was Decap until D18).
Non-technical editors → CMS changes go through PRs (`editorial_workflow`).

## Principles
- KISS, DRY, concise over perfectly custom.
- Minimal dependencies. Beautiful, short CI/CD. Reusable infra.
- Repo stays clean: no generated/scraped junk committed.

## Roadmap
1. [x] Audit current site → docs/audit.md
2. [x] Docusaurus clone (d9bb397). Fix-up pending: per-post images, Google Form link, drop cookie page
3. [ ] Add Decap CMS + test editorial (PR) workflow
4. [ ] Choose target infra
5. [ ] Deploy on test domain
6. [ ] Migrate production domain

## Decisions
| # | Decision | Status |
|---|----------|--------|
| D1 | Git host: GitHub personal account | approved |
| D2 | Hosting: Cloudflare Pages, free tier only | approved |
| D3 | Test domain: platform default (*.pages.dev) | approved |
| D4 | Fidelity: same content/structure, Docusaurus-default design, close look | approved |
| D5 | Editors: 1–3 people; auth method pending CEO (see log) | pending |
| D6 | PR reviewer/merger: CEO | approved |
| D7 | Swarm: local + cloud agents allowed (cloud needs remote) | approved |
| D8 | DNS: no access yet; CEO obtains later; site must be ready before | noted |
| D9 | Email usage on domain: unknown until CEO controls domain → recreate MX/SPF/DKIM at cutover | noted |
| D10 | Contact: link to a Google Form (no form backend) | approved |
| D11 | Analytics: Cloudflare Web Analytics (cookieless, no banner) | approved |
| D12 | Events: Decap-managed `events` collection (start fresh, no 2022 import) | approved |
| D13 | Bank account + board stay public | approved |
| D5 | Editor auth: GitHub account per editor + OAuth proxy on Cloudflare | approved |
| D15 | Media: one folder per post `blog/YYYY-MM-DD-slug/index.md` + images; Decap `path` + `media_folder: ''`; `parseFrontMatter` hook adds `./` to the front-matter image; shared images in static/img | approved |
| D14b | Cloud agents may push their OWN branch and open a PR; never push/merge main | proposed |
| D18 | CMS: switch Decap → Sveltia CMS (PR #1, sveltia branch) after a real GitHub login test on pages.dev | proposed |
| D16 | contactFormUrl placeholder OK for now; old /wp-content/uploads links may break | approved |
| D17 | Legal pages rewritten for the new stack (086852c); CEO/lawyer to review FBME, Google entity, retention | done |
| Q1 | Club address: "Carrer de Xaloc, s/n" (legal pages) vs "27" (site.json)? | pending CEO |

## Coordination rules (lessons)
- Only one local agent writes to the repo at a time; never resume an agent until its previous run has clearly finished.
- Long commands: adequate block_until_ms so nothing is silently backgrounded.
- Agents commit locally only; CEO pushes.
- Cloud Web Analytics must be enabled at deploy (the legal pages depend on it).
| D14 | Repo: https://github.com/Campano/cmes (origin added). CEO pushes manually; agents commit locally only, never push | approved |
| D14b | Cloud agents may push their OWN branch and open a PR; only the CEO merges into main | approved |
| D18 | CMS: Sveltia CMS replaces Decap (PR #1 https://github.com/Campano/cmes/pull/1). Real GitHub login tested at deploy | approved |

## Current site (from docs/audit.md)
WordPress+Elementor Pro on LucusHost (shared, also DNS + mail). Registrar registrador.es, exp 2027-03-15.
11 pages, 51 posts (2022–2024, 5 categories), ~186 media/60MB. Catalan only (legal in Spanish).
URLs: posts `/{category}/{slug}/`, pages `/{slug}/` → must preserve.
Integrations: contact form (Elementor), GA4, cookie banner, Instagram feed, 2022 events calendar.
RISK: MX on same shared host — recreate mail records before cutover.

## Working defaults (reversible, until CEO says otherwise)
- Drop Instagram feed. Events: new CMS collection (D12), no 2022 data.
- Contact: Google Form link (D10). Analytics: CF Web Analytics at deploy (D11).

## Open questions → CEO
See AGENT_LOG.md latest entry.

## Team
- Architect (me): coordination, decisions, reviews.
- Worker "audit": site inventory → `docs/audit.md`.

## Known env facts
- Local: macOS, node + npm via Homebrew. `gh` CLI NOT installed.
- Repo: /Users/lokoda/dev/personal/cmes, empty, no remote.
