// Slimlytics first-party tracking proxy.
//
// Serves the tracker script and beacon from soakers.biz so ad blockers don't
// drop them, and forwards the visitor IP plus the per-site proxy key on the
// collect route so locations reflect the visitor, not Netlify's edge.
//
// The proxy key is a secret: it lives in the SLIMLYTICS_PROXY_KEY Netlify env
// var, never in git. Without it, tracking still works but locations fall back
// to the edge node's IP.

import type { Config, Context } from "https://edge.netlify.com";

const UPSTREAM = "https://slimlytics.com";
const SITE_UUID = "aa86c178-9567-48d0-9e65-7618eafdfca0";
const SCRIPT_PATH = "/52f9ebdaf7fd.js";
const BEACON_PATH = "/f0ad85f0a40e";

const ROUTES: Record<string, string> = {
  [SCRIPT_PATH]: `/p/${SITE_UUID}/f0ad85f0a40e`,
  [BEACON_PATH]: `/api/collect/${SITE_UUID}`,
};

const FORWARD_HEADERS = [
  "content-type",
  "origin",
  "referer",
  "user-agent",
  "dnt",
  "sec-gpc",
  "accept",
  "accept-language",
];

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const upstreamPath = ROUTES[url.pathname];
  if (!upstreamPath) return context.next();

  const headers = new Headers();
  for (const name of FORWARD_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  if (url.pathname === BEACON_PATH) {
    const key = Netlify.env.get("SLIMLYTICS_PROXY_KEY");
    if (key && context.ip) {
      headers.set("X-Slimlytics-Client-IP", context.ip);
      headers.set("X-Slimlytics-Proxy-Key", key);
    }
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const upstream = await fetch(`${UPSTREAM}${upstreamPath}${url.search}`, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
  });

  const responseHeaders = new Headers(upstream.headers);
  responseHeaders.delete("set-cookie");
  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
};

export const config: Config = {
  path: [SCRIPT_PATH, BEACON_PATH],
};
