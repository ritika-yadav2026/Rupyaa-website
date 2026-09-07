"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useCallbackNotifyApp } from "@/hooks/useCallbackNotifyApp";
import { CALLBACK_FLOWS, notifyOpenerCallbackComplete } from "@/lib/callback-opener-messages";
import { runEnachCompletionStageSync } from "@/lib/enach-step-success";
import { getMandateDetails, isMandateRegistrationFailed } from "@/lib/mandate-api";
import { NATIVE_APP_MESSAGE_TYPES } from "@/utils/native-constants";

const LOG_PREFIX = "[EnachWebCallback]";

function enachCallbackDevLog(message: string, data?: unknown): void {
  console.log(LOG_PREFIX, message, data !== undefined ? data : "");
}

function userVisibleMandateError(err: unknown): string {
  const generic = "Could not verify mandate status. Please try again.";
  if (err instanceof Error && err.message.trim().length > 0) {
    return err.message.trim();
  }
  return generic;
}

/**
 * Web popup return URL after Cashfree E-NACH.
 *
 * **Important:** `postMessage` + `window.close()` must run only **after** `getMandateDetails()`
 * succeeds. A parent-level hook that notifies on mount races the child effect and can close the
 * popup before GET /mandates/user runs — so notification lives inside this component’s effect.
 *
 * This effect runs unconditionally on mount — **not** gated behind `isMobileSource` — same as
 * DigiLocker/eSign's `useNotifyOpenerCallbackComplete`. `notifyOpenerCallbackComplete` already
 * no-ops the close for a genuine native WebView (`isInMobileApp()` check), so running it
 * unconditionally is safe. Gating it behind `isMobileSource` previously left the popup stuck
 * forever whenever `source=mobile` was on the URL but no native bridge ever attached (e.g. a
 * plain browser popup whose return URL was configured for the wrong channel) — the component
 * rendered a static image with no verification, no notify, no close.
 */
function useEnachMandateVerification() {
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<"loading" | "failed">("loading");
  const [failureDetail, setFailureDetail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      enachCallbackDevLog("effect_start", { href: typeof window !== "undefined" ? window.location.href : "" });

      try {
        // Verify mandate registration in this popup session (returnUrl hit = Cashfree finished).
        enachCallbackDevLog("calling getMandateDetails()");
        const details = await getMandateDetails();
        enachCallbackDevLog("getMandateDetails resolved", {
          registrationStatus: details.registrationDetails?.status,
        });

        if (cancelled) {
          enachCallbackDevLog("aborted after getMandateDetails (unmount)");
          return;
        }

        if (isMandateRegistrationFailed(details)) {
          enachCallbackDevLog("mandate registration FAILED — notify opener then close popup");
          setPhase("failed");
          setFailureDetail(null);
          toast.error("We could not complete auto-payment setup. Please try again.");
          notifyOpenerCallbackComplete({
            flow: CALLBACK_FLOWS.ENACH,
            search: searchParams.toString(),
            status: "FAILED",
          });
          // `notifyOpenerCallbackComplete` calls `window.close()`; the "failed" UI above is a
          // fallback for the rare case the popup has no `window.opener` and can't self-close.
          return;
        }

        // This store update applies only to the popup window; opener sync happens via postMessage below.
        enachCallbackDevLog("calling runEnachCompletionStageSync (popup store — optional parity)");
        await runEnachCompletionStageSync();

        if (cancelled) {
          enachCallbackDevLog("aborted after runEnachCompletionStageSync");
          return;
        }

        const status = searchParams.get("status") ?? undefined;
        const search = searchParams.toString();

        // Now safe: mandate verified → tell opener to refresh, then close this popup.
        enachCallbackDevLog("mandate OK — notifyOpenerCallbackComplete then window.close()", {
          searchLen: search.length,
          hasStatus: Boolean(status),
        });
        notifyOpenerCallbackComplete({
          flow: CALLBACK_FLOWS.ENACH,
          search,
          status,
        });
        // `notifyOpenerCallbackComplete` calls `window.close()`; do not navigate this window after.
      } catch (err) {
        enachCallbackDevLog("catch block", err);
        if (!cancelled) {
          setPhase("failed");
          const msg = userVisibleMandateError(err);
          setFailureDetail(msg);
          toast.error(msg);
          notifyOpenerCallbackComplete({
            flow: CALLBACK_FLOWS.ENACH,
            search: searchParams.toString(),
            status: "FAILED",
          });
        }
      }
    })();

    return () => {
      cancelled = true;
      enachCallbackDevLog("effect_cleanup");
    };
  }, [searchParams]);

  return { phase, failureDetail };
}

function EnachFailedMessage({ failureDetail }: { failureDetail: string | null }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <p className="text-base font-semibold text-slate-900">Auto-payment setup did not complete</p>
        {failureDetail ? (
          <p className="text-sm text-slate-700 rounded-lg bg-slate-100 px-3 py-2">{failureDetail}</p>
        ) : null}
        <p className="text-sm text-slate-600">
          Return to your loan journey to try again, or contact support if this continues.
        </p>
        <Link
          href="/personal-loan"
          className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Back to loan journey
        </Link>
      </div>
    </div>
  );
}

const EnachCallbackContent = () => {
  // Always runs: verifies the mandate and notifies/closes the popup regardless of `source`.
  const { phase, failureDetail } = useEnachMandateVerification();
  const { isRedirecting, isMobileSource } = useCallbackNotifyApp({
    messageType: NATIVE_APP_MESSAGE_TYPES.ENACH_SUCCESS,
  });

  // These two branches are cosmetic only — the verification effect above already closes the
  // popup (or no-ops safely inside a real native WebView) independent of what's on screen here.
  if (isMobileSource && isRedirecting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">Redirecting to app...</p>
        </div>
      </div>
    );
  }

  if (isMobileSource) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center">
          <Image
            src="/images/e-nach.png"
            alt="eNACH mandate"
            width={320}
            height={320}
            priority
            className="object-contain"
          />
        </div>
      </div>
    );
  }

  if (phase === "failed") {
    return <EnachFailedMessage failureDetail={failureDetail} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 gap-4">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm font-medium text-slate-600">Verifying your mandate...</p>
    </div>
  );
};

const EnachCallbackPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4">
          <Image
            src="/images/e-nach.png"
            alt="eNACH mandate"
            width={320}
            height={320}
            className="object-contain"
          />
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <EnachCallbackContent />
    </Suspense>
  );
};

export default EnachCallbackPage;
