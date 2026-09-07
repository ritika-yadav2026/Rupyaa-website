import { fetchRoutesFromSheet, type SheetRouteMapping } from '@/constants/fetch-sheet-routes';
import { GOOGLE_SHEET_ROUTES } from '../constants/google-sheet-routes';

export type PageRouteMapping = SheetRouteMapping;

export function normalizePageSourcePath(path: string): string {
    const trimmed = path.trim();
    if (!trimmed) return '';

    let pathname = trimmed;

    try {
        pathname = new URL(trimmed).pathname;
    } catch {
        pathname = trimmed.split(/[?#]/)[0] ?? '';
    }

    if (!pathname) return '';
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export async function fetchPageRoutesFromSheet(): Promise<PageRouteMapping[]> {
    return fetchRoutesFromSheet({
        gid: GOOGLE_SHEET_ROUTES.PAGE_GID,
        sourcePathPrefix: '/',
        logLabel: 'fetchPageRoutesFromSheet',
        normalizeSourcePath: normalizePageSourcePath,
    });
}
