import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./LoanHighlightsSection.module.css";

const TRANSPARENCY_CARDS = [
  {
    title: "Loan Amount",
    value: "₹5,000 to ₹5,00,000",
    iconSrc: "/images/loan-amount.png",
    iconAlt: "Loan amount icon",
  },
  {
    title: "Tenure",
    value: "Up to 60 months",
    iconSrc: "/images/tenure.png",
    iconAlt: "Tenure icon",
  },
  {
    title: "Maximum APR",
    value: "Up to 45% per annum",
    iconSrc: "/images/interest-rate.png",
    iconAlt: "Interest rate icon",
  },
] as const;

type WhatYouNeedIconType = "personal" | "income" | "identity" | "face";

const WHAT_YOU_NEED_ITEMS: ReadonlyArray<{
  title: string;
  description: string;
  icon: WhatYouNeedIconType;
}> = [
  {
    title: "Personal Details",
    description: "Name, phone, address and employment status.",
    icon: "personal",
  },
  {
    title: "Income Proof",
    description: "Bank statements for the last 3 months (PDF).",
    icon: "income",
  },
  {
    title: "Identity Proof",
    description: "PAN Card and Aadhaar for digital verification.",
    icon: "identity",
  },
  {
    title: "Face KYC",
    description: "A clear selfie taken from the Rupyaa app.",
    icon: "face",
  },
];

function WhatYouNeedIcon({ type }: { type: WhatYouNeedIconType }): ReactElement {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (type === "personal") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2" />
        <path d="M6 16c.6-1.5 1.8-2.2 3-2.2s2.4.7 3 2.2" />
        <path d="M14 9h5M14 12h5M14 15h3" />
      </svg>
    );
  }
  if (type === "income") {
    return (
      <svg {...common}>
        <path d="M7 3h7l5 5v13a0 0 0 0 1 0 0H7a0 0 0 0 1 0 0V3z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 16h6M9 10h3" />
      </svg>
    );
  }
  if (type === "identity") {
    return (
      <svg {...common}>
        <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 12 2.5a7 7 0 0 1 7 7C19 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 18c1-2.5 3.2-3.8 5.5-3.8S16.5 15.5 17.5 18" />
    </svg>
  );
}

export default function LoanHighlightsSection(): ReactElement {
  return (
    <section className={styles.section} aria-label="Loan highlights and application requirements">
      <div className={styles.heading}>
        <h2>Loan Highlights</h2>
        <p>Clear terms. Flexible options. Designed<br />around your needs.</p>
      </div>
      <div className={styles.cards}>
        {TRANSPARENCY_CARDS.map((card) => (
          <article key={card.title} className={styles.card}>
            <span className={styles.highlightIcon}>
              <Image src={card.iconSrc} alt={card.iconAlt} width={24} height={24} />
            </span>
            <h3>{card.title}</h3>
            <p>{card.value}</p>
          </article>
        ))}
      </div>
      <div className={styles.requirements}>
        <div className={styles.intro}>
          <h2>What You’ll Need</h2>
          <p>Keep these ready for a faster, paperless application.</p>
          <Link href="/auth" className={styles.apply}>Start Application</Link>
        </div>
        <ul className={styles.items}>
          {WHAT_YOU_NEED_ITEMS.map((item) => (
            <li key={item.title}>
              <span className={styles.requirementIcon}><WhatYouNeedIcon type={item.icon} /></span>
              <div><h3>{item.title}</h3><p>{item.description}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
