"use client";

import type { ReactElement, ReactNode } from "react";

export type LoanTab = "ongoing" | "history";

type TabConfig = {
  readonly id: LoanTab;
  readonly label: string;
  readonly description: string;
};

const TABS: readonly TabConfig[] = [
  {
    id: "ongoing",
    label: "Ongoing Loans",
    description: "Active loans & upcoming payments",
  },
  {
    id: "history",
    label: "Loan History",
    description: "View your past loans",
  },
];

function DocumentIcon(): ReactElement {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6M8 13h8M8 17h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HistoryIcon(): ReactElement {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12a9 9 0 1 0 3-6.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3 4v5h5M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getTabIcon(tabId: LoanTab): ReactNode {
  if (tabId === "ongoing") {
    return <DocumentIcon />;
  }
  return <HistoryIcon />;
}

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
      className="grid grid-cols-1 gap-3 sm:grid-cols-2"
    >
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        let buttonClassName =
          "flex w-full items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left transition-colors hover:border-gray-300";
        let iconWrapClassName =
          "flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500";
        if (isActive) {
          buttonClassName =
            "flex w-full items-start gap-3 rounded-2xl border-2 border-[#FECA42] bg-white p-4 text-left transition-colors";
          iconWrapClassName =
            "flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FECA42] text-gray-900";
        }
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={buttonClassName}
          >
            <span className={iconWrapClassName}>{getTabIcon(tab.id)}</span>
            <span className="min-w-0">
              <span className="block text-sm font-bold text-gray-900 sm:text-base">
                {tab.label}
              </span>
              <span className="mt-0.5 block text-xs text-gray-500 sm:text-sm">
                {tab.description}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
