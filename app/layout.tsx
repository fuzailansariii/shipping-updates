import type { Metadata } from "next";
import { Lato, Nunito, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";

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
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${lato.variable} ${roboto.variable} ${nunito.variable} antialiased`}
        >
          <Navbar />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
