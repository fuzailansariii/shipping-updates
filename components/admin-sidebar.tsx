"use client";

import Image from "next/image";
import logo from "@/public/su-logo.png";
import {
  House,
  MessageCircleMore,
  ShoppingCart,
  X,
  LogOut,
  Box,
  Users,
  ChartLine,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { useEffect } from "react";
import { useSidebarStore } from "@/stores/sidebar-store";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/button";

export default function AdminSidebar() {
  const pathname = usePathname();
  const isMobileMenuOpen = useSidebarStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useSidebarStore((state) => state.closeMobileMenu);

  const menuList = [
    { icon: House, title: "Overview", link: "/admin" },
    { icon: Box, title: "Orders", link: "/admin/orders" },
    { icon: ShoppingCart, title: "Products", link: "/admin/products" },
    { icon: Users, title: "Customers", link: "/admin/customers" },
    { icon: MessageCircleMore, title: "Messages", link: "/admin/messages" },
    { icon: ChartLine, title: "Analytics", link: "/admin/analytics" },
  ];

  const isActiveRoute = (link: string) => {
    if (link === "/admin") return pathname === "/admin";
    return pathname.startsWith(link);
  };

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  return (
    <>
      {/* Mobile Overlay — only renders when menu is open */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.15 } }}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={closeMobileMenu}
          />
        )}
      </AnimatePresence>

      {/* Sidebar
          - Mobile: fixed, slides in/out via Framer Motion
          - Desktop: static, always visible, CSS overrides any transform
      */}
      <motion.aside
        initial={false}
        animate={{ x: isMobileMenuOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="
          bg-white border-r border-black/6
          h-screen overflow-y-auto overflow-x-hidden
          fixed inset-y-0 left-0 z-50 w-64
          md:static md:transform-none!
        "
      >
        <div className="flex flex-col h-full px-4 md:py-6 py-3">
          {/* Mobile close button */}
          <div className="md:hidden flex justify-end">
            <button
              onClick={closeMobileMenu}
              aria-label="Close menu"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-black/50 hover:bg-black/10 hover:text-white transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Brand */}
          <div className="flex items-center gap-3 px-2 mb-2 md:mb-6">
            <Image
              src={logo}
              alt="Logo"
              className="w-9 h-9 rounded-xl border border-white/10 shrink-0"
            />
            <div>
              <p className="text-sm font-bold text-primary-dark tracking-wide leading-tight">
                SU Admin
              </p>
              <p className="text-[10px] font-semibold text-secondary-dark tracking-widest uppercase">
                Dashboard
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-linear-to-r from-transparent via-black/10 to-transparent mx-1 mb-2" />

          {/* Section Label */}
          <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 px-3 mb-2">
            Navigation
          </p>

          {/* Nav Links */}
          <nav className="flex flex-col gap-0.5 flex-1">
            {menuList.map((menu, index) => {
              const isActive = isActiveRoute(menu.link);
              return (
                <Link
                  key={index}
                  href={menu.link}
                  className={`
                    relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150
                    ${
                      isActive
                        ? "bg-primary-dark/20 text-secondary-dark"
                        : "text-secondary-dark/70 hover:bg-primary-dark/10 hover:text-secondary-dark/60"
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.75 h-[55%] bg-secondary-dark rounded-r-full" />
                  )}
                  <menu.icon
                    size={16}
                    className={`shrink-0 ${isActive ? "text-secondary-dark" : ""}`}
                  />
                  <span>{menu.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-4 mt-2 border-t border-white/6">
            <SignOutButton>
              <Button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-black/20 text-red-600/80 text-sm font-semibold hover:bg-red-500/20 hover:text-red-700 hover:border-red-500/40 transition-all duration-150">
                <LogOut size={14} />
                <span>Sign Out</span>
              </Button>
            </SignOutButton>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
