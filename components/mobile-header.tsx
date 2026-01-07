"use client";

import Image from "next/image";
import logo from "@/public/su-logo.png";
import { Menu, Bell } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useSidebarStore } from "@/stores/sidebar-store";

export default function MobileHeader() {
  const { user } = useUser();
  const toggleMobileMenu = useSidebarStore((state) => state.toggleMobileMenu);

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src={logo} alt="Shipping Updates" className="h-8 w-8" />
          <span className="font-semibold text-gray-800">Shipping Updates</span>
        </div>

        {/* Right side - Notification and Profile */}
        <div className="flex items-center gap-2">
          {/* Notification Icon */}
          <button
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile Icon */}
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-sm">
                {user?.firstName?.[0] || "U"}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
