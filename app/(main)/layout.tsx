import NavbarWrapper from "@/components/navbar-wrapper";
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
    </div>
  );
}
