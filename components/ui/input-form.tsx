"use client";
import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  name?: string;
  type?: string;
  className?: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  as?: "input" | "textarea";
}

export function Input({
  label,
  name,
  error,
  register,
  className,
  as = "input",
  type = "text",
  ...props
}: InputProps) {
  const Component = as;
  return (
    <div className="space-y-1 flex flex-col w-full max-w-lg border-gray-300 border rounded-3xl p-2 bg-neutral-200">
      {label && (
        <label
          htmlFor={name}
          className="px-2 font-medium text-neutral-600 text-xs"
        >
          {label}
        </label>
      )}
      <Component
        id={name}
        type={type}
        className={`w-full px-2 pb-1.5 font-semibold text-base font-nunito tracking-tight rounded focus:outline-none ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...register}
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
}

export default Input;
