"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ConsentWindowOverlay from "@/components/ConsentWindowOverlay";
import eSignIcon from "@/public/images/e-sign.png";
import { importGoogleContacts } from "@/lib/auth-google-contacts-api";
import { getExistingActiveLoan } from "@/lib/eligibility-api";
import { hasSanctionedPdfKey, resolveLoanIdForAgreement } from "@/lib/loan-id-for-agreement";
import { CALLBACK_FLOWS } from "@/lib/callback-opener-messages";
import { normalizeBackendStage } from "@/config/stageMapping";
import {
  generateAgreementAutomatic,
  getEsignStatus,
  initiateSanctionDoqfy,
  isEsignStatusCompleted,
} from "@/lib/sanction-esign-api";
import { getPersonalDetails, getUserStage, type GetPersonalDetailsResponse } from "@/lib/user-api";
import { UserStagesInBackend } from "@/lib/user-stage";
import { useGoogleOAuthAppState } from "@/components/GoogleOAuthAppProvider";
import { useExternalFlowConsentLock } from "@/hooks/useExternalFlowConsentLock";
import { type GoogleAuthResult, useGoogleAuth } from "@/hooks/useGoogleAuth";
import { openCenteredExternalFlowPopup } from "@/lib/open-external-flow-popup";
import { useGeoStore } from "@/store/useGeoStore";
import AppButton from "@/components/app-button";

type EsignScreen = "bootstrapping" | "ready" | "polling" | "pending" | "failed";

type Props = { onContinue?: () => void };

