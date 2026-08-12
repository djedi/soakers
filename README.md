# Soakers — soakers.biz

Marketing website for [Soakers](https://soakers.biz/), a family-owned hot tub and
swim spa dealer in Midvale, Utah. Authorized dealer for Artesian Spas, Nordic Hot
Tubs, TidalFit Swim Spas, South Seas Spas, Garden Spas, and Covana covers, with
full sales, service, repair, parts, and financing.

Built as a static site with [Eleventy](https://www.11ty.dev/) 3 and
[Sass](https://sass-lang.com/), hosted on [Netlify](https://www.netlify.com/).

## Tech stack

| Layer     | Choice |
|-----------|--------|
| SSG       | Eleventy 3 (ESM config in `eleventy.config.mjs`) |
| Templates | Nunjucks (layouts/includes), Liquid (content pages) |
| Styling   | Sass → PostCSS (autoprefixer + cssnano) |
| CSS purge | [PurgeCSS](https://purgecss.com/) trims the vendored Bootstrap CSS |
| Images    | `eleventy-img` → responsive AVIF/WebP sets |
| Icons     | Font Awesome 6 subset (~30 glyphs, self-hosted) |
| Hosting   | Netlify (deploy previews per PR, production on `main`) |

## Project structure

```
eleventy.config.mjs   Eleventy config: shortcodes, filters, passthroughs, MD library
netlify.toml          Build settings, cache headers, redirects, security headers
src/
  _data/              Global data (site meta, navigation)
  _generate/          Generated output templates (sitemap.xml)
  _includes/          Layouts and partials (base, nav-header, footer, sections)
  pages/              Site pages (markdown + Nunjucks)
  sass/               Source stylesheets (design system)
  css/                Compiled CSS output (gitignored build artifact)
  js/                 Vanilla JS (nav, dropdowns, lightbox — no framework)
  img/                Source images + gallery
  fonts/              Font Awesome subset (CSS + woff2)
  llms.txt            LLM/AI-agent friendly site summary (also served at /llms.txt)
```

## Prerequisites

- **Node.js 22+** (Node 18 is too old: `eleventy-img` requires >=22, and
  `sass` 1.102 needs Node >=22.12 for its ESM shim). Node 20.19+ also works for
  the Sass piece but 22 LTS is the supported floor. A `.nvmrc` pins `22`.

## Getting started

```sh
npm install      # install dependencies
npm start        # dev server at http://localhost:8080 (Eleventy + Sass watch)
```

`npm start` runs the Eleventy dev server with live reload and watches Sass in
parallel. Edit `src/sass/` or any file under `src/` and the browser refreshes.

## Scripts

| Script       | What it does |
|--------------|--------------|
| `npm start`  | Dev server + Sass watch (port 8080) |
| `npm run build` | Production build into `public/` |
| `npm run lint` / `npm run lint:fix` | Stylelint 17 on `src/sass/` (BEM naming, SMACSS property order) |
| `npm run purge` | Purge + minify vendored CSS (`public/css/vendor.css`) |
| `npm run bump` | Bump `package.json` version without a git tag |

## Build pipeline

`npm run build` runs, in order:

1. **`scss`** — compile `src/sass/` → `src/css/` with Sass.
2. **`vendor`** — concatenate the checked-in Bootstrap 4 CSS into
   `src/css/vendor.css`.
3. **eleventy** — render all templates/pages into `public/`, copying static
   assets (CSS, JS, fonts, images, `robots.txt`, `llms.txt`).
4. **`css`** — PostCSS: autoprefix + minify all compiled CSS.
5. **`purge`** — PurgeCSS removes unused Bootstrap rules by scanning the built
   HTML (`scripts/purge-css.mjs`), then minifies again. The vendored bundle
   drops from ~193 KB to ~73 KB.

Output lands in `public/`, which is what Netlify publishes.

### Images

Source images under `src/img/` are processed at build time by `eleventy-img`
into AVIF and WebP, in multiple widths, into `public/img/optimized/` — the
`image` shortcode emits `<picture>`-compatible markup with `loading="lazy"`
(hero images get `fetchpriority="high"`).

### Fonts & icons

Icons are a self-hosted Font Awesome subset (~30 glyphs) in
`src/fonts/fontawesome-subset.css` + `fa-solid-900.woff2` — no icon CDN, no
layout shift. If you need a new glyph, extend the subset. Never run
`pyftsubset` in place; restore the original woff2 first with
`git show d942aa4:src/fonts/fa-solid-900.woff2 > src/fonts/fa-solid-900.woff2`.

## Cache busting

Eleventy has no built-in cache busting, so `eleventy.config.mjs` registers an
`assetHash` shortcode that appends a content hash to every asset URL:

```html
<link rel="stylesheet" href="/css/style.css?v=30f34946" />
```

The hash is the first 8 chars of the file's md5, so:
- unchanged files keep the same URL (browsers/CDNs keep caching — no wasted downloads),
- any edit produces a new URL (visitors get fresh assets immediately).

Netlify pairs this with 1-year `immutable` cache headers on `/css/*`, `/js/*`,
`/fonts/*`, and `/img/optimized/*` (see `netlify.toml`).

## SEO & AI agents

- **`src/llms.txt`** — a machine-readable summary of the business (hours,
  brands, service area, key pages) served at `/llms.txt` for LLM crawlers.
- **`sitemap.xml`** — generated at build time with last-modified dates.
- **`robots.txt`** — allows crawling; utility pages (`/framed/`, `/blank/`,
  `/og-preview/`) are `noindex` via Netlify headers.
- **Metadata** — per-page titles/descriptions from `src/_data/meta.js` and page
  front matter; Open Graph support (incl. a custom `/og-preview/` page).
- **Performance** — no jQuery/Bootstrap JS, ~6 KB of vanilla JS, AVIF/WebP,
  subset fonts, purged CSS, preloaded hero images.

## Deployment

Netlify builds from the repo on every push:

- **PRs** get deploy previews (e.g. `deploy-preview-28--soakers.netlify.app`)
  with Header/Redirect rule checks.
- **`main`** deploys to production (https://soakers.biz).

### Netlify gotchas (read before touching `netlify.toml`)

- **Node version**: the build image's default Node (18) breaks this toolchain,
  so `NODE_VERSION` is pinned under `[build.environment]`. Use a **full
  version** (`"22.20.0"`) — a bare major (`"22"`) is silently ignored and the
  build falls back to the image default.
- **Install**: `install_command = "npm ci --include=dev"` — deterministic
  installs that always include devDependencies (the entire build toolchain
  lives there).
- Netlify hides failed-build logs from the API. If a deploy fails, ship the
  build output into the artifact as a diagnostic (write `public/build.log`
  from the build command and read it from the preview URL), then remove it.

## Security

- `npm audit` is at **0 vulnerabilities**; the dependency set is kept current
  (Dependabot is enabled — fix alerts promptly, same-day when possible).
- `netlify.toml` applies security headers site-wide: HSTS, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and a
  report-only CSP (switch to `Content-Security-Policy` once verified clean in
  the browser console).

## Troubleshooting

- **Stale styles after a deploy** — hard-refresh once; asset URLs carry
  content hashes so a redeploy can't serve stale CSS/JS.
- **Lint errors after a rule change** — `npm run lint:fix` auto-fixes ordering
  and notation issues; re-run `npm run build` afterward (fixes touch `src/sass/`,
  which feeds the build).
- **Vendor CSS growing** — `npm run purge` safelists Bootstrap's dynamic
  classes (see `scripts/purge-css.mjs`); add new classes to the safelist rather
  than disabling the purge.
- **New icon missing** — the FA subset only contains ~30 glyphs; extend the
  subset (see Fonts & icons above), never hotlink an icon CDN.
