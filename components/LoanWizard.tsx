"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import Progress from "@/components/Progress";
import KYCCompletedModal from "@/components/KYCCompletedModal";
import ApplicationRejectedView from "@/components/ApplicationRejectedView";
import DownloadAppView from "@/components/DownloadAppView";
import ComingSoonView from "@/components/ComingSoonView";
import StageCtaCardSection from "@/components/StageCtaCardSection";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import { useFlowStore } from "@/store/useFlowStore";
import { FLOW_PHASES, getSubstepByIndex, type FlowPhase } from "@/config/flowConfig";
import { STEP_COMPONENTS } from "@/config/stepComponents";
import { useEnableFullWebJourneyStatus } from "@/hooks/useEnableFullWebJourney";
import { getLoanStatusCardConfig, LOAN_STATUS_LOADING_CARD } from "@/config/loanStatusCardConfig";
import { UserStagesInBackend } from "@/lib/user-stage";
import { useLoanFlowStageSync } from "@/hooks/useLoanFlowStageSync";
import { goHomeWithFallback } from "@/lib/go-home";
import { usePreEnachReviewGate } from "@/hooks/usePreEnachReviewGate";
import PreEnachReviewGateModal from "@/components/PreEnachReviewGateModal";
import {
  isLoanStatusPending,
  isPendingOfferStatusForUnderReview,
} from "@/helpers/loan-helper";
import { useGetExistingActiveLoan } from "@/services/loans/useGetExistingActiveLoan";
import UnderReviewCard from "@/components/UnderReviewCard";
import ZapcashLoading from "@/components/ZapcashLoading";

