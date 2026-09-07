"use client";

import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * True after Zustand `persist` has finished reading `localStorage` for `useAuthStore`.
 * SSR / first client snapshot is always `false` (`getServerSnapshot`).
 */
export function useAuthPersistHydrated(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const persist = useAuthStore.persist;
      if (!persist) {
        queueMicrotask(notify);
        return () => {};
      }
      if (persist.hasHydrated()) {
        queueMicrotask(notify);
        return () => {};
      }
      const unsub = persist.onFinishHydration(() => notify());
      return typeof unsub === "function" ? unsub : () => {};
    },
    () => Boolean(useAuthStore.persist?.hasHydrated()),
    () => false,
  );
}
