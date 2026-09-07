import { apiFetchWithAuth } from "@/lib/api";
import { API_ENDPOINTS, endpointPath } from "@/lib/api-endpoints";

export type CreatePaymentOrderParams = {
  loanId: string;
  amount: number;
};

export type CreatePaymentOrderResponse = {
  payment_session_id: string;
  order_id: string;
};

export type GenerateAndSendPaymentLinkResponse = {
  message: string;
  success: boolean;
  paymentLink: string;
};

const PAYMENT_SESSION_KEYS = [
  "payment_session_id",
  "paymentSessionId",
  "payment_sessionId",
  "session_id",
  "paymentSession",
] as const;

const ORDER_ID_KEYS = ["order_id", "orderId", "cf_order_id", "cfOrderId"] as const;

function extractFromRecord(rec: Record<string, unknown>): {
  session?: string;
  order?: string;
} {
  let session: string | undefined;
  let order: string | undefined;
  for (const k of PAYMENT_SESSION_KEYS) {
    const v = rec[k];
    if (typeof v === "string" && v.trim()) {
      session = v.trim();
      break;
    }
  }
  for (const k of ORDER_ID_KEYS) {
    const v = rec[k];
    if (typeof v === "string" && v.trim()) {
      order = v.trim();
      break;
    }
  }
  return { session, order };
}

function visitForPaymentOrder(obj: unknown, maxDepth: number): CreatePaymentOrderResponse | null {
  if (maxDepth < 0 || !obj || typeof obj !== "object") return null;
  const rec = obj as Record<string, unknown>;
  const { session, order } = extractFromRecord(rec);
  if (session && order) {
    return { payment_session_id: session, order_id: order };
  }
  for (const v of Object.values(rec)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const found = visitForPaymentOrder(v, maxDepth - 1);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Unwraps nested `data` and finds payment_session_id + order_id (Cashfree PG v3+).
 */
export function parseCreatePaymentOrderResponse(raw: unknown): CreatePaymentOrderResponse {
  const fromRoot = visitForPaymentOrder(raw, 6);
  if (fromRoot) return fromRoot;

  if (raw && typeof raw === "object" && "data" in raw) {
    const inner = visitForPaymentOrder((raw as { data: unknown }).data, 6);
    if (inner) return inner;
  }

  const tokenHint =
    raw && typeof raw === "object" && JSON.stringify(raw).includes("order_token")
      ? " Backend may still return order_token — Cashfree web checkout needs payment_session_id (API version 2023-08-01+)."
      : "";

  throw new Error(
    `Invalid payment order response: missing payment_session_id or order_id.${tokenHint}`,
  );
}

type OrderStatusPayload = {
  status?: string;
  orderStatus?: string;
  paymentStatus?: string;
};

export type PaymentOrderStatus = "SUCCESS" | "FAILED" | "PENDING";

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 60;

function normalizeStatus(raw: string | undefined): PaymentOrderStatus | null {
  if (!raw) return null;
  const u = raw.trim().toUpperCase();
  if (u === "SUCCESS" || u === "PAID" || u === "COMPLETED") return "SUCCESS";
  if (u === "FAILED" || u === "FAILURE" || u === "CANCELLED" || u === "CANCELED") {
    return "FAILED";
  }
  if (u === "PENDING" || u === "ACTIVE" || u === "PROCESSING") return "PENDING";
  return null;
}

function extractStatus(data: unknown): PaymentOrderStatus | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;
  const nested =
    record.data && typeof record.data === "object"
      ? (record.data as OrderStatusPayload)
      : (record as OrderStatusPayload);
  return (
    normalizeStatus(nested.status) ??
    normalizeStatus(nested.orderStatus) ??
    normalizeStatus(nested.paymentStatus) ??
    normalizeStatus(typeof record.status === "string" ? record.status : undefined)
  );
}

/**
 * POST /payment/transactions — create Cashfree order for loan repayment.
 */
export async function createPaymentOrder(
  params: CreatePaymentOrderParams,
): Promise<CreatePaymentOrderResponse> {
  const response = await apiFetchWithAuth<unknown>(
    endpointPath(API_ENDPOINTS.payment.createPaymentOrder),
    {
      method: "POST",
      body: JSON.stringify({
        loanId: params.loanId,
      }),
    },
  );

  return parseCreatePaymentOrderResponse(response);
}

export async function generateAndSendPaymentLink(
  params: CreatePaymentOrderParams,
): Promise<GenerateAndSendPaymentLinkResponse> {
  return apiFetchWithAuth<GenerateAndSendPaymentLinkResponse>(
    endpointPath(API_ENDPOINTS.payment.generateAndSendPaymentLink),
    {
      method: "POST",
      body: JSON.stringify({
        loanId: params.loanId,
        amount: params.amount,
      }),
    },
  );
}

async function fetchPaymentOrderStatus(orderId: string): Promise<PaymentOrderStatus | null> {
  const response = await apiFetchWithAuth<unknown>(
    endpointPath(`${API_ENDPOINTS.payment.orderStatus}/${orderId}`)
  );
  return extractStatus(response);
}

/**
 * Polls GET /payment/order-status until SUCCESS, FAILED, or timeout.
 */
export async function pollPaymentStatus(
  orderId: string,
  signal?: AbortSignal,
): Promise<PaymentOrderStatus> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const status = await fetchPaymentOrderStatus(orderId);
    if (status === "SUCCESS" || status === "FAILED") {
      return status;
    }

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(resolve, POLL_INTERVAL_MS);
      if (signal) {
        const onAbort = () => {
          clearTimeout(timer);
          reject(new DOMException("Aborted", "AbortError"));
        };
        if (signal.aborted) {
          onAbort();
          return;
        }
        signal.addEventListener("abort", onAbort, { once: true });
      }
    });
  }

  return "FAILED";
}
