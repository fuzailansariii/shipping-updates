"use client";
import { useForm } from "react-hook-form";
import { otpSchema, OTPFormData } from "@/lib/validations/auth";
import logo from "@/public/su-logo.png";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface OTPVerificationProps {
  email: string;
  mode: "sign-up" | "sign-in";
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
}

export default function OTPVerification({
  email,
  mode,
  onVerify,
  onResend,
  onBack,
}: OTPVerificationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otpValue, setOtpValue] = useState("");

  const {
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  });

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Handle OTP input change
  const handleOTPChange = (value: string) => {
    setOtpValue(value);
    setValue("code", value, { shouldValidate: true });
    if (errors.code) {
      clearErrors("code");
    }
  };

  // Handle OTP verification
  const onSubmit = async (data: OTPFormData) => {
    if (data.code.length !== 6) {
      setError("code", {
        type: "manual",
        message: "Please enter all 6 digits.",
      });
      return;
    }

    try {
      setIsLoading(true);
      await onVerify(data.code);
    } catch (error) {
      console.error("Verification error:", error);
      setError("code", {
        type: "manual",
        message: "Invalid code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    try {
      setIsResending(true);
      await onResend();
      setCountdown(60);
      setCanResend(false);
      setOtpValue(""); // Clear OTP input
      reset();
    } catch (error) {
      console.error("Resend error:", error);
      setError("code", {
        type: "manual",
        message: "Failed to resend code. Please try again.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="md:max-w-xl w-full h-screen flex justify-center items-center mx-auto">
      <div className="border rounded-xl md:px-15 px-5 py-15 max-w-[500px] shadow-xl mt-15 mx-1">
        {/* Header */}
        <div className="text-center px-3">
          <Image
            src={logo}
            alt="Shipping Updates Logo"
            height={60}
            width={60}
            className="mx-auto mb-2"
            priority
          />
          <h1 className="text-2xl md:text-3xl mb-2 font-semibold font-roboto text-neutral-800">
            Check your email
          </h1>
          <p className="text-sm md:text-base text-neutral-600 font-nunito">
            We sent a 6-digit code to
            <br />
            <span className="font-semibold text-neutral-800">{email}</span>
          </p>
        </div>

        {/* OTP Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-5 flex flex-col gap-4 font-semibold justify-center items-center font-lato"
        >
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otpValue}
            onChange={handleOTPChange}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {errors.code && (
            <p className="text-sm text-red-500 -mt-2" aria-live="polite">
              {errors.code.message}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || otpValue.length !== 6}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </div>
            ) : (
              "Verify Code"
            )}
          </Button>
        </form>

        {/* Resend Section */}
        <div className="space-y-3 mt-4">
          {canResend ? (
            <Button
              type="button"
              variant="ghost"
              className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={handleResend}
              disabled={isResending}
            >
              {isResending ? "Sending..." : "Didn't receive code? Resend"}
            </Button>
          ) : (
            <p className="text-center text-sm text-neutral-500">
              Resend code in {countdown} seconds
            </p>
          )}

          <Button
            type="button"
            variant="ghost"
            className="w-full text-neutral-600 hover:text-neutral-800"
            onClick={onBack}
            disabled={isLoading}
          >
            ← Back to email
          </Button>
        </div>

        {/* Help Text */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-neutral-600 text-center">
            💡 Check your spam folder if you don't see the email
          </p>
        </div>
      </div>
    </div>
  );
}

export type { OTPVerificationProps };
