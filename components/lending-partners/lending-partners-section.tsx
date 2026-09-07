"use client";

import { LendingPartnerCard, type LendingPartner } from "./lending-partner-card";

const LENDING_PARTNERS: LendingPartner[] = [
  {
    name: "Weekline Investment and Trading Company Ltd.",
    logoSrc: "/images/NBFC.png",
    logoAlt: "Weekline Investment and Trading Company Ltd. logo",
    termsUrl: "https://www.weekline.in/terms-conditions.html",
    privacyUrl: "https://www.weekline.in/privacy-policy.html",
    lendingBy: "Weekline Investment",
    grievanceOfficer: "Prashant Kabra",
    address: "79, Ground Floor, World Trade Centre, Barar Lane, New Delhi 110001 India",
    email: "grievance@weekline.in",
    rbiRegisteredNo: "14.01001",
  },
  {
    name: "BMW Fin-Invest Pvt. Ltd.",
    logoSrc: "/images/bmw-mark.webp",
    logoAlt: "BMW Fin-Invest Pvt. Ltd. logo",
    termsUrl: "https://www.bmwfininvest.com/legal/terms",
    privacyUrl: "https://www.bmwfininvest.com/legal/privacy-policy",
    lendingBy: "BMW Fin-Invest Pvt. Ltd.",
    grievanceOfficer: "Sumit Rajan",
    address: "10th Floor, Poddar Point, Block-A, 113, Park Street, Kolkata – 700016",
    email: "grievance@bmwfininvest.in",
    rbiRegisteredNo: "B-05.05626 ",
    imageSize: "max-h-60 max-w-60",
  },
];

/**
 * Section displaying RBI-registered NBFC lending partners.
 */
export default function LendingPartnersSection() {
  return (
    <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20 bg-[#f5fbf4]">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-10 text-center sm:mb-14">
          <h1 className="mb-4 text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl lg:text-[3.2rem]">
            Our <span className="text-primary">Partners</span>
          </h1>
          <p className="mx-auto max-w-3xl text-base font-medium leading-8 text-slate-500 sm:text-[1.05rem]">
            We partner with RBI-registered NBFCs to offer safe and instant personal loans.
          </p>
          <p className="mx-auto mt-1 max-w-3xl text-base font-medium leading-8 text-slate-500 sm:text-[1.05rem]">
            Loan is sanctioned &amp; owned by NBFC
          </p>
        </div>
        <div className="flex flex-col gap-6">
          {LENDING_PARTNERS.map((partner) => (
            <LendingPartnerCard key={partner.name} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}
