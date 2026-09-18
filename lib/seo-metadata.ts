import { OG_IMAGE_URL, SITE_NAME, SITE_URL } from "@/utils/app-constants";
import type { Metadata } from "next";

type SeoConfig = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

type SeoMetadataKey = keyof typeof seoMetadata;

type SheetSeoRow = {
  path: string;
  title: string;
  description: string;
  keywords: string[];
};

const SEO_SHEET_ID =
  process.env.SEO_METADATA_SHEET_ID ??
  "1nr5SdPUbxT_3iAoWtDdOfd4QBbx9UaDDiFiuwcqEPOo";
const SEO_SHEET_GID = process.env.SEO_METADATA_SHEET_GID ?? "0";
const SEO_SHEET_REVALIDATE_SECONDS = 300;

export function buildSeoMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false,
}: SeoConfig): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${SITE_URL}${path}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: OG_IMAGE_URL,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_URL],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export const seoMetadata = {
  auth: buildSeoMetadata({
    title: "Login to Your Rupyaa Account Securely Right Now Here",
    description:
      "Sign in to your Rupyaa account to manage your personal loan, track your application status & check your credit score. Log in securely to your account now!",
    path: "/auth",
  }),
  home: buildSeoMetadata({
    title: "Instant Personal Loan Online – Fast Approval | Rupyaa",
    description:
      "Get an instant personal loan online with Rupyaa. Quick eligibility checks, minimal paperwork & fast disbursal. Apply now to get funds in your account today!",
    path: "/",
    keywords: [
      "instant personal loan app",
      "personal loan online",
      "quick personal loan India",
    ],
  }),
  personalLoan: buildSeoMetadata({
    title: "Personal Loan Online – Instant Approval Today | Rupyaa",
    description:
      "Apply for a personal loan online with Rupyaa. Enjoy low interest rates, quick approval & same-day disbursal. Check your eligibility and apply online now!",
    path: "/personal-loan",
    keywords: [
      "personal loan up to 5 lakh",
      "instant personal loan",
      "NBFC personal loan",
    ],
  }),
  emiCalculator: buildSeoMetadata({
    title: "Personal Loan EMI Calculator – Plan Online | Rupyaa",
    description:
      "Plan your repayments with Rupyaa's free EMI calculator. Enter the loan amount, interest rate & tenure to instantly calculate your monthly EMI. Try it now!",
    path: "/emi-calculator",
    keywords: ["personal loan EMI calculator", "loan EMI calculator India"],
  }),
  creditScore: buildSeoMetadata({
    title: "Check Your Free CIBIL Credit Score Online | Rupyaa",
    description:
      "Check your free credit score online instantly with Rupyaa. View your CIBIL score, see what affects it & get tips to improve it. Check your score now free!",
    path: "/credit-score",
    keywords: [
      "credit score check",
      "free credit score India",
      "Equifax credit report",
      "check credit score free",
    ],
  }),
  support: buildSeoMetadata({
    title: "Customer Support & Help Center for All Users | Rupyaa",
    description:
      "Need help with your loan, EMI or account? Visit Rupyaa's support center for FAQs, contact options & quick assistance from our team. Get help right now!",
    path: "/support",
    keywords: ["Rupyaa customer support", "loan support contact"],
  }),
  privacyPolicy: buildSeoMetadata({
    title: "Privacy Policy – How We Protect Your Data | Rupyaa",
    description:
      "Read Rupyaa's privacy policy to understand how we collect, use, store & protect your personal data on our platform. Learn about your privacy rights here!",
    path: "/privacy-policy",
    keywords: ["Rupyaa privacy policy"],
  }),
  terms: buildSeoMetadata({
    title: "Terms & Conditions of Use for Rupyaa's Services Here",
    description:
      "Review Rupyaa's terms & conditions governing the use of our platform, loan services & website. Read the full terms carefully before you apply for a loan.",
    path: "/terms",
    keywords: ["Rupyaa terms and conditions"],
  }),
  lenders: buildSeoMetadata({
    title: "Our Trusted RBI-Registered Lending Partners | Rupyaa",
    description:
      "Discover Rupyaa's network of RBI-registered lending partners offering fast, secure & fully transparent personal loans across India. View our partners now!",
    path: "/lenders",
    keywords: ["Rupyaa NBFC partner", "Weekline Investment RBI NBFC"],
  }),
  refundPolicy: buildSeoMetadata({
    title: "Refund Policy – Loan Charges & Refund Rules | Rupyaa",
    description:
      "Understand Rupyaa's refund policy, including eligibility criteria, processing timelines & applicable charges for loan refunds. Read the full policy now!",
    path: "/refund-policy",
    keywords: ["Rupyaa refund policy"],
  }),
  codeOfConduct: buildSeoMetadata({
    title: "Code of Conduct & Fair Lending Practices Policy | Rupyaa",
    description:
      "Learn about Rupyaa's code of conduct and fair practice standards that guide our ethical, transparent & responsible lending practices. Read it here now!",
    path: "/code-of-conduct",
    keywords: ["Rupyaa code of conduct", "responsible lending"],
  }),
  cancellationPolicy: buildSeoMetadata({
    title: "Loan Cancellation Policy & Full Process Guide | Rupyaa",
    description:
      "Learn how to cancel your loan application with Rupyaa, including eligibility conditions, timelines & applicable charges. Read the full policy now here!",
    path: "/cancellation-policy",
    keywords: ["Rupyaa loan cancellation policy"],
  }),
  grievanceRedressalPolicy: buildSeoMetadata({
    title: "Grievance Redressal Policy for Our Customers | Rupyaa",
    description:
      "Read Rupyaa's grievance redressal policy to understand how customer complaints are received, reviewed & resolved fairly and promptly. View it now here!",
    path: "/grievance-redressal-policy",
    keywords: ["Rupyaa grievance redressal", "loan complaint"],
  }),
  grievanceRedressalMechanism: buildSeoMetadata({
    title: "Grievance Redressal Mechanism & Full Process | Rupyaa",
    description:
      "Learn how Rupyaa's grievance redressal mechanism works, from filing a complaint to escalation and final resolution. Read the complete process now here!",
    path: "/grievance-redressal-mechanism",
    keywords: ["Rupyaa grievance officer", "loan complaint escalation"],
  }),
  recoveryCollectionPolicy: buildSeoMetadata({
    title: "Recovery & Collection Policy for Our Loans | Rupyaa",
    description:
      "Understand Rupyaa's fair recovery & collection policy covering loan repayments, defaults & recovery practices used. Read the full policy to know more!",
    path: "/recovery-collection-policy",
    keywords: ["Rupyaa recovery policy", "late payment charges"],
  }),
} satisfies Record<string, Metadata>;

