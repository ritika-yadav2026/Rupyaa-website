"use client";

import { useMemo, useState } from "react";
import type { HeroHomeResolvedCard } from "@/lib/build-hero-home-card";
import { getLoggedInHeroUiCase } from "@/lib/hero-home-card-case";

export type HeroDebugPanelProps = {
  userStage: unknown;
  activeLoan: unknown;
  resolved: HeroHomeResolvedCard;
};

export function HeroDebugPanel({ userStage, activeLoan, resolved }: HeroDebugPanelProps) {
  const [open, setOpen] = useState(false);
  const summary = useMemo(() => {
    const al = activeLoan as { hasActiveLoan?: boolean; loanStatus?: string } | null;
    const us = userStage as { stage?: string } | null;
    const heroUiCase = getLoggedInHeroUiCase(resolved);
    return `stage=${us?.stage ?? "?"} hasActiveLoan=${al?.hasActiveLoan ?? "?"} loanStatus=${al?.loanStatus ?? "?"} hasOffer=${resolved.hasOffer ?? "?"} parsedStage=${resolved.parsedStage} → ${heroUiCase}`;
  }, [activeLoan, userStage, resolved]);
  return (
    <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between font-mono text-amber-800"
      >
        <span>Debug: {summary}</span>
        <span>{open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap wrap-break-word font-mono text-[10px] text-amber-900">
          {JSON.stringify({ resolved, userStage, activeLoan }, null, 2)}
        </pre>
      )}
    </div>
  );
}
