import { auth } from "@clerk/nextjs/server";
import Navbar from "./navbar";

export default async function NavbarWrapper() {
  const { userId, sessionClaims } = await auth();
  const isAdmin = sessionClaims?.role === "admin";
  return <Navbar userId={userId} isAdmin={isAdmin} />;
}