async function resolveGeoLocationEsign(): Promise<string> {
  const current = useGeoStore.getState();
  if (current.location) {
    return `${current.location.latitude},${current.location.longitude}`;
  }

  current.startWatching();

  const resolved = await new Promise<string | undefined>((resolve) => {
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

  return resolved ?? "0,0";
}

type ESignStepCoreProps = Props & {
  promptAsync: (() => Promise<GoogleAuthResult>) | null;
};

function ESignStepCore({ onContinue, promptAsync }: ESignStepCoreProps) {
  const [screen, setScreen] = useState<EsignScreen>("bootstrapping");
  const [agreementGenerationFailed, setAgreementGenerationFailed] = useState(false);
  const [personalDetails, setPersonalDetails] = useState<GetPersonalDetailsResponse | null>(null);
  const [isGoogleVerifying, setIsGoogleVerifying] = useState(false);
  const [isInitiating, setIsInitiating] = useState(false);
  const [failedMessage, setFailedMessage] = useState<string | null>(null);

  const completedRef = useRef(false);
  const onContinueRef = useRef(onContinue);
  onContinueRef.current = onContinue;

  const invitationLinkRef = useRef<string | null>(null);
  const safeContinueRef = useRef<() => void>(() => undefined);

  const {
    locked: consentLocked,
    prepareOpenPopup,
    attachPopup,
    startWatchPopupClosed,
    releaseLock,
  } = useExternalFlowConsentLock({
    flow: CALLBACK_FLOWS.ESIGN,
    terminalRef: completedRef,
    overlayStaysLockedOnPopupClose: true,
    releaseLockWhenPostMessageArrives: false,
    onPostMessageComplete: () => safeContinueRef.current(),
    onPopupClosedWithoutMessage: () => setScreen("polling"),
  });

  const safeContinue = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    releaseLock();
    onContinueRef.current?.();
  }, [releaseLock]);

  safeContinueRef.current = safeContinue;

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const statusRes = await getEsignStatus();
        if (cancelled) return;
        if (isEsignStatusCompleted(statusRes.status)) {
          safeContinue();
          return;
        }

        const activeRes = await getExistingActiveLoan();
        if (cancelled) return;

        const loan = activeRes.loan ?? undefined;
        const hasPdf = hasSanctionedPdfKey(loan);

        if (!hasPdf) {
          const loanId = await resolveLoanIdForAgreement();
          if (cancelled) return;
          if (!loanId) {
            setAgreementGenerationFailed(true);
          } else {
            try {
              await generateAgreementAutomatic(loanId);
            } catch {
              if (!cancelled) setAgreementGenerationFailed(true);
            }
          }
        }

        const pd = await getPersonalDetails();
        if (cancelled) return;
        setPersonalDetails(pd);
        setScreen("ready");
      } catch {
        if (!cancelled) {
          setAgreementGenerationFailed(true);
          setScreen("ready");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [safeContinue]);

  useEffect(() => {
    if (screen !== "polling") return;

    let cancelled = false;

    void (async () => {
      try {
        const stageRes = await getUserStage({ device: "web" });
        if (cancelled || completedRef.current) return;
        const raw = typeof stageRes.stage === "string" ? stageRes.stage.trim() : "";
        if (raw.length > 0 && normalizeBackendStage(raw) !== UserStagesInBackend.ESIGN) {
          safeContinue();
          return;
        }
      } catch {
        /* fall through to pending */
      }

      if (cancelled || completedRef.current) return;
      releaseLock();
      setScreen("pending");
    })();

    return () => {
      cancelled = true;
    };
  }, [screen, releaseLock, safeContinue]);

  const handleProceedToEsign = useCallback(async () => {
    setIsInitiating(true);
    setFailedMessage(null);
    try {
      const geoLocationEsign = await resolveGeoLocationEsign();
      const { invitationLink } = await initiateSanctionDoqfy({ geoLocationEsign });
      if (!invitationLink) {
        const msg = "Could not start e-sign. Please try again.";
        setFailedMessage(msg);
        setScreen("failed");
        toast.error(msg);
        return;
      }

      invitationLinkRef.current = invitationLink;
      await prepareOpenPopup();

      const w = openCenteredExternalFlowPopup({
        url: invitationLink,
        windowName: "esignDoqfyWindow",
        preset: "bridge",
      });

      if (!attachPopup(w)) {
        const msg = "Popup was blocked. Allow popups for this site and try again.";
        setFailedMessage(msg);
        setScreen("failed");
        toast.error(msg);
        return;
      }

      startWatchPopupClosed();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not open e-sign. Please try again.";
      setFailedMessage(msg);
      setScreen("failed");
      toast.error(msg);
    } finally {
      setIsInitiating(false);
    }
  }, [attachPopup, prepareOpenPopup, startWatchPopupClosed]);

  const handleVerifyGoogleAndProceed = useCallback(async () => {
    if (!promptAsync) {
      toast.error("Google sign-in is not configured. Please try again later.");
      return;
    }

    setIsGoogleVerifying(true);
    setFailedMessage(null);
    try {
      const result = await promptAsync();
      if (result.type === "cancelled") {
        return;
      }
      if (result.type === "error") {
        setFailedMessage(result.error.message);
        setScreen("failed");
        toast.error(result.error.message);
        return;
      }

      const token = result.accessToken;
      if (!token) {
        const msg = "Google did not return an access token. Please try again.";
        setFailedMessage(msg);
        setScreen("failed");
        toast.error(msg);
        return;
      }

      await importGoogleContacts(token);
      const pd = await getPersonalDetails();
      setPersonalDetails(pd);
      await handleProceedToEsign();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google verification failed.";
      setFailedMessage(msg);
      setScreen("failed");
      toast.error(msg);
    } finally {
      setIsGoogleVerifying(false);
    }
  }, [handleProceedToEsign, promptAsync]);

  const handlePrimaryContinue = useCallback(() => {
    if (agreementGenerationFailed || screen !== "ready") return;

    if (personalDetails?.isOauthDone === true) {
      void handleProceedToEsign();
      return;
    }

    void handleVerifyGoogleAndProceed();
  }, [agreementGenerationFailed, handleProceedToEsign, handleVerifyGoogleAndProceed, personalDetails?.isOauthDone, screen]);

  const handleRetryFromPending = useCallback(() => {
    const url = invitationLinkRef.current;
    if (!url) {
      toast.error("No e-sign link available. Use Next to start again.");
      setScreen("ready");
      return;
    }
    setFailedMessage(null);
    void prepareOpenPopup().then(() => {
      const w = openCenteredExternalFlowPopup({
        url,
        windowName: "esignDoqfyWindow",
        preset: "bridge",
      });
      if (!attachPopup(w)) {
        toast.error("Popup was blocked. Allow popups and try again.");
        return;
      }
      setScreen("ready");
      startWatchPopupClosed();
    });
  }, [attachPopup, prepareOpenPopup, startWatchPopupClosed]);

  const handleDismissFailed = useCallback(() => {
    setFailedMessage(null);
    setScreen("ready");
  }, []);

  const oauthDone = personalDetails?.isOauthDone === true;
  const primaryLabel =
    oauthDone || promptAsync == null
      ? "Next"
      : isGoogleVerifying
        ? "Signing in…"
        : "Verify with Google & continue";

  const disablePrimary =
    agreementGenerationFailed ||
    screen !== "ready" ||
    isGoogleVerifying ||
    isInitiating ||
    consentLocked;

  const consentOverlayCopy =
    screen === "polling"
      ? {
          title: "Verifying your e-sign…",
          description:
            "Hang tight while we sync your loan step. This usually takes a few seconds.",
        }
      : {
          title: "Complete e-sign in the popup window",
          description:
            "Finish signing in the secure Doqfy window. If you close it before finishing, we will automatically check whether your e-sign completed.",
        };

  return (
    <>
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full">
      <div className="flex justify-center mb-6 sm:mb-8">
        <Image src={eSignIcon} alt="e-sign" width={140} height={140} />
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 text-center">
        Complete Your E-Sign
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Complete your e-signature to securely authorize your loan agreement.
      </p>

      {screen === "bootstrapping" && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-gray-600">Preparing e-sign…</p>
        </div>
      )}

      {screen === "polling" && (
        consentLocked ? (
          <div className="min-h-[160px]" aria-hidden />
        ) : (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-gray-600 text-center">
              Checking your loan step… This may take a few seconds.
            </p>
          </div>
        )
      )}

      {screen === "pending" && (
        <div className="space-y-4">
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-center">
            We could not confirm e-sign automatically. If you finished signing in the popup, try continuing from the
            loan steps again. Otherwise retry opening the e-sign window.
          </p>
          <AppButton type="button" fullWidth onClick={handleRetryFromPending}>
            Retry E-Sign
          </AppButton>
        </div>
      )}

      {screen === "failed" && failedMessage && (
        <div className="space-y-4">
          <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center">
            {failedMessage}
          </p>
          <AppButton type="button" fullWidth variant="secondary" onClick={handleDismissFailed}>
            Try again
          </AppButton>
        </div>
      )}

      {screen === "ready" && (
        <>
          {agreementGenerationFailed && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-center mb-4">
              Agreement could not be generated. Please contact support or try again later.
            </p>
          )}

          {!promptAsync && personalDetails?.isOauthDone !== true && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-center mb-4">
              Google sign-in is not configured for this environment. Add a Google OAuth client ID in app configuration
              or set NEXT_PUBLIC_GOOGLE_CLIENT_ID, then reload and try again.
            </p>
          )}

          <AppButton
            type="button"
            fullWidth
            onClick={handlePrimaryContinue}
            disabled={disablePrimary || (!promptAsync && personalDetails?.isOauthDone !== true)}
          >
            {isInitiating ? "Opening e-sign…" : primaryLabel}
          </AppButton>
        </>
      )}
    </div>

    <ConsentWindowOverlay
      isOpen={consentLocked}
      title={consentOverlayCopy.title}
      description={consentOverlayCopy.description}
    />
    </>
  );
}

function ESignStepWithGoogle(props: Props) {
  const { promptAsync } = useGoogleAuth();
  return <ESignStepCore {...props} promptAsync={promptAsync} />;
}

function ESignStepWithoutGoogle(props: Props) {
  return <ESignStepCore {...props} promptAsync={null} />;
}

function ESignBootstrappingShell() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-6 md:p-8 max-w-2xl mx-auto w-full">
      <div className="flex justify-center mb-6 sm:mb-8">
        {/* <Image src={eSignIcon} alt="e-sign" width={300} height={300} /> */}
      </div>
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-gray-600">Loading…</p>
      </div>
    </div>
  );
}

export default function ESignStep(props: Props) {
  const oauth = useGoogleOAuthAppState();

  if (oauth.status === "loading") {
    return <ESignBootstrappingShell />;
  }

  if (oauth.status === "ready") {
    return <ESignStepWithGoogle {...props} />;
  }

  return <ESignStepWithoutGoogle {...props} />;
}
