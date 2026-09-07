"use client";

import type { ReactNode } from "react";

export type PostOfferCtaWithOptionalRefreshProps = {
  children: ReactNode;
  onRefreshPress?: () => void;
  isRefreshing?: boolean;
};

function PostOfferRefreshButton({
  onPress,
  isRefreshing,
}: {
  onPress: () => void;
  isRefreshing: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={isRefreshing}
      className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/35 bg-primary/20 p-0 text-primary shadow-sm transition-colors hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-60 sm:size-11"
      aria-label="Refresh loan status"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={isRefreshing ? "animate-spin" : ""}
        aria-hidden
      >
        <path d="M23 4v6h-6" />
        <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
      </svg>
    </button>
  );
}

/**
 * Primary post-offer CTA full-width, or CTA + refresh control when `onRefreshPress` is set.
 */
export function PostOfferCtaWithOptionalRefresh({
  children,
  onRefreshPress,
  isRefreshing = false,
}: PostOfferCtaWithOptionalRefreshProps) {
  if (typeof onRefreshPress !== "function") {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center gap-2 sm:gap-2.5">
      <div className="min-w-0 flex-1">{children}</div>
      <PostOfferRefreshButton onPress={onRefreshPress} isRefreshing={isRefreshing} />
    </div>
  );
}
