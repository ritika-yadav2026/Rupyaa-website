"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { pollPaymentStatus } from "@/lib/payment-api";
import {
  CALLBACK_FLOWS,
  notifyOpenerCallbackComplete,
} from "@/lib/callback-opener-messages";
import { isInMobileApp } from "@/helpers/NativeHelper";
import {
  clearLoanPaymentPending,
  getLoanPaymentPending,
  markForeclosurePaymentReturnFromCallback,
  setLoanPaymentResult,
} from "@/lib/loan-payment-session";
import {
  VERIFY_PAYMENT_MESSAGE,
} from "@/lib/payment-ui-constants";
import { appShellContainerClassName } from "@/lib/app-shell-layout";

function PaymentWebReturnFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const pending = getLoanPaymentPending();
    if (!pending?.orderId) {
      router.replace("/payment");
      return;
    }

    const controller = new AbortController();
    const hasOpener =
      typeof window !== "undefined" && Boolean(window.opener) && !isInMobileApp();

    void (async () => {
      /** Foreclosure: order status is polled on the foreclosure screen; this route only notifies or redirects. */
      const handleForeclosureHandoff = (): void => {
        if (hasOpener) {
          notifyOpenerCallbackComplete({
            flow: CALLBACK_FLOWS.PAYMENT,
            search: searchParams.toString(),
            status: undefined,
          });
          return;
        }
        markForeclosurePaymentReturnFromCallback();
        router.replace(pending.returnPath);
      };

      const runPaymentVariantPoll = async (): Promise<void> => {
        try {
          const status = await pollPaymentStatus(pending.orderId, controller.signal);
          const normalized = status === "SUCCESS" ? "SUCCESS" : "FAILED";

          setLoanPaymentResult({
            status: normalized,
            amountPaid: pending.amount,
            baseline: pending.baseline,
            variant: pending.variant,
          });
          clearLoanPaymentPending();

          if (hasOpener) {
            notifyOpenerCallbackComplete({
              flow: CALLBACK_FLOWS.PAYMENT,
              search: searchParams.toString(),
              status: normalized,
            });
            return;
          }

          router.replace(pending.returnPath);
        } catch (e) {
          if (e instanceof Error && e.name === "AbortError") return;

          setLoanPaymentResult({
            status: "FAILED",
            amountPaid: pending.amount,
            baseline: pending.baseline,
            variant: pending.variant,
          });
          clearLoanPaymentPending();

          if (hasOpener) {
            notifyOpenerCallbackComplete({
              flow: CALLBACK_FLOWS.PAYMENT,
              search: searchParams.toString(),
              status: "FAILED",
            });
            return;
          }

          router.replace(pending.returnPath);
        }
      };

      if (pending.variant === "foreclosure") {
        handleForeclosureHandoff();
        return;
      }

      await runPaymentVariantPoll();
    })();

    return () => controller.abort();
  }, [router, searchParams]);

  const message = VERIFY_PAYMENT_MESSAGE.MESSAGE;

  return (
    <div className={`py-16 ${appShellContainerClassName}`}>
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <h1 className="text-lg font-semibold text-gray-900">{VERIFY_PAYMENT_MESSAGE.TITLE}</h1>
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className={`py-16 ${appShellContainerClassName}`}>
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-gray-600">{VERIFY_PAYMENT_MESSAGE.MESSAGE}</p>
          </div>
        </div>
      }
    >
      <PaymentWebReturnFlow />
    </Suspense>
  );
}
