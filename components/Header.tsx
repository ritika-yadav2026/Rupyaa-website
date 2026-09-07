'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import notification from "@/public/icons/notification.png";
import profile from "@/public/icons/profile.png";
import arrow from "@/public/icons/arrow-down.png";
import { useSidebarStore } from "@/store/useSidebarStore";
import { useAuthStore } from "@/store/useAuthStore";

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function Header() {
  const toggle = useSidebarStore((s) => s.toggle);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowAccountMenu(false);
    router.replace("/auth");
  };

  return (
    <header className="flex justify-between border-b border-gray-200 w-full max-w-[95%] md:w-[95%] mx-auto min-h-[60px] md:min-h-[70px] items-center px-3 md:px-4 gap-2 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={toggle}
          className="md:hidden p-2 -ml-1 rounded-xl hover:bg-[#00652514] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006525]/30 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg md:text-2xl font-semibold truncate">
            Welcome To ZapCash!
          </h2>
        </div>
      </div>
      <div className="flex gap-2 sm:gap-4 shrink-0">
        <button type="button" className="bg-[#0065250F] text-primary p-2 sm:px-3 sm:py-2 rounded-2xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#006525]/30 min-h-[44px] flex items-center justify-center" aria-label="Notifications">
          <Image className="w-4 h-4" src={notification} alt="" />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setShowAccountMenu((v) => !v)}
            className="bg-[#0065250F] text-primary flex gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-2xl text-xs sm:text-sm items-center hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#006525]/30 min-h-[44px]"
          >
            <Image className="w-4 h-4 shrink-0" src={profile} alt="" />
            <span className="hidden sm:inline">My Account</span>
            <Image className="w-4 h-4 shrink-0 hidden sm:block" src={arrow} alt="" />
          </button>
          {showAccountMenu && (
            <div className="absolute right-0 top-full mt-2 py-2 w-40 rounded-xl bg-white border border-gray-200 shadow-lg z-50">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
