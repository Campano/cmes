# Audit — cmesoller.com (current site)

Audited 2026-10-20. Read-only crawl of the live site, the WP REST API (`/wp-json/wp/v2`), Yoast sitemaps, DNS and WHOIS.

**Owner:** CMES — Club de Muntanya i Escalada Sóller (mountain sports club, Port de Sóller, Mallorca). NIF G-57481228. Public contact email: `cmesoller@gmail.com`.
**Built by:** "Eva" (evasanchis.es), credited in the footer; also the WP user `eva-sanchis`. Cover photo credit: Guiem Raja Fotografia i Vídeo.

## 1. Tech fingerprint

| Item | Value |
|---|---|
| CMS | WordPress (REST API at `/wp-json/`; `wp-login.php` and `xmlrpc.php` are live) |
| Page builder | Elementor 4.3.5 + Elementor Pro, using the `hello-elementor` theme |
| Plugins seen | elementor-pro, essential-addons-for-elementor-lite (event calendar), ultimate-elementor (UAEL tables), adapta-rgpd (cookie banner), google-analytics-for-wordpress (MonsterInsights), wordpress-seo (Yoast), spotlight-social-photo-feeds (Instagram), litespeed-cache, akismet; also an `elementor-mcp` namespace |
| Server | LiteSpeed (LiteSpeed Cache, HTTP/3, HSTS with preload, X-Frame-Options SAMEORIGIN) |
| Hosting | LucusHost (Spanish shared hosting). Server `hl111.lucushost.org`, IP `135.125.41.30`, an OVH Hispano failover IP (AS16276, ES) |
| CDN | None detected (the site is served directly from LiteSpeed) |

## 2. DNS / domain

| Record | Value |
|---|---|
| Registrar | Tecnocratica Centro de Datos S.L. (registrador.es). Created 2010-03-15, **expires 2027-03-15** |
| NS | ns1/ns2/ns3.lucushost.com (DNS is hosted at LucusHost) |
| A `cmesoller.com` | 135.125.41.30 (no AAAA, no CAA) |
| `www` | CNAME to `cmesoller.com` |
| MX | `0 mail.cmesoller.com`, which resolves to **135.125.41.30, the same shared server as the website** |
| TXT (SPF) | `v=spf1 +a +mx +ip4:146.59.253.210 include:hl111.lucushost.org include:spf.lucushost.org ~all` |
| DKIM | `default._domainkey` is present (RSA 2048) |
| DMARC | none |

**Email takeaway:** mail for `@cmesoller.com` (if any mailboxes exist) is hosted on the same LucusHost cPanel account as the website. Cancelling the hosting or moving the nameservers without recreating the MX, SPF and DKIM records **will break email**. The SPF record's `+a` mechanism also authorises the web server's IP to send mail, so changing the A record changes SPF. The public contact address is Gmail, so `@cmesoller.com` mail may be unused; this needs confirming.

## 3. Page inventory

Language: **Catalan only** (`<html lang="ca">`, `og:locale ca_ES`). There is no multilingual plugin. The legal pages are written in **Spanish**, and Yoast's archive titles are also Spanish ("Todos los artículos sobre…").

