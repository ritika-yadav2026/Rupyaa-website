"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface CreditScoreFetchingProps {
  readonly isPending: boolean;
  readonly onComplete: () => void;
}

const STEPS = ["Identity verified", "Connecting to bureau", "Generating your report"] as const;
const STEP_INTERVAL_MS = 850;
const PROCESSING_MS = 1000;

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4 4L19 7"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpinnerRing({ className = "" }: { readonly className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-primary/25 border-t-primary ${className}`}
    />
  );
}

/**
 * Full-screen animated hand-off shown while the Equifax report is being pulled.
 * Advances through visual steps and only completes once the API call resolves.
 */
export default function CreditScoreFetching({ isPending, onComplete }: CreditScoreFetchingProps) {
  const [completedSteps, setCompletedSteps] = useState(0);
  const [phase, setPhase] = useState<"steps" | "processing">("steps");
  const [animationDone, setAnimationDone] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, index) => {
      timers.push(
        setTimeout(() => setCompletedSteps(index + 1), STEP_INTERVAL_MS * (index + 1))
      );
    });
    timers.push(
      setTimeout(() => setPhase("processing"), STEP_INTERVAL_MS * (STEPS.length + 1))
    );
    timers.push(
      setTimeout(
        () => setAnimationDone(true),
        STEP_INTERVAL_MS * (STEPS.length + 1) + PROCESSING_MS
      )
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, []);
  useEffect(() => {
    if (animationDone && !isPending) {
      onCompleteRef.current();
    }
  }, [animationDone, isPending]);
  let card: ReactNode;
  if (phase === "steps") {
    card = (
      <>
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary">
          <span className="text-xs font-bold tracking-wide text-primary">EQUIFAX</span>
        </div>
        <h2 className="mt-6 text-center text-xl font-bold text-gray-900 sm:text-2xl">
          Fetching your credit score…
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Securely connecting to EQUIFAX. This takes a few seconds.
        </p>
        <ul className="mx-auto mt-6 max-w-xs space-y-3">
          {STEPS.map((label, index) => {
            const isDone = index < completedSteps;
            let indicator: ReactNode;
            let labelClass = "text-sm text-gray-400";
            if (isDone) {
              indicator = (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <CheckIcon />
                </span>
              );
              labelClass = "text-sm font-medium text-gray-800";
            } else if (index === completedSteps) {
              indicator = <SpinnerRing className="h-6 w-6" />;
              labelClass = "text-sm font-medium text-gray-600";
            } else {
              indicator = <span className="h-6 w-6 rounded-full border-2 border-gray-200" />;
            }
            return (
              <li key={label} className="flex items-center gap-3">
                <span className="shrink-0">{indicator}</span>
                <span className={labelClass}>{label}</span>
              </li>
            );
          })}
        </ul>
      </>
    );
  } else {
    card = (
      <div className="flex flex-col items-center justify-center py-4">
        <SpinnerRing className="h-16 w-16" />
        <h2 className="mt-6 text-center text-xl font-bold text-gray-900 sm:text-2xl">
          Processing your report…
        </h2>
      </div>
    );
  }
  return (
    <div className="flex min-h-[70vh] w-full items-center justify-center bg-white px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-8">
        {card}
      </div>
    </div>
  );
}
