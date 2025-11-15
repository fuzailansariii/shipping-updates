"use client";
import Card from "@/components/auth/auth-card";
import OTPVerification from "@/components/auth/otp-verification";
import Container from "@/components/container";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

type step = "email" | "verification";

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState<step>("email");
  const [email, setEmail] = useState("");

  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // handle email submission
  const handleEmailSubmit = async (emailAddress: string) => {
    if (!isLoaded) return;
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
    } catch (error: any) {
      console.error("Unexpected error during email submission:", error);
      // handle specific error cases as needed
      if (error.errors?.[0]?.code === "form_identifier_already_exists") {
        console.error("Email already in use.");
      } else {
        // TODO: toast error message
        console.error(
          error.errors?.[0]?.longMessage ||
            "Failed to send code. Please try again."
        );
      }
      throw error;
    }
  };

  // handle OTP verification
  const handleVerify = async (code: string) => {};

  return <div></div>;
}
