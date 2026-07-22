import type { APIRoute } from "astro";

export const prerender = true;

// sitemap.xml dibuat otomatis dari `site` di astro.config.mjs
export const GET: APIRoute = ({ site }) => {
  const base = (site?.href ?? "https://undanganulfahrul.ijlalcode.my.id").replace(/\/$/, "");
  const lastmod = new Date().toISOString().split("T")[0];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
