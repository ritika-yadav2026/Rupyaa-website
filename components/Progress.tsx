"use client";

import type { ReactElement, ReactNode } from "react";
import { cn } from "@/utils/cn-utils";

const FALLBACK_STEP_LABELS = [
  "BASIC INFO",
  "OFFER GENERATED",
  "KYC VERIFICATION",
  "DISBURSAL",
] as const;

/** Maps internal flow step (0-4) to display step (0-3). E-NACH is shown as part of KYC. */
function toDisplayStep(internalStep: number): number {
  if (internalStep <= 2) return internalStep;
  if (internalStep === 3) return 3;
  return 3;
}

type ProgressProps = {
  steps?: readonly string[];
  completedUpTo?: number;
  currentStep?: number;
  className?: string;
};

function resolveStepLabels(steps?: readonly string[]): readonly string[] {
  if (steps && steps.length === 4) {
    return steps;
  }
  return FALLBACK_STEP_LABELS;
}

function CheckIcon(): ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="sm:h-4.5 sm:w-4.5 md:h-5 md:w-5">
      <path
        d="M20 6L9 17l-5-5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Progress({ steps, currentStep = 0, className = "" }: ProgressProps) {
  const labels = resolveStepLabels(steps);
  const displayStep = toDisplayStep(currentStep);

  return (
    <div className={cn("w-full bg-white px-3 py-4 sm:px-6 sm:py-6", className)}>
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center">
          {labels.map((label, index) => {
            const isActive = index === displayStep;
            const isCompleted = index < displayStep;
            const segmentFilled = displayStep > index;
            const isHighlighted = isActive || isCompleted;

            let node: ReactNode;
            if (isHighlighted) {
              node = (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFFCF4] sm:h-14 sm:w-14 md:h-16 md:w-16">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FECA42] sm:h-7 sm:w-7 md:h-8 md:w-8">
                    <CheckIcon />
                  </span>
                </div>
              );
            } else {
              node = (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFFCF4] sm:h-14 sm:w-14 md:h-16 md:w-16">
                  <span className="h-6 w-6 rounded-full border-2 border-[#FECA42] bg-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                </div>
              );
            }

            let segmentClassName: string;
            if (segmentFilled) {
              segmentClassName = "bg-[#FECA42]";
            } else {
              segmentClassName = "bg-[#FFFCF4]";
            }

            return (
              <div key={`${label}-${index}`} className="contents">
                {node}
                {index < labels.length - 1 && (
                  <div
                    className={`flex-1 min-w-[8px] sm:min-w-[12px] h-0.5 shrink ${segmentClassName}`}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-start mt-2">
          {labels.map((label, index) => {
            const isActive = index === displayStep;
            const isCompleted = index < displayStep;
            return (
              <div key={`${label}-cap-${index}`} className="contents">
                <span
                  className={`w-11 sm:w-14 md:w-16 text-[8px] sm:text-[10px] md:text-xs font-medium uppercase text-center shrink-0 leading-tight ${
                    isActive || isCompleted ? "text-black" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
                {index < labels.length - 1 && (
                  <div className="flex-1 min-w-[8px] sm:min-w-[12px] shrink" aria-hidden />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
