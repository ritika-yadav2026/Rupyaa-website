import type { Loan } from "@/lib/eligibility-api";
import type { LoanTab } from "./LoanTabsToggle";
import { OngoingLoanCard } from "./OngoingLoanCard";
import { HistoryLoanCard } from "./HistoryLoanCard";

export function renderLoanCard(
  loan: Loan,
  activeTab: LoanTab,
  onRequestNoc: (loan: Loan) => void,
  isNocPending: boolean
) {
  if (activeTab === "ongoing") {
    return <OngoingLoanCard key={loan._id} loan={loan} />;
  }
  return (
    <HistoryLoanCard
      key={loan._id}
      loan={loan}
      onRequestNoc={onRequestNoc}
      isNocPending={isNocPending}
    />
  );
}
