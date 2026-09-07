import { sitemapIndexResponse } from "@/lib/sitemap/xml";

export const revalidate = 3600;

export function GET(): Response {
  return sitemapIndexResponse(["/sitemap-page.xml", "/sitemap-posts.xml"]);
}

