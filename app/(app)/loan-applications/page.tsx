"use client";

import type { ReactNode } from "react";
import { ErrorContainer } from "@/components/loans/ErrorContainer";
import { LoanListScreen } from "@/components/loans/LoanListScreen";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import { useAllUserLoans } from "@/services/loans";
import { MyLoanEmptyCard } from "@/components/loans/MyLoanEmptyCard";
import ZapcashLoading from "@/components/ZapcashLoading";

export default function LoanApplicationsPage() {
  const {
    data: loanData,
    isPending: loanPending,
    isError: loanError,
    error: loanErr,
  } = useAllUserLoans({ enabled: true });

  const loans = loanData?.loans ?? [];

  let status: "error" | "loading" | "empty" | "success";
  if (loanError) {
    status = "error";
  } else if (loanPending && !loanData) {
    status = "loading";
  } else if (loans.length === 0) {
    status = "empty";
  } else {
    status = "success";
  }

  let content: ReactNode;
  switch (status) {
    case "error":
      content = (
        <ErrorContainer
          message={loanErr instanceof Error ? loanErr.message : "Failed to load your loans. Please try again."}
        />
      );
      break;
    case "loading":
      content = (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <div className="flex flex-col items-center gap-3">
            <ZapcashLoading />
            <span className="text-sm font-medium">Loading your loans…</span>
          </div>

        </div>
      );
      break;
    case "empty":
      content = <MyLoanEmptyCard />;
      break;
    case "success":
      content = <LoanListScreen loans={loans} />;
      break;
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className={`flex flex-col py-8 sm:py-12 flex-1 ${appShellContainerClassName}`}>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Loans</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Track your ongoing repayments and view your past loan history.
          </p>
        </div>

        {content}
      </div>
    </div>
  );
}
