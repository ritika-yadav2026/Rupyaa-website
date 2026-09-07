import Image from "next/image";
import Link from "next/link";
import {
  appShellContainerClassName,
  homeSectionSpacingClassName,
} from "@/lib/app-shell-layout";

const STEPS = [
  "Download ZapCash and register",
  "Complete digital KYC in minutes",
  "Receive funds in your bank account",
] as const;

const STEPS_GRADIENT = "linear-gradient(to right, rgb(0 83 30), #009e39)";

export default function LoanStepsSection() {
  return (
    <section className="bg-white">
      <div className={`${appShellContainerClassName} ${homeSectionSpacingClassName}`}>
        <div
          className="relative rounded-2xl sm:rounded-3xl py-8  xl:py-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 overflow-hidden"
          style={{ background: STEPS_GRADIENT }}
        >
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
            <div className="flex-1 w-full order-2 lg:order-1  lg:text-left min-w-0">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 sm:mb-6 md:mb-8">
                Your Loan in Just 3 Simple Steps
              </h2>
              <ol className="space-y-4 sm:space-y-5 md:space-y-6 mb-6 sm:mb-8 md:mb-10 w-full max-w-md mx-auto lg:mx-0">
                {STEPS.map((step, index) => (
                  <li key={step} className="flex items-center gap-3 sm:gap-4">
                    <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#009437] text-white font-bold shrink-0 text-base sm:text-lg">
                      {index + 1}
                    </span>
                    <span className="text-white text-base sm:text-lg md:text-xl font-semibold">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="flex justify-center lg:justify-start">
                <Link
                  href="/personal-loan"
                  className="inline-flex bg-white text-primary items-center justify-center px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg"
                >
                  Start Your Loan Journey
                </Link>
              </div>
            </div>
            <div className="flex-1 w-full order-1 lg:order-2 flex justify-center min-w-0">
              <div className="relative w-full max-w-[300px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[380px] xl:max-w-[420px] mx-auto">
                <img
                  src="/images/Vector.png"
                  alt="vector icon"
                  className="absolute left-1/3 rotate-15 top-1/2  md:top-75 w-[250px] sm:w-[260px] md:w-[300px] lg:w-[360px] xl:w-[400px] h-full  pointer-events-none"
                  style={{ transform: "translate(-50%, -50%) rotate(-12deg)" }}
                  aria-hidden
                />
                <Image
                  src="/images/sectionMobile.png"
                  alt="ZapCash app - Get your loan in simple steps"
                  width={420}
                  height={735}
                  className="relative z-10 object-contain w-full max-h-[320px] sm:max-h-[380px] md:max-h-[440px] lg:max-h-[500px] xl:max-h-[550px] drop-shadow-2xl"
                  priority={false}
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 340px, (max-width: 1024px) 380px, 420px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
