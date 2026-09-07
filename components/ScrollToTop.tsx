"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls to top when navigating to the home page.
 * Fixes scroll restoration that was taking users to the testimonial section after login/refresh.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname !== "/") return;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    });
    const timeoutId = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, [pathname]);

  return null;
}
