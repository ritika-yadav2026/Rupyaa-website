"use client";

import { useMemo, type ReactElement } from "react";

const ACCENT_GREEN = "#006525";
const TRACK_REMAIN = "#B8E0C8";
const STEP_COUNT = 4;

export const HERO_JOURNEY_PROGRESS_LABELS = [
  "Details",
  "Offer",
  "Verify",
  "Funds",
] as const;

type StepLabelAlign = "left" | "center" | "right";

type Step = {
  readonly label: string;
  readonly labelAlign: StepLabelAlign;
};

function clampCurrentStepIndex(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(STEP_COUNT - 1, Math.floor(value)));
}

function getSteps(labels: readonly string[]): readonly Step[] {
  const aligns: readonly StepLabelAlign[] = ["left", "center", "center", "right"];
  return labels.map((label, index) => ({
    label,
    labelAlign: aligns[index] ?? "center",
  }));
}

function CheckIcon(): ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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

export type HeroJourneyProgressProps = {
  readonly currentStepIndex?: number;
  readonly stepLabels?: readonly string[];
  /** Completed segment & checked nodes (default `#006525`). */
  readonly accentColor?: string;
  /** Background track behind the progress fill (default light mint `#B8E0C8`). */
  readonly trackRemainColor?: string;
};

export default function HeroJourneyProgress({
  currentStepIndex: currentStepIndexProp = 1,
  stepLabels,
  accentColor = ACCENT_GREEN,
  trackRemainColor = TRACK_REMAIN,
}: HeroJourneyProgressProps): ReactElement {
  const steps = useMemo(() => {
    const labels =
      stepLabels && stepLabels.length === STEP_COUNT
        ? stepLabels
        : [...HERO_JOURNEY_PROGRESS_LABELS];
    return getSteps(labels);
  }, [stepLabels]);

  const currentStepIndex = clampCurrentStepIndex(currentStepIndexProp);
  const completedStepsCount = Math.max(0, Math.min(currentStepIndex, STEP_COUNT));
  const progressPercent = (completedStepsCount / (STEP_COUNT - 1)) * 100;

  return (
    <div className="mt-5 sm:mt-6">
      <div className="relative h-9 w-full sm:h-10 ">
        <div
          className="pointer-events-none absolute left-[10px] right-[10px] top-1/2 h-[3px] -translate-y-1/2 rounded-full"
          style={{ backgroundColor: trackRemainColor }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute left-[10px] top-1/2 h-[3px] max-w-[calc(100%-20px)] -translate-y-1/2 rounded-l-full transition-[width] duration-700 ease-out"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: accentColor,
          }}
          aria-hidden
        />

        <div className="relative z-10 grid h-full w-full grid-cols-4 items-center">
          {steps.map((step, index) => {
            const isCompleted: boolean = index < currentStepIndex;
            const alignClassName: string =
              index === 0
                ? "justify-self-start"
                : index === steps.length - 1
                  ? "justify-self-end"
                  : "justify-self-center";
            return (
              <div key={step.label} className={`flex items-center justify-center ${alignClassName}`}>
                {isCompleted ? (
                  <span
                    className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full sm:h-6 sm:w-6"
                    style={{ backgroundColor: accentColor }}
                    aria-hidden
                  >
                    <CheckIcon />
                  </span>
                ) : (
                  <span
                    className="h-[22px] w-[22px] shrink-0 rounded-full border-2 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.07)] sm:h-6 sm:w-6"
                    style={{ borderColor: accentColor }}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-2 grid w-full grid-cols-4">
        {steps.map((step) => (
          <div
            key={`${step.label}-caption`}
            className={`min-w-0 text-[11px] font-semibold leading-tight text-gray-800 sm:text-xs ${
              step.labelAlign === "left"
                ? "text-left justify-self-start"
                : step.labelAlign === "right"
                  ? "text-right justify-self-end"
                  : "text-center justify-self-center"
            }`}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}