const seoPathByKey = {
  auth: "/auth",
  home: "/",
  personalLoan: "/personal-loan",
  emiCalculator: "/emi-calculator",
  creditScore: "/credit-score",
  support: "/support",
  privacyPolicy: "/privacy-policy",
  terms: "/terms",
  lenders: "/lenders",
  refundPolicy: "/refund-policy",
  codeOfConduct: "/code-of-conduct",
  cancellationPolicy: "/cancellation-policy",
  grievanceRedressalPolicy: "/grievance-redressal-policy",
  grievanceRedressalMechanism: "/grievance-redressal-mechanism",
  recoveryCollectionPolicy: "/recovery-collection-policy",
} satisfies Record<SeoMetadataKey, string>;

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (character === '"') {
      if (quoted && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && csv[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((value) => value.trim())) rows.push(row);
  }

  return rows;
}

function normalizePath(value: string): string | undefined {
  try {
    const url = new URL(value, SITE_URL);
    if (url.origin !== new URL(SITE_URL).origin) return undefined;
    const path = url.pathname.replace(/\/+$/, "");
    return path || "/";
  } catch {
    return undefined;
  }
}

function parseSheetRows(csv: string): Map<string, SheetSeoRow> {
  const [headers = [], ...rows] = parseCsv(csv);
  const columns = new Map(
    headers.map((header, index) => [header.trim().toLowerCase(), index]),
  );
  const column = (name: string) => columns.get(name.toLowerCase());
  const urlColumn = column("URL");
  const titleColumn = column("New Meta Title");
  const descriptionColumn = column("New Meta Description");
  const keywordsColumn = column("Target Keywords");

  if (
    urlColumn === undefined ||
    titleColumn === undefined ||
    descriptionColumn === undefined
  ) {
    throw new Error("SEO metadata sheet has unexpected columns");
  }

  const metadataByPath = new Map<string, SheetSeoRow>();
  for (const row of rows) {
    const path = normalizePath(row[urlColumn]?.trim() ?? "");
    if (!path) continue;

    metadataByPath.set(path, {
      path,
      title: row[titleColumn]?.trim() ?? "",
      description: row[descriptionColumn]?.trim() ?? "",
      keywords: (row[keywordsColumn ?? -1] ?? "")
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    });
  }

  return metadataByPath;
}

async function fetchSheetMetadata(): Promise<Map<string, SheetSeoRow>> {
  const url = new URL(
    `https://docs.google.com/spreadsheets/d/${encodeURIComponent(SEO_SHEET_ID)}/export`,
  );
  url.searchParams.set("format", "csv");
  url.searchParams.set("gid", SEO_SHEET_GID);

  const response = await fetch(url, {
    next: { revalidate: SEO_SHEET_REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) {
    throw new Error(`SEO metadata sheet returned ${response.status}`);
  }

  return parseSheetRows(await response.text());
}

function normalizeLegacyLoanAmountCopy(text: string): string {
  return text
    .replace(/₹1 Lakh/gi, "₹5 Lakh")
    .replace(/\b1 Lakh\b/gi, "5 Lakh")
    .replace(/personal loan up to 1 lakh/gi, "personal loan up to 5 lakh");
}

/**
 * Uses the approved, checked-in titles and descriptions. The public sheet may
 * supply keywords; checked-in keywords are used when it is unavailable or blank.
 */
export async function getSeoMetadata(key: SeoMetadataKey): Promise<Metadata> {
  const fallback = seoMetadata[key];
  const path = seoPathByKey[key];

  try {
    const sheetRow = (await fetchSheetMetadata()).get(path);
    if (!sheetRow) return fallback;

    return buildSeoMetadata({
      title: String(fallback.title),
      description: fallback.description || "",
      path,
      keywords:
        sheetRow.keywords.length > 0
          ? sheetRow.keywords.map(normalizeLegacyLoanAmountCopy)
          : Array.isArray(fallback.keywords)
            ? fallback.keywords.map(String)
            : undefined,
    });
  } catch (error) {
    console.error("Unable to load SEO metadata sheet; using fallback", error);
    return fallback;
  }
}
