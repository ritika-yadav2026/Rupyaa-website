import type { SheetRouteMapping } from "@/constants/fetch-sheet-routes";
import { fetchBlogRoutesFromSheet } from "@/sitemap/fetch-blog-routes-from-sheet";
import { fetchPageRoutesFromSheet } from "@/sitemap/fetch-page-routes-from-sheet";
import { SITE_URL } from "@/utils/app-constants";
import { readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const APP_DIR = join(process.cwd(), "app");

export type SitemapEntry = {
  path: string;
  lastModified: Date;
};

const EXCLUDED_SEGMENTS = new Set([
  "api",
  "auth",
  "bsa",
  "credit",
  "dashboard",
  "dev",
  "digilocker",
  "document-requests",
  "enach",
  "esign",
  "payment",
  "profile",
  "sitemap.xml",
  "sitemap-page.xml",
  "sitemap-posts.xml",
]);

const EXCLUDED_PATHS = new Set([
  "/active-loan",
  "/foreclosure",
  "/get-user",
  "/home",
  "/loan-applications",
  "/maintenance",
]);

function findPageFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return findPageFiles(fullPath);
    }

    return entry === "page.tsx" ? [fullPath] : [];
  });
}

function pageFileToRoutePath(pageFile: string): string | null {
  const relativePagePath = relative(APP_DIR, pageFile);
  const segments = relativePagePath.split(sep).slice(0, -1);

  if (
    segments.some(
      (segment) =>
        segment.startsWith("[") ||
        segment.startsWith("@") ||
        EXCLUDED_SEGMENTS.has(segment),
    )
  ) {
    return null;
  }

  const routeSegments = segments.filter(
    (segment) => !segment.startsWith("(") && !segment.endsWith(")"),
  );
  const routePath = routeSegments.length > 0 ? `/${routeSegments.join("/")}` : "/";

  return EXCLUDED_PATHS.has(routePath) ? null : routePath;
}

function resolveLastModified(modifiedDate: Date | undefined): Date {
  if (modifiedDate) {
    return modifiedDate;
  }
  return new Date();
}

function shouldIncludeInSitemap(route: SheetRouteMapping): boolean {
  return route.showInSitemap;
}

function sheetRouteToSitemapEntry(route: SheetRouteMapping): SitemapEntry {
  return {
    path: route.source,
    lastModified: resolveLastModified(route.modifiedDate),
  };
}

function dedupeAndSortEntries(entries: SitemapEntry[]): SitemapEntry[] {
  return entries
    .filter((entry, index, array) => array.findIndex((candidate) => candidate.path === entry.path) === index)
    .sort((a, b) => {
      if (a.path === "/") {
        return -1;
      }
      if (b.path === "/") {
        return 1;
      }
      return a.path.localeCompare(b.path);
    });
}

export function absoluteSitemapUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

function getLocalPageSitemapEntries(): SitemapEntry[] {
  return dedupeAndSortEntries(
    findPageFiles(APP_DIR)
      .map((pageFile): SitemapEntry | null => {
        const path = pageFileToRoutePath(pageFile);

        if (!path) {
          return null;
        }

        return {
          path,
          lastModified: statSync(pageFile).mtime,
        };
      })
      .filter((entry): entry is SitemapEntry => entry !== null),
  );
}

export async function getPageSitemapEntries(): Promise<SitemapEntry[]> {
  const pageRoutes = await fetchPageRoutesFromSheet();

  if (pageRoutes.length === 0) {
    return getLocalPageSitemapEntries();
  }

  return dedupeAndSortEntries(
    pageRoutes
      .filter(shouldIncludeInSitemap)
      .map(sheetRouteToSitemapEntry),
  );
}

export async function getPostSitemapEntries(): Promise<SitemapEntry[]> {
  const blogRoutes = await fetchBlogRoutesFromSheet();

  return dedupeAndSortEntries(
    blogRoutes
      .filter(shouldIncludeInSitemap)
      .map(sheetRouteToSitemapEntry),
  );
}
