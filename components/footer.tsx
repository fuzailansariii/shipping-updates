import logo from "@/public/su-logo.png";
import Image from "next/image";
import FacebookIcon from "@/icons/facebook";
import Youtube from "@/icons/youtube";
import WhatsApp from "@/icons/whatsapp";
import Instagram from "@/icons/instagram";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Separator } from "./ui/separator";

interface MenuListProps {
  title: string;
  link: string;
}

const aboutMenu = [
  { title: "Products", link: "/products" },
  { title: "About Us", link: "/about-us" },
  { title: "Contact", link: "/contact" },
];

const helpMenu = [
  { title: "Privacy", link: "/privacy" },
  { title: "Term & Conditions", link: "/term-condition" },
  { title: "Disclaimer", link: "/disclaimer" },
  { title: "Developer & Teams", link: "/developer-teams" },
];

export default function Footer() {
  return (
    <div className="w-full pt-10 mx-auto bg-neutral-300">
      <Separator className="mb-5" />
      <div className="max-w-7xl mx-auto flex justify-between">
        <div className="flex flex-col gap-5 justify-center items-center">
          <Image src={logo} className="h-24 w-24" alt="Shipping Updates Logo" />
          <div className="flex gap-5">
            <FacebookIcon size="lg" />
            <Youtube size="lg" />
            <WhatsApp size="lg" />
            <Instagram size="lg" />
          </div>
        </div>
        <div className="">
          <div className="flex gap-10">
            <MenuList heading="About" menuItems={aboutMenu} />
            <MenuList heading="Help" menuItems={helpMenu} />
            <div>
              <h1 className="font-nunito text-neutral-600 text-lg">
                Contact Info
              </h1>
              <div className="flex flex-col gap-1">
                <div className="items-center flex gap-2">
                  <Mail className="h-5 w-5" />
                  <Link
                    href={"mailto:shippingupdates21@gmail.com"}
                    className="font-lato tracking-tight text-neutral-500"
                  >
                    shippingupdates21@gmail.com
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <p className="font-lato tracking-tight text-neutral-500">
                    {"(+91) 9322300381"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="mt-5" />
      <div className="text-center flex justify-center items-center py-4 font-nunito font-semibold">
        <span className="mr-1">&copy;</span>
        <p className="text-neutral-700">
          2025 - ShippingUpdates - All Right Resvered
        </p>
      </div>
    </div>
  );
}

export const MenuList = ({
  heading,
  menuItems,
}: {
  heading: string;
  menuItems: MenuListProps[];
}) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-lg font-semibold font-nunito text-neutral-600">
        {heading}
      </h1>
      <div className="flex flex-col font-lato tracking-tight text-neutral-500 gap-1">
        {menuItems.map((link, index) => (
          <Link key={index} href={link.link}>
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
};
