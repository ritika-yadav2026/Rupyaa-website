
import { fetchRoutesFromSheet, normalizeSheetSourcePath, SheetRouteMapping } from '@/constants/fetch-sheet-routes';
import { GOOGLE_SHEET_ROUTES } from '../constants/google-sheet-routes';

export type BlogRouteMapping = SheetRouteMapping;

export const normalizeBlogSourcePath = normalizeSheetSourcePath;

export async function fetchBlogRoutesFromSheet(): Promise<BlogRouteMapping[]> {
    return fetchRoutesFromSheet({
        gid: GOOGLE_SHEET_ROUTES.BLOG_GID,
        // Any path can be mirrored (e.g. /blog/..., /author) — not limited to /blog.
        sourcePathPrefix: '/',
        logLabel: 'fetchBlogRoutesFromSheet',
    });
}
