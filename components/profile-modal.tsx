"use client";

import { useProfileStore } from "@/stores/profile-store";
import { Button } from "./ui/button";
import { useEffect } from "react";
import { Mail, Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

export default function ProfileModal() {
  const { closeProfile, isProfileOpen } = useProfileStore();
  const { user } = useUser();

  useEffect(() => {
    if (isProfileOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isProfileOpen]);

  return (
    <AnimatePresence>
      {isProfileOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeProfile}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="
              relative w-full md:max-w-md
              h-[75vh] md:h-auto
              bg-white
              rounded-t-2xl md:rounded-2xl
              overflow-hidden
            "
          >
            {/* Close */}
            <button
              onClick={closeProfile}
              className="absolute top-3 right-3 z-20 p-1 rounded-full bg-white/80"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="h-36 bg-linear-to-br from-blue-600 to-indigo-600" />

            {/* Content */}
            <div className="relative px-5 pb-6 -mt-16 overflow-y-auto h-full">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                <Image
                  src={user?.imageUrl ?? "U"}
                  alt="User Profile"
                  height={100}
                  width={100}
                />
              </div>

              {/* Name & badges */}
              <h2 className="mt-3 text-xl font-bold">{user?.fullName}</h2>

              <div className="flex gap-2 mt-1">
                <p className="text-xs  text-purple-700">
                  {user?.emailAddresses[0].emailAddress}
                </p>
              </div>

              {/* Bio */}

              {/* Actions */}
              <div className="mt-5 flex items-center gap-3">
                <Button variant={"default"} className="rounded-full w-1/3 bg-black text-white hover:bg-black/90">
                  My Orders
                </Button>

                <Button
                  variant={"secondary"}
                  className="rounded-full border flex items-center justify-center w-1/3"
                >
                  Products
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
