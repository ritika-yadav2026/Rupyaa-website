import { create } from "zustand";
import { persist } from "zustand/middleware";
import { syncAuthLoggedInHintCookie } from "@/lib/auth-session-cookie";
import { MarketingAttributionStorage } from "@/lib/marketing-attribution-storage";
import { trackClarityLogout } from "@/lib/microsoft-clarity";
import { useFlowStore } from "@/store/useFlowStore";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

type AuthState = {
  isLoggedIn: boolean;
  phone: string | null;
  token: string | null;
  refreshToken: string | null;
  userId: string | null;
  leadId: string | null;
};

type AuthActions = {
  login: (payload: {
    phone?: string | null;
    token: string;
    /** Optional — DSA SSO sessions do not return a refresh token. */
    refreshToken?: string | null;
    userId: string;
    leadId: string;
  }) => void;
  setToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      phone: null,
      token: null,
      refreshToken: null,
      userId: null,
      leadId: null,
      login: (payload) => {
        set({
          isLoggedIn: true,
          phone: payload.phone ?? null,
          token: payload.token,
          refreshToken: payload.refreshToken ?? null,
          userId: payload.userId,
          leadId: payload.leadId,
        });
        if (isBrowser()) {
          syncAuthLoggedInHintCookie(true);
        }
      },
      setToken: (token) => set({ token }),
      logout: () => {
        const currentPhoneNumber = useAuthStore.getState().phone;
        const currentUserStage =
          useFlowStore.getState().userStageResponse?.stage ?? null;
        trackClarityLogout(currentPhoneNumber, currentUserStage);
        set({
          isLoggedIn: false,
          phone: null,
          token: null,
          refreshToken: null,
          userId: null,
          leadId: null,
        });
        useFlowStore.getState().resetFlow();
        if (!isBrowser()) return;
        syncAuthLoggedInHintCookie(false);
        try {
          window.localStorage.removeItem("zapcash-auth");
          MarketingAttributionStorage.clear();
        } finally {
          window.location.href = "/";
          window.location.reload();
        }
      },
    }),
    {
      name: "zapcash-auth",
      onRehydrateStorage: () => (state, error) => {
        if (error || typeof window === "undefined") return;
        syncAuthLoggedInHintCookie(Boolean(state?.isLoggedIn));
      },
    }
  )
);
