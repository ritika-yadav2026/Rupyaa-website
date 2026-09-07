'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dashboard from "@/public/icons/dashboard.png";
import profile from "@/public/icons/profile.png";
import list from "@/public/icons/list.png";
import document from "@/public/icons/document.png";
import rocket from "@/public/icons/rocket.png";
import customer from "@/public/icons/customer_care.png";
import AppStoreBadge from "@/components/AppStoreBadge";
import GooglePlayBadge from "@/components/GooglePlayBadge";
import { useSidebarStore } from "@/store/useSidebarStore";
import logo from '@/public/logo.png'

const navLinks = [
  { href: "/personal-loan", label: "Dashboard", icon: dashboard },
  { href: "/profile", label: "My Profile", icon: profile },
  { href: "/loan-applications", label: "All Loan Application", icon: list },
  // { href: "/active-loan", label: "Active Loan & Repay", icon: "/icons/rupee.svg" },
  { href: "/document-requests", label: "Document Requests", icon: document },
  // { href: "/credit-score", label: "Credit Score", icon: rocket },
  { href: "/support", label: "Support", icon: customer },
  { href: "/privacy-policy", label: "Privacy Policy", icon: document },
];

export default function SideBar() {
  const pathname = usePathname();
  const isOpen = useSidebarStore((s) => s.isOpen);
  const close = useSidebarStore((s) => s.close);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
        aria-hidden={!isOpen}
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
        onClick={close}
      />
      <aside
        className={`
          flex flex-col w-[250px] min-w-[250px] h-screen p-2 gap-5 border-r border-gray-200 bg-white
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Link href="/personal-loan" className="flex items-center px-2 py-3 gap-2">
          <Image src={logo} alt="ZapCash" width={120} height={120} className="object-contain" />
          {/* <span className="text-xl font-bold text-primary">ZapCash</span>      */}
        </Link>
        <nav className="flex flex-col gap-2 pl-3 *:transition-all duration-200 flex-1">
          {navLinks.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                onClick={close}
                className={`flex items-center gap-2 text-[14px] pl-1 py-2 rounded-r min-h-[44px] ${
                  isActive ? "bg-[#00652514] text-primary border-l-4 border-l-primary" : "text-gray-700 hover:bg-[#00652514] hover:border-l-4 hover:border-l-primary"
                }`}
              >
                <Image className="w-4 h-4 shrink-0" src={icon} alt="" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 mt-auto border-t border-gray-100">
          <p className="text-xs font-medium text-gray-600 mb-2">Download the app to get started</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
            <GooglePlayBadge />
            <AppStoreBadge />
          </div>
        </div>
      </aside>
    </>
  );
}
