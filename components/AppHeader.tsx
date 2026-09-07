"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { appShellContainerClassName } from "@/lib/app-shell-layout";
import { useAuthLoggedInHint } from "@/hooks/use-auth-logged-in-hint";
import { useAuthStore } from "@/store/useAuthStore";
import { STRING_CONSTANTS } from "@/utils/app-constants";

const NAV_LINKS = [
  { href: "/personal-loan", label: "Personal Loan" },
  { href: "/emi-calculator", label: "EMI Calculator" },
  { href: "/credit-score", label: "Credit Score" },
  { href: "/blog/", label: "Blogs" },
  { href: "/support", label: "Support" },
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

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const HEADER_GRADIENT =
  "radial-gradient(ellipse at left bottom, rgba(0, 101, 37, 0.18) 0%, rgba(0, 101, 37, 0.06) 35%, rgba(255,255,255,0) 65%), radial-gradient(ellipse at right bottom, rgb(183, 214, 191) 0%, rgba(183, 214, 191, 0.4) 35%, rgba(255,255,255,0) 70%), #e8f3ea";

export default function AppHeader() {
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

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b shadow-sm border-gray-200/40"
      style={{ background: HEADER_GRADIENT }}
    >
      <nav className={`flex items-center justify-between h-16 ${appShellContainerClassName}`}>
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logo.png"
            alt="ZapCash"
            width={130}
            height={130}
            className="object-contain h-8 sm:h-9 md:h-10 w-auto"
          />
          {/* <span className="text-xl font-bold text-gray-900">ZapCash</span> */}
        </Link>
        <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = href.startsWith("/") && pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`text-sm font-medium transition-colors ${isActive ? "text-primary" : "text-gray-900 hover:text-primary"
                  }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {!isLoggedIn && (
            <>
              <a
                href={STRING_CONSTANTS.PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GET IT ON Google Play"
                className="flex size-8 shrink-0 items-center mt-1 justify-center"
              >
                <Image
                  src="/images/google-play-store-icon.webp"
                  alt="Google Play"
                  width={22}
                  height={22}
                  className="size-[23px] shrink-0 object-contain"
                />
              </a>
              <a
                href={STRING_CONSTANTS.APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="flex size-8 shrink-0 items-center justify-center"
              >
                <Image
                  src="/images/apple.png"
                  alt="App Store"
                  width={30}
                  height={30}
                  className="size-[28px] shrink-0 object-contain filter invert"
                />
              </a>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-primary/10"
            aria-label="Menu"
          >
            <MenuIcon />
          </button>
          {isLoggedIn ? (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-primary text-primary hover:bg-primary/5 transition-colors"
                aria-label="My Account"
              >
                <UserIcon />
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 py-2 w-52 sm:w-56 rounded-xl bg-white border border-gray-200 shadow-lg z-50 max-h-[85vh] overflow-y-auto">
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
              )}
            </div>
          ) : (
            <Link
              href={authHref}
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-primary text-white text-sm sm:text-base font-bold  hover:bg-primary/90 active:scale-[0.98] transition-all min-h-[44px] min-w-[96px]"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-16 left-0 right-0 border-t border-gray-200/60 py-4 px-4 sm:px-6 lg:px-8 flex flex-col gap-2"
          style={{ background: HEADER_GRADIENT }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 font-medium text-gray-900 hover:text-primary"
            >
              {label}
            </Link>
          ))}
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 font-medium text-gray-900 hover:text-primary"
              >
                Profile
              </Link>
              <Link
                href="/loan-applications"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 font-medium text-gray-900 hover:text-primary"
              >
                Loan Applications
              </Link>
              <Link
                href="/document-requests"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 font-medium text-gray-900 hover:text-primary"
              >
                Document Request
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="py-2 font-medium text-red-500 hover:text-red-600 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href={authHref}
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 inline-flex items-center justify-center w-full py-3 rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/25 hover:bg-primary/90 transition-colors min-h-[48px]"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
