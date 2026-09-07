"use client";

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
};

function resolveStepLabels(steps?: readonly string[]): readonly string[] {
  if (steps && steps.length === 4) {
    return steps;
  }
  return FALLBACK_STEP_LABELS;
}

export default function Progress({ steps, currentStep = 0 }: ProgressProps) {
  const labels = resolveStepLabels(steps);
  const displayStep = toDisplayStep(currentStep);

  return (
    <div className="w-full py-4 sm:py-6 px-3 sm:px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center">
          {labels.map((label, index) => {
            const isActive = index === displayStep;
            const isCompleted = index < displayStep;
            const segmentFilled = displayStep > index;

            return (
              <div key={`${label}-${index}`} className="contents">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full text-sm sm:text-base md:text-lg font-bold shrink-0
                    ${isActive || isCompleted
                      ? "bg-primary text-white"
                      : "bg-white border-2 border-primary/40 text-gray-400"}
                  `}
                >
                  {index + 1}
                </div>
                {index < labels.length - 1 && (
                  <div
                    className={`flex-1 min-w-[8px] sm:min-w-[12px] h-0.5 shrink ${
                      segmentFilled ? "bg-primary" : "bg-primary/30"
                    }`}
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
                  className={`text-[8px] sm:text-[10px] md:text-xs font-medium uppercase text-center shrink-0 leading-tight ${
                    isActive || isCompleted ? "text-primary" : "text-gray-500"
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
