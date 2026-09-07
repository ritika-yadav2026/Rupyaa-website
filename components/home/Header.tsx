"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { appShellContainerClassName } from "@/lib/app-shell-layout";

const NAV_LINKS = [
  { href: "/personal-loan", label: "Personal Loan" },
  { href: "/emi-calculator", label: "EMI Calculator" },
  { href: "#credit-score", label: "Credit Score" },
  { href: "#support", label: "Support" },
];

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#e8f5e9] border-b border-gray-200">
      <nav className={`flex items-center justify-between h-16 ${appShellContainerClassName}`}>
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logo.png"
            alt="ZapCash"
            width={120}
            height={40}
            className="object-contain h-8 w-auto"
          />
        </Link>
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-900"
            aria-label="Menu"
          >
            <MenuIcon />
          </button>
          <Link
            href="/auth"
            className="hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-primary text-white text-sm sm:text-base font-bold shadow-md shadow-primary/25 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all min-h-[44px] min-w-[96px]"
          >
            Login
          </Link>
        </div>
      </nav>
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#e8f5e9] border-t border-gray-200 py-4 px-4 sm:px-6 lg:px-8 flex flex-col gap-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-900 py-2 hover:text-gray-700 font-medium"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/auth"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center w-full py-3 rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/25 hover:bg-primary/90 transition-colors min-h-[48px]"
          >
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
