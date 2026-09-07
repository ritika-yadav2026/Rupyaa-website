import Link from "next/link";
import type { ReactNode } from "react";

type AppEmptyStateCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};

/**
 * Light green rounded card for “no data yet” states (matches ZapCash marketing UI).
 */
export default function AppEmptyStateCard({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: AppEmptyStateCardProps) {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] p-6 sm:p-10 md:p-14 lg:p-16 min-h-[min(52vh,420px)] flex flex-col items-center justify-center text-center">
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-primary/15 flex items-center justify-center mb-8 shrink-0">{icon}</div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 max-w-3xl">{title}</h2>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-10 max-w-2xl">{description}</p>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center sm:flex-wrap">
        <Link
          href={primaryAction.href}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors min-h-[48px]"
        >
          {primaryAction.label}
        </Link>
        {secondaryAction && (
          <Link
            href={secondaryAction.href}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white border-2 border-gray-200 text-gray-800 font-semibold hover:bg-gray-50 transition-colors min-h-[48px]"
          >
            {secondaryAction.label}
          </Link>
        )}
      </div>
    </div>
  );
}
