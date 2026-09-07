// app/digilocker/callback/page.tsx
"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useCallbackNotifyApp } from "@/hooks/useCallbackNotifyApp";
import { useNotifyOpenerCallbackComplete } from "@/hooks/useNotifyOpenerCallbackComplete";
import { CALLBACK_FLOWS } from "@/lib/callback-opener-messages";
import { NATIVE_APP_MESSAGE_TYPES } from "@/utils/native-constants";

const DigilockerCallbackContent = () => {
  useNotifyOpenerCallbackComplete({ flow: CALLBACK_FLOWS.DIGILOCKER });
  const { isRedirecting, isMobileSource } = useCallbackNotifyApp({
    messageType: NATIVE_APP_MESSAGE_TYPES.DIGILOCKER_SUCCESS,
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
      <div className="flex flex-col items-center">
        <Image
          src="/images/digilocker.png"
          alt="DigiLocker verification"
          width={320}
          height={320}
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
};

const DigilockerCallback = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <DigilockerCallbackContent />
    </Suspense>
  );
};

export default DigilockerCallback;
