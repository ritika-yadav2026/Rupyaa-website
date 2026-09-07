import { fetchExternalAppConfig } from "@/lib/external-app-config-api";
import { useAuthStore } from "@/store/useAuthStore";

type CashfreeJsMode = "sandbox" | "production";

function normalizePhoneDigits(phone: string | null | undefined): string {
  if (!phone) return "";
  return phone.replace(/\D/g, "");
}

/**
 * Resolves Cashfree.js `mode` for E-NACH: remote `cashFreeEnachEnvironment` (fallback `cashfreEnvironment`),
 * with Play Store reviewer whitelist forcing sandbox (parity with mobile).
 */
export async function resolveCashfreeEnachMode(): Promise<CashfreeJsMode> {
  const config = await fetchExternalAppConfig();
  const phone = useAuthStore.getState().phone;
  const normalizedUser = normalizePhoneDigits(phone);
  const whitelist = config?.playStorePhoneNumbers;
  if (Array.isArray(whitelist) && normalizedUser.length > 0) {
    const hit = whitelist.some((entry) => normalizePhoneDigits(entry) === normalizedUser);
    if (hit) {
      return "sandbox";
    }
  }

  const raw =
    (typeof config?.cashFreeEnachEnvironment === "string" && config.cashFreeEnachEnvironment) ||
    (typeof config?.cashfreEnvironment === "string" && config.cashfreEnvironment) ||
    "PRODUCTION";
  const upper = raw.trim().toUpperCase();
  return upper === "SANDBOX" ? "sandbox" : "production";
}
