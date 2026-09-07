import type { ReactElement } from "react";
import Image from "next/image";
import { STRING_CONSTANTS } from "@/utils/app-constants";

type GooglePlayBadgeProps = {
  readonly href?: string;
  readonly className?: string;
};

/**
 * Standard Google Play badge matching the App Store badge dimensions.
 */
export default function GooglePlayBadge({
  href = STRING_CONSTANTS.PLAY_STORE_URL,
  className = "",
}: GooglePlayBadgeProps): ReactElement {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get it on Google Play"
      className={[
        "inline-flex h-14 w-[190px] shrink-0 items-center gap-3 rounded-xl border border-gray-700 bg-black px-4 text-white",
        "hover:bg-gray-900 transition-colors",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Image
        src="/images/google-play-store-icon.webp"
        alt="Google Play"
        width={28}
        height={28}
        className="size-7 shrink-0 object-contain"
      />
      <span className="flex flex-col items-start leading-none">
        <span className="text-[10px] uppercase leading-tight">Get it on</span>
        <span className="text-sm font-semibold leading-tight">Google Play</span>
      </span>
    </a>
  );
}
