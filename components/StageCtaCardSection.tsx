"use client";

import type { ReactNode } from "react";
import Progress from "@/components/Progress";
import BasicInfoFooter from "@/components/BasicInfoFooter";
import { appShellContainerClassName } from "@/lib/app-shell-layout";

type StageCtaCardSectionProps = {
  steps: readonly string[];
  completedUpTo: number;
  currentStep: number;
  title: string;
  heading: string;
  description: string;
  hideProgressStepper?: boolean;
  hideAction?: boolean;
  actionLabel?: string;
  onActionPress?: () => void;
  content?: ReactNode;
};

export default function StageCtaCardSection(props: StageCtaCardSectionProps) {
  const {
    steps,
    completedUpTo,
    currentStep,
    title,
    heading,
    description,
    hideProgressStepper = false,
    hideAction = true,
    actionLabel,
    onActionPress,
    content,
  } = props;

  return (
    <div className={appShellContainerClassName}>
      {!hideProgressStepper && (
        <Progress steps={steps} completedUpTo={completedUpTo} currentStep={currentStep} />
      )}
      <main className="min-h-[60vh] mt-5">
        {content ?? (
          <div className="w-full max-w-2xl mx-auto bg-white/60 backdrop-blur rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 sm:p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">{title}</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{heading}</h2>
            <p className="text-sm text-gray-600">{description}</p>
            {!hideAction && actionLabel && onActionPress && (
              <button
                type="button"
                onClick={onActionPress}
                className="mt-6 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px]"
              >
                {actionLabel}
              </button>
            )}
          </div>
        )}
      </main>
      <BasicInfoFooter />
    </div>
  );
}
