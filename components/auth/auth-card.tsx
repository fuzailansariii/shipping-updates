"use client";
import Image from "next/image";
import { Input } from "../ui/input";
import logo from "@/public/su-logo.png";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { EmailFormData, emailSchema } from "@/lib/validations/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Google from "@/icons/google";
import Container from "../container";

interface AuthCardProps {
  mode: "sign-in" | "sign-up";
  onEmailSubmit: (email: string) => Promise<void>;
  onGoogleAuth?: () => Promise<void>;
}

export default function AuthCard({
  mode,
  onEmailSubmit,
  onGoogleAuth,
}: AuthCardProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const isSignUp = mode === "sign-up";

  // React Hook Form setup
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<EmailFormData>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(emailSchema),
  });

  // handle email submission
  const onSubmit = async (data: EmailFormData) => {
    try {
      setIsLoading(true);
      await onEmailSubmit(data.email);
      reset();
    } catch (error) {
      console.error("Error submitting email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // handle google authentication
  const handleGoogleAuth = async () => {
    if (!onGoogleAuth) return;
    try {
      setIsGoogleLoading(true);
      await onGoogleAuth();
    } catch (error) {
      console.error("Error with Google authentication:", error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex justify-center h-screen items-center mx-auto max-w-[500px] px-4">
      <div className="border rounded-xl md:px-15 px-5 py-20 w-full shadow-xl mx-1 md:mx-0">
        {/* form title and description */}
        <div className="text-center px-3">
          <Image
            src={logo}
            alt="shipping-updates-logo"
            height={60}
            width={60}
            className="mx-auto mb-2"
          />
          <h1 className="text-2xl md:text-3xl mb-2 font-semibold font-roboto text-neutral-800">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm md:text-base text-neutral-600 font-nunito">
            {isSignUp
              ? "Join us and unlock premium study materials"
              : "Sign in to access your study materials"}
          </p>
        </div>
        <div className="w-full">
          {/* Form content */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-5 flex flex-col gap-5 font-semibold font-lato"
          >
            {/* Email input */}
            <div className="flex flex-col gap-4">
              <Input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="bg-neutral-100"
                disabled={isLoading || isGoogleLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500" aria-live="polite">
                  {errors.email.message}
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending code...
                  </div>
                ) : (
                  "Continue with Email"
                )}
              </Button>
              <div id="clerk-captcha" />
            </div>
            <div className="relative my-2">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-neutral-500">
                or
              </span>
            </div>

            {/* Google auth button */}
            <Button
              variant="secondary"
              size={"lg"}
              className="w-full border-2 hover:bg-neutral-50"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading || isLoading}
              type="button"
            >
              <Google />
              {isGoogleLoading
                ? "Loading..."
                : `${isSignUp ? "Sign up" : "Sign in"} with Google`}
            </Button>
            <div id="clerk-captcha" />
          </form>

          {/* Form footer */}
          <p className="text-center mt-6 text-sm text-neutral-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-neutral-500 mt-6">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-neutral-700">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-neutral-700">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export type { AuthCardProps };
