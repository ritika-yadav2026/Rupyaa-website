"use client";

import { useEffect } from "react";
import {
  clearExternalAppConfigCache,
  fetchExternalAppConfig,
} from "@/lib/external-app-config-api";
import { useAuthLoggedInHint } from "@/hooks/use-auth-logged-in-hint";

type Props = {
  /** When omitted, follows the client auth hint / store. */
  enabled?: boolean;
};

/**
 * Pre-fetches external app config for authenticated users on app boot / refresh.
 * Keeps feature/provider config warm before dependent KYC steps execute.
 */
export function ExternalAppConfigInit({ enabled }: Props) {
  const { isLoggedIn: hintLoggedIn } = useAuthLoggedInHint();
  const isEnabled = enabled ?? hintLoggedIn;

  useEffect(() => {
    if (!isEnabled) {
      clearExternalAppConfigCache();
      return;
    }
    void fetchExternalAppConfig();
  }, [isEnabled]);

  return null;
}
