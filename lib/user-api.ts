import { apiFetchWithAuth } from "./api";
import { API_ENDPOINTS, endpointPath } from "./api-endpoints";
import type {
  GetContactDetailsResponse,
  PostContactDetailsRequest,
  PostContactDetailsResponse,
  SendEmailOtpRequest,
  SendEmailOtpResponse,
  VerifyEmailOtpRequest,
  VerifyEmailOtpResponse,
} from "./kyc-contact-types";
import type { UserStageSectionsCompleted } from "./user-stage";

export type GetUserStageContext = {
  offerStatus?: string;
  offerSource?: string;
  showUpdateButton?: boolean;
};

export type SectionsCompletedBeforeOffer = {
  isPersonalDetailsFilled?: boolean;
  isEmploymentDetailsFilled?: boolean;
  isSoftPullCompleted?: boolean;
};

export type GetUserStageResponse = {
  showDashboard: boolean;
  stage: string;
  bankStatementStatus?: string;
  context?: GetUserStageContext;
  sectionsCompletedBeforeOffer?: SectionsCompletedBeforeOffer;
  sectionsCompleted?: UserStageSectionsCompleted;
};

export type GetUserStageParams = {
  device?: "web" | "android" | "ios";
};

export async function getUserStage(
  params?: GetUserStageParams
): Promise<GetUserStageResponse> {
  const searchParams: Record<string, string> = {};
  if (params?.device) {
    searchParams.device = params.device;
  }
  return apiFetchWithAuth<GetUserStageResponse>(
    endpointPath(API_ENDPOINTS.user.getUserStage),
    {
      method: "GET",
      ...(Object.keys(searchParams).length > 0 && { params: searchParams }),
    }
  );
}

/** GET /api/v1/user/personal-details — flat user profile object */
export type GetPersonalDetailsResponse = {
  userId?: string;
  phoneNumber?: string;
  /** Some backends send a single full name instead of first/middle/last */
  fullName?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  pincode?: string;
  pan?: string;
  dob?: string;
  employmentMode?: string;
  declaredSalaryDay?: number;
  salary?: number;
  salaryMode?: string;
  organization?: string;
  email?: string;
  officeEmail?: string;
  alternate_mobile?: string;
  hasNoActiveLoan?: boolean;
  disableFields?: boolean;
  isOauthDone?: boolean;
  softPullConsentWithdrawn?: boolean;
  designation?: string;
  enableFullWebJourneyOverride?: boolean;
};

export async function getPersonalDetails(): Promise<GetPersonalDetailsResponse> {
  return apiFetchWithAuth<GetPersonalDetailsResponse>(
    endpointPath(API_ENDPOINTS.user.getPersonalDetails)
  );
}

export type PostPersonalDetailsPayload = {
  pincode: string;
  pan: string;
  dob: string;
  salary: number;
  gender?: string;
  employmentMode: "salaried" | "self-employed";
  declaredSalaryDay?: number;
  organization?: string;
  geolocation?: { latitude: number; longitude: number };
};

export type PostPersonalDetailsResponse = {
  message?: string;
  success?: boolean;
  isEligible?: boolean;
  userId?: string;
  loanAmount?: number;
  rejectionReason?: {
    age: boolean;
    income: boolean;
    pincode: boolean;
    loanRestriction: boolean;
  };
};

