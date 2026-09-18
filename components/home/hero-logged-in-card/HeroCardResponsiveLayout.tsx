"use client";

import type { ReactElement, ReactNode } from "react";

/**
 * Centers the resolved logged-in hero card over the skyline gradient.
 */
export function HeroCardResponsiveLayout({
  children,
}: {
  readonly children: ReactNode;
}): ReactElement {
  return <div className="w-full max-w-[520px]">{children}</div>;
}
