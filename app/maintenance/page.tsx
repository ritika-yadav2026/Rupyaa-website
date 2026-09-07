import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Under Maintenance - ZapCash",
  description: "ZapCash is currently under maintenance. We'll be back soon.",
};

function WrenchIcon() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export default function MaintenancePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6"
      style={{
        background: "linear-gradient(to bottom, #F8FAF7, #EBF4EC)",
      }}
    >
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/10 flex items-center justify-center mb-6 sm:mb-8">
          <WrenchIcon />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          We&apos;ll be back soon!
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
          ZapCash is currently under scheduled maintenance. We&apos;re working hard to improve your
          experience and will be back shortly.
        </p>
        <div className="rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 px-6 py-4 w-full">
          <p className="text-sm text-gray-600">
            For urgent assistance, please contact us at{" "}
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
