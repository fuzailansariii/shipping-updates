"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
// import { useState } from "react";

export default function SSOCallback() {
  // const [isCreatingUser, setIsCreatingUser] = useState(false);

  // const handleSignUpCallback = async () => {
  //   setIsCreatingUser(true);

  //   try {
  //     // Create user in your database after successful OAuth
  //     const response = await axios.post("/api/create-user");
  //     if (response.status === 201) {
  //       console.log("User created successfully in database");
  //     }
  //   } catch (dbError) {
  //     console.error("Failed to create user in database:", dbError);
  //     // Don't fail the OAuth flow if DB creation fails
  //     // You can handle this gracefully or show a warning
  //   } finally {
  //     setIsCreatingUser(false);
  //   }
  // };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {/* {isCreatingUser ? (
          <>
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Setting up your account...</p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Completing sign-up...</p>
          </>
        )} */}

        <AuthenticateWithRedirectCallback signUpFallbackRedirectUrl={"/"} />
      </div>
    </div>
  );
}
