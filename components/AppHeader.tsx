"use client";

import { useState, useRef, useEffect, type ReactElement, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import { useAuthLoggedInHint } from "@/hooks/use-auth-logged-in-hint";
import { useAuthStore } from "@/store/useAuthStore";
import { STRING_CONSTANTS } from "@/utils/app-constants";
import { IMAGES } from "@/lib/images";
import AppButton from "@/components/app-button";
import { cn } from "@/utils/cn-utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/personal-loan", label: "Personal Loan" },
  { href: "/credit-score", label: "Credit Score" },
  { href: "/blog/", label: "Blogs" },
  { href: "/support", label: "Support" },
] as const;

function MenuIcon(): ReactElement {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function UserIcon(): ReactElement {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/**
 * Returns whether the current pathname matches a header nav href.
 */
function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  if (href.endsWith("/")) {
    return pathname === href || pathname.startsWith(href);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function StoreBadges(): ReactElement {
  return (
    <>
      <a
        href={STRING_CONSTANTS.PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GET IT ON Google Play"
        className="flex size-9 shrink-0 items-center justify-center"
      >
        <Image
          src="/images/google-play-store-icon.webp"
          alt="Google Play"
          width={24}
          height={24}
          className="size-6 shrink-0 object-contain"
        />
      </a>
      {/* <a
        href={STRING_CONSTANTS.APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
        className="flex size-9 shrink-0 items-center justify-center"
      >
        <Image
          src="/images/apple.png"
          alt="App Store"
          width={28}
          height={28}
          className="size-7 shrink-0 object-contain"
        />
      </a> */}
    </>
  );
}

/**
 * Site-wide header: logo | centered nav | store icons + Login (or account).
 */
export default function AppHeader(): ReactElement {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isLoggedIn } = useAuthLoggedInHint();
  const logout = useAuthStore((s) => s.logout);
  const authHref = `/auth?returnTo=${encodeURIComponent(pathname)}`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    router.replace("/");
  };

  let accountOrLogin: ReactNode;
  if (isLoggedIn) {
    let accountMenu: ReactNode = null;
    if (accountMenuOpen) {
      accountMenu = (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-[85vh] w-52 overflow-y-auto rounded-xl border border-gray-200 bg-white py-2 shadow-lg sm:w-56">
          <Link
            href="/profile"
            onClick={() => setAccountMenuOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Profile
          </Link>
          <Link
            href="/loan-applications"
            onClick={() => setAccountMenuOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Loan Applications
          </Link>
          <Link
            href="/document-requests"
            onClick={() => setAccountMenuOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Document Request
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      );
    }
    accountOrLogin = (
      <div className="relative hidden md:block" ref={menuRef}>
        <AppButton
          type="button"
          variant="secondary"
          className="!min-h-0 size-9 rounded-full border-2 p-0"
          onClick={() => setAccountMenuOpen(!accountMenuOpen)}
          aria-label="My Account"
        >
          <UserIcon />
        </AppButton>
        {accountMenu}
      </div>
    );
  } else {
    accountOrLogin = (
      <AppButton
        type="button"
        className="hidden md:inline-flex"
        onClick={() => router.push(authHref)}
      >
        Login
      </AppButton>
    );
  }

  let mobileMenu: ReactNode = null;
  if (mobileMenuOpen) {
    let mobileAuthLinks: ReactNode;
    if (isLoggedIn) {
      mobileAuthLinks = (
        <>
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 font-medium text-gray-900"
          >
            Profile
          </Link>
          <Link
            href="/loan-applications"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 font-medium text-gray-900"
          >
            Loan Applications
          </Link>
          <Link
            href="/document-requests"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 font-medium text-gray-900"
          >
            Document Request
          </Link>
          <button
            type="button"
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
            className="py-2 text-left font-medium text-red-500 hover:text-red-600"
          >
            Logout
          </button>
        </>
      );
    } else {
      mobileAuthLinks = (
        <AppButton
          type="button"
          fullWidth
          className="mt-2"
          onClick={() => {
            setMobileMenuOpen(false);
            router.push(authHref);
          }}
        >
          Login
        </AppButton>
      );
    }

    mobileMenu = (
      <div className="absolute left-0 right-0 top-16 flex flex-col gap-1 border-t border-gray-100 bg-white px-4 py-4 sm:px-6 md:hidden lg:px-8">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = isNavLinkActive(pathname, href);
          let linkClassName =
            "border-b-2 border-transparent py-2 text-sm font-medium text-gray-500";
          if (isActive) {
            linkClassName =
              "border-b-2 border-gray-900 py-2 text-sm font-semibold text-gray-900";
          }
          return (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className={linkClassName}
            >
              {label}
            </Link>
          );
        })}
        <div className="mt-2 flex items-center gap-3">
          <StoreBadges />
        </div>
        {mobileAuthLinks}
      </div>
    );
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-gray-100 bg-white">
      <nav
        className={cn(
          "grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]",
          appShellContainerClassName
        )}
      >
        <Link href="/" className="flex shrink-0 items-center justify-self-start">
          <Image
            src={IMAGES.logo.src}
            alt="Rupyaa"
            width={130}
            height={40}
            className="h-8 w-auto object-contain sm:h-9 md:h-10"
            priority
          />
        </Link>

        <div className="hidden items-center justify-center gap-6 justify-self-center md:flex lg:gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = isNavLinkActive(pathname, href);
            let linkClassName =
              "border-b-2 border-transparent pb-0.5 text-[15px] font-medium text-gray-500 transition-colors hover:text-gray-900";
            if (isActive) {
              linkClassName =
                "border-b-2 border-gray-900 pb-0.5 text-[15px] font-semibold text-gray-900";
            }
            return (
              <Link key={label} href={href} className={linkClassName}>
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2 justify-self-end sm:gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <StoreBadges />
          </div>
          <AppButton
            type="button"
            variant="ghost"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 !text-gray-700 hover:bg-gray-100 hover:no-underline md:hidden"
            aria-label="Menu"
          >
            <MenuIcon />
          </AppButton>
          {accountOrLogin}
        </div>
      </nav>
      {mobileMenu}
    </header>
  );
}
