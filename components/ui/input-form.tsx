"use client";
import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface BaseInputProps {
  label?: string;
  name?: string;
  className?: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
}

interface InputElementProps extends BaseInputProps {
  as?: "input";
  type?: string;
  placeholder?: string;
}

interface TextareaElementProps extends BaseInputProps {
  as: "textarea";
  placeholder?: string;
  rows?: number;
}

interface SelectElementProps extends BaseInputProps {
  as: "select";
  children: React.ReactNode;
}

type InputProps = InputElementProps | TextareaElementProps | SelectElementProps;

export function Input(props: InputProps) {
  const { label, name, error, register, className, as = "input" } = props;

  const renderInput = () => {
    const baseClassName = `w-full px-2 py-1 rounded-xl font-medium text-base font-lato tracking-tight rounded focus:outline-none bg-transparent ${
      error ? "border-red-500" : ""
    } ${className || ""}`;

    if (as === "textarea") {
      const { placeholder, rows = 4 } = props as TextareaElementProps;
      return (
        <textarea
          id={name}
          placeholder={placeholder}
          rows={rows}
          className={baseClassName}
          {...register}
        />
      );
    }

    if (as === "select") {
      const { children } = props as SelectElementProps;
      return (
        <select id={name} className={baseClassName} {...register}>
          {children}
        </select>
      );
    }

    // Default: input
    const { type = "text", placeholder } = props as InputElementProps;
    return (
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={baseClassName}
        {...register}
      />
    );
  };

  return (
    <div className="flex flex-col w-full max-w-3xl border-gray-300 border rounded-xl p-1 bg-white">
      {label && (
        <label
          htmlFor={name}
          className="px-2 font-medium text-neutral-600 text-xs capitalize"
        >
          {label}
        </label>
      )}
      {renderInput()}
      {error && <p className="text-red-500 text-sm px-2">{error.message}</p>}
    </div>
  );
}

export default Input;
