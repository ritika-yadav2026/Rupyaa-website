export const STRING_CONSTANTS = {
    WHATSAPP_SUPPORT_URL: "https://wa.me/918503090309?text=Hi",
    PLAY_STORE_URL: "https://play.google.com/store/apps/details?id=com.zapcash.loan",
    APP_STORE_URL:
        "https://apps.apple.com/in/app/zapcash-quick-loans/id6761755166",
} as const;

export const REACT_QUERY_KEYS = {
    LOANS: "loans",
    CAN_CANCEL_LOAN: "can-cancel-loan",
    SALARY_ACCOUNTS: "salary-accounts",
    USER_STAGE_WEB: "user-stage-web",
    ALL_USER_LOANS: "all-user-loans",
    EXISTING_ACTIVE_LOAN: "existing-active-loan",
    DOCUMENT_REQUESTS: "document-requests",
    PERSONAL_DETAILS: "personal-details",
    USER_STAGE: "user-stage",
    SHOULD_STOP_BEFORE_NACH: "should-stop-before-nach",
    TICKET_FILTER_OPTIONS: "ticket-filter-options",
    WEB: "web",
} as const;


/** Aligned with native `BANK_CONNECT_STATUS_MESSAGES` / `BankConnectFetchingContent`. */
export const BANK_CONNECT_STATUS_MESSAGES = {
    fetchingBankDetails: "Fetching your bank details",
} as const;

export const BANK_CONNECT_FETCHING_SUBTEXT =
    "Please wait while we securely connect to your bank";

export const BANK_CONNECT_PREPARING_OFFER_TITLE = "Preparing your loan offer";
export const BANK_CONNECT_PREPARING_OFFER_SUBTEXT = "This usually takes a few seconds.";

/** Former `ConsentWindowOverlay` copy for BSA while the bank consent popup is open. */
export const BSA_CONSENT_WAIT_TITLE = "Complete bank consent in the new window";
export const BSA_CONSENT_WAIT_SUBTITLE =
    "This screen is locked until the bank window closes. Once closed, we will check your bank verification status.";


/** Default Next.js route for the post-offer “continue journey” CTA. */
export const POST_OFFER_CTA_DEFAULT_HREF = "/personal-loan";

export const SITE_NAME = "ZapCash";
export const SITE_URL = "https://zapcash.in"
export const OG_IMAGE_URL =
  "https://zapcash-assets.s3.ap-south-1.amazonaws.com/zapcash-og-image.jpg";
