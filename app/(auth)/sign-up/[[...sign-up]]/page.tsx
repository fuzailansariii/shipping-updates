"use client";
import AuthCard from "@/components/auth/auth-card";
import OTPVerification from "@/components/auth/otp-verification";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ClerkAPIError } from "@clerk/types";

type Step = "email" | "verification";

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // handle email submission
  const handleEmailSubmit = async (emailAddress: string) => {
    if (!isLoaded) {
      console.error("Clerk not loaded yet");
      throw new Error("Authentication service is not ready. Please try again.");
    }
    try {
      // create sign up with emailAddress
      await signUp.create({ emailAddress });
      // send verification code to emailAddress
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      // move to verification step
      setEmail(emailAddress);
      setCurrentStep("verification");
      // TODO: toast success message "Verification code sent to your email!"
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.longMessage ||
        clerkError.errors?.[0]?.message ||
        "Failed to send verification code";

      console.error("Email submission error:", errorMessage);

      // TODO: Add toast error message
      // toast.error(errorMessage);

      throw new Error(errorMessage);
    }
  };

  // handle OTP verification
  const handleVerify = async (code: string) => {
    if (!isLoaded) {
      console.error("Clerk not loaded yet");
      throw new Error("Authentication service is not ready. Please try again.");
    }
    try {
      const cleanCode = code.trim();
      console.log("Attempting verification with code:", cleanCode);
      console.log("Current signUp status:", signUp.status);
      const attemptSignUp = await signUp.attemptEmailAddressVerification({
        code: cleanCode,
      });
      console.log("Verification attempt result:", attemptSignUp.status);
      if (attemptSignUp.status === "complete") {
        if (!setActive) {
          throw new Error("Unable to set active session");
        }
        await setActive({ session: attemptSignUp.createdSessionId });
        // TODO: toast success message "Sign up successful!"
        router.push("/dashboard");
      } else if (attemptSignUp.status === "missing_requirements") {
        console.warn("Missing requirements:", attemptSignUp);
        throw new Error("Please complete all required fields.");
      } else {
        // Handle incomplete verification
        console.warn("Verification incomplete:", attemptSignUp.status);
        throw new Error("Verification incomplete. Please try again.");
        // toast.error("Verification incomplete. Please try again.");
      }
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.message ||
        clerkError.errors?.[0]?.longMessage ||
        "Invalid verification code";

      console.error("Verification error:", errorMessage);

      // TODO: Add toast error message
      // toast.error(errorMessage);

      throw new Error(errorMessage);
    }
  };

  // handle resend code
  const handleResendCode = async () => {
    if (!isLoaded) {
      console.error("Clerk not loaded yet");
      throw new Error("Authentication service is not ready. Please try again.");
    }
    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      // TODO: toast success message "Verification code resent to your email!"
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.message ||
        clerkError.errors?.[0]?.longMessage ||
        "Failed to resend verification code";

      console.error("Resend error:", errorMessage);

      // TODO: Add toast error message
      // toast.error(errorMessage);

      throw new Error(errorMessage);
    }
  };

  // Google sign up handler
  const handleGoogleSignUp = async () => {
    if (!isLoaded) {
      console.error("Clerk not loaded yet");
      throw new Error("Authentication service is not ready. Please try again.");
    }
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.message ||
        clerkError.errors?.[0]?.longMessage ||
        "Google sign-up failed";

      console.error("Google sign-up error:", errorMessage);

      // toast.error(errorMessage);

      throw new Error(errorMessage);
    }
  };

  // handle back to email step
  const handleBackToEmail = () => {
    setCurrentStep("email");
    setEmail("");
  };

  // At the top of the component
  // if (!isLoaded) {
  //   return <div>Lofading...</div>; // or a proper loading spinner
  // }

  if (currentStep === "verification") {
    return (
      <OTPVerification
        email={email}
        mode="sign-up"
        onBack={handleBackToEmail}
        onResend={handleResendCode}
        onVerify={handleVerify}
      />
    );
  }

  return (
    <AuthCard
      mode="sign-up"
      onEmailSubmit={handleEmailSubmit}
      onGoogleAuth={handleGoogleSignUp}
    />
  );
}
