"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AadharCompletedModal from "./AadharCompletedModal";
import ConsentWindowOverlay from "./ConsentWindowOverlay";
import digilockerIcon from "@/public/images/digilocker.png";
import {
  isDigilockerVerified,
  isVerificationIdRequiredError,
  pickDigilockerRedirectUrl,
  postDigilockerInitiate,
  postDigilockerStatus,
  SUCCESS_MODAL_AUTO_NEXT_DELAY_MS,
} from "@/lib/digilocker-api";
import { CALLBACK_FLOWS } from "@/lib/callback-opener-messages";
import { useExternalFlowConsentLock } from "@/hooks/useExternalFlowConsentLock";
import { openCenteredExternalFlowPopup } from "@/lib/open-external-flow-popup";
import AppButton from "@/components/app-button";

const DIGILOCKER_STATUS_QUERY_KEY = ["digilocker-status"] as const;

function CheckIcon({ className = "text-[#FECA42]" }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = { onContinue?: () => void };

export default function DigiLockerStep({ onContinue }: Props) {
  const queryClient = useQueryClient();
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didAdvanceRef = useRef(false);

  const { data: statusResult, isFetching: isStatusFetching } = useQuery({
    queryKey: DIGILOCKER_STATUS_QUERY_KEY,
    queryFn: postDigilockerStatus,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });

  const isVerified = isDigilockerVerified(statusResult);
  const hasNoSessionYet = isVerificationIdRequiredError(statusResult);
  const hadUnexpectedStatusError =
    !!statusResult && !statusResult.ok && !hasNoSessionYet;

  const refetchStatus = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: DIGILOCKER_STATUS_QUERY_KEY });
  }, [queryClient]);

  const { locked: consentLocked, prepareOpenPopup, attachPopup, startWatchPopupClosed } =
    useExternalFlowConsentLock({
      flow: CALLBACK_FLOWS.DIGILOCKER,
      overlayStaysLockedOnPopupClose: false,
      releaseLockWhenPostMessageArrives: true,
      onPostMessageComplete: refetchStatus,
      onPopupClosedWithoutMessage: refetchStatus,
      watchClosedPollMs: 1000,
    });

  const advanceOnce = useCallback(() => {
    if (didAdvanceRef.current) return;
    didAdvanceRef.current = true;
    onContinue?.();
  }, [onContinue]);

  useEffect(() => {
    if (!isVerified) return;
    queueMicrotask(() => {
      setShowCompletedModal(true);
    });
    if (advanceTimerRef.current) return;
    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      advanceOnce();
    }, SUCCESS_MODAL_AUTO_NEXT_DELAY_MS);
  }, [isVerified, advanceOnce]);

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
    };
  }, []);

  const initiateMutation = useMutation({
    mutationFn: postDigilockerInitiate,
    onSuccess: (response) => {
      const url = pickDigilockerRedirectUrl(response);
      if (!url) {
        toast.error("DigiLocker link unavailable. Please try again.");
        return;
      }
      void prepareOpenPopup().then(() => {
        const popup = openCenteredExternalFlowPopup({
          url,
          windowName: "digilockerConsentWindow",
          preset: "consent",
        });
        if (!attachPopup(popup)) {
          toast.error("Popup blocked. Please allow popups and try again.");
          return;
        }
        startWatchPopupClosed();
      });
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Failed to start DigiLocker verification");
    },
  });

  const handleGoToDigiLocker = () => {
    initiateMutation.mutate({});
  };

  const handleCompletedClose = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    setShowCompletedModal(false);
    advanceOnce();
  };

  const isInitiating = initiateMutation.isPending;
  const ctaDisabled = isInitiating || consentLocked || isStatusFetching;
  const ctaLabel = isInitiating
    ? "Opening DigiLocker…"
    : consentLocked
      ? "Waiting for DigiLocker…"
      : "Continue with DigiLocker";

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        <div className=" rounded-xl bg-[#E8F5E9] flex items-center justify-center mb-3 sm:mb-4">
          <Image
            src={digilockerIcon}
            alt="digilocker"
            width={250}
            height={250}
          />
        </div>
        <p className="text-sm text-gray-500 mb-4">
          The secure documents platform.
        </p>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Verify Instantly with DigiLocker
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Securely fetch your verified KYC documents directly from DigiLocker.
          100% encrypted & confidential.
        </p>
      </div>

      <ul className="space-y-3 mb-6 sm:mb-8">
        <li className="flex items-center gap-3 text-sm text-gray-700">
          <CheckIcon />
          <span>No need to upload Aadhar manually</span>
        </li>
        <li className="flex items-center gap-3 text-sm text-gray-700">
          <CheckIcon />
          <span>Direct link to Government portal (UIDAI)</span>
        </li>
        <li className="flex items-center gap-3 text-sm text-gray-700">
          <CheckIcon />
          <span>100% encrypted document verification</span>
        </li>
      </ul>

      <AppButton
        type="button"
        fullWidth
        onClick={handleGoToDigiLocker}
        disabled={ctaDisabled}
      >
        {ctaLabel}
      </AppButton>

        {consentLocked && (
          <p className="text-center text-xs text-gray-500 mt-3">
            Complete the verification in the new tab. We&apos;ll continue automatically once it&apos;s done.
          </p>
        )}

        {hadUnexpectedStatusError && !consentLocked && !isVerified && (
          <p className="text-center text-xs text-amber-600 mt-3">
            We couldn&apos;t check your DigiLocker status. You can still start verification.
          </p>
        )}

        <AadharCompletedModal
          isOpen={showCompletedModal}
          onClose={handleCompletedClose}
        />
      </div>

      <ConsentWindowOverlay
        isOpen={consentLocked}
        title="Complete Aadhaar verification in the new window"
        description="This screen is locked until the DigiLocker window closes. Once closed, we will check your Aadhaar verification status."
      />
    </>
  );
}