| URL | Title | Purpose / content type |
|---|---|---|
| `/` | Inici | Elementor canvas. Hero with logo and "Fes-te soci" call to action, the 4 sections, an "El Club" intro text with a "read more" toggle, and the 4 latest posts as cards |
| `/el-club/` | El club | Founders, club details (founding date, NIF, federations, address, **bank IBAN**, email), and the board of directors per term (2026/2030, 2023/2026, …) in 12 UAEL tables |
| `/calendari/` | Calendari | Rules for activities, plus an Essential Addons event calendar holding **54 hand-entered events, all from 2022 (stale)**, colour-coded by section. Also links a CSV |
| `/local-social/` | Local social | Clubhouse description (climbing wall, gym, canyoning practice area), opening hours, photo gallery (7 images), and a link to the usage rules PDF |
| `/fes-te-soci/` | Fes-te soci | Membership instructions: fill in an **external Google Form**, then pay by bank transfer. 3 fee tables (UAEL) |
| `/contacte/` | Contacte | Section leads list and an **Elementor Pro form** (name, email, "addressed to" radio with 5 options, message, privacy consent checkbox) |
| `/blog/` | Blog | Post list. **`/blog/page/2/` returns 404** |
| `/avis-legal/`, `/politica-de-privacitat/`, `/politica-de-cookies/`, `/preferencies-de-cookies/` | Legal | Spanish GDPR (RGPD) boilerplate |
| `/{category}/` ×5 | Category archives | `actualitat`, `barranquisme`, `curses-per-muntanya`, `escalada`, `senderisme`. Single page, no pagination |
| `/{category}/{slug}/` ×51 | Blog posts | News and activity reports |

Totals: 11 WP pages, 51 posts, 5 categories, 0 tags, 2 users. `/feed/` is live (RSS). Author and date archives 301-redirect to `/`.

## 4. Content model → proposed Decap collections

| Collection | Count | Fields observed |
|---|---|---|
| `posts` (news) | 51 (25 from 2022, 22 from 2023, 4 from 2024; **last post 2024-02-19**) | title, date, slug, categories (1–4 per post; 16 posts have more than one), featured image (all 51), body (Gutenberg HTML, ~220 words on average, inline images, 4 galleries), excerpt, Yoast meta description (auto-generated) |
| `sections` (taxonomy) | 5 | name, slug, colour; used as categories and as homepage "Seccions" tiles |
| `events` (calendar) | 54 (2022 only) | title, start, end, allDay, description (section), colour |
| `board` / `team` | about 2 terms × ~8 roles | term, role, name. Could be a single YAML data file rather than a collection |
| `pages` (singletons) | home, el-club, local-social, fes-te-soci, contacte, calendari intro, 4 legal pages | free markdown, plus structured data (hours, fees, section leads) |
| `settings` | 1 | contact email, IBAN, address, social links, footer credits |

## 5. Assets

- Media library: 186 items listed via the API (201 counted, the rest are probably unattached or private). Of these, **173 JPEG, 6 PNG, 1 SVG**, 1 PDF (`03-Reglament-dusos-local-social.pdf`), 1 CSV (hiking calendar), and 4 font files.
- Original sizes total **≈60 MB**, plus WordPress-generated thumbnails. Many images are `-scaled` 2560px originals or WhatsApp/Facebook exports, so they should be resized when imported.
- No video embeds or iframes found in pages or posts.
- Fonts: Google Fonts **Poppins** (headings) and **Lato** (body, weights 200/300); a self-hosted custom script font **Guthen Bloots Slant** (`.woff2/.woff/.ttf/.eot`) used for archive headings; "Formosa Hanoded" referenced in CSS. The font licence for Guthen Bloots needs checking.

## 6. Features / integrations

| Feature | Current implementation | Needs a replacement? |
|---|---|---|
| Contact form | Elementor Pro form; submissions emailed via WP mail | **Yes.** Netlify Forms, Formspree, Web3Forms, or a mailto link. The "Dirigit a" routing to 5 sections must be preserved |
| Membership sign-up | External Google Form plus bank transfer | No; keep the link |
| Event calendar | Essential Addons widget, manual JSON | Yes. A Decap `events` collection plus a React calendar or list, or embed a Google Calendar |
| Analytics | GA4 `G-PLRQR389GR` via MonsterInsights | Re-add gtag, or switch to Plausible/Umami (no cookie banner needed) |
| Cookie banner | adapta-rgpd (Accept/Reject, preferences page) | Yes, if GA stays (EU/Spain law requires consent) |
| Social links | Facebook, Twitter `@cmes_soller`, Instagram `cmes_soller` | Static links |
| Instagram feed | Spotlight plugin (seen on single-post pages) | Drop, or use a static embed |
| Newsletter | None. Mailchimp appears only in privacy-policy boilerplate | — |
| Search, e-commerce, maps | None | — |
| Spam protection | Akismet | Use the form provider's spam protection or a honeypot |

