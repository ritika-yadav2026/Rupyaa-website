"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchExternalAppConfig } from "@/lib/external-app-config-api";

export type GoogleOAuthAppState =
  | { status: "loading" }
  | { status: "ready"; clientId: string }
  | { status: "missing" };

const GoogleOAuthAppContext = createContext<GoogleOAuthAppState>({ status: "loading" });

export function useGoogleOAuthAppState(): GoogleOAuthAppState {
  return useContext(GoogleOAuthAppContext);
}

function initialOAuthState(): GoogleOAuthAppState {
  return { status: "loading" };
}

/**
 * Wraps the app with Google OAuth when `googleClientId` is available from GET /external/config.
 * Exposes {@link useGoogleOAuthAppState} for steps that
 * must avoid calling `useGoogleLogin` when OAuth is not configured.
 */
export function GoogleOAuthAppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GoogleOAuthAppState>(initialOAuthState);

  useEffect(() => {
    void fetchExternalAppConfig().then((config) => {
      const remote = config?.googleClientId?.trim();
      if (remote) {
        setState({ status: "ready", clientId: remote });
        return;
      }
      setState({ status: "missing" });
    });
  }, []);

  const value = useMemo(() => state, [state]);

  const tree =
    state.status === "ready" ? (
      <GoogleOAuthProvider clientId={state.clientId}>{children}</GoogleOAuthProvider>
    ) : (
      children
    );

  return <GoogleOAuthAppContext.Provider value={value}>{tree}</GoogleOAuthAppContext.Provider>;
}
