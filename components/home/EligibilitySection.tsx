import type { ReactElement } from "react";
import Image from "next/image";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";
import { HOME_IMAGES } from "@/lib/images";

const SAFETY_POINTS = [
  {
    title: "Secure Data Handling",
    description: "Your information is protected through secure systems.",
  },
  {
    title: "Privacy First",
    description: "Your data is handled responsibly and only for permitted purposes.",
  },
  {
    title: "Trusted Partners",
    description: "We work with regulated lending partners to provide loan options.",
  },
] as const;

const CARD_BACKGROUND =
  "linear-gradient(90deg, rgba(254,202,66,0.22) 0%, rgba(254,202,66,0.1) 55%, rgba(254,202,66,0.03) 100%)";

/**
 * Homepage safety / trust section.
 */
export default function EligibilitySection(): ReactElement {
  return (
    <section className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
              Your Safety
              <br />
              comes first
            </h2>
            <div className="relative mt-8 hidden w-[200px] sm:mt-10 sm:block sm:w-[240px] lg:w-[280px]">
              <Image
                src={HOME_IMAGES.safetyShield}
                alt="Secure shield with lock"
                width={720}
                height={780}
                className="h-auto w-full object-contain"
                sizes="280px"
                unoptimized
                priority={false}
              />
            </div>
          </div>
          <div className="w-full">
            <p className="mb-6 hidden text-sm leading-relaxed text-gray-600 sm:mb-8 sm:block sm:text-base lg:text-lg">
              We use secure technology and responsible processes to help protect your personal and
              financial information.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4">
              {SAFETY_POINTS.map(({ title, description }) => (
                <article
                  key={title}
                  className="rounded-2xl px-5 py-4 sm:px-6 sm:py-5"
                  style={{ background: CARD_BACKGROUND }}
                >
                  <h3 className="text-base font-bold text-gray-900 sm:text-lg">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
