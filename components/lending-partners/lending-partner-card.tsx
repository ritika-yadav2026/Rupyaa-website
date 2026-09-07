"use client";

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

function DetailItem({
  iconSrc,
  iconAlt,
  label,
  value,
  valueClassName = "text-[1.08rem] font-semibold text-slate-800",
}: {
  iconSrc: string;
  iconAlt: string;
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/15 text-primary">
        <Image src={iconSrc} alt={iconAlt} width={20} height={20} className="h-5 w-5 object-contain" />
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
export function LendingPartnerCard({ partner }: LendingPartnerCardProps) {
  const logoClassName = partner.imageSize
    ? `h-auto w-auto max-w-full object-contain ${partner.imageSize}`
    : "h-auto w-full max-w-full object-contain sm:max-w-[460px]";

  return (
    <div className="overflow-hidden rounded-[1rem] border border-[#edf0ec] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
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
            <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-slate-900 break-words sm:text-[1.8rem]">
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
                className="text-[0.98rem] font-medium text-primary hover:underline"
              >
                Terms &amp; Conditions
              </Link>
              <Link
                href={partner.privacyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.98rem] font-medium text-primary hover:underline"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="min-w-0 border-t border-[#edf0ec] px-5 py-6 sm:px-10 sm:py-10 md:border-t-0 md:border-l md:px-10 md:py-12">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-8 bg-primary/70" />
            <p className="text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-slate-700">
              Partner Details
            </p>
          </div>

          <div className="space-y-7">
            <DetailItem
              iconSrc="/images/lending.png"
              iconAlt="Lending by icon"
              label="Lending By"
              value={partner.lendingBy}
            />
            <DetailItem
              iconSrc="/images/grievance.png"
              iconAlt="Grievance officer icon"
              label="Grievance Officer (GRO)"
              value={partner.grievanceOfficer}
            />
            <DetailItem
              iconSrc="/images/address.png"
              iconAlt="Address icon"
              label="Address"
              value={partner.address}
              valueClassName="max-w-md text-[1.06rem] font-medium leading-7 text-slate-800"
            />
            <DetailItem
              iconSrc="/images/email.png"
              iconAlt="Email support icon"
              label="Email Support"
              value={
                <Link href={`mailto:${partner.email}`} className="font-medium text-primary hover:underline">
                  {partner.email}
                </Link>
              }
            />
            <DetailItem
              iconSrc="/images/rbi.png"
              iconAlt="RBI registered number icon"
              label="RBI Registered No."
              value={partner.rbiRegisteredNo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
