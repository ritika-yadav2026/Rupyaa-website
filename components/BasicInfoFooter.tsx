"use client";

function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-2-8 2v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

const FOOTER_ITEMS = [
  { icon: ClockIcon, label: "INSTANT DISBURSAL" },
  { icon: ShieldIcon, label: "SECURE TRANSACTION" },
  { icon: DocumentIcon, label: "TRANSPARENT TERMS" },
];

export default function BasicInfoFooter() {
  return (
    <div className="flex flex-wrap justify-center gap-5 sm:gap-8 md:gap-12 py-6 border-t border-gray-100">
      {FOOTER_ITEMS.map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <div className="text-gray-400">
            <Icon />
          </div>
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        </div>
      ))}
    </div>
  );
}
