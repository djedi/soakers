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
