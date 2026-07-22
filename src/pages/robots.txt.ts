import type { APIRoute } from "astro";

export const prerender = true;

// robots.txt dibuat otomatis dari `site` di astro.config.mjs
export const GET: APIRoute = ({ site }) => {
  const base = (site?.href ?? "https://undanganulfahrul.ijlalcode.my.id").replace(/\/$/, "");
  const body = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
