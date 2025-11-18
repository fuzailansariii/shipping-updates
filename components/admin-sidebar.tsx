import Image from "next/image";
import logo from "@/public/su-logo.png";
import { currentUser } from "@clerk/nextjs/server";
import { FileText, House, MessageCircleMore, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { SignOutButton } from "@clerk/nextjs";

export default async function AdminSidebar() {
  const menuList = [
    { icon: House, title: "Home", link: "/" },
    { icon: FileText, title: "PDFs", link: "/pdfs" },
    { icon: ShoppingCart, title: "Purchases", link: "/purchases" },
    { icon: MessageCircleMore, title: "Messages", link: "/messages" },
  ];

  const user = await currentUser();
  return (
    <aside className="w-72 p-5 min-h-screen border-r-2">
      <div className="h-full flex flex-col rounded-xl px-3 py-5">
        <div className="flex flex-col justify-center items-center">
          <Image src={logo} alt="Shipping Updates Logo" className="w-16 h-16" />
          {user && (
            <p className="text-sm text-gray-600 mt-2">
              {user.emailAddresses[0]?.emailAddress}
            </p>
          )}
        </div>
        <Separator className="mt-5" />
        {/* <AdminSidebarMenu /> */}
        <div className="flex flex-col gap-3  my-5 mx-3 text-neutral-700">
          {menuList.map((menu, index) => (
            <Link
              key={index}
              href={menu.link}
              className="flex gap-2 font-semibold text-base font-nunito items-center"
            >
              <menu.icon />
              {menu.title}
            </Link>
          ))}
        </div>
        <Separator className="mb-5" />

        <div className="">
          <SignOutButton>
            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition">
              Logout
            </button>
          </SignOutButton>
        </div>
      </div>
    </aside>
  );
}
