"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/format-utils";
import {
  PAYMENT_SUCCESS_ICON_SRC,
  type PaymentSuccessVariant,
} from "@/lib/payment-ui-constants";
import Link from "next/link";

export interface PaymentSuccessModalProps {
  visible: boolean;
  amountPaid: number;
  variant: PaymentSuccessVariant;
  remainingBalance?: number;
  onContinueToHomepage: () => void;
  onRequestClose?: () => void;
}

function SuccessIcon() {
  return (
    <div className="relative mx-auto mb-8 flex h-36 w-36 items-center justify-center md:mb-6 md:h-28 md:w-28">
      <Image
        src={PAYMENT_SUCCESS_ICON_SRC}
        alt=""
        width={144}
        height={144}
        priority
        className="h-28 w-28 object-contain md:h-24 md:w-24"
      />
    </div>
  );
}

export function PaymentSuccessModal({
  visible,
  amountPaid,
  variant,
  remainingBalance = 0,
  onContinueToHomepage,
  onRequestClose,
}: PaymentSuccessModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const showRemainingBalance = variant === "payment";
  
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (visible) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [visible]);

  if (!visible) return null;

  const handleForecloseNow = () => {
    onRequestClose?.();
  };

  const renderCTAbutton = () => {
    if (variant === "payment") {
      return (
        <>
        <div className="flex flex-col items-center justify-center">
        <Link href="/" className="text-sm text-gray-500 text-center p-4">
          Continue to Homepage
        </Link>
        </div>
        <button
          type="button"
          onClick={handleForecloseNow}
          className="w-full min-h-[52px] rounded-xl bg-primary font-semibold text-white hover:bg-primary/90"
          >
          Foreclose Now
        </button>
          </>
      );
    }
    return (
      <button
        type="button"
        onClick={onContinueToHomepage}
        className="w-full min-h-[52px] rounded-xl bg-primary font-semibold text-white hover:bg-primary/90"
      >
        Continue to Homepage
      </button>
    );
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-0 h-full w-full max-h-none max-w-none border-0 bg-transparent p-0 backdrop:bg-white md:flex md:items-center md:justify-center md:p-6 md:backdrop:bg-black/55"
      aria-modal="true"
      aria-labelledby="payment-success-title"
      onCancel={(e) => {
        e.preventDefault();
        onRequestClose?.();
      }}
      onClose={() => {
        onRequestClose?.();
      }}
    >
      <div className="flex h-full min-h-full w-full flex-col bg-white px-6 pt-12 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:h-auto md:min-h-0 md:max-h-[min(90vh,640px)] md:max-w-md md:rounded-2xl md:px-8 md:pt-10 md:pb-8 md:shadow-xl">
        <div className="flex flex-1 flex-col items-center justify-center text-center md:flex-none md:py-2">
          <SuccessIcon />
          <h2
            id="payment-success-title"
            className="mb-8 text-xl font-semibold text-gray-900 md:mb-6"
          >
            Payment Successful
          </h2>

          <div className={showRemainingBalance ? "mb-4 w-full max-w-xs" : "mb-6 md:mb-8"}>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              Amount Paid
            </p>
            <p className="text-3xl font-semibold text-gray-900">{formatCurrency(amountPaid)}</p>
          </div>

          {showRemainingBalance ? (
            <>
              <div className="mb-6 mt-12 w-full max-w-xs md:mb-8">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Remaining Balance
                </p>
                <p className="text-2xl font-semibold text-primary">
                  {formatCurrency(remainingBalance)}
                </p>
              </div>
            </>
          ) : null}
        </div>

        <div className="mx-auto w-full md:max-w-none">
          {renderCTAbutton()}
        </div>
      </div>
    </dialog>
  );
}
