import type { ReactElement } from "react";
import Image from "next/image";
import { STRING_CONSTANTS } from "@/utils/app-constants";

type AppStoreBadgeProps = {
  readonly href?: string;
  readonly className?: string;
};

/**
 * Black store badge matching the Google Play badge style used across the site.
 * Uses `/images/apple.png` and links to the ZapCash App Store listing.
 */
export default function AppStoreBadge({
  href = STRING_CONSTANTS.APP_STORE_URL,
  className = "",
}: AppStoreBadgeProps): ReactElement {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download on the App Store"
      className={[
        "inline-flex h-14 w-[190px] shrink-0 items-center gap-3 rounded-xl border border-gray-700 bg-black px-4 text-white",
        "hover:bg-gray-900 transition-colors",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src="/images/apple.png"
        alt="App Store"
        width={28}
        height={28}
        className="size-7 shrink-0 rounded-sm object-contain"
      />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[10px] leading-tight uppercase">Download on the</span>
        <span className="text-sm font-semibold leading-tight">App Store</span>
      </span>
    </a>
  );
}
