"use client";

import { UseFormReturn } from "react-hook-form";
import { FrontendUpdateBookValues } from "@/lib/validations/product.schema";
import Input from "../ui/input-form";
import { BookOpen } from "lucide-react";

interface BookFieldsProps {
  form: UseFormReturn<FrontendUpdateBookValues>;
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-100 rounded-2xl p-4 md:p-6 border border-gray-300 space-y-4 md:space-y-6">
      <h2 className="text-base font-semibold text-neutral-700 flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </div>
  );
}

export function BookFields({ form }: BookFieldsProps) {
  const { register, formState } = form;
  const { errors } = formState;

  return (
    <Section
      icon={<BookOpen className="w-3.5 h-3.5 text-blue-500" />}
      title="Book Details"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="text"
          name="author"
          label="Author"
          placeholder="Author name"
          register={register("author")}
          error={errors.author}
        />
        <Input
          type="number"
          name="stockQuantity"
          label="Stock Quantity"
          placeholder="50"
          register={register("stockQuantity", { valueAsNumber: true })}
          error={errors.stockQuantity}
        />
        <Input
          type="text"
          name="publisher"
          label="Publisher"
          placeholder="Publisher name"
          register={register("publisher")}
          error={errors.publisher}
        />
        <Input
          type="text"
          name="isbn"
          label="ISBN"
          placeholder="123-45-678-9"
          register={register("isbn")}
          error={errors.isbn}
        />
        <Input
          type="text"
          name="edition"
          label="Edition"
          placeholder="1st Edition"
          register={register("edition")}
          error={errors.edition}
        />
      </div>
    </Section>
  );
}
