import type { Metadata } from "next";
import { Lato, Nunito, Roboto } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import CartSidebar from "@/components/cart-sidebar";
import ProfileModal from "@/components/profile-modal";
import ProductModal from "@/components/product-modal";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
  subsets: ["latin"],
});
const roboto = Roboto({
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-roboto",
  subsets: ["latin"],
});
const nunito = Nunito({
  weight: ["200", "300", "400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shipping Updates",
  description: "Portfolio & Study Materials Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body
          className={`${lato.variable} ${roboto.variable} ${nunito.variable} antialiased`}
        >
          <ProfileModal />
          {children}
          <Toaster position="top-center" />
          <CartSidebar />
          <ProductModal />
        </body>
      </html>
    </Providers>
  );
}
