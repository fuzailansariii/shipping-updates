"use client";
import AuthCard from "@/components/auth/auth-card";
import OTPVerification from "@/components/auth/otp-verification";
import { useSignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { ClerkAPIError } from "@clerk/types";
import { toast } from "sonner";

type Step = "email" | "verification";

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/";

  // handle email submission
  const handleEmailSubmit = async (
    emailAddress: string,
    firstName?: string,
    lastName?: string,
  ) => {
    if (!isLoaded) {
      console.error("Clerk not loaded yet");
      throw new Error("Authentication service is not ready. Please try again.");
    }
    try {
      // create sign up with emailAddress
      await signUp.create({
        emailAddress,
        firstName: firstName || "",
        lastName: lastName || "",
      });
      // send verification code to emailAddress
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      // move to verification step
      setEmail(emailAddress);
      setCurrentStep("verification");
      toast.success("Verification code sent to your email!");
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.longMessage ||
        clerkError.errors?.[0]?.message ||
        "Failed to send verification code";

      toast.error(errorMessage);
      console.error("Email submission error:", errorMessage);
    }
  };

  // handle OTP verification
  const handleVerify = async (code: string) => {
    if (!isLoaded) {
      throw new Error("Authentication service is not ready. Please try again.");
    }
    try {
      const cleanCode = code.trim();
      const attemptSignUp = await signUp.attemptEmailAddressVerification({
        code: cleanCode,
      });

      if (attemptSignUp.status === "complete") {
        if (!setActive) throw new Error("Unable to set active session");
        await setActive({ session: attemptSignUp.createdSessionId });
        toast.success("Sign up successful!");
        router.push(redirectUrl);
      } else {
        throw new Error("Verification incomplete. Please try again.");
      }
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorCode = clerkError.errors?.[0]?.code;
      const errorMessage =
        clerkError.errors?.[0]?.longMessage ||
        clerkError.errors?.[0]?.message ||
        (error as Error)?.message ||
        "Invalid verification code";

      toast.error(errorMessage);

      // If code expired or too many attempts, restart the flow
      if (
        errorCode === "verification_expired" ||
        errorCode === "verification_failed"
      ) {
        toast.error("Code expired. Please request a new one.");
        handleBackToEmail(); // go back to email step
      }

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
      toast.success("Verification code resent to your email!");
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.message ||
        clerkError.errors?.[0]?.longMessage ||
        "Failed to resend verification code";

      toast.error(errorMessage);
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
        redirectUrlComplete: redirectUrl,
      });
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.message ||
        clerkError.errors?.[0]?.longMessage ||
        "Google sign-up failed";

      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // handle back to email step
  const handleBackToEmail = () => {
    setCurrentStep("email");
    setEmail("");
  };

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
