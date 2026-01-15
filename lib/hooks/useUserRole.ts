"use client";

import { useAuth, useUser } from "@clerk/nextjs";

export function useUserRole() {
  const { sessionClaims, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();

  //   Accessign role form sessionClaims
  const role = (sessionClaims?.role as string) || "user";

  const isAdmin = role === "admin";
  const isUser = role === "user" || !role;
  const isLoaded = authLoaded && userLoaded;

  return {
    role,
    isAdmin,
    isUser,
    isLoaded,
    isSignedIn,
    sessionClaims,
    user,
  };
}
