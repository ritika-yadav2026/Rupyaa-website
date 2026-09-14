"use client";

import type { ReactNode } from "react";
import { ErrorContainer } from "@/components/loans/ErrorContainer";
import { LoanListScreen } from "@/components/loans/LoanListScreen";
import BasicInfoSidebar from "@/components/BasicInfoSidebar";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import { useAllUserLoans } from "@/services/loans";
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
          message={
            loanErr instanceof Error
              ? loanErr.message
              : "Failed to load your loans. Please try again."
          }
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
      content = <LoanListScreen loans={[]} />;
      break;
    case "success":
      content = <LoanListScreen loans={loans} />;
      break;
  }

  return (
    <div className={`${appShellContainerClassName} box-border py-8 sm:py-10`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="min-w-0 flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Loans</h1>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              Track your ongoing repayments and view your past loan history.
            </p>
          </div>
          {content}
        </div>
        <div className="hidden w-[300px] shrink-0 self-stretch lg:flex xl:w-[340px]">
          <div className="sticky top-24 h-[calc(100dvh-7rem)] w-full">
            <BasicInfoSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
