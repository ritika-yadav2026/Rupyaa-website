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
  home: buildSeoMetadata({
    title: "Instant Personal Loan up to ₹5 Lakh | ZapCash",
    description:
      "Need quick cash? Apply for a personal loan up to ₹5 Lakh with digital KYC, transparent charges and fast approval. Check eligibility on ZapCash.",
    path: "/",
    keywords: [
      "instant personal loan app",
      "personal loan online",
      "quick personal loan India",
    ],
  }),
  personalLoan: buildSeoMetadata({
    title: "Personal Loan up to ₹5 Lakh Online | ZapCash",
    description:
      "Apply online for a personal loan up to ₹5 Lakh. Digital KYC, no collateral, clear fees and repayment details before you accept the offer.",
    path: "/personal-loan",
    keywords: [
      "personal loan up to 5 lakh",
      "instant personal loan",
      "NBFC personal loan",
    ],
  }),
  emiCalculator: buildSeoMetadata({
    title: "Free Personal Loan EMI Calculator - Know Your EMI in 10 Sec",
    description:
      "Find your exact monthly EMI in seconds. Just enter amount, tenure & rate - see your full repayment breakdown instantly. Free ZapCash EMI Calculator.",
    path: "/emi-calculator",
    keywords: ["personal loan EMI calculator", "loan EMI calculator India"],
  }),
  creditScore: buildSeoMetadata({
    title: "Check Credit Score Free — Instant Report Online | ZapCash",
    description:
      "Check your credit score and full report free in under a minute. No impact on your score. Plus what the new RBI weekly reporting rules from July 2026 mean.",
    path: "/credit-score",
    keywords: [
      "credit score check",
      "free credit score India",
      "Equifax credit report",
      "check credit score free",
    ],
  }),
  support: buildSeoMetadata({
    title: "Need Help? Contact ZapCash Support - 24 Hr Response",
    description:
      "Have a question about your loan? Reach ZapCash support via email or call +91 8503090309. Real help, response within 24 hours - no bots, no waiting.",
    path: "/support",
    keywords: ["ZapCash customer support", "loan support contact"],
  }),
  privacyPolicy: buildSeoMetadata({
    title: "ZapCash Privacy Policy - How We Protect Your Data",
    description:
      "See exactly how ZapCash collects, stores, and protects your personal and financial information. Your data, your control.",
    path: "/privacy-policy",
    keywords: ["ZapCash privacy policy"],
  }),
  terms: buildSeoMetadata({
    title: "ZapCash Terms & Conditions - Loan Service Agreement",
    description:
      "Read the full Terms & Conditions for using ZapCash's personal loan app and services before you apply.",
    path: "/terms",
    keywords: ["ZapCash terms and conditions"],
  }),
  lenders: buildSeoMetadata({
    title: "ZapCash Lending Partners - RBI-Registered & Verified",
    description:
      "ZapCash works exclusively with Weekline Investment and Trading Company Ltd, an RBI-registered NBFC. Verify our lender before you borrow.",
    path: "/lenders",
    keywords: ["ZapCash NBFC partner", "Weekline Investment RBI NBFC"],
  }),
  refundPolicy: buildSeoMetadata({
    title: "ZapCash Refund Policy - Fees & Charges Explained",
    description:
      "Understand when and how ZapCash refunds processing fees and charges. Clear terms, no hidden conditions.",
    path: "/refund-policy",
    keywords: ["ZapCash refund policy"],
  }),
  codeOfConduct: buildSeoMetadata({
    title: "ZapCash Code of Conduct - Our Lending Promise",
    description:
      "See ZapCash's commitment to fair, transparent, and responsible lending practices for every borrower.",
    path: "/code-of-conduct",
    keywords: ["ZapCash code of conduct", "responsible lending"],
  }),
  cancellationPolicy: buildSeoMetadata({
    title: "ZapCash Cancellation Policy - Cancel Your Loan Easily",
    description:
      "Changed your mind? Here's exactly how to cancel your ZapCash loan application and what charges may apply.",
    path: "/cancellation-policy",
    keywords: ["ZapCash loan cancellation policy"],
  }),
  grievanceRedressalPolicy: buildSeoMetadata({
    title: "ZapCash Grievance Redressal Policy - File a Complaint",
    description:
      "Not satisfied with how your issue was handled? Learn how to escalate a complaint with ZapCash's Grievance Redressal Policy.",
    path: "/grievance-redressal-policy",
    keywords: ["ZapCash grievance redressal", "loan complaint"],
  }),
  grievanceRedressalMechanism: buildSeoMetadata({
    title: "ZapCash Grievance Officer - Escalate an Unresolved Issue",
    description:
      "Still unresolved? Contact ZapCash's designated Grievance Officer directly for complaints that need urgent escalation.",
    path: "/grievance-redressal-mechanism",
    keywords: ["ZapCash grievance officer", "loan complaint escalation"],
  }),
  recoveryCollectionPolicy: buildSeoMetadata({
    title: "ZapCash Recovery Policy - Late Payment Charges Explained",
    description:
      "Missed an EMI? See exactly what late payment charges apply and how ZapCash's recovery process works - no surprises.",
    path: "/recovery-collection-policy",
    keywords: ["ZapCash recovery policy", "late payment charges"],
  }),
} satisfies Record<string, Metadata>;

const seoPathByKey = {
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
 * Resolves SEO values from the public, view-only sheet. Checked-in metadata is
 * always used when Google is unavailable or a sheet field is blank.
 */
export async function getSeoMetadata(key: SeoMetadataKey): Promise<Metadata> {
  const fallback = seoMetadata[key];
  const path = seoPathByKey[key];

  try {
    const sheetRow = (await fetchSheetMetadata()).get(path);
    if (!sheetRow) return fallback;

    return buildSeoMetadata({
      title: normalizeLegacyLoanAmountCopy(
        sheetRow.title || String(fallback.title ?? "ZapCash"),
      ),
      description: normalizeLegacyLoanAmountCopy(
        sheetRow.description || fallback.description || "",
      ),
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
