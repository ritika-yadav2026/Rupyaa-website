"use client";

export type LoanTab = "ongoing" | "history";

const TABS: { id: LoanTab; label: string }[] = [
  { id: "ongoing", label: "Ongoing Loans" },
  { id: "history", label: "Loan History" },
];

export function LoanTabsToggle({
  activeTab,
  onChange,
}: {
  activeTab: LoanTab;
  onChange: (tab: LoanTab) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Loan status"
      className="inline-flex w-full sm:w-auto rounded-full border border-gray-200 bg-white p-1"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
