"use client";

import AuthCard from "@/components/auth/auth-card";
import OTPVerification from "@/components/auth/otp-verification";
import { useSignIn } from "@clerk/nextjs";
import { ClerkAPIError } from "@clerk/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Step = "email" | "verification";

export default function SignIn() {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect_url") || "/dashboard";

  const handleEmailSubmit = async (emailAddress: string) => {
    if (!isLoaded) {
      console.error("Clerk not loaded yet");
      throw new Error("Authentication service is not ready. Please try again.");
    }
    try {
      const signInAttempt = await signIn.create({ identifier: emailAddress });

      const emailFactor = signInAttempt.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );

      if (!emailFactor?.emailAddressId) {
        throw new Error("Email Verification failed");
      }

      await signInAttempt.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
      });

      setEmail(emailAddress);
      setCurrentStep("verification");
      // TODO: toast success message "Verification code sent to your email!"
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.message ||
        clerkError.errors?.[0]?.longMessage ||
        "Failed to send verification code";
      // toast.error(errorMessage);
      console.error("Email submission error:", errorMessage);
      throw new Error(errorMessage);
    }
  };
  const handleVerificationCode = async (code: string) => {
    if (!isLoaded) {
      console.error("Clerk not loaded yet");
      throw new Error("Authentication service is not ready. Please try again.");
    }
    try {
      const completeSignIn = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });
      if (completeSignIn.status === "complete") {
        if (!setActive) {
          throw new Error("Unable to set active session");
        }
        await setActive({ session: completeSignIn.createdSessionId });
        router.push(redirectUrl);
        // TODO: toast success message "Signed in successfully!"
      } else {
        // TODO: toast error message("Sign-in not complete. Please try again.")
        throw new Error("Sign-in not complete");
      }
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.longMessage ||
        clerkError.errors?.[0]?.message ||
        "Failed to verify code";
      console.error("Verification error:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleResend = async () => {
    if (!isLoaded) {
      console.error("Clerk not loaded yet");
      throw new Error("Authentication service is not ready. Please try again.");
    }

    try {
      const emailFactor = signIn.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      );

      if (!emailFactor?.emailAddressId) {
        throw new Error("Unable to resend code");
      }

      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
      });

      // toast.success("New verification code sent!");
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.message ||
        clerkError.errors?.[0]?.longMessage ||
        "Failed to resend code";
      console.error("Resend code error:", errorMessage);
      // toast.error("Failed to resend code. Please try again.");
      throw new Error(errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) {
      console.error("Clerk not loaded yet");
      throw new Error("Authentication service is not ready. Please try again.");
    }
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: redirectUrl,
      });
    } catch (error) {
      const clerkError = error as { errors?: ClerkAPIError[] };
      const errorMessage =
        clerkError.errors?.[0]?.message ||
        clerkError.errors?.[0].longMessage ||
        "Google sign-in failed";
      console.error("Google sign-in error:", errorMessage);
      // toast.error('Google sign in failed. Please try again.');
      throw new Error(errorMessage);
    }
  };

  const handleBack = () => {
    setCurrentStep("email");
    setEmail("");
  };

  if (currentStep === "verification") {
    return (
      <OTPVerification
        email={email}
        mode="sign-in"
        onBack={handleBack}
        onResend={handleResend}
        onVerify={handleVerificationCode}
      />
    );
  }

  return (
    <AuthCard
      mode="sign-in"
      onEmailSubmit={handleEmailSubmit}
      onGoogleAuth={handleGoogleSignIn}
    />
  );
}
