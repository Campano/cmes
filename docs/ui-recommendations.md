# UI recommendations — look better than cmesoller.com

Plan only (2026-10-22). No UI was implemented. Compared [cmesoller.com](https://cmesoller.com/) (WordPress + Elementor) with [cmes-rmp.pages.dev](https://cmes-rmp.pages.dev) (Docusaurus 3.10) on desktop (1440×900) and mobile (390×844). Screenshots: `docs/ui-audit/`.

**Constraints (from AGENT.md + this brief):** KISS, DRY, Infima/Docusaurus custom CSS + a few React/MDX tweaks. No extra CSS frameworks, no new npm deps, not pixel-perfect, not a SaaS landing page. Goal: more alive and more professional than the Elementor original.

**How to use this list:** tick boxes. P0 = do before the public cutover if we want “looks better”. Size S/M/L is agent effort, not calendar time. **CMS risk** is the thing to watch: editors publish markdown/MDX straight to `main`.

---

## Screenshot pairs

| # | What it shows |
|---|---|
| [01 home desktop](ui-audit/01-home-desktop-old.jpg) vs [new](ui-audit/01-home-desktop-new.jpg) | Original: logo lives in a transparent nav, photo breathes. New: solid bar + second giant logo covering the hikers. |
| [02 home mobile](ui-audit/02-home-mobile-old.jpg) vs [new](ui-audit/02-home-mobile-new.jpg) | Original: hamburger in the photo, sections visible in the first screen. New: sticky Docusaurus bar eats the sky; sections below the fold. |
| [03 post](ui-audit/03-post-desktop-old.jpg) vs [new](ui-audit/03-post-desktop-new.jpg) | Original: script title + Instagram rail. New: leftover **Darreres notícies** docs sidebar; cleaner article, less club-y. |
| [04 category](ui-audit/04-category-desktop-old.jpg) vs [new](ui-audit/04-category-desktop-new.jpg) | Original: photo cards (magazine). New: stacked blog list + sidebar (documentation site). Biggest visual downgrade. |
| [05 el-club](ui-audit/05-el-club-desktop-old.jpg) vs [new](ui-audit/05-el-club-desktop-new.jpg) | Original: Serra photo + script title. New: markdown dump + right-hand **table of contents** (docs chrome). |
| [06 blog](ui-audit/06-blog-desktop-old.jpg) vs [new](ui-audit/06-blog-desktop-new.jpg) | Original: same card grid as categories. New: year-column changelog titled “Totes les notícies”. |

Also browsed `/fes-te-soci`, `/contacte`, `/agenda` (original `/calendari/`), `/local-social`, legal pages. Notes below, no extra image files.

---

## Theme leftovers (inventory)

Read: `src/css/custom.css`, `src/components/Home/`, `src/pages/`, `src/theme/`, `docusaurus.config.js`, `src/data/site.json`, `plugins/blog.js`.

| Chrome | Status | Action |
|---|---|---|
| Search / Algolia | Off (not configured). Original had none. | Leave off. |
| Docs sidebar | `docs: false`. | Leave off. |
| Dark-mode toggle | `colorMode.disableSwitch: true`, locked dark. Palette CSS is **only** under `html[data-theme='dark']`. | **Keep locked.** A toggle would invent a light Infima theme. CEO call below. |
| “Edit this page” | No `editUrl`. | Leave off. |
| Blog sidebar “Darreres notícies” | Default blog chrome on posts + category pages. | **Hide** (`blogSidebarCount: 0`). |
| MDX page TOC (right rail) | On `/el-club`, `/fes-te-soci`, `/contacte` (2 items!), `/local-social` (1 item), legal pages. | **Hide** (CSS or wrap `MDXPage`). Do not put `hide_table_of_contents` in front matter — CMS page fields do not include it, editors may strip it. |
| Heading permalink `#` | Docusaurus default on every `h2`. | Hide via CSS (`hash-link { display: none }`). |
| “Totes les seccions” | Tag-list link on category pages. Tags index route is dropped (`plugins/blog.js`), so the link goes to `/` (home). | **Remove** the tags-list link (swizzle or CSS). |
| Infima `--ifm-color-primary: #949cb3` | That is the original **secondary** grey-blue. Contact CTA is a washed grey pill. Original submit was accent red `#c03847`. | Point primary or `.button--primary` at `--cmes-accent`. |
| Footer | One line: `Facebook ↗ · Twitter ↗ · Instagram ↗ ·` legal. External-link icons are docs-ish. Cookie policy still listed though the site has no cookies (page text is correct). | Quiet footer: icon-less labels, keep legal. |
| `/blog/` archive | Default `BlogArchivePage` (years as columns). | Replace with the same card grid as home/categories, or drop the archive and paginate. |

Nav that fights itself: original **Seccions** dropdown *is* the club (4 sports). New label is **Blog**, and the sports are buried under it plus “Totes les notícies” + “Actualitat”. “Blog” is a CMS word; members think in seccions.

---

## A. SIMPLER / CLEANER (polish)

Clutter, unused chrome, spacing/type, nav, WordPress-y tables, footer, legal, empty states, mobile nav.

- [ ] **P0 · S · hide docs chrome** — TOC, blog sidebar, heading hashes, “Totes les seccions”. **Why better:** original never looked like a documentation site; this is the fastest way to stop looking like one. **Risk:** none (theme/CSS). CMS pages stay as they are.

- [ ] **P0 · S · fees table usable on a phone** — `overflow-x: auto` + tighter cell padding; freeze the “Modalitat” column if easy. **Why better:** original UAEL tables were ugly but at least full-width; new Infima table is clipped (`Ma…` / `56·`) with huge empty cells. **Risk:** CSS only; editors keep the markdown table.

- [ ] **P0 · S · stop the grey primary button** — contact “Formulari de contacte” is Infima `button--primary` in `#949cb3`. Use `--cmes-accent` for filled CTAs; keep the outline pill for nav “Fes-te soci”. **Why better:** original’s one strong move was a red Enviar. **Risk:** none.

- [ ] **P1 · S · footer as a club footer, not a docs footer** — drop the ↗ icons; “Twitter” → keep the URL, label “X” or leave “Twitter” (CEO). Cookie policy can stay (legal truth: we don’t use cookies) but it does not need equal weight with Instagram. **Why better:** original had three icon buttons + a small legal row. **Risk:** `site.json` `social[].label` is CMS-editable.

- [ ] **P1 · S · board tables are definition lists, visually** — keep the markdown tables (CMS) but CSS them as role/name rows without the empty header cell and zebra Excel look. Highlight **2026/2030** as current; collapse older terms in `<details>` (that *would* be MDX — **CMS risk: M**, editors must not flatten the tags). Safer: CSS `:first-of-type` + a bit of margin, leave history visible. **Why better:** original also used tables, but with photo banners; we can beat both by not looking like WordPress admin. Empty Barranquisme cell in 2026/2030 is a **content** hole (CEO/editors), not CSS.

- [ ] **P1 · S · legal pages: hide TOC, don’t restyle as marketing** — they are Spanish on a Catalan site (already D17). Hide the rail; keep the text. **Why better:** original had no docs outline. **Risk:** none. Do not rewrite copy here.

- [ ] **P1 · S · local-social gallery actually grids** — CSS targets `p:has(> img + img)` but the CMS page puts **one image per paragraph**, so photos stack full-width. Fix the selector (adjacent `p:has(>img)`) or a tiny MDX wrapper. **Why better:** original had a 7-image gallery. **Risk:** CSS = none; asking editors to put images in one paragraph = they will forget.

- [ ] **P2 · S · empty agenda state is already fine** (`Torna-hi aviat!`). Do not add a fake calendar skeleton. **[PROVA] events must leave before launch** (CMS, not UI).

- [ ] **P2 · S · mobile nav: keep the Docusaurus drawer** — it is cleaner than Elementor’s hamburger-in-the-photo. Put “Fes-te soci” at the top of the drawer (it already is). Optional: a small outline CTA in the top bar on mobile so the action isn’t only behind the menu. **Risk:** navbar `className: navbar-cta` already exists.

---

## B. SEXIER (UI/UX) — alive mountain club, not a SaaS landing

Visual hierarchy, hero, photography, type, colour, motion, cards, CTAs, trust, calendar.

- [ ] **P0 · M · hero: one logo, one photo, one CTA** — overlay the navbar on the home hero (transparent/dark scrim), **do not** stack a second 500px logo on Guiem Raja’s picture. Keep the night-over-Sóller photo (it is the best asset on either site). **Why better:** original already does this; new covers the hikers and the town lights. We beat original by letting the photo go edge-to-edge without a cookie banner. **Risk:** Home is React (`src/components/Home`), not CMS. `_inici.md` body is CMS — do not dump all five paragraphs over the photo (see next).

- [ ] **P0 · M · category + `/blog/` as photo cards** — reuse the home card (`styles.module.css` `.card`) for tag pages and the archive. **Why better:** this is where the original still wins (magazine grid vs docs list). Beating it: drop the grey card body and the script “Continuar llegint”, keep the photo + title + date, add a section chip. **Risk:** swizzle `BlogTagsPostsPage` / replace archive component. **CMS-safe** (reads post `image` + `title` + `date`). Editors must keep a cover image.

- [ ] **P1 · S · home “El Club” is a teaser, not a wall** — five thin Lato-300 paragraphs on a 75% darkened photo are low-contrast and unread. Show 1–2 sentences + “Més sobre el club” → `/el-club/`. **Why better:** original had a “read more” toggle. We beat it with a real link instead of a JS accordion. **Risk:** `_inici.md` is CMS; either truncate in the React home (ignore extra paragraphs — **low risk**) or ask editors to shorten (**they will lengthen it again**).

- [ ] **P1 · M · seccions on the home as four photo tiles** — today they are uppercase text links (same idea as original, but original at least showed them in the first mobile screen). One still per sport (already in `static/img/` / post covers — pick four, hardcode or add optional `image` to `site.json` sections). **Why better:** original seccions were also just words; photos make the club feel like it goes outside. **Risk:** if `image` is added to `site.json`, update the CMS settings fields or the tile breaks when editors add a section. Safer: CSS + four known slugs, fallback to text.

- [ ] **P1 · M · agenda as a noticeboard, not a month grid** — original `/calendari/` widget for October 2026 is **empty** (events are from 2022). The new list is the right model. Make each event a card: date chip, section colour (slate / red / dusty rose — original legend), place, one-line description. **Why better:** a living list beats a dead calendar. Do **not** rebuild Essential Addons. **Risk:** `agenda.js` + CSS; `events.json` schema stays. CMS-safe.

- [ ] **P1 · S · contacte as a trust page** — big accent CTA to the Google Form (D10), then responsables, then address (new site already adds the street; original form page did not). Optional: one photo (the silhouette banner from the original is good, if we still have it). **Why better:** original had a heavy form + RGPD wall; we can feel more human and still convert. **Risk:** `contacte.mdx` is CMS raw MDX (`<Site field="contactFormUrl" />`). Style the existing `<Site label>` button in CSS; do not replace with a custom component the editor can delete. **Launch blocker (not UI):** `contactFormUrl` is still `forms.gle/TODO-contact-form`.

- [ ] **P1 · M · fes-te soci: 2 steps above the spreadsheet** — (1) Formulari (2) Transferència + IBAN in a copyable block, then the 2026 quotes table. **Why better:** original hid the table under a novel of caveats; we still have that novel. Hierarchy beats decoration. **Risk:** page is CMS MDX. Reorder in the markdown = editors can undo it. A small React intro above the MDX is more stable but duplicates the instructions. Prefer markdown reorder + CSS for the IBAN block.

- [ ] **P1 · S · type: keep Poppins + Lato, bump body to 400** — Lato 300 on `#171a27` is the original’s worst habit (thin grey text). We already skipped Guthen Bloots (licence unverified, amateur). Do not add a display font. **Why better:** more readable than Elementor, still the same family. **Risk:** we only self-host 300 and 700. Need a `lato-400.woff2` file (OFL, same as now) — **not an npm dep**, but it is a new font file. If we refuse new files, `font-weight: 700` for UI and keep 300 for long legal text only.

- [ ] **P1 · S · colour: CMES, not Infima** — background `#171a27`, surface `#1f2333`, accent `#c03847`, slate `#546286` / `#949cb3` for muted UI. Use red for actions and **one** heading level, not every `h1` on every page (today `article header h1` paints El Club / Contacte / legal titles all red). **Why better:** original used red as spice (script titles, Continuar llegint, Enviar). New uses it as the only heading colour, so nothing is spicy. **Risk:** CSS. CMS-safe.

- [ ] **P2 · S · motion: hover only** — card lift 2px + image zoom 1.03, 150ms. No hero parallax, no counters, no “scroll-triggered” SaaS. **Why better:** original was static; a little feedback is enough. **Risk:** CSS.

- [ ] **P2 · L · el-club photography** — original’s Serra banners made a dull page feel like Mallorca. Re-adding banners means either hard-coded images in MDX (CMS can delete) or a React layout the CMS body slots into. **Skip in sprint 1** unless the CEO insists. Current junta + dades as a clean block already beats six years of UAEL tables stacked forever — collapsing history is the 80/20.

---

## Grouped for ticking

### Quick wins (S, mostly P0)

| Tick | P | Size | Item |
|---|---|---|---|
| [ ] | P0 | S | Hide TOC, blog sidebar, `#` permalinks, “Totes les seccions” |
| [ ] | P0 | S | Mobile `overflow-x` on tables + denser cells |
| [ ] | P0 | S | Accent-red filled CTAs (contact, later fes-te soci) |
| [ ] | P1 | S | Footer without ↗; quieter cookies link |
| [ ] | P1 | S | Gallery CSS for one-image-per-paragraph |
| [ ] | P1 | S | Headings: red only on news titles, not every page |
| [ ] | P1 | S | Body type: Lato 400 (or 700 for UI) |

### Structure / IA

| Tick | P | Size | Item |
|---|---|---|---|
| [ ] | P0 | S | Nav: **Seccions** dropdown (4 sports), not “Blog”. “Actualitat” / “Totes les notícies” as one item or just `/blog/`. **CEO.** |
| [ ] | P1 | S | `/calendari/` stays as **normes**, title no longer “Calendari”. Already off the nav; linked from Agenda. **CEO: keep vs drop.** |
| [ ] | P2 | S | Cookie policy page stays (honest “we don’t use cookies”); do not add a banner. |

### Visual identity

| Tick | P | Size | Item |
|---|---|---|---|
| [ ] | P0 | M | Home hero: overlay nav, single logo, keep Guiem Raja photo. **CEO: keep this photo.** |
| [ ] | P1 | S | Palette: accent for actions, slate for mute, lock dark mode. **CEO: no light theme.** |
| [ ] | P1 | M | Home seccions as four photo tiles |
| [ ] | P2 | S | Card hover only — no motion library |

### Content presentation

| Tick | P | Size | Item |
|---|---|---|---|
| [ ] | P0 | M | Category + blog archive → photo cards (reuse home) |
| [ ] | P1 | S | Home El Club teaser + link |
| [ ] | P1 | M | Agenda event cards + section colour |
| [ ] | P1 | M | Fes-te soci: 2 steps, then table |
| [ ] | P1 | S | Contacte: accent CTA + address as trust |
| [ ] | P1 | S | Board tables restyle (CSS); current term first |
| [ ] | P2 | L | El-club photo banners (skip sprint 1) |

### Mobile

| Tick | P | Size | Item |
|---|---|---|---|
| [ ] | P0 | S | Fees table scroll |
| [ ] | P0 | M | Hero not doubled (nav overlay + no second logo) — same as desktop hero |
| [ ] | P1 | S | Keep drawer; optional Fes-te soci in the top bar |
| [ ] | P1 | S | Board tables already OK on mobile once Excel chrome is gone |

---

## Headlines a writer could improve (do not rewrite here)

1. **Home has no sentence** — only the logo. `site.json` `tagline` repeats the club name. One Catalan line under the CTA would help (“Senderisme, barrancs, escalada i curses a la Vall de Sóller”) without becoming a SaaS slogan.
2. **Diary titles** — e.g. “Cap de setmana de plena activitat”, “Dies d’intensa activitat”, “Un llarg cap de setmana que va començar dijous”. Fine as club notes; weak on a category grid. Editors can name the place or the race.
3. **`/blog/` “Totes les notícies” + subtitle “Totes les notícies del CMES”** — filler. If we keep an archive heading, “Actualitat” is enough.

---

## Proposed 1-sprint sequence (~1 day of agent time)

Do **not** start with a new calendar widget, a light theme, Guthen Bloots, or el-club banners.

1. **Chrome strip (S)** — `blogSidebarCount: 0`, hide TOC + hash links + tags-list link, accent buttons, table overflow, gallery selector, footer ↗. *Site immediately stops looking like Docusaurus docs.*
2. **Hero + nav (M)** — transparent home nav, one logo, keep the photo, rename dropdown to Seccions if CEO agrees. *Beats original by removing the cookie banner and the duplicate mark.*
3. **Cards (M)** — same card component on home, `/{seccio}/`, `/blog/`. *This is the original’s last real advantage.*
4. **Agenda + CTAs (S–M)** — event cards; fes-te soci / contacte hierarchy. *Beats the empty 2022 calendar and the grey Form button.*
5. **If anything is left** — El Club teaser, Lato 400, current junta emphasis.

**Out of sprint / not UI:** replace `[PROVA]` events; real `contactFormUrl`; address s/n vs 27 (Q1); last post is Feb 2024 (the site will feel dead until editors publish).

---

## CEO decisions (needed before or during the sprint)

1. **Dark mode** — recommend **keep locked dark** (matches original + current CSS). Do not add a toggle.
2. **Hero photo** — recommend **keep Guiem Raja** (night ridge over Sóller). Do not commission or swap.
3. **`/calendari/`** — recommend **keep as normes**, rename title, stay off the nav. Do not rebuild the month grid (it is empty in 2026 on the old site).
4. **Nav label “Blog” vs “Seccions”** — recommend **Seccions** (club language). “Blog” is for editors, not hikers.
5. **Twitter label** in the footer (`site.json`).
6. **Empty Barranquisme cap de secció 2026/2030** — fill or leave blank?
7. **Collapse old juntes** on `/el-club/` (cleaner) vs show all history (original did all years)?
