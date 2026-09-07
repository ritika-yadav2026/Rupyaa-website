import {
  exchangeDsaSession,
  type ExchangeDsaSessionResponse,
  type MarketingAttribution,
} from "@/lib/auth-api";
import { readAttributionFromSearchParams } from "@/lib/marketing-attribution-storage";

/**
 * Shares one exchange promise per ticket so React Strict Mode remounts do not
 * fire a second POST against a one-time ticket.
 */
const inFlightByTicket: Map<string, Promise<DsaSsoExchangeResult>> = new Map();

export type DsaSsoExchangeResult =
  | { status: "success"; data: ExchangeDsaSessionResponse }
  | { status: "missing_ticket" }
  | { status: "error"; message: string };

/**
 * Reads `ticket` + UTMs from the landing URL and exchanges for a DSA session.
 */
export async function executeDsaSsoExchange(
  searchParams: URLSearchParams
): Promise<DsaSsoExchangeResult> {
  const ticket = searchParams.get("ticket")?.trim() ?? "";
  if (!ticket) {
    return { status: "missing_ticket" };
  }
  const existing = inFlightByTicket.get(ticket);
  if (existing) {
    return existing;
  }
  const attribution: MarketingAttribution | undefined =
    readAttributionFromSearchParams(searchParams);
  const promise = (async (): Promise<DsaSsoExchangeResult> => {
    try {
      const data = await exchangeDsaSession({ ticket, attribution });
      return { status: "success", data };
    } catch (err) {
      inFlightByTicket.delete(ticket);
      const message =
        err instanceof Error && err.message.trim().length > 0
          ? err.message.trim()
          : "This sign-in link is expired or invalid.";
      return { status: "error", message };
    }
  })();
  inFlightByTicket.set(ticket, promise);
  return promise;
}
