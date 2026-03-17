"use client";

import { UseFormReturn } from "react-hook-form";
import { FrontendUpdatePdfValues } from "@/lib/validations/product.schema";
import Upload from "../upload";

interface PdfFieldsProps {
  form: UseFormReturn<FrontendUpdatePdfValues>;
  uploadKey: number;
  onFileUpload: (res: { url: string; size: number }) => void;
  onFileRemove: () => void;
}

export function PdfFields({
  form,
  uploadKey,
  onFileUpload,
  onFileRemove,
}: PdfFieldsProps) {
  const { register } = form;

  return (
    <div className="space-y-4">
      <input type="hidden" {...register("fileUrl")} />
      <input type="hidden" {...register("fileSize")} />

      <Upload
        key={`file-${uploadKey}`}
        uploadType="pdf"
        onSuccess={onFileUpload}
        onRemove={onFileRemove}
      />
    </div>
  );
}
