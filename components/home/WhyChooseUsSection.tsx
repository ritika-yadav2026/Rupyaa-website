import Image from "next/image";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";
import whyChooseUsImage from "@/public/images/why-choose-us.png";

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: CheckIcon,
    text: "RBI-Approved NBFC Partnerships",
  },
  {
    icon: LockIcon,
    text: "Bank-Grade Data Security & Encryption",
  },
  {
    icon: ClockIcon,
    text: "Flexible Loan Repayments & Quick Disbursements",
  },
] as const;

export default function WhyChooseUsSection() {
  return (
    <section className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <div className="flex flex-col lg:flex-row items-center  gap-6 sm:gap-10 lg:gap-16">
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="relative w-full max-w-xl lg:max-w-2xl mx-auto lg:mx-0 rounded-xl overflow-hidden">
              <Image
                src={whyChooseUsImage}
                alt="Why People Choose Us - ZapCash mobile app"
                width={800}
                height={800}
                className="object-contain w-full h-auto"
                priority={false}
              />
            </div>
          </div>
          <div className="flex-1 w-full order-1 lg:order-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Empowering Financial Freedom
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6 md:mb-8">
              ZapCash is on a mission to democratize credit access across India. We believe everyone
              deserves a fair chance at financial stability without the traditional banking hurdles.
            </p>
            <ul className="space-y-4">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0">
                    <Icon />
                  </span>
                  <span className="text-gray-700 font-medium">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
