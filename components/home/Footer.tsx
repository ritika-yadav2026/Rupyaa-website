"use client";

import Image from "next/image";
import Link from "next/link";
import EmSignSecuritySeal from "@/components/EmSignSecuritySeal";
import { appShellContainerClassName } from "@/lib/app-shell-layout";

const PRODUCT_LINKS = [
  { href: "/personal-loan", label: "Personal Loan" },
  // { href: "/credit-score", label: "Credit Score" },
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
  // { href: "#", label: "Cookie Notice" },
  // { href: "#", label: "Copyright Policy" },
  // { href: "#", label: "Data Policy" },
] as const;

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/profile.php?id=61587821694569", label: "Facebook", icon: "facebook" },
  { href: "https://www.instagram.com/zapcash.in/", label: "Instagram", icon: "instagram" },
  { href: "https://www.linkedin.com/company/zapcash-in/?viewAsMember=true", label: "LinkedIn", icon: "linkedin" },
] as const;

function SocialIcon({ icon }: { icon: string }) {
  const className = "w-5 h-5";
  switch (icon) {
    case "twitter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return null;
  }
}

function ProductColumn({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div className="flex flex-col">
      <h3 className="text-sm font-bold text-gray-900 mb-4">{title}</h3>
      <nav className="flex flex-col gap-3">
        {links.map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-10">
      <div className={`${appShellContainerClassName} pb-12 sm:pb-16 lg:pb-20`}>
        <div className="flex flex-col md:flex-row md:flex-wrap lg:flex-nowrap lg:items-start lg:justify-between gap-8 md:gap-10 lg:gap-16">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <Image
                src="/images/logo.png"
                alt="ZapCash"
                width={160}
                height={48}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>

            {/* <EmSignSecuritySeal /> */}
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-6 sm:gap-12 md:gap-16 lg:gap-24">
            <ProductColumn title="Products" links={PRODUCT_LINKS} />
            <ProductColumn title="Quick Links" links={QUICK_LINKS} />
            <ProductColumn title="Policies" links={POLICY_LINKS} />
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col items-center text-center">
          <div className="flex justify-center gap-4 mb-6">
            {SOCIAL_LINKS.map(({ href, label, icon }) => (
              <a
                key={icon}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors"
              >
                <SocialIcon icon={icon} />
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-4">A brand by Omnistack Innovation Private Limited</p>
          <nav className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4 gap-y-2 mb-4 text-sm text-gray-500">
            {LEGAL_LINKS.map(({ href, label }, index) => (
              <span key={label} className="flex items-center">
                {index > 0 && <span className="text-gray-300 mx-1 sm:mx-2">|</span>}
                <Link href={href} className="hover:text-gray-700 transition-colors">
                  {label}
                </Link>
              </span>
            ))}
          </nav>
          <p className="text-sm text-gray-500">© 2026 OMNISTACK INNOVATION PRIVATE LIMITED. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
