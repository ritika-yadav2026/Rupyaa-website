import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found - ZapCash",
  description:
    "The page you are looking for doesn't exist or has been moved. Return to ZapCash home.",
};

function CompassIcon() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 14v-3a9 9 0 1 1 18 0v3" />
      <path d="M21 14a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2v1z" />
      <path d="M3 14a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2v1z" />
      <path d="M18 16v1a3 3 0 0 1-3 3h-2" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, rgba(0, 101, 37, 0.18) 0%, rgba(0, 101, 37, 0.06) 30%, rgba(255,255,255,0) 62%), radial-gradient(circle at 85% 18%, rgb(183, 214, 191) 0%, rgba(183, 214, 191, 0.42) 32%, rgba(255,255,255,0) 66%), linear-gradient(180deg,#e8f3ea 0%,#edf6ee 30%,#f3faf4 60%,#ffffff 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 101, 37, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 101, 37, 0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/10 flex items-center justify-center mb-6 sm:mb-8 ring-1 ring-primary/15">
          <CompassIcon />
        </div>

        <p className="text-sm font-semibold tracking-[0.2em] text-primary uppercase mb-3">
          Error 404
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
          Looks like you&apos;ve taken a wrong turn
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-white font-semibold shadow-sm hover:bg-primary/90 transition-colors"
          >
            <ArrowLeftIcon />
            Back to Home
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 px-6 py-3 text-gray-800 font-semibold hover:bg-white transition-colors"
          >
            <HeadsetIcon />
            Contact Support
          </Link>
        </div>

        <div className="mt-10 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 px-6 py-4 w-full">
          <p className="text-sm text-gray-600">
            Need urgent help? Reach us at{" "}
            <a
              href="mailto:care@zapcash.in"
              className="text-primary font-semibold hover:underline"
            >
              care@zapcash.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
