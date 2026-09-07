"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { openCashfreePaymentCheckoutWeb } from "@/lib/cashfree-payment-web";

/**
 * Bridge page opened in a **popup** from the payment / foreclosure screens.
 * Runs Cashfree `checkout` with `redirectTarget: "_self"` so hosted checkout stays in the popup.
 */
function MissingSessionMessage() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-4 py-8 text-center">
      <p className="text-sm font-medium text-red-700">
        Missing checkout session. Close this window and try again from the payment page.
      </p>
    </div>
  );
}

function PaymentCheckoutWithSession({
  paymentSessionId,
  orderId,
  cashfreeMode,
}: {
  paymentSessionId: string;
  orderId: string;
  cashfreeMode: "sandbox" | "production";
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        await openCashfreePaymentCheckoutWeb({
          mode: cashfreeMode,
          paymentSessionId,
          orderId,
          origin,
          redirectTarget: "_self",
        });
      } catch (err) {
        if (cancelled) return;
        setErrorMessage(
          err instanceof Error ? err.message : "Could not open payment gateway. Please try again.",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [paymentSessionId, orderId, cashfreeMode]);

  if (errorMessage) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-4 py-8 text-center">
        <p className="text-sm font-medium text-red-700">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 px-4 py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm font-medium text-gray-600">Opening secure checkout…</p>
    </div>
  );
}

function PaymentCheckoutInner() {
  const searchParams = useSearchParams();
  const paymentSessionId = searchParams.get("paymentSessionId")?.trim() ?? "";
  const orderId = searchParams.get("orderId")?.trim() ?? "";
  const cashfreeModeParam = searchParams.get("cashfreeMode")?.trim() ?? "";
  const cashfreeMode =
    cashfreeModeParam === "production" || cashfreeModeParam === "sandbox"
      ? cashfreeModeParam
      : null;

  if (!paymentSessionId || !orderId || !cashfreeMode) {
    return <MissingSessionMessage />;
  }

  return (
    <PaymentCheckoutWithSession
      paymentSessionId={paymentSessionId}
      orderId={orderId}
      cashfreeMode={cashfreeMode}
    />
  );
}

export default function PaymentCheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-slate-50 px-4 pt-8">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-gray-600">Loading…</p>
          </div>
        }
      >
        <PaymentCheckoutInner />
      </Suspense>
    </div>
  );
}
