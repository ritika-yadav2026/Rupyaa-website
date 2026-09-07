"use client";

import { useEffect, useState } from "react";
import { useAuthPersistHydrated } from "@/hooks/useAuthPersistHydrated";
import { readAuthLoggedInCookieHintClient } from "@/lib/auth-session-cookie";
import { useAuthStore } from "@/store/useAuthStore";

type AuthLoggedInHintState = {
  /** Prefer Zustand after rehydrate; otherwise the client cookie hint. */
  isLoggedIn: boolean;
  /**
   * True until the cookie has been read on the client or Zustand has rehydrated.
   * Use to avoid guest/logged-in flashes on auth-sensitive screens.
   */
  isPending: boolean;
};

/**
 * Client-only logged-in hint so RSC pages can stay static (no `cookies()`).
 * SSR and the first client render always report logged-out / pending to avoid hydration mismatch.
 */
export function useAuthLoggedInHint(): AuthLoggedInHintState {
  const hasHydrated = useAuthPersistHydrated();
  const storeIsLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [cookieHint, setCookieHint] = useState<boolean | null>(null);

  useEffect(() => {
    setCookieHint(readAuthLoggedInCookieHintClient());
  }, []);

  if (hasHydrated) {
    return {
      isLoggedIn: storeIsLoggedIn,
      isPending: false,
    };
  }

  return {
    isLoggedIn: cookieHint === true,
    isPending: cookieHint === null,
  };
}
