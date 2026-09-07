/**
 * Lightweight liveness endpoint for ALB / ECS health checks.
 * Must stay free of SSR, cookies, and external fetches.
 */
export function GET(): Response {
  return new Response("ok", {
    status: 200,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
