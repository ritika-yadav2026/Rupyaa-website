"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { IMAGES } from "@/lib/images";
import { MarketingAttributionStorage } from "@/lib/marketing-attribution-storage";
import { executeDsaSsoExchange } from "@/services/auth/exchange-dsa-sso-session";
import { useAuthStore } from "@/store/useAuthStore";

const DEFAULT_SSO_REDIRECT_PATH = "/personal-loan";

type CallbackStatus = "loading" | "error";

function SsoLoadingView(): ReactNode {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center gap-5 text-center">
        <Image
          src={IMAGES.zapcashLogo}
          alt="ZapCash"
          width={140}
          height={40}
          priority
          className="h-10 w-auto object-contain"
        />
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-gray-900">
            Signing you in to ZapCash
          </h1>
          <p className="max-w-sm text-sm text-slate-600">
            Please wait a moment. Do not close this window.
          </p>
        </div>
      </div>
    </div>
  );
}

function SsoErrorView(): ReactNode {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <Image
          src={IMAGES.zapcashLogo}
          alt="ZapCash"
          width={120}
          height={36}
          className="mx-auto h-9 w-auto object-contain"
        />
        <h1 className="mt-6 text-xl font-bold text-gray-900">
          Link expired or invalid
        </h1>
        <Link
          href="/auth"
          className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Continue to login
        </Link>
      </div>
    </div>
  );
}

function SsoCallbackContent(): ReactNode {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);
  const [status, setStatus] = useState<CallbackStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const result = await executeDsaSsoExchange(
        new URLSearchParams(searchParams.toString())
      );
      if (cancelled) return;

      if (result.status === "success") {
        login({
          token: result.data.token,
          userId: result.data.userId,
          leadId: result.data.leadId,
        });
        MarketingAttributionStorage.clear();
        toast.success("Welcome to ZapCash!");
        router.replace(DEFAULT_SSO_REDIRECT_PATH);
        return;
      }

      setStatus("error");
    })();

    return () => {
      cancelled = true;
    };
  }, [login, router, searchParams]);

  let content: ReactNode;
  if (status === "error") {
    content = <SsoErrorView />;
  } else {
    content = <SsoLoadingView />;
  }

  return content;
}

export default function SsoCallbackPage(): ReactNode {
  return (
    <Suspense fallback={<SsoLoadingView />}>
      <SsoCallbackContent />
    </Suspense>
  );
}
