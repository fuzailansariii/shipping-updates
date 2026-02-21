import {
  backendSchema,
  frontendPdfSchema,
  PdfFormData,
  RATE_LIMIT_MS,
} from "@/lib/validations/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AlignLeft, UploadIcon } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Upload from "../upload";
import Input from "../ui/input-form";
import { Toggle } from "../toggle";

export default function PdfUploadForm() {
  const [hasImageUploaded, setHasImageUploaded] = useState(false);
  const [hasPdfUploaded, setHasPdfUploaded] = useState(false);
  const [uploadKey, setUploadKey] = useState(Date.now());
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<PdfFormData>({
    resolver: zodResolver(frontendPdfSchema),
    defaultValues: {
      type: "pdf",
      title: "",
      description: "",
      price: "",
      topics: [],
      thumbnail: "",
      images: [],
      language: "English",
      fileUrl: "",
      fileSize: 0,
      isActive: false,
      isFeatured: false,
    },
  });

  const handleThumbnailUpload = (response: { url: string }) => {
    setValue("thumbnail", response.url, { shouldValidate: true });
    setHasImageUploaded(true);
    toast.success("Thumbnail uploaded successfully!");
  };

  const handlePdfUpload = (response: { url: string; size: number }) => {
    setValue("fileUrl", response.url, { shouldValidate: true });
    setValue("fileSize", Number(response.size), { shouldValidate: true });
    setHasPdfUploaded(true);
    toast.success("PDF uploaded successfully!");
  };

  const handleImageRemove = () => {
    setHasImageUploaded(false);
    setValue("thumbnail", "");
    toast.success("Thumbnail removed");
  };

  const handlePdfRemove = () => {
    setHasPdfUploaded(false);
    setValue("fileUrl", "");
    setValue("fileSize", 0);
    toast.success("PDF removed");
  };

  const onSubmit = async (data: PdfFormData) => {
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      const remaining = Math.ceil(
        (RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000,
      );
      toast.error(
        `Please wait ${remaining} more second(s) before submitting again.`,
      );
      return;
    }
    setLastSubmitTime(now);

    // Parse and validate with backend schema (handles paise conversion)
    const backendParsed = backendSchema.safeParse(data);
    if (!backendParsed.success) {
      toast.error("Invalid data. Please check your inputs.");
      console.error(backendParsed.error.flatten());
      return;
    }

    try {
      const response = await axios.post(
        "/api/admin/products",
        backendParsed.data,
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        reset();
        setHasImageUploaded(false);
        setHasPdfUploaded(false);
        setUploadKey((prev) => prev + 1);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Upload failed. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
      aria-label="PDF upload form"
    >
      {/* Upload Section */}
      <div className="bg-neutral-100 rounded-2xl p-6 border border-gray-300">
        <h2 className="text-xl font-semibold text-neutral-700 mb-6 flex items-center gap-2">
          <UploadIcon className="w-5 h-5 text-blue-500" />
          Upload Files
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Upload
            key={`pdf-thumbnail-${uploadKey}`}
            uploadType="image"
            onSuccess={handleThumbnailUpload}
            onRemove={handleImageRemove}
          />
          <Upload
            key={`pdf-file-${uploadKey}`}
            uploadType="pdf"
            onSuccess={handlePdfUpload}
            onRemove={handlePdfRemove}
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="bg-neutral-100 rounded-2xl p-6 border border-gray-300">
        <h2 className="text-xl font-semibold text-neutral-700 mb-6 flex items-center gap-2">
          <AlignLeft className="w-5 h-5 text-blue-500" />
          PDF Details
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="title"
              label="Document Title"
              type="text"
              placeholder="Enter a clear, descriptive title"
              register={register("title")}
              error={errors.title}
            />
            <Input
              name="price"
              label="Price (INR)"
              type="text"
              placeholder="0.00"
              register={register("price")}
              error={errors.price}
            />
            <Input
              name="topics"
              label="Topics (comma-separated)"
              type="text"
              placeholder="e.g., GP Rating, IMU CET"
              register={register("topics", {
                setValueAs: (value) =>
                  typeof value === "string"
                    ? value
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean)
                    : value,
              })}
              error={errors.topics as any}
            />
            <Input
              as="textarea"
              name="description"
              label="Description"
              placeholder="Provide a detailed description of your PDF content..."
              register={register("description")}
              error={errors.description}
            />
            <Input
              type="text"
              name="language"
              label="Language"
              placeholder="English"
              register={register("language")}
              error={errors.language}
            />
          </div>

          {/* Hidden fields */}
          <input type="hidden" {...register("thumbnail")} />
          <input type="hidden" {...register("fileUrl")} />
          <input
            type="hidden"
            {...register("fileSize", { valueAsNumber: true })}
          />

          {/* Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Toggle
              label="Publish Document"
              description="Make this document available for purchase"
              name="isActive"
              register={register}
            />
            <Toggle
              label="Feature This Document"
              description="Feature this document on the homepage"
              name="isFeatured"
              register={register}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !hasImageUploaded || !hasPdfUploaded}
        className="w-full py-3 px-6 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Publishing..." : "Publish PDF"}
      </button>
    </form>
  );
}