## 7. Design

- **Palette** (Elementor globals): primary `#546286` (slate blue), secondary `#949CB3`, accent `#C03847` (red), dark background `#171A27`, text `#FFFFFF`. Calendar section colours: `#457B9D`, `#AA6A7D`, `#C03847`. **Dark theme** throughout.
- **Typography:** Poppins (H1 40px, H2 30px, uppercase 20px bold labels), Lato 300 at 16px for body text, and the Guthen Bloots script font for accent titles.
- **Layout:** full-width hero photo (`CMES-Fondo-Barranc.jpg`) with a large white circular logo and wordmark (`Logo-CMES-blanc.png`). Hamburger nav (El club, Seccions ▸ 4, Calendari, Local social, Contacte) and a pill-shaped "FES-TE SOCI" button. Card grids for posts. Footer has social icons, legal links and credits.
- Screenshots: `docs/audit-screenshots/01-home.jpg`, `02-contacte.jpg`, `03-category.jpg`.

## 8. SEO / URLs to preserve

- Post permalinks use the primary category: `/%category%/%postname%/` with a trailing slash, e.g. `/senderisme/transitant-pels-passos-de-deia/`. **All 51 must keep resolving** (export the list from `post-sitemap.xml`).
- Page URLs are flat slugs with a trailing slash. Category archives are at the root (`/senderisme/`). There are also `/blog/`, `/feed/`, `/sitemap_index.xml` and `/wp-content/uploads/...`. Image URLs may be hot-linked from Facebook, so either keep `/wp-content/uploads/` paths or redirect them.
- Docusaurus's default blog URLs (`/blog/YYYY/MM/DD/slug`) **differ**. Either set the blog `routeBasePath: '/'` with a per-post `slug: /{category}/{slug}` in front matter, or add host-level 301 redirects.
- Meta: Yoast titles follow `{Title} | CMES Club de Muntanya i Escalada Sóller`. Descriptions are auto-excerpted, and the home page description is broken (it is nav text). OG and Twitter cards are present (`summary_large_image`, `@cmes_soller`); the default OG image is the hero. Canonical tags are present. robots.txt allows everything.

## 9. Risks / unknowns

1. **Email:** MX is on the shared web host. We need to know whether any `@cmesoller.com` mailboxes or forwarders are in use, and who holds the LucusHost cPanel login. Do not change the nameservers or cancel the hosting until this is resolved.
2. **Access:** we need credentials for the registrar (registrador.es), LucusHost and WP admin, plus a full WXR export and an `uploads/` dump. The REST API is public enough for a scripted export if those credentials are not available.
3. **Content is stale:** last post Feb 2024, calendar 2022. Decide whether to migrate the calendar or start fresh.
4. **Personal and sensitive data:** the bank IBAN and named board members/founders are public. This is fine for a club, but confirm it is intended.
5. **Legal pages are in Spanish** and cite Elementor form, GA and Mailchimp processing. They need updating for the new stack (form provider, analytics choice).
6. **Hosting target** (Netlify, Cloudflare Pages, GitHub Pages) determines the form solution and the Decap auth backend (Netlify Identity/Git Gateway vs a GitHub OAuth proxy). Editors will need GitHub or Netlify accounts.
7. **Elementor layouts** (home, el-club tables, fees tables) must be rebuilt by hand; they do not export cleanly. Posts are clean Gutenberg HTML and can be converted to Markdown.
8. **Font licence** for Guthen Bloots Slant is unverified.
9. **Domain expiry** 2027-03-15; make sure auto-renew is on.
