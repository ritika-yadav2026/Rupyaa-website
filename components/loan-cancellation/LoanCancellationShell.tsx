"use client";

import { type ReactNode } from "react";
import LoanCancellationHeader from "./LoanCancellationHeader";

type LoanCancellationShellProps = {
  /** When true (success step), the body fills available height and centers content vertically. */
  fillBody?: boolean;
  children: ReactNode;
};

/**
 * Layout shell shared by both steps. Confirm step uses a scrollable body so
 * the inline footer CTAs remain reachable on short viewports; success step
 * fills the remaining height and centers its content vertically.
 */
export default function LoanCancellationShell({
  fillBody = false,
  children,
}: LoanCancellationShellProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white md:h-auto md:max-h-[min(90vh,720px)] md:w-full md:max-w-md md:rounded-2xl md:shadow-xl">
      <LoanCancellationHeader />
      <div
        className={
          fillBody
            ? "flex flex-1 flex-col items-center justify-center px-5 pb-8 pt-6 sm:px-7 md:px-8"
            : "flex flex-1 flex-col overflow-y-auto px-5 pb-8 pt-6 sm:px-7 md:px-8"
        }
      >
        {children}
      </div>
    </div>
  );
}
