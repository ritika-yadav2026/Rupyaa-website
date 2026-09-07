"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import toast from "react-hot-toast";
import ConsentWindowOverlay from "@/components/ConsentWindowOverlay";
import { useLoanFlowStageSync } from "@/hooks/useLoanFlowStageSync";
import {
  getAadhaarReferenceImageLink,
  getHyperKycAccessToken,
  getLoanIdForHyperKyc,
  pickAccessToken,
  pickLoanIdAsTransactionId,
  pollHyperKycResultsUntilReady,
} from "@/lib/hyperkyc-api";
import {
  launchHyperKycWeb,
  type HyperKycSdkStatus,
} from "@/lib/hyperkyc-web-launch";
import {
  fetchExternalAppConfig,
  getActiveProvider,
  resolveHyperKycLaunchParams,
} from "@/lib/external-app-config-api";

type Props = { onContinue?: () => void };

type FacePhase = "intro" | "verifying" | "polling" | "failed";

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary shrink-0">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 shrink-0">
      <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" />
    </svg>
  );
}

const SDK_FAILURE_MESSAGES: Partial<Record<HyperKycSdkStatus, string>> = {
  auto_declined: "Face verification could not be completed due to a face mismatch.",
  error: "Face verification failed. Please try again.",
};

export default function FaceKYCStep({ onContinue }: Props) {
  const { refreshAndInvalidateUserStageQueries } = useLoanFlowStageSync();

  const [phase, setPhase] = useState<FacePhase>("intro");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const didAdvanceRef = useRef(false);

  const isFailed = phase === "failed";

  const syncStage = useCallback(async () => {
    await refreshAndInvalidateUserStageQueries();
  }, [refreshAndInvalidateUserStageQueries]);

  const advanceOnce = useCallback(() => {
    if (didAdvanceRef.current) return;
    didAdvanceRef.current = true;
    onContinue?.();
  }, [onContinue]);

  const handleStartFaceKYC = useCallback(async () => {
    setErrorMessage(null);
    setPhase("verifying");

    let accessToken = "";
    let transactionId = "";
    let inputImageUrl: string | null = null;
    let workflowId = "";
    let sdkVersion = "";
    let showLandingPage = true;

    try {
      const [appConfig, tokenRes, loanIdRes, imageLink] = await Promise.all([
        fetchExternalAppConfig(),
        getHyperKycAccessToken(),
        getLoanIdForHyperKyc(),
        getAadhaarReferenceImageLink(),
      ]);

      const activeProvider = getActiveProvider(appConfig?.faceKycProvider);
      if (activeProvider && activeProvider.toLowerCase() !== "hyperverge") {
        const message = "Face verification provider is not supported on web yet.";
        setErrorMessage(message);
        setPhase("failed");
        toast.error(message);
        return;
      }

      const launchParams = resolveHyperKycLaunchParams(appConfig);
      workflowId = launchParams.workflowId;
      sdkVersion = launchParams.sdkVersion;
      showLandingPage = launchParams.showLandingPage;

      accessToken = pickAccessToken(tokenRes);
      transactionId = pickLoanIdAsTransactionId(loanIdRes);
      inputImageUrl = imageLink;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start face verification";
      setErrorMessage(message);
      setPhase("failed");
      toast.error(message);
      return;
    }

    if (!workflowId) {
      const message = "Face verification configuration is unavailable. Please try again later.";
      setErrorMessage(message);
      setPhase("failed");
      toast.error(message);
      return;
    }

    if (!accessToken || !transactionId) {
      const message = "Verification session is not ready. Please try again.";
      setErrorMessage(message);
      setPhase("failed");
      toast.error(message);
      return;
    }

    const sdkResult = await launchHyperKycWeb({
      accessToken,
      transactionId,
      workflowId,
      sdkVersion,
      showLandingPage,
      inputImageUrl,
    });

    if (sdkResult.status === "user_cancelled") {
      setPhase("intro");
      return;
    }

    if (sdkResult.status === "auto_declined" || sdkResult.status === "error") {
      const fallback = SDK_FAILURE_MESSAGES[sdkResult.status] ?? "Face verification failed.";
      const message = sdkResult.errorMessage?.trim() || fallback;
      setErrorMessage(message);
      setPhase("failed");
      return;
    }

    setPhase("polling");
    const pollOutcome = await pollHyperKycResultsUntilReady();

    if (!pollOutcome.ok) {
      const message =
        pollOutcome.reason === "timeout"
          ? "Verification is taking longer than expected. Please try again."
          : pollOutcome.message ?? "Verification failed. Please try again.";
      setErrorMessage(message);
      setPhase("failed");
      toast.error(message);
      return;
    }

    try {
      await syncStage();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to refresh application status";
      toast.error(message);
    }

    advanceOnce();
  }, [advanceOnce, syncStage]);

  const handleTryAgain = () => {
    setErrorMessage(null);
    setPhase("intro");
  };

  useEffect(() => {
    return () => {
      didAdvanceRef.current = true;
    };
  }, []);

  const isOverlayOpen = phase === "verifying" || phase === "polling";
  const overlayCopy =
    phase === "polling"
      ? {
          title: "Finalizing your verification",
          description:
            "We are confirming your face KYC result. This usually takes under a minute.",
        }
      : {
          title: "Complete face verification in the popup",
          description:
            "Follow the on-screen instructions in the HyperKYC window. We will continue automatically once it is complete.",
        };

  const mockupShellClassName = `relative mx-auto w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden flex items-center justify-center ${
    isFailed ? "ring-2 ring-red-400" : "bg-gray-800/90"
  }`;

  let faceMockup: ReactNode;
  if (phase === "intro") {
    faceMockup = (
      <button
        type="button"
        onClick={() => void handleStartFaceKYC()}
        aria-label="Start Face KYC"
        className={`${mockupShellClassName} cursor-pointer transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
      >
        <svg
          className="w-24 h-24 text-gray-500"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
        <span className="absolute bottom-3 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-white shadow-md">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        </span>
      </button>
    );
  } else if (phase === "verifying" || phase === "polling") {
    let statusLabel = "Verifying...";
    if (phase === "polling") {
      statusLabel = "Finalizing...";
    }
    faceMockup = (
      <div className={mockupShellClassName} aria-hidden>
        <div className="flex flex-col items-center justify-center text-white text-xs gap-3">
          <span className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          <span>{statusLabel}</span>
        </div>
      </div>
    );
  } else {
    faceMockup = (
      <div className={mockupShellClassName} aria-hidden>
        <div className="w-full h-full bg-linear-to-b from-amber-100 to-amber-200 rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-24 rounded-full border-2 border-amber-400 bg-amber-100/50" />
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 text-center">Complete Your Face KYC</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Take a clear selfie to verify your identity.</p>

        <div
          className={`rounded-2xl border-2 p-6 sm:p-8 mb-6 transition-colors ${
            isFailed ? "border-red-400 bg-red-50/30" : "border-gray-200 bg-gray-50/50"
          }`}
        >
          {isFailed && (
            <div className="flex justify-end mb-2">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600" aria-hidden>
                <CrossIcon />
              </span>
            </div>
          )}
          <p className={`text-sm font-medium mb-4 text-center ${isFailed ? "text-red-700" : "text-gray-700"}`}>
            {phase === "intro" && "Auto scan and capture a photo."}
            {phase === "verifying" && "Verifying your face in HyperKYC..."}
            {phase === "polling" && "Finalizing verification..."}
            {phase === "failed" && "Face Verification Failed"}
          </p>
          {faceMockup}
          {phase === "intro" && (
            <p className="mt-3 text-center text-xs text-gray-500">Tap the photo to start Face KYC</p>
          )}
          {phase === "failed" && errorMessage && (
            <p className="text-sm text-red-600 text-center mt-3">{errorMessage}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Do This</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2"><CheckIcon /> Keep your face centered and fully visible</li>
              <li className="flex items-center gap-2"><CheckIcon /> Use a neutral expression</li>
              <li className="flex items-center gap-2"><CheckIcon /> Be in a well-lit area</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Avoid This</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2"><CrossIcon /> Wearing masks, sunglasses, or hats</li>
              <li className="flex items-center gap-2"><CrossIcon /> Tilting the camera or using filters</li>
              <li className="flex items-center gap-2"><CrossIcon /> Blurry or dark photos</li>
            </ul>
          </div>
        </div>

        {(phase === "intro" || phase === "verifying" || phase === "polling") && (
          <button
            type="button"
            onClick={() => void handleStartFaceKYC()}
            disabled={phase !== "intro"}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {phase === "intro" && "Start Face KYC"}
            {phase === "verifying" && "Opening HyperKYC..."}
            {phase === "polling" && "Finalizing..."}
          </button>
        )}
        {phase === "failed" && (
          <button
            type="button"
            onClick={handleTryAgain}
            className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px]"
          >
            Try Again
          </button>
        )}
      </div>

      <ConsentWindowOverlay
        isOpen={isOverlayOpen}
        title={overlayCopy.title}
        description={overlayCopy.description}
      />
    </>
  );
}