export default function LoanWizard() {
  const {
    enabled: enableFullWebJourney,
    isResolved: isFullWebJourneyResolved,
  } = useEnableFullWebJourneyStatus();
  const router = useRouter();
  const steps = useFlowStore((s) => s.steps);
  const phaseIndex = useFlowStore((s) => s.phaseIndex);
  const substepIndex = useFlowStore((s) => s.substepIndex);
  const flowContext = useFlowStore((s) => s.flowContext);
  const applicationRejected = useFlowStore((s) => s.applicationRejected);
  const showDownloadApp = useFlowStore((s) => s.showDownloadApp);
  const next = useFlowStore((s) => s.next);
  const prev = useFlowStore((s) => s.prev);
  const goTo = useFlowStore((s) => s.goTo);
  const userStageResponse = useFlowStore((s) => s.userStageResponse);

  const userStage = userStageResponse?.stage as UserStagesInBackend | undefined;

  const activeLoanQuery = useGetExistingActiveLoan({
    enabled:
      userStage === UserStagesInBackend.ACTIVE_LOAN_DASHBOARD ||
      userStage === UserStagesInBackend.APPLICATION_STATUS,
  });
  const { refreshFromBackend: syncStage } = useLoanFlowStageSync();

  const [showKycCompletedModal, setShowKycCompletedModal] = useState(false);

  const showUnderReviewCard =
    userStage === UserStagesInBackend.APPLICATION_STATUS ||
    isLoanStatusPending(activeLoanQuery.data?.loanStatus) ||
    (userStage === UserStagesInBackend.OFFERINGS &&
      isPendingOfferStatusForUnderReview(userStageResponse?.context?.offerStatus));

  const currentPhase = FLOW_PHASES[Math.max(0, Math.min(phaseIndex, FLOW_PHASES.length - 1))];
  const currentSubstep = getSubstepByIndex(currentPhase, substepIndex, flowContext);
  const completedUpTo = phaseIndex === 0 ? -1 : phaseIndex - 1;

  const progressCurrentStep =
    currentPhase === "register" &&
      (currentSubstep?.id === "loan-offer-register" || currentSubstep?.id === "under-review")
      ? 1
      : phaseIndex;

  const handleRefreshUnderReview = useCallback(async () => {
    await Promise.allSettled([activeLoanQuery.refetch(), syncStage()]);
  }, []);

  const handleKycCompletedModalClose = async () => {
    setShowKycCompletedModal(false);
    goTo("disbursal", "enach");
    await syncStage();
  };

  const handleNext = useCallback(async () => {
    if (!currentSubstep) return;

    if (currentSubstep.id === "face-kyc") {
      setShowKycCompletedModal(true);
      return;
    }

    if (currentSubstep.id === "loan-offer-register") {
      goTo("offer", "approved-offer");
      await syncStage();
      return;
    }

    next();
    await syncStage();
  }, [currentSubstep, goTo, next, syncStage]);

  const handleBack = () => {
    if (currentPhase === "disbursal" && currentSubstep?.id === "enach") {
      goTo("kyc", "face-kyc");
      return;
    }
    prev();
  };

  const preEnachReviewGate = usePreEnachReviewGate(currentSubstep?.id);

  const gateModal = (
    <PreEnachReviewGateModal
      visible={preEnachReviewGate.visible}
      isLoading={preEnachReviewGate.isLoading}
      hasError={preEnachReviewGate.hasError}
      substepId={preEnachReviewGate.substepId}
      onRetry={() => void preEnachReviewGate.refetch()}
      onBackToHome={() => goHomeWithFallback(router)}
    />
  );

  if (applicationRejected) {
    return (
      <>
        <main className={`min-h-[60vh] ${appShellContainerClassName}`}>
          <ApplicationRejectedView />
        </main>
        {gateModal}
      </>
    );
  }

  if (showDownloadApp) {
    return (
      <>
        <div className={appShellContainerClassName}>
          <Progress steps={steps} completedUpTo={completedUpTo} currentStep={progressCurrentStep} />
          <div className="flex flex-col gap-5 py-4 sm:py-6 overflow-x-hidden">
            <DownloadAppView />
          </div>
        </div>
        {gateModal}
      </>
    );
  }

  if (showUnderReviewCard) {
    return (
      <>
        <div className={appShellContainerClassName}>
          <Progress steps={steps} completedUpTo={completedUpTo} currentStep={progressCurrentStep} />
          <div className="flex flex-col gap-5 py-4 sm:py-6 overflow-x-hidden">
            <UnderReviewCard
              applicationNumber={activeLoanQuery.data?.loan?.applicationNumber}
              onRefresh={() => void handleRefreshUnderReview()}
              isRefreshing={activeLoanQuery.isFetching}
            />
          </div>
        </div>
        {gateModal}
      </>
    );
  }

  if (!userStageResponse?.stage) {
    return (
      <>
        <div className={appShellContainerClassName}>
          <Progress steps={steps} completedUpTo={completedUpTo} currentStep={progressCurrentStep} />
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 py-4 sm:py-6 overflow-x-hidden">
            <ZapcashLoading />
          </div>
        </div>
        {gateModal}
      </>
    );
  }

  if (!isFullWebJourneyResolved) {
    return (
      <>
        <div className={appShellContainerClassName}>
          <Progress steps={steps} completedUpTo={completedUpTo} currentStep={progressCurrentStep} />
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 overflow-x-hidden py-4 sm:py-6">
            <ZapcashLoading />
          </div>
        </div>
        {gateModal}
      </>
    );
  }

  if (!currentSubstep) {
    return (
      <>
        {gateModal}
      </>
    );
  }

  const isWebEnabled = currentSubstep.webEnabled || enableFullWebJourney;
  if (!isWebEnabled) {
    const stage = userStageResponse?.stage as UserStagesInBackend | undefined;
    const card = stage
      ? getLoanStatusCardConfig(stage)
      : LOAN_STATUS_LOADING_CARD;

    return (
      <>
        <StageCtaCardSection
          steps={steps}
          completedUpTo={completedUpTo}
          currentStep={progressCurrentStep}
          title={card.title}
          heading={card.heading}
          description={card.description}
          hideAction={card.hideAction}
          hideProgressStepper={card.hideProgressStepper}
          content={enableFullWebJourney ? <ComingSoonView /> : <DownloadAppView />}
        />
        {gateModal}
      </>
    );
  }

  const stepConfig = STEP_COMPONENTS[currentSubstep.component];
  if (!stepConfig) {
    return (
      <>
        {gateModal}
      </>
    );
  }

  const { Component: StepComponent, ctaProp } = stepConfig;
  const stepBaseProps: {
    substepId: string;
    flowPhase: FlowPhase;
    onContinue?: () => Promise<void>;
  } = {
    substepId: currentSubstep.id,
    flowPhase: currentPhase as FlowPhase,
    ...(ctaProp === "onContinue" ? { onContinue: handleNext } : {}),
  };

  const isPersonalDetailsStep = currentSubstep.component === "PersonalDetailsForm";

  return (
    <div className={appShellContainerClassName}>
      {!isPersonalDetailsStep && (
        <Progress steps={steps} completedUpTo={completedUpTo} currentStep={progressCurrentStep} />
      )}
      <div className="flex flex-col gap-5 py-4 sm:py-6 overflow-x-hidden">
        <StepComponent {...stepBaseProps} />
      </div>
      {gateModal}
      <KYCCompletedModal isOpen={showKycCompletedModal} onClose={handleKycCompletedModalClose} />
    </div>
  );
}
