export const ANALYTICS_EVENT = {
    BUREAU_POLICY_RESPONSE_APP: "bureau_policy_response_app",
    CONTACT_DETAIL_PAGE_SUBMIT: "contact_detail_page_submit",
    REVIEW_OFFER_PAGE_LAND: "review_offer_page_land",
    REVIEW_OFFER_PAGE_CLICK: "review_offer_page_click",
  } as const;
  
  export type AnalyticsEventName =
    (typeof ANALYTICS_EVENT)[keyof typeof ANALYTICS_EVENT];
  
  export type BureauPolicyResponseAppPayload = {
    status?: string;
    decile?: number;
    declaredSalary?: number;
    offerAmount?: number;
    empType?: string;
    applicationType?: 'reloan' | 'fresh';
  };
  
  const isFiniteNumber = (value: unknown): value is number =>
    typeof value === "number" && Number.isFinite(value);
  
  const toNonEmptyString = (value: unknown): string | undefined => {
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  };
  
  function pushToDataLayer(event: AnalyticsEventName, payload: Record<string, string | number>) {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ...payload,
    });
  }
  
  export function trackBureauPolicyResponseApp(
    params: BureauPolicyResponseAppPayload
  ): void {
    const payload: Record<string, string | number> = {};
  
    const status = toNonEmptyString(params.status);
    if (status) payload.status = status;
  
    if (isFiniteNumber(params.decile)) payload.decile = params.decile;
    if (isFiniteNumber(params.declaredSalary)) {
      payload.declaredSalary = params.declaredSalary;
    }
    if (isFiniteNumber(params.offerAmount)) payload.offerAmount = params.offerAmount;
    payload['applicationType'] = params.applicationType ?? 'fresh';
  
    const empType = toNonEmptyString(params.empType);
    if (empType) payload.empType = empType;
  
    if (Object.keys(payload).length === 0) return;
    console.log("trackBureauPolicyResponseApp", payload);
    pushToDataLayer(ANALYTICS_EVENT.BUREAU_POLICY_RESPONSE_APP, payload);
  }

  /** Fires after successful POST /user/contacts — no PII or OTP in payload. */
  export function trackContactDetailPageSubmit(): void {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: ANALYTICS_EVENT.CONTACT_DETAIL_PAGE_SUBMIT,
      source: "web",
    });
  }

  /** Approved-offer step visible after first GET /offer/current resolves (no offer payloads). */
  export function trackReviewOfferPageLand(): void {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: ANALYTICS_EVENT.REVIEW_OFFER_PAGE_LAND,
      source: "web",
    });
  }

  /** Fires on successful POST /offer/acceptance before advancing the wizard. */
  export function trackReviewOfferPageClick(): void {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: ANALYTICS_EVENT.REVIEW_OFFER_PAGE_CLICK,
      source: "web",
    });
  }
