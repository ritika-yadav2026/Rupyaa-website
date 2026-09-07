import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function ShieldCheckBullet({ children }: Props) {
  return (
    <div className="flex items-start gap-2.5 text-gray-700 text-sm leading-snug">
      <span className="mt-0.5 shrink-0 text-primary" aria-hidden>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="block">
          <path
            d="M12 3l8 3v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 12.3l1.6 1.6 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{children}</span>
    </div>
  );
}
