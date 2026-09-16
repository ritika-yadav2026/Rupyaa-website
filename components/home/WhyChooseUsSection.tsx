import type { ReactElement, ReactNode } from "react";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";

type FeatureIconProps = {
  readonly children: ReactNode;
};

function FeatureIcon({ children }: FeatureIconProps): ReactElement {
  return (
    <span className="mb-4 flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm">
      {children}
    </span>
  );
}

function LaptopIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M2 20h20" />
      <path d="M8 20v-2h8v2" />
    </svg>
  );
}

function BoltIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldCheckIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BankIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 10l9-6 9 6" strokeLinejoin="round" />
      <path d="M5 10v8M9 10v8M15 10v8M19 10v8" />
      <path d="M3 18h18" />
      <path d="M2 21h20" />
    </svg>
  );
}

const FEATURES = [
  {
    title: "100% Digital & Paperless",
    description: "Apply completely online with no physical paperwork.",
    icon: LaptopIcon,
  },
  {
    title: "Quick Approval & Disbursals",
    description: "Get a quick decision and fast fund transfer after approval.",
    icon: BoltIcon,
  },
  {
    title: "Transparent & Affordable",
    description: "Know your charges and repayment details upfront.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Simple Application",
    description: "A quick, easy process designed to get you started faster.",
    icon: BankIcon,
  },
] as const;

const FEATURE_CARD_CLASSNAME =
  "flex h-full flex-col rounded-2xl border border-[#FECA42]/55 bg-[radial-gradient(ellipse_at_top_left,_#FECA42_0%,_rgba(254,202,66,0.45)_32%,_rgba(254,202,66,0.12)_58%,_#FFFFFF_82%)] p-5 sm:p-6";

const MOBILE_TRACK_CLASSNAME =
  "flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch] [touch-action:pan-x_pan-y] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

type FeatureCardProps = {
  readonly title: string;
  readonly description: string;
  readonly icon: () => ReactElement;
};

/**
 * Shared feature card used by the mobile carousel and desktop grid.
 */
function FeatureCard({ title, description, icon: Icon }: FeatureCardProps): ReactElement {
  return (
    <article className={FEATURE_CARD_CLASSNAME}>
      <FeatureIcon>
        <Icon />
      </FeatureIcon>
      <h3 className="text-base font-bold text-gray-900 sm:text-lg">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
    </article>
  );
}

export default function WhyChooseUsSection(): ReactElement {
  return (
    <section className="border-t border-[#FECA42] bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <div className="mx-auto mb-8 mt-8 max-w-3xl text-center sm:mb-10">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Why Choose Rupyaa ?
          </h2>
          <p className="mt-3 hidden text-sm leading-relaxed text-gray-600 sm:block sm:text-base">
            We use secure technology and responsible processes to help protect your personal and
            financial information.
          </p>
        </div>
        <div className="relative -mx-4 px-4 sm:hidden">
          <div className={MOBILE_TRACK_CLASSNAME}>
            {FEATURES.map(({ title, description, icon }) => (
              <div key={title} className="w-[min(78vw,260px)] shrink-0 snap-start">
                <FeatureCard title={title} description={description} icon={icon} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {FEATURES.map(({ title, description, icon }) => (
            <FeatureCard key={title} title={title} description={description} icon={icon} />
          ))}
        </div>
      </div>
    </section>
  );
}
