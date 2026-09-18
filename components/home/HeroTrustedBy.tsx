import type { ReactElement } from "react";
import Image from "next/image";

const AVATARS = [
  "/images/trusted/1.png",
  "/images/trusted/2.png",
  "/images/trusted/3.png",
  "/images/trusted/4.png",
] as const;

/**
 * Social-proof strip above the logged-out home hero headline.
 */
export default function HeroTrustedBy(): ReactElement {
  return (
    <div className="mb-4 mt-10 flex items-center justify-center gap-3 sm:mb-5 sm:mt-0">
      <div className="flex -space-x-2.5">
        {AVATARS.map((src, index) => (
          <span
            key={src}
            className="relative inline-flex size-8 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm sm:size-9"
            style={{ zIndex: AVATARS.length - index }}
          >
            <Image src={src} alt="" width={36} height={36} className="size-full object-cover" />
          </span>
        ))}
      </div>
      <p className="text-left text-sm font-medium leading-tight text-gray-600 sm:text-[15px]">
        Trusted by
        <br />
        10,000+
      </p>
    </div>
  );
}
