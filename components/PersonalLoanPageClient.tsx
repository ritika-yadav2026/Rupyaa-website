"use client";

import type { ReactElement, ReactNode } from "react";
import LoanWizard from "@/components/LoanWizard";
import GuestDashboardLanding from "@/components/GuestDashboardLanding";
import BasicInfoSidebar from "@/components/BasicInfoSidebar";
import ZapcashLoading from "@/components/ZapcashLoading";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import { useAuthLoggedInHint } from "@/hooks/use-auth-logged-in-hint";

type PersonalLoanShellProps = {
  readonly children: ReactNode;
  readonly contentClassName?: string;
};

/** Viewport height under fixed `h-16` AppHeader. */
const SHELL_VIEWPORT_HEIGHT = "h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)]";

/**
 * Logged-in personal loan layout: fixed viewport height, scrollable LoanWizard (left),
 * fixed BasicInfoSidebar (right).
 */
function PersonalLoanShell({
  children,
  contentClassName = "",
}: PersonalLoanShellProps): ReactElement {
  return (
    <div
      className={`${appShellContainerClassName} box-border flex flex-col overflow-hidden py-4 sm:py-6 ${SHELL_VIEWPORT_HEIGHT}`}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-hidden lg:flex-row lg:gap-6">
        <div
          className={`min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain ${contentClassName}`.trim()}
        >
          {children}
        </div>
        <div className="hidden h-full min-h-0 w-[300px] shrink-0 lg:flex xl:w-[340px]">
          <BasicInfoSidebar />
        </div>
      </div>
    </div>
  );
}

export default function PersonalLoanPageClient() {
  const { isLoggedIn, isPending } = useAuthLoggedInHint();

  if (isPending) {
    return (
      <PersonalLoanShell contentClassName="flex flex-col items-center justify-center">
        <ZapcashLoading />
      </PersonalLoanShell>
    );
  }

  if (!isLoggedIn) {
    return <GuestDashboardLanding />;
  }

  return (
    <PersonalLoanShell>
      <LoanWizard />
    </PersonalLoanShell>
  );
}
