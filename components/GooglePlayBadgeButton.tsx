'use client';

import type { ReactElement } from "react";

type GooglePlayBadgeButtonProps = {
  readonly href: string;
  readonly onClick?: () => void;
  readonly className?: string;
};

function GooglePlayIcon(): ReactElement {
  return (
    <svg width="28" height="28" viewBox="0 0 512 512" aria-hidden="true">
      <defs>
        <linearGradient id="gp-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00A0FF" />
          <stop offset="1" stopColor="#00E3FF" />
        </linearGradient>
        <linearGradient id="gp-b" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FFE000" />
          <stop offset="1" stopColor="#FF9C00" />
        </linearGradient>
        <linearGradient id="gp-c" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FF3A44" />
          <stop offset="1" stopColor="#C31162" />
        </linearGradient>
        <linearGradient id="gp-d" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#32A071" />
          <stop offset="1" stopColor="#00F076" />
        </linearGradient>
      </defs>
      <path
        d="M71.6 25.5c-9.8 7.6-15.6 20-15.6 34.7v391.6c0 14.7 5.8 27.1 15.6 34.7l218.6-230.7L71.6 25.5z"
        fill="url(#gp-a)"
      />
      <path
        d="M361.5 306.4l-71.3-50.6L71.6 486.5c7.6 5.9 17.3 9.4 28 9.4 9 0 17.5-2.4 24.9-6.9l237-136.4z"
        fill="url(#gp-d)"
      />
      <path
        d="M361.5 205.6L124.5 69.2c-7.4-4.5-15.9-6.9-24.9-6.9-10.7 0-20.4 3.5-28 9.4l218.6 230.7 71.3-50.6z"
        fill="url(#gp-b)"
      />
      <path
        d="M456 256c0-14.5-7.9-27.9-20.7-35.2l-73.8-42.5-71.3 50.6 71.3 50.6 73.8-42.5c12.8-7.3 20.7-20.7 20.7-35.2z"
        fill="url(#gp-c)"
      />
    </svg>
  );
}

export default function GooglePlayBadgeButton({
  href,
  onClick,
  className = "",
}: GooglePlayBadgeButtonProps): ReactElement {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        onClick?.();
        event.stopPropagation();
      }}
      aria-label="Get it on Google Play"
      className={[
        "inline-flex items-center gap-3 rounded-full bg-black text-white",
        "px-5 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.14)]",
        "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
        "transition-transform active:scale-[0.99]",
        className,
      ].join(" ")}
    >
      <GooglePlayIcon />
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] tracking-[0.18em] uppercase text-white/80">
          Get it on
        </span>
        <span className="text-[18px] font-semibold">Google Play</span>
      </span>
    </a>
  );
}

