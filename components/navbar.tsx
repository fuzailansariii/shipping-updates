"use client";
import logo from "@/public/su-logo.png";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [authHovered, setAuthHovered] = useState<number | null>(null);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
  ];
  const authMenu = [
    {
      name: "Sign Up",
      href: "/sign-up",
      style:
        "border-neutral-300 px-4 py-2 border rounded-full hover:bg-neutral-300 transition-colors duration-400",
    },
    {
      name: "Login",
      href: "/sign-in",
      style:
        "border-neutral-300 px-4 py-2 border rounded-full bg-neutral-500 text-neutral-200 hover:bg-neutral-600 transition-colors duration-400",
    },
  ];

  const mobileLinks = [
    ...links,
    ...authMenu.map((item) => ({ name: item.name, href: item.href })),
  ];

  return (
    <div className="relative">
      <nav className="flex justify-between fixed inset-x-0 top-0 md:mt-2 bg-neutral-100 md:rounded-full mx-auto items-center max-w-5xl border border-neutral-200 p-2">
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
        <div className="hidden md:flex justify-center font-lato text-base text-neutral-500">
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
        <motion.div className="text-base text-neutral-500 gap-2 hidden md:flex">
          {authMenu.map((link, index) => (
            <Link
              href={link.href}
              key={index}
              className={link.style}
              onMouseEnter={() => setAuthHovered(index)}
              onMouseLeave={() => setAuthHovered(null)}
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
        <motion.button
          className="md:hidden mr-2 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setOpen(!open)}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
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
        </motion.button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute md:hidden inset-x-0 top-20 bg-neutral-100 rounded-md max-w-[95%] mx-auto border border-neutral-200 shadow-lg"
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
                      href={link.href}
                      className="hover:text-neutral-900 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {link.name}
                    </Link>
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
