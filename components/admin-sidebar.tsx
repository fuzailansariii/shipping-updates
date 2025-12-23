"use client";

import Image from "next/image";
import logo from "@/public/su-logo.png";
import {
  FileText,
  House,
  MessageCircleMore,
  ShoppingCart,
  Menu,
  X,
  PanelRightClose,
  PanelRightOpen,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { user } = useUser();
  const pathname = usePathname();

  const menuList = [
    { icon: House, title: "Home", link: "/" },
    { icon: FileText, title: "PDFs", link: "/products" },
    { icon: ShoppingCart, title: "Purchases", link: "/purchases" },
    { icon: MessageCircleMore, title: "Messages", link: "/messages" },
  ];

  const isActiveRoute = (link: string) => {
    if (link === "/") return pathname === "/";
    return pathname.startsWith(link);
  };

  const handleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

  useEffect(() => {
    if (window.innerWidth >= 1024 && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Header - Only visible on mobile */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={handleMobileMenu}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <Image src={logo} alt="Shipping Updates" className="h-8 w-8" />
            <span className="font-semibold text-gray-800">
              Shipping Updates
            </span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={handleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          border-r-2 bg-white
          
          /* Mobile: overlay sliding from left - always full width */
          lg:relative fixed inset-y-0 left-0 z-50
          transition-all duration-300 ease-in-out p-2
          ${
            isMobileMenuOpen
              ? "translate-x-0 w-72"
              : "-translate-x-full lg:translate-x-0"
          }
          
          /* Desktop: collapsible width */
          ${isSidebarOpen ? "lg:w-72" : "lg:w-20"}
          
          /* Height */
          lg:min-h-screen min-h-screen
        `}
      >
        {/* Toggle Button - Desktop Only */}
        <div
          className={`hidden lg:flex ${
            isSidebarOpen ? "justify-end" : "justify-center"
          }`}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-5 hover:bg-gray-100 rounded-lg transition"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <PanelRightClose className="h-5 w-5 text-gray-600" />
            ) : (
              <PanelRightOpen className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        <div
          className={`h-full flex flex-col ${
            isSidebarOpen ? "px-3 py-5" : "lg:px-1 lg:py-5 px-3 py-5"
          } rounded-xl`}
        >
          {/* Close button - only on mobile */}
          <div className="lg:hidden flex justify-end mb-2">
            <button
              onClick={handleMobileMenu}
              className="p-2 hover:bg-gray-100 border border-primary-dark/50 rounded-lg transition"
            >
              <X className="h-7 w-7 text-gray-600" />
            </button>
          </div>

          {/* Logo & User Info */}
          <div className="flex flex-col justify-center items-center">
            <Image
              src={logo}
              alt="Shipping Updates Logo"
              className={`${
                isSidebarOpen ? "w-16 h-16" : "lg:w-10 lg:h-10 w-16 h-16"
              }`}
            />
            {(isSidebarOpen || isMobileMenuOpen) && user && (
              <p className="text-sm text-gray-600 mt-2 text-center break-all px-2">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            )}
          </div>

          <Separator className="mt-5" />

          {/* Menu */}
          <div
            className={`flex flex-col gap-3 my-5 text-neutral-700 ${
              isSidebarOpen ? "mx-3" : "lg:mx-1 mx-3"
            }`}
          >
            {menuList.map((menu, index) => {
              const isActive = isActiveRoute(menu.link);
              return (
                <Link
                  key={index}
                  href={menu.link}
                  className={`flex gap-2 font-semibold text-base font-nunito items-center rounded-lg transition
                    ${
                      isSidebarOpen
                        ? "px-3 py-2"
                        : "lg:px-2 lg:py-2 lg:justify-center px-3 py-2"
                    }
                    ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600"
                        : "hover:bg-gray-100"
                    }`}
                  title={!isSidebarOpen ? menu.title : undefined}
                >
                  <menu.icon
                    className={`${isSidebarOpen ? "" : "lg:h-6 lg:w-6"} ${
                      isActive ? "text-indigo-600" : ""
                    }`}
                  />
                  {(isSidebarOpen || isMobileMenuOpen) && (
                    <span className={isSidebarOpen ? "" : "lg:hidden"}>
                      {menu.title}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <Separator className="mb-5" />

          {/* Logout Button */}
          <div className="">
            <SignOutButton>
              <button
                className={`w-full text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition flex justify-center items-center
                  ${isSidebarOpen ? "px-4 py-2" : "lg:px-2 lg:py-2 px-4 py-2"}`}
              >
                {isSidebarOpen || isMobileMenuOpen ? (
                  "Logout"
                ) : (
                  <span className="hidden lg:block">
                    <LogOut size={17} />
                  </span>
                )}
              </button>
            </SignOutButton>
          </div>
        </div>
      </aside>
    </>
  );
}
