// IndexNow submitter (https://www.indexnow.org/documentation).
//
// Runs only in the Netlify *production* context. Before the build it snapshots
// the currently live sitemap; after a successful deploy (onSuccess = site is
// live) it diffs that against the freshly built sitemap and POSTs the new,
// changed (<lastmod> moved) and removed URLs to IndexNow. If the live sitemap
// couldn't be read, or the key file isn't live yet (first deploy with this key,
// or a rotated key), it submits every sitemap URL instead.
//
// Fail-safe: every handler swallows its own errors and never calls
// utils.build.fail*/failPlugin, so this can't fail a build or a deploy.
// Set INDEXNOW_DISABLED=true in Netlify env vars to switch it off.

const fs = require("fs");
const os = require("os");
const path = require("path");

const STATE_FILE = path.join(os.tmpdir(), "indexnow-previous-sitemap.xml");
const TIMEOUT_MS = 15000;
const MAX_URLS = 10000; // IndexNow per-request limit

const log = (...args) => console.log("[indexnow]", ...args);

function enabled() {
  if (process.env.CONTEXT !== "production") {
    log(`skipping: context is "${process.env.CONTEXT || "unknown"}", not production`);
    return false;
  }
  if (/^(1|true|yes)$/i.test(process.env.INDEXNOW_DISABLED || "")) {
    log("skipping: INDEXNOW_DISABLED is set");
    return false;
  }
  return true;
}

function parseSitemap(xml) {
  const entries = new Map();
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) || []) {
    const loc = (block.match(/<loc>\s*([^<]+?)\s*<\/loc>/) || [])[1];
    const lastmod = (block.match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/) || [])[1] || "";
    if (loc) entries.set(loc, lastmod);
  }
  return entries;
}

async function fetchText(url) {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "User-Agent": "soakers-indexnow-netlify-plugin" },
  });
  if (!res.ok) throw new Error(`GET ${url} -> HTTP ${res.status}`);
  return res.text();
}

function readKey() {
  const file = path.join(process.cwd(), "src", "_data", "indexnow.json");
  const { key } = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!/^[A-Za-z0-9-]{8,128}$/.test(key || "")) throw new Error("invalid key in src/_data/indexnow.json");
  return key;
}

module.exports = {
  async onPreBuild({ inputs }) {
    try {
      if (!enabled()) return;
      try { fs.unlinkSync(STATE_FILE); } catch {}
      // A key that isn't live yet means search engines have never seen it:
      // skip the snapshot so the first submission covers the whole sitemap.
      const key = readKey();
      const liveKey = await fetchText(`https://${inputs.host}/${key}.txt`).catch(() => "");
      if (liveKey.trim() !== key) {
        log("key file not live yet; this deploy will submit all sitemap URLs");
        return;
      }
      const xml = await fetchText(`https://${inputs.host}/sitemap.xml`);
      fs.writeFileSync(STATE_FILE, xml);
      log(`snapshotted live sitemap (${parseSitemap(xml).size} URLs)`);
    } catch (err) {
      log(`could not snapshot live sitemap, will submit all URLs: ${err.message}`);
    }
  },

  async onSuccess({ inputs, constants, utils }) {
    try {
      if (!enabled()) return;
      const key = readKey();
      const host = inputs.host;
      const keyLocation = `https://${host}/${key}.txt`;

      const built = parseSitemap(
        fs.readFileSync(path.join(constants.PUBLISH_DIR, "sitemap.xml"), "utf8"),
      );
      let urls;
      if (fs.existsSync(STATE_FILE)) {
        const previous = parseSitemap(fs.readFileSync(STATE_FILE, "utf8"));
        const changed = [...built].filter(([u, m]) => previous.get(u) !== m).map(([u]) => u);
        const removed = [...previous.keys()].filter((u) => !built.has(u));
        urls = [...changed, ...removed];
        log(`${changed.length} new/changed, ${removed.length} removed of ${built.size} sitemap URLs`);
      } else {
        urls = [...built.keys()];
        log(`no previous sitemap snapshot; submitting all ${urls.length} URLs`);
      }
      urls = urls.filter((u) => new URL(u).host === host).slice(0, MAX_URLS);
      if (!urls.length) {
        log("nothing changed; no submission");
        return;
      }

      // Search engines verify ownership by fetching the key file; make sure it is live.
      const live = (await fetchText(keyLocation)).trim();
      if (live !== key) throw new Error(`key file at ${keyLocation} does not match`);

      const res = await fetch(inputs.endpoint, {
        method: "POST",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
      });
      const summary = `IndexNow: submitted ${urls.length} URL(s), HTTP ${res.status}`;
      log(summary);
      if (res.status !== 200 && res.status !== 202) {
        log(`response: ${(await res.text().catch(() => "")).slice(0, 500)}`);
      }
      try { utils.status.show({ title: "IndexNow", summary }); } catch {}
    } catch (err) {
      log(`submission skipped (non-fatal): ${err.message}`);
    }
  },
};
