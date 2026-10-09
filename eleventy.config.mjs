import emojiRegex from "emoji-regex";
import slugify from "slugify";
import crypto from "crypto";
import fs from "fs";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginRss from "@11ty/eleventy-plugin-rss";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import Image from "@11ty/eleventy-img";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageVersion = JSON.parse(
  fs.readFileSync(path.join(__dirname, "package.json"), "utf8")
).version;

async function imageShortcode(
  src,
  alt,
  sizes = "100vw",
  widths = [400, 800],
  cssClass = "",
  loading = "lazy",
  fetchpriority = ""
) {
  let inputPath = src.startsWith("/") ? path.join("src", src) : src;
  let metadata = await Image(inputPath, {
    widths: widths,
    formats: ["avif", "webp"],
    outputDir: "./public/img/optimized/",
    urlPath: "/img/optimized/",
    filenameFormat: function (id, src, width, format) {
      const name = path.basename(src, path.extname(src));
      return `${name}-${width}w.${format}`;
    },
  });

  let imageAttributes = {
    alt,
    sizes,
    loading,
    decoding: "async",
  };
  if (cssClass) {
    imageAttributes.class = cssClass;
  }
  if (fetchpriority) {
    imageAttributes.fetchpriority = fetchpriority;
  }

  return Image.generateHTML(metadata, imageAttributes);
}

// Rendered HTML -> readable plain text (used by llms-full.txt)
const plainText = (html) =>
  (html || "")
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<a[^>]*class="tdbc-anchor"[^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<\/(p|div|section|h[1-6]|li|tr|blockquote)>|<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const LLMS_HOME_PLACEHOLDER = "{{HOMEPAGE_TEXT}}";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  eleventyConfig.addWatchTarget("./src/sass/");

  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy("./src/fonts");
  eleventyConfig.addPassthroughCopy("./src/favicon");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addPassthroughCopy("./src/favicon.png");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");

  // Page dates come from each file's last git commit, so the sitemap's
  // <lastmod> reflects real content changes instead of the build time.
  eleventyConfig.addGlobalData("date", "git Last Modified");

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);
  eleventyConfig.addShortcode("packageVersion", () => `v${packageVersion}`);
  // Content-hash cache busting: ?v=<md5-8> of the built asset, so browsers
  // and CDNs never serve stale CSS/JS after a deploy. Hashes the file in
  // src (the build input) — deterministic across rebuilds of the same code.
  eleventyConfig.addShortcode("assetHash", (assetPath) => {
    try {
      const rel = assetPath.replace(/^\//, "");
      const file = path.join("src", rel);
      const data = fs.readFileSync(file);
      return crypto.createHash("md5").update(data).digest("hex").slice(0, 8);
    } catch (e) {
      return "";
    }
  });

  eleventyConfig.addFilter("slug", (str) => {
    if (!str) {
      return;
    }

    const regex = emojiRegex();
    // Remove Emoji first
    let string = str.replace(regex, "");

    return slugify(string, {
      lower: true,
      replacement: "-",
      remove: /[*+~·,()'"`´%!?¿:@\/]/g,
    });
  });

  eleventyConfig.addFilter("jsonTitle", (str) => {
    if (!str) {
      return;
    }
    let title = str.replace(/((.*)\s(.*)\s(.*))$/g, "$2&nbsp;$3&nbsp;$4");
    title = title.replace(/"(.*)"/g, '\\"$1\\"');
    return title;
  });

  eleventyConfig.addFilter("plainText", plainText);

  // The homepage body lives in the home.njk layout, which a collection item's
  // `content` doesn't include. Fill llms-full.txt's placeholder from the
  // rendered page once the build has written it.
  eleventyConfig.on("eleventy.after", ({ dir }) => {
    const out = path.join(dir.output, "llms-full.txt");
    const home = path.join(dir.output, "index.html");
    if (!fs.existsSync(out) || !fs.existsSync(home)) return;
    const main = fs.readFileSync(home, "utf8").match(/<main[^>]*>([\s\S]*?)<\/main>/);
    const text = fs.readFileSync(out, "utf8");
    fs.writeFileSync(out, text.replace(LLMS_HOME_PLACEHOLDER, () => plainText(main ? main[1] : "")));
  });

  eleventyConfig.addFilter("tojson", (value) => JSON.stringify(value ?? ""));

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "tdbc-anchor",
    permalinkSymbol: "#",
    permalinkSpace: false,
    level: [1, 2, 3],
    slugify: (s) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[\s+~\/]/g, "-")
        .replace(/[().`,%·'"!?¿:@*]/g, ""),
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "public",
    },
  };
}
