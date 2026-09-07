declare module "@cashfreepayments/cashfree-js" {
  type CashfreeMode = "sandbox" | "production";

  type LoadParams = { mode: CashfreeMode } & Record<string, unknown>;

  /** Regular payment drop checkout (expects payment session id). */
  type CheckoutOptions = {
    paymentSessionId: string;
    returnUrl?: string;
    mode: CashfreeMode;
    redirectTarget?: "_self" | "_blank" | "_top" | "_parent";
  };

  /** Subscription / E-NACH hosted checkout. */
  type SubscriptionCheckoutOptions = {
    subsSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_top" | "_parent";
  };

  type CheckoutResult = {
    error?: { message?: string };
    redirect?: boolean;
  };

  type CashfreeInstance = {
    checkout: (options: CheckoutOptions) => Promise<CheckoutResult>;
    subscriptionsCheckout: (options: SubscriptionCheckoutOptions) => Promise<CheckoutResult>;
  };

  export function load(params: LoadParams): Promise<CashfreeInstance | null>;
}
