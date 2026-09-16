"use client";

import type { ReactElement, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export interface LendingPartner {
  imageSize?: string;
  name: string;
  logoSrc: string;
  logoAlt: string;
  termsUrl: string;
  privacyUrl: string;
  lendingBy: string;
  grievanceOfficer: string;
  address: string;
  email: string;
  rbiRegisteredNo: string;
}

interface LendingPartnerCardProps {
  partner: LendingPartner;
}

type DetailIconType = "lending" | "grievance" | "address" | "email" | "rbi";

function DetailIcon({ type }: { readonly type: DetailIconType }): ReactElement {
  const className = "h-5 w-5";
  if (type === "lending") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "grievance") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    );
  }
  if (type === "address") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  if (type === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12h8M12 8v8" strokeLinecap="round" />
    </svg>
  );
}

function DetailItem({
  iconType,
  label,
  value,
  valueClassName = "text-[1.08rem] font-semibold text-slate-800",
}: {
  iconType: DetailIconType;
  label: string;
  value: ReactNode;
  valueClassName?: string;
}): ReactElement {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-button/30 bg-brand-soft text-button">
        <DetailIcon type={iconType} />
      </div>
      <div className="min-w-0">
        <p className="text-[0.82rem] font-medium uppercase tracking-[0.06em] text-slate-500">
          {label}
        </p>
        <div className={valueClassName}>{value}</div>
      </div>
    </div>
  );
}

/**
 * Displays a single lending partner card in the website's public disclosure format.
 */
export function LendingPartnerCard({ partner }: LendingPartnerCardProps): ReactElement {
  const logoClassName = partner.imageSize
    ? `h-auto w-auto max-w-full object-contain ${partner.imageSize}`
    : "h-auto w-full max-w-full object-contain sm:max-w-[460px]";

  return (
    <div className="overflow-hidden rounded-[1rem] border border-brand-border bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
      <div className="grid md:grid-cols-[1fr_0.95fr]">
        <div className="flex min-h-[280px] min-w-0 flex-col justify-between px-5 py-6 sm:min-h-[340px] sm:px-10 sm:py-10 md:min-h-[370px] lg:px-12 lg:py-12">
          <div className="flex min-h-[140px] w-full min-w-0 items-center justify-center sm:min-h-[180px]">
            <Image
              src={partner.logoSrc}
              alt={partner.logoAlt}
              width={760}
              height={186}
              sizes="(max-width: 768px) 100vw, 460px"
              className={logoClassName}
              priority
            />
          </div>

          <div className="mt-8 min-w-0">
            <h2 className="break-words text-[1.35rem] font-semibold tracking-[-0.03em] text-slate-900 sm:text-[1.8rem]">
              {partner.name}
            </h2>
            <p className="mt-2 text-[1.05rem] font-medium text-slate-500">
              RBI Registered NBFC
            </p>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
              <Link
                href={partner.termsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.98rem] font-medium text-button hover:underline"
              >
                Terms &amp; Conditions
              </Link>
              <Link
                href={partner.privacyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.98rem] font-medium text-button hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="min-w-0 border-t border-brand-border px-5 py-6 sm:px-10 sm:py-10 md:border-t-0 md:border-l md:px-10 md:py-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-8 bg-button/70" />
            <p className="text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-slate-700">
              Partner Details
            </p>
          </div>

          <div className="space-y-7">
            <DetailItem iconType="lending" label="Lending By" value={partner.lendingBy} />
            <DetailItem
              iconType="grievance"
              label="Grievance Officer (GRO)"
              value={partner.grievanceOfficer}
            />
            <DetailItem
              iconType="address"
              label="Address"
              value={partner.address}
              valueClassName="max-w-md text-[1.06rem] font-medium leading-7 text-slate-800"
            />
            <DetailItem
              iconType="email"
              label="Email Support"
              value={
                <Link href={`mailto:${partner.email}`} className="font-medium text-button hover:underline">
                  {partner.email}
                </Link>
              }
            />
            <DetailItem
              iconType="rbi"
              label="RBI Registered No."
              value={partner.rbiRegisteredNo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
