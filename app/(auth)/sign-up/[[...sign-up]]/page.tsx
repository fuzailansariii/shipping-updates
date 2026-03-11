"use client";
import AuthCard from "@/components/auth/auth-card";
import OTPVerification from "@/components/auth/otp-verification";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ClerkAPIError } from "@clerk/types";
import { toast } from "sonner";

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
      toast.success("Verification code sent to your email!");
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.longMessage ||
        clerkError.errors?.[0]?.message ||
        "Failed to send verification code";

      // console.error("Email submission error:", errorMessage);
      toast.error("Failed to send verification code");
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
      const attemptSignUp = await signUp.attemptEmailAddressVerification({
        code: cleanCode,
      });
      if (attemptSignUp.status === "complete") {
        if (!setActive) {
          throw new Error("Unable to set active session");
        }
        await setActive({ session: attemptSignUp.createdSessionId });
        toast.success("Sign up successful!");
        router.push("/");
      } else if (attemptSignUp.status === "missing_requirements") {
        toast.error("Please complete all required fields.");
        throw new Error("Please complete all required fields.");
      } else {
        toast.error("Verification incomplete. Please try again.");
        throw new Error("Verification incomplete. Please try again.");
      }
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.message ||
        clerkError.errors?.[0]?.longMessage ||
        "Invalid verification code";

      toast.error("Failed to verify code");
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

      toast.error("Failed to resend code");

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
        redirectUrlComplete: "/",
      });
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.message ||
        clerkError.errors?.[0]?.longMessage ||
        "Google sign-up failed";

      toast.error("Google sign-up failed. Please try again.");

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
