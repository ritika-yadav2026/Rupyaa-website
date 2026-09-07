"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import { RedirectionStageFetcher } from "@/components/RedirectionStageFetcher";
import { ExternalAppConfigInit } from "@/components/ExternalAppConfigInit";
import { GoogleOAuthAppProvider } from "@/components/GoogleOAuthAppProvider";
import ZapcashLoading from "@/components/ZapcashLoading";
import { useAuthLoggedInHint } from "@/hooks/use-auth-logged-in-hint";
import { useAuthPersistHydrated } from "@/hooks/useAuthPersistHydrated";
import { useAuthStore } from "@/store/useAuthStore";
import { useGeoStore } from "@/store/useGeoStore";

/** Routes that render guest-friendly content without forcing `/auth` redirect. */
const GUEST_FRIENDLY_ROUTES = new Set([
  "/personal-loan",
  "/credit-score",
]);

export type AppShellProps = {
  children: React.ReactNode;
};

function AppShellLoading() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
      <ZapcashLoading />
    </div>
  );
}

export default function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hasHydrated = useAuthPersistHydrated();
  const { isLoggedIn: loggedInHint, isPending: isHintPending } = useAuthLoggedInHint();
  const startWatching = useGeoStore((s) => s.startWatching);
  const stopWatching = useGeoStore((s) => s.stopWatching);
  const allowGuestDashboard = GUEST_FRIENDLY_ROUTES.has(pathname);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isLoggedIn) {
      stopWatching();
      if (!allowGuestDashboard) {
        const queryString = window.location.search.replace(/^\?/, "");
        const returnTo = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(`/auth?returnTo=${encodeURIComponent(returnTo)}`);
      }
      return;
    }

    startWatching();
    return () => stopWatching();
  }, [allowGuestDashboard, hasHydrated, isLoggedIn, pathname, router, startWatching, stopWatching]);

  if (!hasHydrated) {
    if (isHintPending && !allowGuestDashboard) {
      return <AppShellLoading />;
    }
    if (loggedInHint) {
      return <AppShellLoading />;
    }
    if (!allowGuestDashboard) {
      return <AppShellLoading />;
    }
  }

  if (!isLoggedIn && !allowGuestDashboard) {
    return null;
  }

  return (
    <GoogleOAuthAppProvider>
      <div className="min-h-screen w-full overflow-x-hidden bg-white flex flex-col">
        {isLoggedIn && <RedirectionStageFetcher />}
        <ExternalAppConfigInit enabled={isLoggedIn} />
        <AppHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 min-w-0 pt-16 outline-none">
          {children}
        </main>
      </div>
    </GoogleOAuthAppProvider>
  );
}
