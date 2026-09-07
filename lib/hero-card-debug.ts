type DebugPayload = Record<string, unknown>;

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

export function isHeroCardDebugEnabled(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  if (!hasWindow()) return false;

  const hasQueryFlag = window.location.search.includes("heroDebug=1");
  const hasLocalFlag = window.localStorage.getItem("hero-card-debug") === "1";
  return hasQueryFlag || hasLocalFlag;
}

export function logHeroCardDebug(tag: string, payload: DebugPayload): void {
  if (!isHeroCardDebugEnabled()) return;
  console.info(`[hero-card][${tag}]`, payload);
}

