import type { ReactElement, ReactNode } from "react";
import Image from "next/image";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";
import { HOME_IMAGES } from "@/lib/images";

type StepIconProps = {
  readonly children: ReactNode;
};

function StepIcon({ children }: StepIconProps): ReactElement {
  return (
    <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[#FECA42] bg-[#FFFCF5] text-gray-900 sm:size-12">
      {children}
    </span>
  );
}

function PhoneCheckIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M10 17h4" strokeLinecap="round" />
      <path d="M10 9l1.5 1.5L15 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LaptopIcon(): ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M2 20h20" />
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
      <path d="M3 18h18M2 21h20" />
    </svg>
  );
}

const STEPS = [
  {
    title: "Apply Online",
    description: "Fill in a few basic details to get started.",
    icon: PhoneCheckIcon,
  },
  {
    title: "Personalized Offer",
    description: "View loan options and eligible amounts tailored for you.",
    icon: LaptopIcon,
  },
  {
    title: "Complete KYC",
    description: "Securely verify identity with a quick digital KYC process.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Receive Funds",
    description: "Approved amount is transferred directly to your bank account.",
    icon: BankIcon,
  },
] as const;

export default function LoanStepsSection(): ReactElement {
  return (
    <section className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 sm:mb-8 sm:text-left sm:text-3xl lg:text-4xl">
          How It Works
        </h2>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          <div className="hidden items-end justify-center rounded-3xl border border-[#FECA42] bg-[linear-gradient(360deg,_#FECA42_0%,_rgba(254,202,66,0.45)_32%,_rgba(254,202,66,0.12)_58%,_#FFFFFF_82%)] px-6 pb-0 pt-10 sm:px-10 sm:pt-12 lg:flex">
            <div className="relative w-full max-w-[240px] sm:max-w-[280px]">
              <Image
                src={HOME_IMAGES.howItWorksPhone}
                alt="Rupyaa app - loan offer eligibility"
                width={420}
                height={735}
                className="h-auto w-full object-contain object-bottom drop-shadow-xl"
                sizes="(max-width: 640px) 240px, 280px"
              />
            </div>
          </div>
          <ol className="relative space-y-8 sm:space-y-10">
            <span
              aria-hidden
              className="absolute bottom-6 left-[21px] top-6 w-0.5 bg-[#FECA42] sm:left-[23px]"
            />
            {STEPS.map(({ title, description, icon: Icon }) => (
              <li key={title} className="relative flex items-start gap-4">
                <StepIcon>
                  <Icon />
                </StepIcon>
                <div className="pt-1.5">
                  <h3 className="text-base font-bold text-gray-900 sm:text-lg">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
