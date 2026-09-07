"use client";

import { useCallback, useRef } from "react";
import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import { runWithCenteredThirdPartyPopups } from "@/lib/open-external-flow-popup";

export type GoogleAuthResult =
  | {
      type: "success";
      user: null;
      accessToken: string | null;
      idToken: string | null;
      error?: unknown;
    }
  | {
      type: "cancelled";
    }
  | {
      type: "error";
      error: Error;
    };

/**
 * Web OAuth token flow.
 *
 * Returns accessToken for Google APIs (e.g. contacts.readonly).
 */
export function useGoogleAuth() {
  const pendingPromiseRef = useRef<{
    resolve: (result: GoogleAuthResult) => void;
  } | null>(null);

  const login = useGoogleLogin({
    flow: "implicit",
    scope: ["profile", "email", "https://www.googleapis.com/auth/contacts.readonly"].join(" "),

    onSuccess: (tokenResponse: TokenResponse) => {
      const accessToken =
        typeof tokenResponse.access_token === "string" && tokenResponse.access_token.trim().length > 0
          ? tokenResponse.access_token
          : null;

      pendingPromiseRef.current?.resolve({
        type: "success",
        user: null,
        accessToken,
        idToken: null,
        ...(accessToken == null ? { error: new Error("Google access token missing.") } : {}),
      });

      pendingPromiseRef.current = null;
    },

    onError: (errorResponse) => {
      const message =
        errorResponse?.error_description ||
        errorResponse?.error ||
        "Google sign-in failed. Please try again.";

      pendingPromiseRef.current?.resolve({
        type: "error",
        error: new Error(message),
      });

      pendingPromiseRef.current = null;
    },

    onNonOAuthError: (nonOAuthError) => {
      const type = nonOAuthError?.type;

      pendingPromiseRef.current?.resolve(
        type === "popup_closed" || type === "popup_failed_to_open"
          ? { type: "cancelled" }
          : {
              type: "error",
              error: new Error(type || "Google sign-in was cancelled."),
            }
      );

      pendingPromiseRef.current = null;
    },
  });

  const promptAsync = useCallback(async (): Promise<GoogleAuthResult> => {
    if (pendingPromiseRef.current) {
      return {
        type: "error",
        error: new Error("Google sign-in is already in progress."),
      };
    }

    return new Promise<GoogleAuthResult>((resolve) => {
      pendingPromiseRef.current = { resolve };

      try {
        runWithCenteredThirdPartyPopups(() => login(), "bridge");
      } catch (err) {
        pendingPromiseRef.current = null;

        resolve({
          type: "error",
          error: err instanceof Error ? err : new Error(String(err)),
        });
      }
    });
  }, [login]);

  return { promptAsync };
}
