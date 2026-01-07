"use client";

import Image from "next/image";
import logo from "@/public/su-logo.png";
import {
  FileText,
  House,
  MessageCircleMore,
  ShoppingCart,
  X,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { SignOutButton } from "@clerk/nextjs";
import { useEffect } from "react";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Button } from "./ui/button";

export default function AdminSidebar() {
  const pathname = usePathname();

  // State and actions from Zustand store
  const isMobileMenuOpen = useSidebarStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useSidebarStore((state) => state.closeMobileMenu);

  const menuList = [
    { icon: House, title: "Home", link: "/admin" },
    { icon: FileText, title: "Products", link: "/admin/products" },
    { icon: ShoppingCart, title: "Purchases", link: "/admin/purchases" },
    { icon: MessageCircleMore, title: "Messages", link: "/admin/messages" },
  ];

  const isActiveRoute = (link: string) => {
    if (link === "/admin") return pathname === "/admin";
    return pathname.startsWith(link);
  };

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu if window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen, closeMobileMenu]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          border-r-2 bg-white
          
          /* Mobile: overlay sliding from left */
          md:relative fixed inset-y-0 left-0 z-50
          transition-all duration-300 ease-in-out p-2
          ${
            isMobileMenuOpen
              ? "translate-x-0 w-72"
              : "-translate-x-full md:translate-x-0"
          }
          
          /* Desktop: fixed width */
          md:w-72
          
          /* Height */
          h-screen overflow-y-auto
        `}
      >
        <div className="flex flex-col px-3 py-5 rounded-xl">
          {/* Close button - only on mobile */}
          <div className="md:hidden flex justify-end mb-2">
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-gray-100 border border-primary-dark/50 rounded-lg transition"
              aria-label="Close menu"
            >
              <X className="h-7 w-7 text-gray-600" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-col justify-center items-center">
            <Image
              src={logo}
              alt="Shipping Updates Logo"
              className="w-16 h-16"
            />
          </div>

          <Separator className="mt-5" />

          {/* Menu */}
          <div className="flex flex-col gap-3 my-5 text-neutral-700 mx-3">
            {menuList.map((menu, index) => {
              const isActive = isActiveRoute(menu.link);
              return (
                <Link
                  key={index}
                  href={menu.link}
                  className={`flex gap-2 font-semibold text-base font-nunito items-center rounded-lg transition px-3 py-2 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <menu.icon className={isActive ? "text-indigo-600" : ""} />
                  <span>{menu.title}</span>
                </Link>
              );
            })}
          </div>

          <Separator className="mb-5" />

          {/* Logout Button */}
          <div>
            <SignOutButton>
              <Button
                variant="destructive"
                className="w-full flex justify-center items-center gap-2"
              >
                <span>Logout</span>
                <LogOut size={17} />
              </Button>
            </SignOutButton>
          </div>
        </div>
      </aside>
    </>
  );
}
