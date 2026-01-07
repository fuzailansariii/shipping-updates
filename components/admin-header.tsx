"use client";
import { useUser } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function SidebarHeader() {
  const { user } = useUser();

  return (
    <header className="hidden md:flex max-w-5xl mx-auto justify-between items-center">
      {/* Right side content */}
      <div className="flex items-center">
        <h1 className="text-sm font-lato text-secondary-dark tracking-wide flex items-center gap-2">
          Welcome Back, <span>{user?.firstName}</span>
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant={"ghost"}
          className="relative cursor-pointer hover:bg-gray-200 transition-colors duration-200"
          onClick={() => console.log("Cart Button clicked")}
        >
          <Bell className="size-5 text-neutral-600" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
        <button
          onClick={() => console.log("Profile Clicked in admin")}
          className="cursor-pointer"
        >
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
        </button>
        <h1 className="font-bold text-base font-nunito">{user?.fullName}</h1>
      </div>
    </header>
  );
}
