"use client";

import Link from "next/link";

function LightningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9 9v2" />
      <path d="M9 13v2" />
      <path d="M9 17v2" />
      <path d="M15 9v2" />
      <path d="M15 13v2" />
      <path d="M15 17v2" />
    </svg>
  );
}

const FEATURES = [
  {
    icon: LightningIcon,
    title: "Fast Disbursal",
    description: "Funds are transferred to your verified bank account in under 5 minutes.",
  },
  {
    icon: DocumentIcon,
    title: "Paperless Process",
    description: "100% digital application. No physical signatures or office visits required.",
  },
  {
    icon: BuildingIcon,
    title: "Transparent Rates",
    description: "What you see is what you pay. No hidden fees or surprise charges, ever.",
  },
];

export default function WhyPeopleChooseUsScreen() {
  return (
    <div className="min-h-[400px] flex flex-col bg-white rounded-[2rem] overflow-hidden">
      <div className="bg-[#1E7C4D] px-4 pt-6 pb-8 flex-1 relative overflow-hidden">
        <span className="absolute top-2 right-4 text-4xl font-light text-white/20">₹</span>
        <div className="flex items-start justify-between gap-2 relative">
          <div>
            <button type="button" className="text-white mb-2" aria-label="Back">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-bold text-white leading-tight">
              Why People
              <br />
              Choose Us
            </h2>
            <p className="text-sm text-white/90 mt-1">
              Transparent, lightning fast, and built on 100% digital trust.
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white border-2 border-[#1E7C4D] flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E7C4D" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-2-8 2v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="px-4 py-4 space-y-3 bg-white">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
          >
            <div className="w-10 h-10 rounded-full bg-[#D9F0E1] flex items-center justify-center shrink-0 text-[#1E7C4D]">
              <Icon />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{description}</p>
            </div>
          </div>
        ))}
        <Link
          href="/auth"
          className="block w-full py-3 rounded-xl bg-[#1E7C4D] text-white text-center font-semibold text-sm hover:bg-[#1a6d3f] transition-colors"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}
