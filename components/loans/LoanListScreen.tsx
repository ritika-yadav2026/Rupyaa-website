"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { Loan } from "@/lib/eligibility-api";
import { classifyLoans } from "@/helpers/loan-helper";
import { useNocRequest } from "@/services/loans";
import { LoanTabsToggle, type LoanTab } from "./LoanTabsToggle";
import { MyLoanEmptyCard } from "./MyLoanEmptyCard";
import { renderLoanCard } from "./renderLoanCard";

export function LoanListScreen({
  loans,
}: {
  loans: Loan[];
}) {
  const [activeTab, setActiveTab] = useState<LoanTab>("ongoing");
  const { submitNoc, pendingLoanId } = useNocRequest();

  const { ongoing, history } = useMemo(() => classifyLoans(loans), [loans]);
  const activeLoans = activeTab === "ongoing" ? ongoing : history;

  const handleRequestNoc = (loan: Loan) => {
    submitNoc(loan._id);
  };

  let listContent: ReactNode;
  if (activeLoans.length === 0) {
    listContent = <MyLoanEmptyCard />;
  } else {
    listContent = (
      <div className="flex flex-col gap-4">
        {activeLoans.map((loan) =>
          renderLoanCard(loan, activeTab, handleRequestNoc, pendingLoanId === loan._id)
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <LoanTabsToggle activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {listContent}
    </div>
  );
}
