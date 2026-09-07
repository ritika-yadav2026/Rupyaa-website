/** Minimal router surface used by {@link goHomeWithFallback}. */
export type GoHomeRouter = {
  push: (href: string) => void;
};

/** Navigate home; fallback for environments where client routing may not apply. */
export function goHomeWithFallback(router: GoHomeRouter): void {
  try {
    router.push("/");
  } catch {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }
}
