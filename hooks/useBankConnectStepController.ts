"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  getTempUrl,
  type BankStatementKey,
  type BankStatementStatus,
  type GetUserBankStatementStatusResponse,
} from "@/lib/bank-statement-api";
import {
  hasBankStatementKeyData,
  logBankConnectDebug,
  normalizeBankStatementStatus,
  resolveAaAttemptsLeft,
  resolveBankConnectAttemptState,
  resolveManualUploadAttemptsLeft,
  shouldContinueBankStatementPolling,
  type BankConnectAttemptState,
  type NormalizedBankStatementStatus,
} from "@/lib/bank-connect";
import {
  applyLoanAndFetchOffer,
  getFiniteOfferAmount,
  shouldAdvanceAfterBankStatementProcessed,
} from "@/lib/bsa-processed-offer";
import { getFlowSyncActions, syncLoanFlowFromStage } from "@/lib/loan-flow-sync";
import { useCurrentOfferStore } from "@/store/useCurrentOfferStore";
import { useBankStatementStatus } from "@/hooks/useBankStatementStatus";
import { useFlowStore } from "@/store/useFlowStore";
import { CALLBACK_FLOWS } from "@/lib/callback-opener-messages";
import { usePopupCallbackMessageListener } from "@/hooks/usePopupCallbackMessageListener";
import { openCenteredExternalFlowPopup } from "@/lib/open-external-flow-popup";
import {
  BANK_CONNECT_FETCHING_SUBTEXT,
  BANK_CONNECT_PREPARING_OFFER_SUBTEXT,
  BANK_CONNECT_PREPARING_OFFER_TITLE,
  BANK_CONNECT_STATUS_MESSAGES,
  BSA_CONSENT_WAIT_SUBTITLE,
  BSA_CONSENT_WAIT_TITLE,
} from "@/utils/app-constants";

type UseBankConnectStepControllerParams = {
  onContinue?: () => void | Promise<void>;
};

type ChecklistItem = {
  id: string;
  label: string;
  state: "waiting" | "in-progress" | "done" | "failed";
};

/** Primary button: disabled only while consent is opening or bank status is actively updating after a successful popup open. */
export type BsaUiPhase = "idle" | "active_wait" | "retryable";

export type BsaLoadingOverlayState = {
  visible: boolean;
  title: string;
  subtitle: string;
};