export async function postPersonalDetails(
  payload: PostPersonalDetailsPayload
): Promise<PostPersonalDetailsResponse> {
  return apiFetchWithAuth<PostPersonalDetailsResponse>(
    endpointPath(API_ENDPOINTS.user.personalDetailsV2),
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export type PostEmploymentDetailsPayload = {
  employmentMode: "salaried" | "self-employed";
  declaredSalaryDay?: number;
  organization?: string;
  organizationName?: string;
  deviceType?: string;
};

export type PostEmploymentDetailsResponse = {
  message?: string;
  success?: boolean;
  isEligible?: boolean;
  userId?: string;
  rejectionReason?: {
    loanRestriction: boolean;
    selfEmployed: boolean;
  };
};

export async function postEmploymentDetails(
  payload: PostEmploymentDetailsPayload
): Promise<PostEmploymentDetailsResponse> {
  return apiFetchWithAuth<PostEmploymentDetailsResponse>(
    endpointPath(API_ENDPOINTS.user.postEmploymentDetails),
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export type PostResidenceAddressPayload = {
  addressLine1: string;
  addressLine2: string;
  pinCode: string;
  city: string;
  state: string;
};

export type PostResidenceAddressResponse = {
  message?: string;
  success?: boolean;
};

export async function postResidenceAddress(
  payload: PostResidenceAddressPayload
): Promise<PostResidenceAddressResponse> {
  return apiFetchWithAuth<PostResidenceAddressResponse>(
    endpointPath(API_ENDPOINTS.user.postResidenceAddress),
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export type PostFamilyDetailsPayload = {
  familyMember: {
    name: string;
    relation: string;
    mobile: string;
  };
};

export type PostFamilyDetailsResponse = {
  message?: string;
  success?: boolean;
};

export async function postFamilyDetails(
  payload: PostFamilyDetailsPayload
): Promise<PostFamilyDetailsResponse> {
  return apiFetchWithAuth<PostFamilyDetailsResponse>(
    endpointPath(API_ENDPOINTS.user.postFamilyDetails),
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export type ReferenceContact = {
  name: string;
  mobile: string;
  relationship: string;
};

export type PostReferenceDetailsPayload = {
  reference1: ReferenceContact;
  reference2: ReferenceContact;
};

export type PostReferenceDetailsResponse = {
  message?: string;
  success?: boolean;
};

export async function postReferenceDetails(
  payload: PostReferenceDetailsPayload
): Promise<PostReferenceDetailsResponse> {
  return apiFetchWithAuth<PostReferenceDetailsResponse>(
    endpointPath(API_ENDPOINTS.user.postReferenceDetails),
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export type BankAccountType = "savings" | "current";

export type PostBankDetailsPayload = {
  accountNumber: string;
  confirmAccountNumber: string;
  accountHolderName: string;
  accountType: BankAccountType;
  ifscCode: string;
  bankName: string;
  branchName: string;
};

export type PostBankDetailsResponse = {
  message?: string;
  success?: boolean;
};

export async function postBankDetails(
  payload: PostBankDetailsPayload
): Promise<PostBankDetailsResponse> {
  return apiFetchWithAuth<PostBankDetailsResponse>(
    endpointPath(API_ENDPOINTS.user.postBankDetails),
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export type {
  ContactFieldOptions,
  ContactDetails,
  GetContactDetailsResponse,
  PostContactDetailsRequest,
  PostContactDetailsResponse,
  SendEmailOtpRequest,
  SendEmailOtpResponse,
  VerifyEmailOtpRequest,
  VerifyEmailOtpResponse,
  VerifyTarget,
} from "./kyc-contact-types";

export async function getContactDetails(): Promise<GetContactDetailsResponse> {
  return apiFetchWithAuth<GetContactDetailsResponse>(
    endpointPath(API_ENDPOINTS.user.getContactDetails)
  );
}

export async function postContactDetails(
  payload: PostContactDetailsRequest
): Promise<PostContactDetailsResponse> {
  return apiFetchWithAuth<PostContactDetailsResponse>(
    endpointPath(API_ENDPOINTS.user.postContactDetails),
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function sendEmailOtp(
  payload: SendEmailOtpRequest
): Promise<SendEmailOtpResponse> {
  return apiFetchWithAuth<SendEmailOtpResponse>(
    endpointPath(API_ENDPOINTS.external.emailVerify),
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function verifyEmailOtp(
  payload: VerifyEmailOtpRequest
): Promise<VerifyEmailOtpResponse> {
  return apiFetchWithAuth<VerifyEmailOtpResponse>(
    endpointPath(API_ENDPOINTS.external.emailCheckOtp),
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}
