import { absoluteSitemapUrl, type SitemapEntry } from "@/lib/sitemap/build-sitemaps";

const XML_CONTENT_TYPE = "application/xml; charset=utf-8";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function formatLastModDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": XML_CONTENT_TYPE,
    },
  });
}

export function sitemapIndexResponse(paths: string[]): Response {
  const sitemaps = paths
    .map((path) => {
      return [
        "  <sitemap>",
        `    <loc>${escapeXml(absoluteSitemapUrl(path))}</loc>`,
        "  </sitemap>",
      ].join("\n");
    })
    .join("\n");

  return xmlResponse(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      sitemaps,
      "</sitemapindex>",
    ].join("\n"),
  );
}

export function urlSetResponse(entries: SitemapEntry[]): Response {
  const urls = entries
    .map((entry) => {
      const fields = [
        "  <url>",
        `    <loc>${escapeXml(absoluteSitemapUrl(entry.path))}</loc>`,
      ];

      fields.push(`    <lastmod>${formatLastModDate(entry.lastModified)}</lastmod>`);
      fields.push("  </url>");
      return fields.join("\n");
    })
    .join("\n");

  return xmlResponse(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls,
      "</urlset>",
    ].join("\n"),
  );
}

