"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useCallbackNotifyApp } from "@/hooks/useCallbackNotifyApp";
import { useNotifyOpenerCallbackComplete } from "@/hooks/useNotifyOpenerCallbackComplete";
import { CALLBACK_FLOWS } from "@/lib/callback-opener-messages";
import { NATIVE_APP_MESSAGE_TYPES } from "@/utils/native-constants";

const EsignContent = () => {
  useNotifyOpenerCallbackComplete({ flow: CALLBACK_FLOWS.ESIGN });
  const { isRedirecting, isMobileSource } = useCallbackNotifyApp({
    messageType: NATIVE_APP_MESSAGE_TYPES.ESIGN_SUCCESS,
  });

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center" aria-label="Esign verification">
        <Image
          src="/images/e-sign.png"
          alt="eSign verification"
          width={320}
          height={320}
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
};

const EsignCallbackWrapper = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4">
          <Image
            src="/images/e-sign.png"
            alt="eSign verification"
            width={320}
            height={320}
            className="object-contain"
          />
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <EsignContent />
    </Suspense>
  );
};

export default EsignCallbackWrapper;
