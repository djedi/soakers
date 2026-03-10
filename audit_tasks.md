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

## Medium Priority

### 13. About Page Lacks Credibility Signals

**Category:** Trust / Marketing
The about page is thin on specifics:

- No founding year or years in business
- No team member names, photos, or bios
- No certifications or dealer badges (Artesian authorized dealer, etc.)
- No community involvement mentions

### 17. No Lazy Loading on Above-the-Fold Images

**Category:** Performance
The hero/slider images and logo should NOT have `loading="lazy"` — they are above the fold and lazy loading delays their render. Use `loading="eager"` or `fetchpriority="high"` on the hero image. Only below-fold images should be lazy loaded.

---

## Low Priority

### 20. No Open Graph Image Per Page

**Category:** Social / Marketing
All pages share the same `/img/og.png` social image. Key product pages (Island Spas, Covana, etc.) should have unique OG images showing the actual products for better social sharing click-through.

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
