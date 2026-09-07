"use client";

export default function ApplicationRejectedView() {
  return (
    <div className="max-w-md mx-auto w-full py-8 sm:py-12">
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 sm:p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-red-600"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Application Rejected
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Unfortunately, your loan application could not be approved at this time. Please contact support for more details.
        </p>
        <a
          href="mailto:help@zapcash.com"
          className="inline-flex items-center justify-center py-3 px-6 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 min-h-[48px]"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
