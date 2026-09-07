import { apiPath } from "./api-config";

export const API_ENDPOINTS = {
  auth: {
    checkOtpSignupLogin: "/auth/sessions",
    dsaSession: "/auth/sessions/dsa",
    importGoogleContacts: "/auth/contacts/google",
    refreshToken: "/auth/tokens/refresh",
    logout: "/auth/sessions/logout",
  },
  otp: {
    generate: "/otp",
    verify: "/otp/verify",
  },
  app: {
    placeholderStartup: "/app/startup",
    updateCheck: "/app-update",
  },
  external: {
    getHyperKycAccessToken: "/external/hyperkyc/token",
    getHyperKycApiResults: "/external/hyperkyc/results",
    getAdhaarImage: "/external/digilocker/aadhar-image",
    digilockerInitiate: "/external/digilocker/sessions",
    digilockerStatus: "/external/digilocker/status",
    emailVerify: "/external/email/verifications",
    emailCheckOtp: "/external/email/otp-verify",
    externalAppConfig: "/external/config",
    encryptionStatus: "/external/encryption",
  },
  user: {
    getSalaryAccounts: "/user/salary-accounts",
    personalDetailsV2: "/user/personal-details",
    getPersonalDetails: "/user/personal-details",
    getGoogleContacts: "/user/google-contacts",
    postEmploymentType: "/user/employment-type",
    postEmploymentDetails: "/user/employment-details",
    getEmploymentDetails: "/user/employment-details",
    getUserEligibilityExperian: "/user/eligibility/experian",
    getTempUrl: "/user/bank-statement/consent-url",
    getUserBankStatementStatus: "/user/bank-statement/status",
    getPendingBsaStatus: "/user/bank-statement/pending-status",
    uploadBankStatement: "/user/bank-statement",
    postBankDetails: "/user/bank-details",
    postReferenceDetails: "/user/references",
    postContactDetails: "/user/contacts",
    getContactDetails: "/user/contacts",
    verifyOfficeEmail: "/user/office-email/verification",
    verifyPersonalEmail: "/user/personal-email/verification",
    postResidenceAddress: "/user/address/residence",
    postFamilyDetails: "/user/family-details",
    getUserStage: "/user/stage",
    saveUserSms: "/user/save-user-sms",
    saveAppInfo: "/user/save-app-info",
    setFcmToken: "/user/set-fcm-token",
    requestNoc: "/user/noc-request",
  },
  documentRequests: {
    getDocumentRequests: "/document-requests",
    uploadDocumentRequest: "/document-requests",
    uploadDocumentRequestAttachments: "/document-requests/:requestId/attachments",
  },
  loans: {
    getLoanId: "/loans/id",
    applyLoan: "/loans/applications",
    generateAgreementAutomatic: "/loans/:id/agreement",
    getAllUserLoans: "/loans",
    getExistingActiveLoan: "/loans/active",
    cancelEligibility: "/loans/:loanId/cancel-eligibility",
    cancelLoan: "/loans/:loanId/cancel",
  },
  offer: {
    currentOffer: "/offer/current",
    acceptOffer: "/offer/acceptance",
  },
  mandates: {
    createMandate: "/mandates",
    getMandateDetails: "/mandates/user",
    shouldStopBeforeNach: "/mandates/should-stop-before-nach",
  },
  sanction: {
    initiateDoqfy: "/sanction/doqfy/sessions",
    esignStatus: "/sanction/esign/status",
  },
  disburse: {
    initiate: "/disburse/disbursals",
  },
  payment: {
    createOrder: "/payment/orders",
    createPaymentOrder: "/payment/transactions",
    generateAndSendPaymentLink: "/payment/generate-payment-link",
    orderStatus: "/payment/order-status",
  },
  cbl: {
    getRedirectionStage: "/cbl/stage",
  },
  admin: {
    getBureauMocks: "/admin/mocks/bureau",
    getPanMocks: "/admin/mocks/pan",
  },
  test: {
    getEncryptedUserById: "/_test/users/:encryptedPayload",
  },
} as const;

export function endpointPath(endpoint: string): string {
  return apiPath(endpoint);
}

export function resolveEndpoint(
  template: string,
  params: Record<string, string | number>
): string {
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replace(`:${key}`, encodeURIComponent(String(value)));
  }, template);
}
