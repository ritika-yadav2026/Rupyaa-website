"use client";

import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import ConsentWindowOverlay from "@/components/ConsentWindowOverlay";
import enachIcon from "@/public/images/e-nach.png";
import { useExternalFlowConsentLock } from "@/hooks/useExternalFlowConsentLock";
import { runEnachCompletionStageSync } from "@/lib/enach-step-success";
import { CALLBACK_FLOWS } from "@/lib/callback-opener-messages";
import {
  createMandate,
  getMandateDetails,
  isMandateRegistrationFailed,
} from "@/lib/mandate-api";
import { getEnachCashfreeBridgePopupUrl } from "@/lib/enach-checkout-popup-url";
import { openCenteredExternalFlowPopup } from "@/lib/open-external-flow-popup";
import { useGeoStore } from "@/store/useGeoStore";
import { resolveCashfreeEnachMode } from "@/lib/cashfree-enach-config";
import { REACT_QUERY_KEYS } from "@/utils/app-constants";
import AppButton from "@/components/app-button";

const ENACH_OPENER_LOG = "[EnachOpener]";

function enachOpenerDevLog(message: string, data?: unknown): void {
  console.log(ENACH_OPENER_LOG, message, data !== undefined ? data : "");
}

function CalendarIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="shrink-0 text-black"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="shrink-0 text-black"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="shrink-0 text-black"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="shrink-0 text-black"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function ENachMandateStep() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshOpenerInFlightRef = useRef(false);

  /**
   * Whether the user returned via `/enach/callback` postMessage or only closed the popup: verify
   * mandate on the **opener** (GET /mandates/user), refresh pre-NACH gate, then sync wizard.
   */
  const refreshOpenerAfterEnachPopupEnds = useCallback(async () => {
    if (refreshOpenerInFlightRef.current) {
      enachOpenerDevLog("refresh skipped — already in flight");
      return;
    }
    refreshOpenerInFlightRef.current = true;
    enachOpenerDevLog("starting opener refresh after eNACH popup (getMandateDetails + sync)");

    try {
      try {
        enachOpenerDevLog("calling getMandateDetails()");
        const details = await getMandateDetails();
        enachOpenerDevLog("getMandateDetails resolved", {
          registrationStatus: details.registrationDetails?.status,
        });

        if (isMandateRegistrationFailed(details)) {
          enachOpenerDevLog("mandate FAILED on opener — toast + invalidate gate only");
          toast.error("We could not complete auto-payment setup. Please try again.");
          void queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.SHOULD_STOP_BEFORE_NACH] });
          return; 
        }
      } catch (err) {
        enachOpenerDevLog("getMandateDetails error on opener", err);
        const msg =
          err instanceof Error && err.message.trim().length > 0
            ? err.message.trim()
            : "Could not verify mandate status. Please try again.";
        toast.error(msg);
        void queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.SHOULD_STOP_BEFORE_NACH] });
        return;
      }

      void queryClient.invalidateQueries({ queryKey: [REACT_QUERY_KEYS.SHOULD_STOP_BEFORE_NACH] });
      enachOpenerDevLog("calling runEnachCompletionStageSync on opener");
      await runEnachCompletionStageSync();
      enachOpenerDevLog("opener refresh finished");
    } finally {
      refreshOpenerInFlightRef.current = false;
    }
  }, [queryClient]);

  const { locked: consentLocked, prepareOpenPopup, attachPopup, startWatchPopupClosed } =
    useExternalFlowConsentLock({
      flow: CALLBACK_FLOWS.ENACH,
      overlayStaysLockedOnPopupClose: false,
      releaseLockWhenPostMessageArrives: true,
      onPostMessageComplete: () => void refreshOpenerAfterEnachPopupEnds(),
      onPopupClosedWithoutMessage: () => void refreshOpenerAfterEnachPopupEnds(),
    });

  const resolveGeoLocationFromStore = async (): Promise<string | undefined> => {
    const current = useGeoStore.getState();
    if (current.location) {
      return `${current.location.latitude},${current.location.longitude}`;
    }

    current.startWatching();

    return new Promise((resolve) => {
      let done = false;
      const finish = (value: string | undefined) => {
        if (done) return;
        done = true;
        clearTimeout(timeoutId);
        unsubscribe();
        useGeoStore.getState().stopWatching();
        resolve(value);
      };

      const timeoutId = window.setTimeout(() => finish(undefined), 12000);
      const unsubscribe = useGeoStore.subscribe((state) => {
        if (state.location) {
          finish(`${state.location.latitude},${state.location.longitude}`);
          return;
        }
        if (state.error) {
          finish(undefined);
        }
      });
    });
  };

  const handleProceed = async () => {
    setError(null);
    setLoading(true);
    try {
      const geoLocation = await resolveGeoLocationFromStore();
      const { sessionId } = await createMandate({ geoLocation });
      const enachMode = await resolveCashfreeEnachMode();
      await prepareOpenPopup();
      const popup = openCenteredExternalFlowPopup({
        url: getEnachCashfreeBridgePopupUrl(sessionId, enachMode),
        windowName: "enachCashfreeWindow",
        preset: "bridge",
      });
      if (!attachPopup(popup)) {
        toast.error("Popup blocked. Please allow popups for this site and try again.");
        return;
      }
      startWatchPopupClosed();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(message);
      // toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full">
      
    <div className="flex justify-center mb-6 sm:mb-8">
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl  flex items-center justify-center">
          <Image src={enachIcon} alt="" />
        </div>
      </div>
      
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center">
        Set Up Auto-Payment for Your Loan
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Authorize secure auto-debits for your loan. No sensitive bank details are stored — 100% safe process.
      </p>

      <h3 className="text-sm font-semibold text-gray-800 mb-4 text-center">
        Why Set Up eNACH?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
          <CalendarIcon />
          <p className="text-sm font-medium text-gray-800">No Post Dated Cheques Required</p>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
          <ClockIcon />
          <p className="text-sm font-medium text-gray-800">Avoid Manual Payments</p>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
          <RefreshIcon />
          <p className="text-sm font-medium text-gray-800">Avoid Late Payment Charges</p>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50/80 border border-gray-100">
          <StarIcon />
          <p className="text-sm font-medium text-gray-800">One Time Setup For Entire Loan Tenure</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 text-center mb-4" role="alert">
          {error}
        </p>
      )}

      <AppButton
        type="button"
        fullWidth
        onClick={() => void handleProceed()}
        disabled={loading || consentLocked}
      >
        {loading ? "Opening secure checkout..." : "Set Up Auto-Payment"}
      </AppButton>
    </div>

    <ConsentWindowOverlay
      isOpen={consentLocked}
      title="Complete auto-payment setup in the new window"
      description="When the secure window closes, we verify your mandate on this page and update your loan steps."
    />
    </>
  );
}
