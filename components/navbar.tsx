"use client";
import logo from "@/public/su-logo.png";
import { SignOutButton } from "@clerk/nextjs";
import {
  ChevronDown,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useProfileStore } from "@/stores/profile-store";

interface NavbarProps {
  userId: string | null;
  isAdmin: boolean;
}

interface DropdownProp {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href?: string;
  action?: string;
}

export default function Navbar({ userId, isAdmin }: NavbarProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [hovered, setHovered] = useState<number | null>(null);
  // const [authHovered, setAuthHovered] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Store
  const { toggleCart, items } = useCartStore();
  const { openProfile } = useProfileStore();
  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
  ];

  const dropdownLinks: DropdownProp[] = userId
    ? [
        { name: "Profile", icon: User, action: "profile" },
        {
          name: isAdmin ? "Admin Dashboard" : "My Purchases",
          icon: Package,
          href: isAdmin ? "/admin" : "/purchases",
        },
        { name: "Logout", icon: LogOut, action: "signout" },
      ]
    : [];

  const authMenu = !userId
    ? [
        {
          name: "Sign Up",
          href: "/sign-up",
        },
        {
          name: "Login",
          href: "/sign-in",
        },
      ]
    : [];

  const mobileLinks = [
    ...links,
    ...authMenu.map((item) => ({ name: item.name, href: item.href })),
  ];

  //  Close Dropdown when clicking outsite
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <div className="relative">
      <nav className="flex justify-between bg-linear-to-r from-blue-50 to-neutral-50 fixed inset-x-0 top-0 md:mt-2 z-30 md:rounded-full mx-auto items-center max-w-5xl border border-neutral-200 p-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          onClick={() => setOpen(false)}
        >
          <Link href={"/"}>
            <Image
              className="rounded-full"
              src={logo}
              alt="Shipping Updates Logo"
              height={50}
              width={50}
            />
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center font-lato text-base text-primary-dark">
          {links.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="relative"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === index && (
                <motion.span
                  layoutId="hovered-span"
                  className="absolute inset-0 h-full w-full rounded-md bg-neutral-200"
                />
              )}
              <span className="relative z-10 p-2">{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Desktop Auth Menu */}
        <motion.div className="text-base gap-2 hidden md:flex items-center">
          <Button
            variant="ghost"
            aria-label="View cart"
            className="cursor-pointer relative"
            onClick={toggleCart}
          >
            <ShoppingCart className="size-6" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Button>
          {!userId ? (
            // Show Sign Up / Login buttons if not logged in
            authMenu.map((item, index) => (
              <Button
                asChild
                variant={"default"}
                key={index}
                className="cursor-pointer font-lato rounded-full"
                size={"lg"}
              >
                <Link href={item.href} key={index}>
                  {item.name}
                </Link>
              </Button>
            ))
          ) : (
            // Show dropdown if logged in
            <div className="relative" ref={dropdownRef}>
              <Button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                variant="secondary"
                className="flex cursor-pointer items-center gap-1 px-3 py-2 rounded-full font-nunito font-semibold hover:bg-neutral-200 transition-colors duration-300"
              >
                <User size={18} />
                <span>Account</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white border font-lato border-neutral-200 rounded-lg shadow-lg overflow-hidden"
                  >
                    {dropdownLinks.map((item, idx) => (
                      <div key={idx}>
                        {item.action === "signout" ? (
                          // Sign Out Button
                          <SignOutButton redirectUrl="/">
                            <button
                              onClick={() => setDropdownOpen(false)}
                              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                              <item.icon className="size-4.5" />
                              <span>{item.name}</span>
                            </button>
                          </SignOutButton>
                        ) : item.action === "profile" ? (
                          // Profile Button
                          <button
                            onClick={() => {
                              openProfile(); 
                              setDropdownOpen(false); 
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors text-left"
                          >
                            <item.icon className="size-4.5" />
                            <span>{item.name}</span>
                          </button>
                        ) : item.href ? (
                          // Regular Links (My Purchases, Admin Dashboard)
                          <Link
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
                          >
                            <item.icon className="size-4.5" />
                            <span>{item.name}</span>
                          </Link>
                        ) : null}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Mobile Menu Toggle */}
        <motion.div
          className="md:hidden flex items-center gap-2 mr-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="ghost"
            aria-label="View cart"
            className="cursor-pointer relative"
            onClick={toggleCart} 
          >
            <ShoppingCart className="size-6" />
            {items.length > 0 && ( 
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Button>
          <motion.div
            className="relative w-10 h-10 flex items-center justify-center"
            onClick={() => setOpen(!open)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute md:hidden inset-x-0 top-20 bg-linear-to-r from-blue-50 to-neutral-50 rounded-md max-w-[95%] mx-auto border border-neutral-200 shadow-lg"
            >
              <div className="flex flex-col items-start gap-4 text-2xl text-neutral-500 p-4">
                {mobileLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href!}
                      className="hover:text-neutral-900 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Dropdown Items */}
                {userId &&
                  dropdownLinks.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (mobileLinks.length + idx) * 0.1 }}
                    >
                      {item.action === "signout" ? (
                        <SignOutButton redirectUrl="/">
                          <button
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 text-2xl font-semibold text-red-600 hover:text-red-700 transition-colors"
                          >
                            {/* <item.icon size={20} /> */}
                            <p>{item.name}</p>
                          </button>
                        </SignOutButton>
                      ) : item.action === "profile" ? (
                        <button
                          className="flex items-center pl-0 gap-3 text-2xl"
                          onClick={() => {
                            openProfile();
                            setOpen(false);
                          }}
                        >
                          <p>{item.name}</p>
                        </button>
                      ) : item.href ? (
                        <Link
                          href={item.href!}
                          onClick={() => setOpen(false)}
                          className="flex items-center pl-0 gap-3 text-2xl"
                        >
                          {/* <item.icon size={20} /> */}
                          <p>{item.name}</p>
                        </Link>
                      ) : null}
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
