import Footer from "@/components/footer";
import NavbarWrapper from "@/components/navbar-wrapper";
// import ProductModal from "@/components/product-modal";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <NavbarWrapper />
      {children}
      <Footer />
      {/* <ProductModal /> */}
    </div>
  );
}
