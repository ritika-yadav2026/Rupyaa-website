"use client";

/**
 * Shared chrome for journey hero cards: white surface, very light grid image, border, radius, shadow.
 * Constants: `lib/hero-card-visuals.ts`.
 */

import type { ReactNode } from "react";
import {
  HERO_CARD_GRID_BACKGROUND_SIZE_PX,
  HERO_CARD_GRID_IMAGE_URL,
  HERO_CARD_GRID_OVERLAY_OPACITY,
} from "@/lib/hero-card-visuals";

const SHELL_FRAME_CLASS =
  "overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:rounded-[1.35rem]";

export interface HeroCardGridShellProps {
  children: ReactNode;
  className?: string;
}

export function HeroCardGridShell({ children, className }: HeroCardGridShellProps) {
  return (
    <div className={`${SHELL_FRAME_CLASS} relative ${className ?? ""}`}>
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          opacity: HERO_CARD_GRID_OVERLAY_OPACITY,
          backgroundImage: `url("${HERO_CARD_GRID_IMAGE_URL}")`,
          backgroundRepeat: "repeat",
          backgroundSize: `${HERO_CARD_GRID_BACKGROUND_SIZE_PX}px`,
          backgroundPosition: "0 0",
        }}
        aria-hidden
      />
      <div className="relative z-1">{children}</div>
    </div>
  );
}
