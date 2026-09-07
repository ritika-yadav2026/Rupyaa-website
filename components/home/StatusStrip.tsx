"use client";

/**
 * Web port of the native `StatusStrip`: full-width 3px gradient line with an optional
 * right-aligned pill on top. Decorative only — no pointer events on the strip row.
 *
 * To change defaults (colors, padding feel), use `lib/hero-card-visuals.ts` + props here.
 */

import { STATUS_STRIP_DEFAULT_GRADIENT_COLORS } from "@/lib/hero-card-visuals";

export interface StatusStripProps {
  statusLabel?: string;
  gradientColors?: readonly [string, string];
  uppercaseLabel?: boolean;
  pillTextWeight?: "bold" | "semibold";
  className?: string;
  stripClassName?: string;
  lineClassName?: string;
  pillClassName?: string;
  pillTextClassName?: string;
}

export function StatusStrip({
  statusLabel,
  gradientColors = STATUS_STRIP_DEFAULT_GRADIENT_COLORS,
  uppercaseLabel = true,
  pillTextWeight = "bold",
  className,
  stripClassName,
  lineClassName,
  pillClassName,
  pillTextClassName,
}: StatusStripProps) {
  const raw = typeof statusLabel === "string" ? statusLabel.trim() : "";
  const normalized =
    raw.length === 0 ? "" : uppercaseLabel ? raw.toUpperCase() : raw;
  const shouldShowLabel = normalized.length > 0;

  const weightClass = pillTextWeight === "semibold" ? "font-semibold" : "font-bold";

  const [from, to] = gradientColors;

  return (
    <div className={className}>
      <div
        className={`relative flex min-h-[3px] items-center justify-end px-5 py-2.5 sm:px-6 ${stripClassName ?? ""}`}
      >
        <div
          className={`pointer-events-none absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 ${lineClassName ?? ""}`}
          style={{
            backgroundImage: `linear-gradient(90deg, ${from}, ${to})`,
          }}
          aria-hidden
        />
        {shouldShowLabel ? (
          <span
            className={`relative z-10 inline-flex max-w-[min(280px,55vw)] shrink-0 items-center rounded-full border px-3.5 py-2 ${weightClass} text-[10px] uppercase tracking-wide ${
              pillClassName != null && pillClassName.trim().length > 0
                ? pillClassName.trim()
                : "border-primary bg-white"
            }`}
            title={normalized}
          >
            <span
              className={`min-w-0 truncate ${
                pillTextClassName != null && pillTextClassName.trim().length > 0
                  ? pillTextClassName.trim()
                  : pillClassName != null && pillClassName.trim().length > 0
                    ? ""
                    : "text-primary"
              }`}
            >
              {normalized}
            </span>
          </span>
        ) : null}
      </div>
    </div>
  );
}
