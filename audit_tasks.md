# Soakers.biz Website Audit

**Date:** 2026-03-09
**Site:** https://soakers.biz
**Stack:** Eleventy 1.0 / Netlify / Sass / jQuery + Bootstrap 5

---

## Critical Priority

### 3. Add a Contact Form

**Category:** Conversion / UX
The contact page has no form — only phone, email, and address. Many visitors prefer filling out a form over calling or emailing directly. A simple Netlify Forms form (name, email, phone, message) would capture leads that are currently lost.

---

## High Priority

### 8. No Skip Navigation Link

**Category:** Accessibility (WCAG 2.1 AA)
No "Skip to main content" link exists. Screen reader and keyboard users must tab through the entire navigation on every page. Add a visually-hidden skip link as the first element in `<body>`.

### 9. Missing ARIA Labels on Interactive Elements

**Category:** Accessibility

- Carousel controls lack `aria-label` attributes
- Mobile hamburger menu needs `aria-expanded` toggling
- Gallery popup triggers need `aria-haspopup="dialog"`
- Social media links in footer need `aria-label` (e.g., "Facebook")
- Back-to-top button needs `aria-label="Back to top"`

---

## Medium Priority

### 11. No Google Business Profile Link

**Category:** Local SEO / Trust
Only Facebook is linked as a social profile. Add a link to the Google Business Profile — this reinforces legitimacy and helps customers leave reviews. Also consider adding Yelp and BBB links.

### 12. Add an FAQ Section

**Category:** SEO / Conversion
No FAQ page exists. Hot tub buyers commonly search for:

- "How much does a hot tub cost?"
- "How much electricity does a hot tub use?"
- "How long do hot tubs last?"
- "What size hot tub do I need?"

An FAQ page with `FAQPage` schema markup would capture long-tail search traffic and build trust.

### 13. About Page Lacks Credibility Signals

**Category:** Trust / Marketing
The about page is thin on specifics:

- No founding year or years in business
- No team member names, photos, or bios
- No certifications or dealer badges (Artesian authorized dealer, etc.)
- No customer testimonials on this page
- No community involvement mentions

### 14. No Canonical URLs

**Category:** SEO
Pages don't include `<link rel="canonical">` tags. While Netlify handles trailing slashes consistently, canonical tags explicitly tell search engines the preferred URL and prevent any duplicate content issues.

```html
<link rel="canonical" href="{{ meta.url }}{{ page.url }}" />
```

### 15. Missing `alt` Text on Decorative Images

**Category:** Accessibility
Decorative shape/background images should have `alt=""` (empty alt) to be properly ignored by screen readers. Verify all decorative images use empty alt and all meaningful images have descriptive alt text.

### 16. Protocol-Relative URL for Analytics

**Category:** Security / Best Practice
Matomo analytics uses `//analytics.redseam.com/` (protocol-relative). This is a deprecated pattern. Change to explicit `https://analytics.redseam.com/`.

### 17. No Lazy Loading on Above-the-Fold Images

**Category:** Performance
The hero/slider images and logo should NOT have `loading="lazy"` — they are above the fold and lazy loading delays their render. Use `loading="eager"` or `fetchpriority="high"` on the hero image. Only below-fold images should be lazy loaded.

### 18. Too Many CSS Files (10+ HTTP Requests)

**Category:** Performance
The site loads 10+ individual CSS files. While HTTP/2 mitigates this somewhat, bundling into 2-3 files (critical + deferred) would reduce overhead. Consider:

- Bundle: Bootstrap + custom styles + responsive into one file
- Bundle: Owl Carousel + Magnific Popup + Meanmenu into one file
- Keep deferred: Animate + Font Awesome

### 19. No `Permissions-Policy` Header

**Category:** Security
Add a `Permissions-Policy` header to restrict browser features you don't use:

```
Permissions-Policy = "camera=(), microphone=(), geolocation=(self), payment=()"
```

---

## Low Priority

### 20. No Open Graph Image Per Page

**Category:** Social / Marketing
All pages share the same `/img/og.png` social image. Key product pages (Island Spas, Covana, etc.) should have unique OG images showing the actual products for better social sharing click-through.

