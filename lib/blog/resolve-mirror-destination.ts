import {
    normalizeSheetSourcePath,
    type SheetRouteMapping,
} from "@/constants/fetch-sheet-routes";
import { fetchBlogRoutesFromSheet } from "@/sitemap/fetch-blog-routes-from-sheet";
import { fetchPageRoutesFromSheet } from "@/sitemap/fetch-page-routes-from-sheet";

type MirrorMatch = {
    source: string;
    destination: string;
};

type MirrorRoutes = {
    appPaths: Set<string>;
    mirrorMap: Map<string, string>;
};

type MirrorRouteCache = MirrorRoutes & {
    expiresAt: number;
};

type GetMirrorDestinationParams = {
    pathname: string;
    requestOrigin: string;
};

let routeCache: MirrorRouteCache | null = null;
let routeMapInFlight: Promise<MirrorRoutes> | null = null;

/** Longer TTL reduces Google Sheet stampede under mirrored traffic. */
const ROUTE_MAP_TTL_MS = 10 * 60 * 1000;
const BLOG_MIRROR_HOST = "blog.zapcash.in";
const BLOG_MIRROR_ORIGIN = "https://blog.zapcash.in";
const SAME_SITE_HOSTS = new Set(["zapcash.in", "www.zapcash.in"]);
const BLOG_INDEX_PATHS = new Set(["/blog", "/blogs"]);
const RESERVED_APP_PATHS = [
    "/active-loan",
    "/auth",
    "/bsa",
    "/contact",
    "/credit",
    "/credit-score",
    "/dashboard",
    "/dev",
    "/digilocker",
    "/document-requests",
    "/enach",
    "/esign",
    "/faq",
    "/foreclosure",
    "/get-user",
    "/health",
    "/home",
    "/loan-applications",
    "/maintenance",
    "/payment",
    "/personal-loan",
    "/profile",
    "/sso",
] as const;

const parseAbsoluteHttpUrl = (value: string): URL | null => {
    try {
        const url = new URL(value);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            return null;
        }
        return url;
    } catch {
        return null;
    }
};

const isPathOrPrefix = (pathname: string, prefix: string): boolean => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
};

const isReservedAppPath = (pathname: string, appPaths: Set<string>): boolean => {
    if (pathname === "/") {
        return true;
    }
    if (appPaths.has(pathname)) {
        return true;
    }
    for (const reservedPath of RESERVED_APP_PATHS) {
        if (isPathOrPrefix(pathname, reservedPath)) {
            return true;
        }
    }
    for (const appPath of appPaths) {
        if (appPath !== "/" && isPathOrPrefix(pathname, appPath)) {
            return true;
        }
    }
    return false;
};

const joinDestinationPath = (destinationPathname: string, remainder: string): string => {
    const base = destinationPathname.endsWith("/")
        ? destinationPathname.slice(0, -1)
        : destinationPathname;
    return `${base}${remainder}` || "/";
};

const canonicalizeBlogPathname = (pathname: string): string => {
    if (BLOG_INDEX_PATHS.has(normalizeSheetSourcePath(pathname))) {
        return "/";
    }
    return pathname;
};

const buildBlogMirrorUrl = (pathname: string): string => {
    const destinationUrl = new URL(BLOG_MIRROR_ORIGIN);
    destinationUrl.pathname = canonicalizeBlogPathname(pathname);
    return destinationUrl.toString();
};

const findMirrorMatch = (pathname: string, map: Map<string, string>): MirrorMatch | null => {
    const exactDestination = map.get(pathname);
    if (exactDestination) {
        return { source: pathname, destination: exactDestination };
    }
    let bestSource: string | null = null;
    for (const source of map.keys()) {
        if (source === "/") {
            continue;
        }
        if (!pathname.startsWith(`${source}/`)) {
            continue;
        }
        if (bestSource === null || source.length > bestSource.length) {
            bestSource = source;
        }
    }
    if (!bestSource) {
        return null;
    }
    const destination = map.get(bestSource);
    if (!destination) {
        return null;
    }
    return { source: bestSource, destination };
};

const buildRewriteUrl = (params: {
    pathname: string;
    match: MirrorMatch;
    requestOrigin: string;
}): string | null => {
    const destinationUrl = parseAbsoluteHttpUrl(params.match.destination);
    if (!destinationUrl || destinationUrl.origin === params.requestOrigin) {
        return null;
    }
    if (destinationUrl.hostname.toLowerCase() !== BLOG_MIRROR_HOST) {
        return null;
    }
    if (params.pathname !== params.match.source) {
        const remainder = params.pathname.slice(params.match.source.length);
        destinationUrl.pathname = joinDestinationPath(destinationUrl.pathname, remainder);
    }
    destinationUrl.pathname = canonicalizeBlogPathname(destinationUrl.pathname);
    return destinationUrl.toString();
};

const collectSheetRoutes = (routes: SheetRouteMapping[], collected: MirrorRoutes): void => {
    for (const route of routes) {
        const source = normalizeSheetSourcePath(route.source);
        const destinationUrl = parseAbsoluteHttpUrl(route.destination);
        if (!source || !destinationUrl) {
            continue;
        }
        const hostname = destinationUrl.hostname.toLowerCase();
        if (SAME_SITE_HOSTS.has(hostname)) {
            collected.appPaths.add(source);
            continue;
        }
        if (hostname === BLOG_MIRROR_HOST && source !== "/") {
            collected.mirrorMap.set(source, route.destination);
        }
    }
};

const buildRouteMap = async (): Promise<MirrorRoutes> => {
    const [pageRoutes, blogRoutes] = await Promise.all([
        fetchPageRoutesFromSheet(),
        fetchBlogRoutesFromSheet(),
    ]);
    const collected: MirrorRoutes = {
        appPaths: new Set<string>(),
        mirrorMap: new Map<string, string>(),
    };
    collectSheetRoutes(pageRoutes, collected);
    collectSheetRoutes(blogRoutes, collected);
    return collected;
};

const getCachedRouteMap = async (): Promise<MirrorRoutes> => {
    const now = Date.now();
    if (routeCache && routeCache.expiresAt > now) {
        return routeCache;
    }
    if (routeMapInFlight) {
        return routeMapInFlight;
    }
    routeMapInFlight = buildRouteMap()
        .then((routes) => {
            routeCache = {
                ...routes,
                expiresAt: Date.now() + ROUTE_MAP_TTL_MS,
            };
            return routes;
        })
        .finally(() => {
            routeMapInFlight = null;
        });
    return routeMapInFlight;
};

/**
 * Mirrors any ZapCash path onto blog.zapcash.in unless it is a real app page.
 * Sheet rows whose destination host is blog.zapcash.in win first; remaining
 * non-app paths (e.g. /author, /blogs, /category/...) fall through to the same
 * path on https://blog.zapcash.in.
 */
export const getMirrorDestination = async (
    params: GetMirrorDestinationParams
): Promise<string | null> => {
    const normalizedPath = normalizeSheetSourcePath(params.pathname);
    if (!normalizedPath || normalizedPath === "/") {
        return null;
    }
    const routes = await getCachedRouteMap();
    if (isReservedAppPath(normalizedPath, routes.appPaths)) {
        return null;
    }
    const match = findMirrorMatch(normalizedPath, routes.mirrorMap);
    if (match) {
        return buildRewriteUrl({
            pathname: normalizedPath,
            match,
            requestOrigin: params.requestOrigin,
        });
    }
    return buildBlogMirrorUrl(normalizedPath);
};
