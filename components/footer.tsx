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
    <div className="w-full pt-10 mx-auto bg-primary-dark border-t border-gray-800">
      <div className="md:max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between">
        <div className="flex md:flex-col gap-5 justify-between md:justify-center items-center px-5 md:px-0">
          <Image
            src={logo}
            className="h-24 w-24 hidden md:block"
            alt="Shipping Updates Logo"
          />
          <span className="block md:hidden font-roboto font-medium text-center text-text-color">
            FOLLOW US
          </span>
          <div className="flex gap-5 items-center">
            <FacebookIcon size="lg" />
            <Youtube size="lg" />
            <WhatsApp size="lg" />
            <Instagram size="lg" />
          </div>
        </div>
        <div className="items-center gap-5 mx-5 mt-10">
          <div className="flex flex-col md:flex-row gap-10">
            <MenuList heading="About" menuItems={aboutMenu} />
            <MenuList heading="Help" menuItems={helpMenu} />
            <div>
              <h1 className="font-nunito text-text-color text-lg">
                Contact Info
              </h1>
              <div className="flex flex-col gap-1 font-lato tracking-wide text-text-color/70">
                <div className="items-center flex gap-2">
                  <Mail className="h-5 w-5" />
                  <Link href={"mailto:shippingupdates21@gmail.com"}>
                    shippingupdates21@gmail.com
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <p>{"(+91) 9322300381"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="mt-5 bg-main" />
      <div className="text-center text-text-color/50 tracking-wide flex justify-center items-center py-4 font-lato font-semibold">
        <span className="mr-1">&copy;</span>
        <p className="">2025 - ShippingUpdates - All Right Resvered</p>
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
      <h1 className="text-lg font-semibold tracking-wide font-nunito text-text-color">
        {heading}
      </h1>
      <div className="flex flex-col font-lato tracking-wide text-text-color/70 gap-1">
        {menuItems.map((link, index) => (
          <Link key={index} href={link.link}>
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
};