### 21. RSS Feed Includes All Pages

**Category:** SEO
The Atom feed at `/feed/feed.xml` includes every page (privacy policy, terms, etc.). An RSS feed is typically for blog posts or news. Either add a blog and limit the feed to blog posts, or remove the feed entirely if there's no content strategy.

### 22. Copyright Year via JavaScript

**Category:** SEO / Robustness
The footer copyright year is inserted via JavaScript. If JS fails, the year is missing. Use Eleventy/Nunjucks to render it server-side instead:

```
© {{ "now" | date: "%Y" }} Soakers
```

### 23. No `rel="noopener"` on External Links

**Category:** Security
External links with `target="_blank"` should include `rel="noopener noreferrer"` to prevent reverse tabnapping. Audit all external links in templates and content.

### 24. WOW.js / Animate.css Adds Weight with Minimal Value

**Category:** Performance
WOW.js (8KB) + Animate.css (73KB) add ~81KB for scroll-reveal animations. These animations can feel dated and hurt performance on low-end devices. Consider removing them or replacing with lightweight CSS `@keyframes` for the 2-3 animations actually used.

### 25. Font Awesome Is Overkill

**Category:** Performance
The full Font Awesome CSS (69KB) is loaded for what appears to be ~10-15 icons. Consider:

- Using only the icons needed via Font Awesome subsetting
- Switching to inline SVG icons (zero additional HTTP requests)
- Using a lighter icon set like Heroicons or Lucide

### 26. No Image `width`/`height` Attributes on Non-Optimized Images

**Category:** Performance (CLS)
Images not processed through `eleventy-img` (logo, decorative shapes, etc.) may lack explicit `width` and `height` attributes, causing Cumulative Layout Shift (CLS). Add dimensions to prevent layout jank during load.

### 27. No `preload` for Critical Assets

**Category:** Performance
Consider adding `<link rel="preload">` for:

- The hero/slider image (LCP element)
- The primary font file (Josefin Sans bold)
  This would improve Largest Contentful Paint (LCP) scores.

### 28. Covana Page Uses Nunjucks While Others Use Markdown

**Category:** Maintainability
`covana.njk` is written in raw Nunjucks while all other product pages use Markdown. For consistency and easier content editing, convert it to Markdown with the same patterns used by other pages.

### 29. No 404 Page Styling

**Category:** UX
Check if the 404 page at `/404.html` uses the site layout and navigation, or if it's a standalone page that looks disconnected. A well-designed 404 with search/navigation helps retain visitors.

### 30. Missing `Strict-Transport-Security` (HSTS) Header

**Category:** Security
While Netlify handles HTTPS redirects, adding an explicit HSTS header prevents downgrade attacks:

```
Strict-Transport-Security = "max-age=31536000; includeSubDomains"
```

---

## Marketing & Growth Opportunities

### 31. No Blog or Content Hub

A blog with articles about hot tub maintenance, buying guides, seasonal tips, and local content (Utah lifestyle) would drive organic traffic. Even 1-2 posts/month would compound over time.

### 32. No Email Capture / Newsletter

No email signup exists anywhere on the site. A simple "Get our seasonal deals" signup in the footer or a popup would build a remarketing list.

### 33. No Customer Reviews Integration

The homepage mentions a 4.8-star rating but doesn't link to or embed actual reviews. Consider embedding Google Reviews or adding a testimonials page with verified reviews.

### 34. No "Why Soakers" Comparison Content

Competitive differentiation content (why buy from Soakers vs. big box stores or other dealers) would help convert comparison shoppers.

### 35. No Financing Details Page Content

The financing page likely just frames an external site. Adding original content about financing options, monthly payment examples, and approval process would capture "hot tub financing" searches.

---

## Summary

| Priority  | Count  | Categories                        |
| --------- | ------ | --------------------------------- |
| Critical  | 5      | SEO, Security, Conversion         |
| High      | 5      | Accessibility, Security, UX       |
| Medium    | 9      | SEO, Performance, Trust, Security |
| Low       | 11     | Performance, UX, Maintainability  |
| Growth    | 5      | Marketing, Content Strategy       |
| **Total** | **35** |                                   |
