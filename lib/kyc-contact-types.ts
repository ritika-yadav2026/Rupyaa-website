/**
 * Contact details KYC — aligned with mobile `kyc.ts` / registration contracts.
 */

export type ContactFieldOption = {
  show?: boolean;
  required?: boolean;
  verify?: boolean;
};

export type ContactFieldOptions = {
  personalEmail?: ContactFieldOption;
  officeEmail?: ContactFieldOption;
  alternateMobile?: ContactFieldOption;
};

/** Values returned from GET /user/contacts (shape may include nested or flat fields). */
export type ContactDetails = {
  email?: string;
  alternate_mobile?: string;
  officeEmail?: string;
};

export type GetContactDetailsResponse = ContactDetails & {
  contactFieldOptions?: ContactFieldOptions;
  /** Some backends nest details under a key */
  contactDetails?: ContactDetails;
};

export type PostContactDetailsRequest = {
  email: string;
  alternate_mobile?: string;
  officeEmail?: string;
};

export type PostContactDetailsResponse = {
  message?: string;
  success?: boolean;
  isEligible?: boolean;
};

export type SendEmailOtpRequest = {
  email: string;
  isPersonalMail: boolean;
};

export type VerifyEmailOtpRequest = {
  email: string;
  otp: string;
  isPersonalMail: boolean;
};

export type SendEmailOtpResponse = {
  message?: string;
  success?: boolean;
};

export type VerifyEmailOtpResponse = {
  message?: string;
  success?: boolean;
};

/** Maps to OTP payload `isPersonalMail`. */
export type VerifyTarget = "personal" | "office";
