"use client";

import { useEffect, useRef } from "react";
import { useAuthPersistHydrated } from "@/hooks/useAuthPersistHydrated";
import { useUserStage } from "@/hooks/useUserStage";
import {
  trackClarityLogin,
  updateClarityUserStage,
} from "@/lib/microsoft-clarity";
import { useAuthStore } from "@/store/useAuthStore";

export function MicrosoftClarityAnalytics() {
  const hasHydrated = useAuthPersistHydrated();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const phoneNumber = useAuthStore((state) => state.phone);
  const { data: userStageResponse } = useUserStage({
    enabled: hasHydrated && isLoggedIn,
  });
  const trackedLoginRef = useRef(false);
  const lastTrackedStageRef = useRef<string | null>(null);

  useEffect(() => {
    const userStage = userStageResponse?.stage?.trim();
    if (!hasHydrated || !isLoggedIn || !phoneNumber || !userStage) return;

    if (!trackedLoginRef.current) {
      trackClarityLogin(phoneNumber, userStage);
      trackedLoginRef.current = true;
      lastTrackedStageRef.current = userStage;
      return;
    }

    if (lastTrackedStageRef.current !== userStage) {
      updateClarityUserStage(phoneNumber, userStage);
      lastTrackedStageRef.current = userStage;
    }
  }, [hasHydrated, isLoggedIn, phoneNumber, userStageResponse?.stage]);

  return null;
}
