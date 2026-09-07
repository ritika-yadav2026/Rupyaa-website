"use client";

import type { ReactNode } from "react";
import type { LoanStatusColorVariant } from "@/helpers/loan-helper";
import { LoanStatusPill } from "./LoanStatusPill";
import { MoneyBagIcon } from "../icons";
import { cn } from "@/utils/cn-utils";

export function LoanCardShell({
  title,
  statusLabel,
  statusVariant,
  children,
  footer,
  className,
}: {
  title: string;
  statusLabel: string;
  statusVariant: LoanStatusColorVariant;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <MoneyBagIcon width={20} height={20} />
          </span>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
        </div>
        <LoanStatusPill label={statusLabel} variant={statusVariant} />
      </div>
      <div className="border-t border-gray-100 pt-1">{children}</div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </div>
  );
}
