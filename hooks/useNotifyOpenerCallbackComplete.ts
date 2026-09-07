"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { type CallbackFlow, notifyOpenerCallbackComplete } from "@/lib/callback-opener-messages";

type UseNotifyOpenerCallbackCompleteParams = {
  flow: CallbackFlow;
};

export function useNotifyOpenerCallbackComplete({ flow }: UseNotifyOpenerCallbackCompleteParams): void {
  const searchParams = useSearchParams();
  const didNotifyRef = useRef(false);

  useEffect(() => {
    if (didNotifyRef.current) return;
    didNotifyRef.current = true;

    const status = searchParams.get("status") ?? undefined;
    const search = searchParams.toString();

    notifyOpenerCallbackComplete({
      flow,
      search,
      status,
    });
  }, [flow, searchParams]);
}
