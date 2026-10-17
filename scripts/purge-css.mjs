/* Purge unused Bootstrap CSS from the built vendor bundle, then minify. */
import { PurgeCSS } from 'purgecss';
import postcss from 'postcss';
import cssnano from 'cssnano';
import fs from 'fs';
import path from 'path';

const vendorPath = path.resolve('public/css/vendor.css');

const results = await new PurgeCSS().purge({
  content: ['public/**/*.html'],
  css: [vendorPath],
  safelist: {
    standard: [
      'show',
      'collapsing',
      'fade',
      'in',
      'active',
      'open',
      'disabled',
      'sr-only',
      'no-js'
    ],
    greedy: [
      /^m[trblxy]?-[0-9]/,
      /^p[trblxy]?-[0-9]/,
      /^d-/,
      /^w-[0-9]/,
      /^h-[0-9]/,
      /^text-/,
      /^col/,
      /^row$/,
      /^container/,
      /^card/,
      /^btn/,
      /^nav/,
      /^dropdown/,
      /^collapse/,
      /^img-/,
      /^rounded/,
      /^shadow/,
      /^border/,
      /^align-/,
      /^justify-/,
      /^flex-/,
      /^order-/,
      /^bg-/,
      /^sr-only/
    ]
  }
});

const before = fs.statSync(vendorPath).size;
const css = results[0].css;
const minified = await postcss([cssnano]).process(css, { from: vendorPath });
fs.writeFileSync(vendorPath, minified.css);
const after = fs.statSync(vendorPath).size;
console.log(`vendor.css purged: ${(before / 1024).toFixed(1)}KB -> ${(after / 1024).toFixed(1)}KB`);

/* Inline the stylesheets into the homepage so it has no render-blocking
   requests (Lighthouse). Other pages keep the cached external files. */
const homePath = path.resolve('public/index.html');
if (fs.existsSync(homePath)) {
  let html = fs.readFileSync(homePath, 'utf8');
  const sheets = [];
  html = html.replace(
    /<link rel="stylesheet" href="(\/(?:css|fonts)\/[^"?]+)(?:\?v=[^"]*)?"\s*\/?>/g,
    (tag, href) => {
      const file = path.resolve('public' + href);
      if (!fs.existsSync(file)) return tag;
      const dir = path.posix.dirname(href);
      // Root relative url()s so they still resolve from the page
      sheets.push(
        fs
          .readFileSync(file, 'utf8')
          .replace(/\/\*# sourceMappingURL=[^*]*\*\//g, '')
          .replace(/url\((["']?)(?![a-z]+:|\/|#)([^"')]+)\1\)/gi, (m, q, u) => `url(${q}${dir}/${u}${q})`)
      );
      return sheets.length === 1 ? '<!--inline-css-->' : '';
    }
  );
  if (sheets.length) {
    // Keep only rules this page (and the classes custom.js adds) can use
    const [purged] = await new PurgeCSS().purge({
      content: [
        { raw: html, extension: 'html' },
        { raw: fs.readFileSync('public/js/custom.js', 'utf8'), extension: 'js' }
      ],
      css: [{ raw: sheets.join('\n') }],
      fontFace: false,
      safelist: { standard: ['show', 'collapsing', 'active', 'is-stuck', 'no-scroll'], greedy: [/^lightbox/, /^to-top/, /^map-facade/, /focus-visible/] }
    });
    const css = (await postcss([cssnano]).process(purged.css, { from: undefined })).css;
    html = html.replace('<!--inline-css-->', () => `<style>${css}</style>`);
    fs.writeFileSync(homePath, html);
    console.log(`index.html: inlined ${sheets.length} stylesheet(s), ${(css.length / 1024).toFixed(1)}KB`);
  }
}
