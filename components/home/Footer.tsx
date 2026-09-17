"use client";

import type { ReactElement, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import AppStoreBadge from "@/components/AppStoreBadge";
import GooglePlayBadge from "@/components/GooglePlayBadge";
import HeroSkyline from "@/components/home/HeroSkyline";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import { PERSONAL_LOAN_PAGE_GRADIENT } from "@/lib/personal-loan-page-gradient";

const PRODUCT_LINKS = [
  { href: "/personal-loan", label: "Personal loan" },
] as const;

const QUICK_LINKS = [
  { href: "/blog/", label: "Blogs" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/auth", label: "Apply for Loan" },
  { href: "/support", label: "Raise a complaint" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/lenders", label: "Our Lending Partner" },
] as const;

const POLICY_LINKS = [
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/code-of-conduct", label: "Code of Conduct" },
  { href: "/cancellation-policy", label: "Cancellation Policy" },
  { href: "/grievance-redressal-policy", label: "Grievance Redressal Policy" },
  { href: "/grievance-redressal-mechanism", label: "Grievance Redressal Mechanism" },
  { href: "/recovery-collection-policy", label: "Recovery & Collection Policy" },
] as const;

const LEGAL_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Condition" },
  { href: "/lenders", label: "Our Lending Partner" },
] as const;

const SOCIAL_LINKS = [
  {
    href: "https://www.linkedin.com/company/zapcash-in/?viewAsMember=true",
    label: "LinkedIn",
    icon: "linkedin",
  },
  {
    href: "https://www.facebook.com/profile.php?id=61587821694569",
    label: "Facebook",
    icon: "facebook",
  },
  {
    href: "https://www.instagram.com/zapcash.in/",
    label: "Instagram",
    icon: "instagram",
  },
] as const;

type FooterLink = {
  readonly href: string;
  readonly label: string;
};

function SocialIcon({ icon }: { readonly icon: string }): ReactElement | null {
  const className = "size-5";
  if (icon === "twitter") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (icon === "facebook") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  if (icon === "instagram") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  }
  if (icon === "linkedin") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  return null;
}

function FooterLinkColumn({
  title,
  links,
}: {
  readonly title: string;
  readonly links: readonly FooterLink[];
}): ReactElement {
  return (
    <div className="flex flex-col">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-900">{title}</h3>
      <nav className="flex flex-col gap-3">
        {links.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="text-sm text-gray-500 transition-colors hover:text-gray-900"
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function LegalLinksRow(): ReactElement {
  const desktopItems: ReactNode[] = [];
  LEGAL_LINKS.forEach(({ href, label }, index) => {
    if (index > 0) {
      desktopItems.push(
        <span key={`sep-${label}`} className="mx-2 text-gray-400" aria-hidden>
          |
        </span>
      );
    }
    desktopItems.push(
      <Link
        key={label}
        href={href}
        className="text-sm text-gray-700 transition-colors hover:text-gray-900"
      >
        {label}
      </Link>
    );
  });
  return (
    <>
      <nav
        className="mb-4 flex flex-col items-center gap-2 sm:hidden"
        aria-label="Legal"
      >
        {LEGAL_LINKS.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="text-sm text-gray-700 transition-colors hover:text-gray-900"
          >
            {label}
          </Link>
        ))}
      </nav>
      <nav
        className="mb-4 hidden flex-wrap items-center justify-center sm:flex"
        aria-label="Legal"
      >
        {desktopItems}
      </nav>
    </>
  );
}

/**
 * Site-wide footer: brand + store badges, link columns, socials, and copyright.
 * Uses the same Personal Loan gradient + skyline treatment as the home hero.
 */
export default function Footer(): ReactElement {
  return (
    <footer
      className="relative overflow-hidden bg-white pt-10 sm:pt-12"
      style={{ background: PERSONAL_LOAN_PAGE_GRADIENT }}
    >
      <HeroSkyline />
      <div className={`relative z-[2] ${appShellContainerClassName} pb-10 sm:pb-12 lg:pb-14`}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="flex shrink-0 flex-col gap-5">
            <Link href="/" className="inline-flex w-fit items-center">
              <Image
                src="/images/logo.png"
                alt="Rupyaa"
                width={160}
                height={48}
                className="h-10 w-auto object-contain sm:h-12"
              />
            </Link>
            <div className="hidden flex-col items-start gap-2.5 sm:flex">
              <GooglePlayBadge />
              <AppStoreBadge />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12 lg:flex lg:flex-1 lg:justify-end lg:gap-16 xl:gap-24">
            <FooterLinkColumn title="Product" links={PRODUCT_LINKS} />
            <FooterLinkColumn title="Quick Links" links={QUICK_LINKS} />
            <FooterLinkColumn title="Policies" links={POLICY_LINKS} />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center border-t border-black/10 pt-8 text-center sm:mt-14 sm:pt-10">
          <div className="mb-5 flex items-center justify-center gap-5">
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <a
                key={icon}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-gray-900 transition-opacity hover:opacity-70"
              >
                <SocialIcon icon={icon} />
              </a>
            ))}
          </div>
          <LegalLinksRow />
          <p className="text-sm text-gray-700">© 2026 Rupyaa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
