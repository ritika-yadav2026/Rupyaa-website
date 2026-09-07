import type {
  ContactFieldOption,
  ContactFieldOptions,
  ContactDetails,
  GetContactDetailsResponse,
  PostContactDetailsRequest,
} from "@/lib/kyc-contact-types";

/** Normalize GET /user/contacts body to flat contact fields + options. */
export function normalizeGetContactDetailsResponse(
  raw: GetContactDetailsResponse
): { details: ContactDetails; contactFieldOptions: GetContactDetailsResponse["contactFieldOptions"] } {
  const nested = raw.contactDetails;
  const rawFieldOptions = (raw as { contactFieldOptions?: Record<string, ContactFieldOption> })
    .contactFieldOptions;

  const pickOption = (...keys: string[]): ContactFieldOption | undefined => {
    if (!rawFieldOptions) return undefined;
    for (const key of keys) {
      const option = rawFieldOptions[key];
      if (option) return option;
    }
    return undefined;
  };

  const normalizedFieldOptions: ContactFieldOptions | undefined = rawFieldOptions
    ? {
        personalEmail: pickOption("personalEmail", "personal_email", "email"),
        officeEmail: pickOption("officeEmail", "office_email"),
        alternateMobile: pickOption("alternateMobile", "alternate_mobile", "alternateNumber"),
      }
    : undefined;

  const details: ContactDetails = {
    email: nested?.email ?? raw.email,
    alternate_mobile: nested?.alternate_mobile ?? raw.alternate_mobile,
    officeEmail: nested?.officeEmail ?? raw.officeEmail,
  };
  return { details, contactFieldOptions: normalizedFieldOptions };
}

export function mapContactDetailsToApi(input: {
  email: string;
  alternate_mobile: string;
  officeEmail: string;
}): PostContactDetailsRequest {
  const email = input.email.trim();
  const altDigits = input.alternate_mobile.replace(/\D/g, "").slice(0, 10);
  const office = input.officeEmail.trim();
  const out: PostContactDetailsRequest = { email };
  if (altDigits.length > 0) {
    out.alternate_mobile = altDigits;
  }
  if (office.length > 0) {
    out.officeEmail = office;
  }
  return out;
}

/** Schema-style: alternate empty or 10 digits starting 1–9 */
const ALT_SCHEMA_REGEX = /^[1-9]\d{9}$/;

/** CTA / proceed: alternate must match 6–9 start when non-empty */
const ALT_CTA_REGEX = /^[6-9]\d{9}$/;

export function validateAlternateMobileSchema(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return null;
  if (!ALT_SCHEMA_REGEX.test(digits)) {
    return "Enter a valid 10-digit alternate mobile";
  }
  return null;
}

export function isAlternateMobileValidForProceed(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return true;
  return ALT_CTA_REGEX.test(digits);
}
