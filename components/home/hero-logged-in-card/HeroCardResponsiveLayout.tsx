"use client";

import type { ReactElement, ReactNode } from "react";

/**
 * Centers the resolved logged-in hero card under the marketing headline.
 */
export function HeroCardResponsiveLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return <div className="w-full">{children}</div>;
}
