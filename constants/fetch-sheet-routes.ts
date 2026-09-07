import { GOOGLE_SHEET_ROUTES } from "./google-sheet-routes";

export interface SheetRouteMapping {
    destination: string;
    source: string;
    modifiedDate?: Date;
    showInSitemap: boolean;
}

interface FetchSheetRoutesOptions {
    gid: string;
    sourcePathPrefix: string;
    logLabel: string;
    normalizeSourcePath?: (path: string) => string;
}

export const getSheetExportUrl = (gid: string): string => {
    return `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ROUTES.SHEET_ID}/export?format=csv&gid=${gid}`;
};

export const normalizeSheetSourcePath = (path: string): string => {
    const trimmed = path.trim();
    if (!trimmed) return '';
    const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    if (withLeadingSlash === '/') return '/';
    return withLeadingSlash.endsWith('/')
        ? withLeadingSlash.slice(0, -1)
        : withLeadingSlash;
};

function parseCsvLine(line: string): string[] {
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
            continue;
        }
        if (char === ',' && !inQuotes) {
            fields.push(current.trim());
            current = '';
            continue;
        }
        current += char;
    }

    fields.push(current.trim());
    return fields;
}

function findColumnIndex(headers: string[], name: string): number {
    const normalized = name.toLowerCase();
    return headers.findIndex((header) => header.toLowerCase() === normalized);
}

function parseShowInSitemap(value: string | undefined): boolean {
    const normalized = (value ?? '').trim().toLowerCase();
    if (normalized === 'false') {
        return false;
    }
    return true;
}

function parseModifiedDate(value: string | undefined): Date | undefined {
    const trimmed = (value ?? '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        return undefined;
    }
    const parsed = new Date(`${trimmed}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) {
        return undefined;
    }
    return parsed;
}

function parseRoutesFromCsv(
    csvText: string,
    {
        sourcePathPrefix,
        logLabel,
        normalizeSourcePath = normalizeSheetSourcePath,
    }: Pick<FetchSheetRoutesOptions, 'sourcePathPrefix' | 'logLabel' | 'normalizeSourcePath'>
): SheetRouteMapping[] {
    const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = parseCsvLine(lines[0]);
    const destinationIndex = findColumnIndex(headers, 'destination');
    const sourceIndex = findColumnIndex(headers, 'source');
    const modifiedDateIndex = findColumnIndex(headers, 'modifiedDate');
    const showInSitemapIndex = findColumnIndex(headers, 'showInSitemap');

    if (destinationIndex === -1 || sourceIndex === -1) {
        console.warn(`[${logLabel}] Missing Destination or source column in sheet`);
        return [];
    }

    const mappings: SheetRouteMapping[] = [];

    for (let i = 1; i < lines.length; i += 1) {
        const columns = parseCsvLine(lines[i]);
        const destination = columns[destinationIndex]?.trim() ?? '';
        const source = normalizeSourcePath(columns[sourceIndex] ?? '');

        if (!destination || !source || !source.startsWith(sourcePathPrefix)) {
            continue;
        }

        const modifiedDateRaw =
            modifiedDateIndex === -1 ? undefined : columns[modifiedDateIndex];
        const showInSitemapRaw =
            showInSitemapIndex === -1 ? undefined : columns[showInSitemapIndex];

        mappings.push({
            destination,
            source,
            modifiedDate: parseModifiedDate(modifiedDateRaw),
            showInSitemap: parseShowInSitemap(showInSitemapRaw),
        });
    }

    return mappings;
}

export async function fetchRoutesFromSheet(
    options: FetchSheetRoutesOptions
): Promise<SheetRouteMapping[]> {
    const { gid, logLabel } = options;

    try {
        const response = await fetch(getSheetExportUrl(gid), {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.warn(
                `[${logLabel}] Sheet fetch failed: ${response.status} ${response.statusText}`
            );
            return [];
        }

        const csvText = await response.text();
        return parseRoutesFromCsv(csvText, options);
    } catch (error) {
        console.warn(`[${logLabel}] Unable to load routes from sheet:`, error);
        return [];
    }
}
