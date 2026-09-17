import type { ReactElement, ReactNode } from "react";

type HeroStatusCardShellProps = {
  readonly children: ReactNode;
  readonly badge?: ReactNode;
  readonly className?: string;
};

/**
 * Shared marketing card chrome for logged-in hero status UIs.
 */
export function HeroStatusCardShell({
  children,
  badge,
  className = "",
}: HeroStatusCardShellProps): ReactElement {
  return (
    <div
      className={`relative isolate w-full overflow-hidden rounded-[1.35rem] border border-white/60 px-5 pb-6 pt-7 text-center backdrop-blur-xl sm:rounded-[1.5rem] sm:px-7 sm:pb-7 sm:pt-8 ${className}`}
      style={{
        background: "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, #FFFCF5 100%)",
      }}
    >
      {badge}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

type HeroAppIdBadgeProps = {
  readonly label: string;
};

/**
 * Top-right black application / status badge.
 */
export function HeroAppIdBadge({ label }: HeroAppIdBadgeProps): ReactElement {
  return (
    <div className="absolute right-3 top-3 z-10 max-w-[70%] truncate rounded-md bg-[#1A1A1A] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#FECA42] sm:right-4 sm:top-4 sm:text-[11px]">
      {label}
    </div>
  );
}

type HeroYellowButtonProps = {
  readonly children: ReactNode;
  readonly href?: string;
  readonly onClick?: () => void;
  readonly disabled?: boolean;
  readonly type?: "button" | "submit";
  readonly className?: string;
};

/**
 * Primary yellow CTA used across logged-in hero status cards.
 */
export function HeroYellowButton({
  children,
  href,
  onClick,
  disabled = false,
  type = "button",
  className = "",
}: HeroYellowButtonProps): ReactElement {
  const baseClassName = `inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#FECA42] px-5 py-3 text-sm font-bold text-gray-900 transition hover:bg-[#F5C038] focus:outline-none focus:ring-2 focus:ring-[#FECA42] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[52px] sm:text-base ${className}`;
  if (href && !disabled) {
    return (
      <a href={href} className={baseClassName}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClassName}>
      {children}
    </button>
  );
}

export function HeroArrowIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeroCheckIcon(): ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
