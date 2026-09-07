"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { openCashfreeSubscriptionCheckoutWeb } from "@/lib/cashfree-subscription-web";
import { CALLBACK_FLOWS, notifyOpenerCallbackComplete } from "@/lib/callback-opener-messages";

const LOG_PREFIX = "[EnachCheckoutBridge]";

function enachCheckoutBridgeLog(message: string, data?: unknown): void {
  console.log(LOG_PREFIX, message, data !== undefined ? data : "");
}

/**
 * Bridge page opened in a **popup** via `window.open` from the loan wizard.
 * Runs Cashfree `subscriptionsCheckout` with `redirectTarget: "_self"` so hosted checkout
 * stays inside the popup (using `_blank` from the main window opens a new tab instead).
 *
 * Any failure here happens before Cashfree's hosted checkout ever loads, so there is no
 * `/enach/callback` return trip to close the popup. Each failure path must notify the opener
 * and close itself directly — otherwise the popup is orphaned open with no way back.
 */
function MissingSessionMessage() {
  useEffect(() => {
    enachCheckoutBridgeLog("missing_session_notify_failed_and_close");
    notifyOpenerCallbackComplete({
      flow: CALLBACK_FLOWS.ENACH,
      search: "",
      status: "FAILED",
    });
  }, []);

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-4 py-8 text-center">
      <p className="text-sm font-medium text-red-700">
        Missing checkout session. This window will close automatically.
      </p>
    </div>
  );
}

function EnachCheckoutWithSession({ subscriptionSessionId, enachMode }: { subscriptionSessionId: string, enachMode: "sandbox" | "production" }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        enachCheckoutBridgeLog("opening_cashfree_subscription_checkout", {
          mode: enachMode,
          hasSubscriptionSessionId: Boolean(subscriptionSessionId),
        });
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        await openCashfreeSubscriptionCheckoutWeb({
          mode: enachMode,
          subscriptionSessionId,
          returnUrl: `${origin}/enach/callback`,
          redirectTarget: "_self",
        });
      } catch (err) {
        if (cancelled) return;
        enachCheckoutBridgeLog("cashfree_subscription_checkout_error", {
          message: err instanceof Error ? err.message : "Unknown checkout error",
        });
        setErrorMessage(
          err instanceof Error ? err.message : "Could not open payment gateway. Please try again."
        );
        notifyOpenerCallbackComplete({
          flow: CALLBACK_FLOWS.ENACH,
          search: "",
          status: "FAILED",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [subscriptionSessionId, enachMode]);

  if (errorMessage) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-4 py-8 text-center">
        <p className="text-sm font-medium text-red-700">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 px-4 py-10">
      <Image src="/images/e-nach.png" alt="" width={120} height={120} className="object-contain" />
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm font-medium text-gray-600">Opening secure checkout…</p>
    </div>
  );
}

function EnachCheckoutInner() {
  const searchParams = useSearchParams();
  const subscriptionSessionId = searchParams.get("subscriptionSessionId")?.trim() ?? "";
  const enachMode = searchParams.get("enachMode")?.trim() ?? "";

  if (!subscriptionSessionId) {
    return <MissingSessionMessage />;
  }

  return <EnachCheckoutWithSession subscriptionSessionId={subscriptionSessionId} enachMode={enachMode as "sandbox" | "production"} />;
}

export default function EnachCheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start pt-8 px-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-gray-600">Loading…</p>
          </div>
        }
      >
        <EnachCheckoutInner />
      </Suspense>
    </div>
  );
}
