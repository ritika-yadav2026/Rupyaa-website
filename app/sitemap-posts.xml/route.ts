import { getPostSitemapEntries } from "@/lib/sitemap/build-sitemaps";
import { urlSetResponse } from "@/lib/sitemap/xml";

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  return urlSetResponse(await getPostSitemapEntries());
}

