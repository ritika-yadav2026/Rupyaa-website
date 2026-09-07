import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getMirrorDestination } from './lib/blog/resolve-mirror-destination';

const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === 'true' || process.env.MAINTENANCE_MODE === '1';
const STAGING_HOST_PATTERN = /^staging[\w-]*\.zapcash\.in$/;

const STATIC_PATHS = [
    '/_next',
    '/favicon.ico',
    '/favicon.svg',
    '/favicon-96x96.png',
    '/apple-touch-icon.png',
    '/site.webmanifest',
    '/robots.txt',
    '/sitemap',
    '/images',
];

const MAINTENANCE_ALLOWED_PATHS = ['/maintenance', '/support', '/faq', '/contact', '/health'];

function isStaticPath(pathname: string): boolean {
    return STATIC_PATHS.some((p) => pathname.startsWith(p));
}

function isMaintenanceAllowedPath(pathname: string): boolean {
    return MAINTENANCE_ALLOWED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`)) || isStaticPath(pathname);
}

function isStagingHost(hostname: string): boolean {
    return STAGING_HOST_PATTERN.test(hostname);
}

function getRequestHostname(request: NextRequest): string {
    const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
    const host = forwardedHost || request.headers.get('host') || request.nextUrl.host;

    return host.split(':')[0]?.toLowerCase() ?? '';
}

function isStagingRobotsRequest(request: NextRequest): boolean {
    return request.nextUrl.pathname === '/robots.txt' && isStagingHost(getRequestHostname(request));
}

function createStagingRobotsResponse(): NextResponse {
    return new NextResponse(
        `User-agent: *\nDisallow: /\n`,
        {
            status: 200,
            headers: {
                'content-type': 'text/plain; charset=utf-8',
                'x-robots-tag': 'noindex, nofollow',
            },
        },
    );
}

function withStagingNoIndex(request: NextRequest, response: NextResponse): NextResponse {
    if (isStagingHost(getRequestHostname(request))) {
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    return response;
}

export const proxy = async (request: NextRequest): Promise<NextResponse> => {
    const { pathname } = request.nextUrl;
    if (isStagingRobotsRequest(request)) {
        return createStagingRobotsResponse();
    }

    if (MAINTENANCE_MODE && !isMaintenanceAllowedPath(pathname)) {
        return withStagingNoIndex(request, NextResponse.redirect(new URL('/maintenance', request.url)));
    }

    if (!isStaticPath(pathname)) {
        const destination = await getMirrorDestination({
            pathname,
            requestOrigin: request.nextUrl.origin,
        });
        if (destination) {
            const destinationUrl = new URL(destination);
            destinationUrl.search = request.nextUrl.search;
            return withStagingNoIndex(request, NextResponse.rewrite(destinationUrl));
        }
    }
    return withStagingNoIndex(request, NextResponse.next());
};

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|api/|health).*)',
    ],
};