export function useBankConnectStepController({ onContinue }: UseBankConnectStepControllerParams) {
  const setOfferAmount = useFlowStore((s) => s.setOfferAmount);
  const setFlowState = useFlowStore((s) => s.setFlowState);
  const setShowUpdateButton = useFlowStore((s) => s.setShowUpdateButton);
  const cameFromOfferings = useFlowStore((s) => s.cameFromOfferings);
  const {
    bankStatementResponse,
    refetchWithSource,
    pollBankStatementStatus,
    stopPolling: stopStatusPolling,
    clearStatus,
  } = useBankStatementStatus();

  const [mobile, setMobile] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoadingAttempts, setIsLoadingAttempts] = useState(true);
  const [showManualUpload, setShowManualUpload] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [normalizedStatus, setNormalizedStatus] = useState<NormalizedBankStatementStatus | null>(null);
  const [isOpeningConsent, setIsOpeningConsent] = useState(false);
  const [uiPhase, setUiPhase] = useState<BsaUiPhase>("idle");
  /** Post-consent: polling for statement key or preparing offer (`active_wait` uses consent copy from messages file). */
  const [bankConnectFetchingOverlay, setBankConnectFetchingOverlay] = useState<{
    title: string;
    subtitle: string;
  } | null>(null);
  const consentWindowRef = useRef<Window | null>(null);
  const openerHeardCallbackRef = useRef(false);
  const didEvaluateClosedWindowRef = useRef(false);
  /** Stops in-flight `pollBankStatementStatus` when consent restarts or hook unmounts. */
  const stopBankStatementPollRef = useRef<(() => void) | null>(null);

  const processedGateRef = useRef({ resolved: false, inFlight: false });

  // Attempt availability is derived from the React Query response so the UI
  // cannot drift from the single source of truth after entering from an offer.
  const attemptState = useMemo<BankConnectAttemptState>(() => {
    if (!bankStatementResponse) return "aa-only";
    return resolveBankConnectAttemptState({
      aaAttemptsLeft: resolveAaAttemptsLeft(bankStatementResponse),
      manualUploadAttemptsLeft:
        resolveManualUploadAttemptsLeft(bankStatementResponse),
    });
  }, [bankStatementResponse]);
  const manualUploadAttemptsLeft = bankStatementResponse
    ? resolveManualUploadAttemptsLeft(bankStatementResponse)
    : null;
  const manualUploadAvailable =
    manualUploadAttemptsLeft != null && manualUploadAttemptsLeft > 0;

  useEffect(() => {
    logBankConnectDebug("attemptStateDerived", {
      cameFromOfferings,
      hasStatusResponse: Boolean(bankStatementResponse),
      aaAttemptsLeft: bankStatementResponse
        ? resolveAaAttemptsLeft(bankStatementResponse)
        : null,
      manualUploadAttemptsLeft: bankStatementResponse
        ? manualUploadAttemptsLeft
        : null,
      manualUploadAvailable,
      attemptState,
    });
    if (attemptState === "manual-only") setShowManualUpload(true);
    if (attemptState === "exhausted") setFlowState("under_review");
  }, [
    attemptState,
    bankStatementResponse,
    cameFromOfferings,
    manualUploadAttemptsLeft,
    manualUploadAvailable,
    setFlowState,
  ]);

  const abortBankStatementPoll = useCallback(() => {
    const stop = stopBankStatementPollRef.current;
    if (stop) {
      stop();
      stopBankStatementPollRef.current = null;
    }
    stopStatusPolling("controller-abort");
  }, [stopStatusPolling]);

  const syncAttemptsFromStatus = useCallback(
    async (status?: GetUserBankStatementStatusResponse) => {
      try {
        if (!status) await refetchWithSource("attempt-refresh");
      } catch {
        /* ignore */
      }
    },
    [refetchWithSource],
  );

  const syncLoanFlowFromUserStage = useCallback(async () => {
    await syncLoanFlowFromStage(getFlowSyncActions(), { enrichOffer: false });
  }, []);

  const runProcessedBranch = useCallback(
    async (
      bankStatementKey: BankStatementKey | undefined,
      callApplyLoan?: boolean,
      statusResponse?: GetUserBankStatementStatusResponse,
    ) => {
      /** Apply-loan when processed and API returned a `bankStatementKey` object (see `hasBankStatementKeyData`). */
      if (!hasBankStatementKeyData(bankStatementKey)) {
        return;
      }

      const result = await applyLoanAndFetchOffer({
        canApplyLoan: callApplyLoan ?? true,
      });

      await syncAttemptsFromStatus(statusResponse);

      if (!result.hasOffer || !result.offer) {
        const retryMsg =
          result.retryMessage ??
          "We could not prepare your offer. Please try bank verification again.";
        setError(retryMsg);
        toast.error(retryMsg);
        setUiPhase("retryable");
        processedGateRef.current.resolved = true;
        return;
      }

      if (result.currentOfferPayload) {
        useCurrentOfferStore.getState().setLastResult({
          kind: "success",
          data: result.currentOfferPayload,
          at: Date.now(),
        });
        const amt = getFiniteOfferAmount(result.currentOfferPayload.offer);
        setOfferAmount(amt != null ? amt : null);
        setShowUpdateButton(result.currentOfferPayload.showUpdateButton ?? false);
      }

      if (!shouldAdvanceAfterBankStatementProcessed(result.offer, result.hasOffer)) {
        setFlowState("under_review");
        await syncLoanFlowFromUserStage();
        processedGateRef.current.resolved = true;
        return;
      }

      setFlowState("offer");
      await onContinue?.();
      processedGateRef.current.resolved = true;
    },
    [
      onContinue,
      setFlowState,
      setOfferAmount,
      setShowUpdateButton,
      syncAttemptsFromStatus,
      syncLoanFlowFromUserStage,
    ]
  );

  /** Maps GET status into local UI (normalized status, attempts, manual-only / exhausted). */
  const syncUiFromBankStatementStatus = useCallback(
    (status: GetUserBankStatementStatusResponse): NormalizedBankStatementStatus => {
      const rawStatus = status.bankStatementStatus ?? status.status;
      const norm = normalizeBankStatementStatus(rawStatus);
      setNormalizedStatus(norm);
      return norm;
    },
    []
  );

  /** Single place for in-flight / error handling around apply-loan + offer (mount + poll). */
  const runProcessedBranchIfIdle = useCallback(
    async (
      bankStatementKey: BankStatementKey | undefined,
      callApplyLoan?: boolean,
      statusResponse?: GetUserBankStatementStatusResponse,
    ) => {
      if (processedGateRef.current.resolved || processedGateRef.current.inFlight) return;
      processedGateRef.current.inFlight = true;
      setBankConnectFetchingOverlay({
        title: BANK_CONNECT_PREPARING_OFFER_TITLE,
        subtitle: BANK_CONNECT_PREPARING_OFFER_SUBTEXT,
      });
      try {
        await runProcessedBranch(bankStatementKey, callApplyLoan, statusResponse);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong. Please try again.";
        setError(message);
        toast.error(message);
        setUiPhase("retryable");
        processedGateRef.current.resolved = true;
      } finally {
        processedGateRef.current.inFlight = false;
        setBankConnectFetchingOverlay(null);
      }
    },
    [runProcessedBranch]
  );

  const handleManualUploadStatusReady = useCallback(
    async (status: GetUserBankStatementStatusResponse) => {
      logBankConnectDebug("manualUploadStatusReady", {
        status: normalizeBankStatementStatus(
          status.bankStatementStatus ?? status.status,
        ),
        callApplyLoan: status.callApplyLoan,
        hasBankStatementKey: hasBankStatementKeyData(status.bankStatementKey),
      });
      await runProcessedBranchIfIdle(
        status.bankStatementKey,
        status.callApplyLoan,
        status,
      );
    },
    [runProcessedBranchIfIdle],
  );

  /**
   * Poll GET /status while processing is pending/in progress or a processed statement key is
   * still unavailable, then run `runProcessedBranchIfIdle` once the terminal data is ready.
   * @param dismissConsentOverlay — after consent popup: set `uiPhase` to `retryable` so full-screen loading switches from consent-wait to fetching copy.
   */
  const beginPollWhenProcessedWithoutStatementKey = useCallback(
    (dismissConsentOverlay: boolean) => {
      processedGateRef.current.resolved = false;
      abortBankStatementPoll();

      setBankConnectFetchingOverlay({
        title: BANK_CONNECT_STATUS_MESSAGES.fetchingBankDetails,
        subtitle: BANK_CONNECT_FETCHING_SUBTEXT,
      });

      if (dismissConsentOverlay) {
        setUiPhase("retryable");
        setStatusMessage("Statement processed. Finalizing documents…");
      }

      const stop = pollBankStatementStatus(
        (
          status: BankStatementStatus,
          callApplyLoan: boolean,
          bankStatementKey: BankStatementKey | undefined,
          normalizedStatus: NormalizedBankStatementStatus | undefined,
          fullResponse?: GetUserBankStatementStatusResponse
        ) => {
          if (fullResponse) {
            syncUiFromBankStatementStatus(fullResponse);
          }
          console.log("[BSA useBankConnectStepController]", "poll_tick", {
            status,
            normalizedStatus,
            hasKey: hasBankStatementKeyData(bankStatementKey),
          });
      
          if (status === "Error") {
            abortBankStatementPoll();
            setBankConnectFetchingOverlay(null);
            if (dismissConsentOverlay) {
              toast.error(
                "Timed out waiting for your statement files. Try Continue Securely again in a moment."
              );
            }
            setStatusMessage(
              "We're still preparing your statement. You can retry from this screen."
            );
            return;
          }
          if (normalizedStatus === "processed" && hasBankStatementKeyData(bankStatementKey)) {
            abortBankStatementPoll();
            setStatusMessage("Statement processed. Preparing your offer…");
            void runProcessedBranchIfIdle(bankStatementKey, callApplyLoan, fullResponse);
            return;
          }
          if (normalizedStatus === "approved" && hasBankStatementKeyData(bankStatementKey)) {
            abortBankStatementPoll();
            setStatusMessage("Statement approved. Preparing your offer…");
            void runProcessedBranchIfIdle(bankStatementKey, callApplyLoan, fullResponse);
            return;
          }
          if (
            normalizedStatus &&
            normalizedStatus !== "processed" &&
            normalizedStatus !== "approved" &&
            !shouldContinueBankStatementPolling(normalizedStatus)
          ) {
            abortBankStatementPoll();
            setBankConnectFetchingOverlay(null);
          }
        },
        { scenario: "manual-upload", useStopRules: true }
      );
      stopBankStatementPollRef.current = stop;
    },
    [
      abortBankStatementPoll,
      pollBankStatementStatus,
      runProcessedBranchIfIdle,
      syncUiFromBankStatementStatus,
    ]
  );

  /** On mount / refresh: pull status once; if already processed, retry apply-loan path. */
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const status = (await refetchWithSource("step-entry")).response;
        if (cancelled) return;
        const norm = syncUiFromBankStatementStatus(status);
        if (norm === "processed" || (norm === "approved" && hasBankStatementKeyData(status.bankStatementKey))) {
          if (hasBankStatementKeyData(status.bankStatementKey)) {
            await runProcessedBranchIfIdle(
              status.bankStatementKey,
              status.callApplyLoan,
              status,
            );
          } else if (norm === "processed") {
            beginPollWhenProcessedWithoutStatementKey(false);
          }
        }
      } catch {
        // With no cached response the derived attempt state safely remains AA-only.
      } finally {
        if (!cancelled) setIsLoadingAttempts(false);
      }
    })();
    return () => {
      cancelled = true;
      abortBankStatementPoll();
      setBankConnectFetchingOverlay(null);
    };
  }, [
    abortBankStatementPoll,
    beginPollWhenProcessedWithoutStatementKey,
    refetchWithSource,
    runProcessedBranchIfIdle,
    syncUiFromBankStatementStatus,
  ]);

  const evaluateStatusAfterConsentWindowClose = useCallback(async () => {
    setStatusMessage("Checking bank verification status...");
    try {
      const status = (await refetchWithSource("webview-close")).response;
      const norm = syncUiFromBankStatementStatus(status);

      if (
        norm !== "processed" &&
        !(norm === "approved" && hasBankStatementKeyData(status.bankStatementKey))
      ) {
        processedGateRef.current.resolved = false;
      }

      if (
        (norm === "processed" || norm === "approved") &&
        hasBankStatementKeyData(status.bankStatementKey)
      ) {
        setStatusMessage(
          norm === "approved"
            ? "Statement approved. Preparing your offer…"
            : "Statement processed. Preparing your offer…"
        );
        await runProcessedBranchIfIdle(
          status.bankStatementKey,
          status.callApplyLoan,
          status,
        );
        setUiPhase("retryable");
        return;
      }
      if (norm === "processed") {
        beginPollWhenProcessedWithoutStatementKey(true);
        setUiPhase("retryable");
        return;
      }
      if (norm === "rejected") {
        setStatusMessage("Unable to verify via bank consent. You can upload manually.");
        toast.error("Bank consent could not be completed. Please upload manually.");
        setShowManualUpload(true);
        setUiPhase("retryable");
        return;
      }
      if (norm === "approved") {
        setStatusMessage("Bank verified. Processing statement is not complete yet. Please try again.");
        setUiPhase("retryable");
        return;
      }
      if (shouldContinueBankStatementPolling(norm)) {
        // Backend processing is asynchronous; resolution polling owns subsequent checks.
        beginPollWhenProcessedWithoutStatementKey(true);
        setUiPhase("retryable");
        return;
      }
      setStatusMessage("We could not verify the status. Please retry.");
      setUiPhase("retryable");
    } catch {
      setStatusMessage("We couldn't fetch your bank status. Please try again.");
      setUiPhase("retryable");
      toast.error("Failed to fetch bank verification status.");
    }
  }, [
    beginPollWhenProcessedWithoutStatementKey,
    refetchWithSource,
    runProcessedBranchIfIdle,
    syncUiFromBankStatementStatus,
  ]);

  /** Keep BSA step blocked while popup is open; evaluate status only after popup closes. */
  useEffect(() => {
    if (uiPhase !== "active_wait") return;
    const id = window.setInterval(() => {
      const w = consentWindowRef.current;
      if (!w?.closed) return;
      if (didEvaluateClosedWindowRef.current) return;
      didEvaluateClosedWindowRef.current = true;
      void evaluateStatusAfterConsentWindowClose();
    }, 2000);
    return () => window.clearInterval(id);
  }, [uiPhase, evaluateStatusAfterConsentWindowClose]);

  const handleStartBsa = useCallback(async () => {
    const digits = mobile.replace(/\D/g, "").slice(0, 10);

    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError(null);
    processedGateRef.current = { resolved: false, inFlight: false };
    openerHeardCallbackRef.current = false;
    didEvaluateClosedWindowRef.current = false;
    clearStatus();
    abortBankStatementPoll();
    setBankConnectFetchingOverlay(null);
    setIsOpeningConsent(true);

    try {
      const tempUrl = await getTempUrl({ phoneNumber: digits });

      const consentWindow = openCenteredExternalFlowPopup({
        url: tempUrl,
        windowName: "bsaConsentWindow",
        preset: "consent",
      });
      consentWindowRef.current = consentWindow;
      if (!consentWindow) {
        if (process.env.NODE_ENV === "development") {
          console.log("[CallbackOpener]", "popup_open_blocked", { flow: CALLBACK_FLOWS.BSA });
        }
        toast.error("Popup blocked. Please allow popups to continue.");
        return;
      }
      if (process.env.NODE_ENV === "development") {
        console.log("[CallbackOpener]", "popup_open_success", { flow: CALLBACK_FLOWS.BSA });
      }

      setUiPhase("active_wait");
      setStatusMessage("Complete your bank consent in the new window.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get consent URL";
      toast.error(message);
      setError(message);
      setUiPhase("retryable");
    } finally {
      setIsOpeningConsent(false);
    }
  }, [mobile, abortBankStatementPoll, clearStatus]);

  const handlePopupMessageAccepted = useCallback(() => {
    openerHeardCallbackRef.current = true;
    setStatusMessage("Consent completed. Finalizing after bank window closes...");
  }, []);

  usePopupCallbackMessageListener({
    flow: CALLBACK_FLOWS.BSA,
    popupWindowRef: consentWindowRef,
    onAccepted: handlePopupMessageAccepted,
  });

  const bsaLoadingOverlay: BsaLoadingOverlayState = useMemo(() => {
    if (bankConnectFetchingOverlay) {
      return {
        visible: true,
        title: bankConnectFetchingOverlay.title,
        subtitle: bankConnectFetchingOverlay.subtitle,
      };
    }
    if (uiPhase === "active_wait") {
      return {
        visible: true,
        title: BSA_CONSENT_WAIT_TITLE,
        subtitle: BSA_CONSENT_WAIT_SUBTITLE,
      };
    }
    return { visible: false, title: "", subtitle: "" };
  }, [uiPhase, bankConnectFetchingOverlay]);

  const checklistItems: ChecklistItem[] = useMemo(() => {
    const status = normalizedStatus;
    if (!status) {
      return [
        { id: "fetch", label: "Fetching bank statement", state: "waiting" },
        { id: "process", label: "Processing statement", state: "waiting" },
      ];
    }
    if (status === "approved") {
      return [
        { id: "fetch", label: "Fetching bank statement", state: "in-progress" },
        { id: "process", label: "Processing statement", state: "waiting" },
      ];
    }
    if (status === "processed") {
      return [
        { id: "fetch", label: "Fetching bank statement", state: "done" },
        { id: "process", label: "Processing statement", state: "done" },
      ];
    }
    if (status === "rejected") {
      return [
        { id: "fetch", label: "Fetching bank statement", state: "failed" },
        { id: "process", label: "Processing statement", state: "waiting" },
      ];
    }
    return [
      { id: "fetch", label: "Fetching bank statement", state: "in-progress" },
      { id: "process", label: "Processing statement", state: "waiting" },
    ];
  }, [normalizedStatus]);

  return {
    mobile,
    setMobile,
    error,
    attemptState,
    manualUploadAvailable,
    isLoadingAttempts,
    showManualUpload,
    setShowManualUpload,
    statusMessage,
    checklistItems,
    isOpeningConsent,
    uiPhase,
    bsaLoadingOverlay,
    handleStartBsa,
    handleManualUploadStatusReady,
  };
}
