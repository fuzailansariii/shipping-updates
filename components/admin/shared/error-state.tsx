"use client";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ErrorStateProps {
  message?: string;
}

export default function ErrorState({
  message = "Something went wrong",
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
        <AlertCircle className="w-5 h-5 text-red-500" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-secondary-dark/80">
          {message}
        </p>
        <p className="text-xs text-secondary-dark/40">
          Please try again or contact support if the issue persists.
        </p>
      </div>
      <button
        onClick={() => router.refresh()}
        className="text-xs font-medium px-4 py-2 rounded-lg border border-secondary-dark/10 hover:bg-secondary-dark/5 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
