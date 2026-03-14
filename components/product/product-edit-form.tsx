"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import {
  AlignLeft,
  BookOpen,
  FileText,
  Layers,
  Loader2,
  Save,
  UploadIcon,
} from "lucide-react";
import Input from "../ui/input-form";
import Upload from "../upload";
import {
  FrontendUpdateProductValues,
  FrontendUpdateBookValues,
  FrontendUpdatePdfValues,
  frontendUpdateProductSchema,
  backendUpdateProductSchema,
} from "@/lib/validations/product.schema";
import { Toggle } from "../toggle";
import { BookFields } from "./book-fields";
import { PdfFields } from "./pdf-fields";
import ErrorState from "../admin/shared/error-state";
import { useRouter } from "next/navigation";

interface EditProductProps {
  productId: string;
}

// Shared UI helpers

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

function TypeBadge({ type }: { type: "book" | "pdf" | undefined }) {
  if (!type) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
        type === "book"
          ? "bg-amber-50 text-amber-700"
          : "bg-blue-50 text-blue-600"
      }`}
    >
      {type === "book" ? (
        <BookOpen className="w-3 h-3" />
      ) : (
        <FileText className="w-3 h-3" />
      )}
      <span className="capitalize">{type}</span>
    </span>
  );
}

// Main Component

export default function EditProduct({ productId }: EditProductProps) {
  const [hasImageUploaded, setHasImageUploaded] = useState(false);
  const [hasFileUploaded, setHasFileUploaded] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [uploadKey, setUploadKey] = useState(0);
  const RATE_LIMIT_MS = 5000;
  const router = useRouter();

  const form = useForm<FrontendUpdateProductValues>({
    resolver: zodResolver(frontendUpdateProductSchema),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = form;

  const type = watch("type");

  // Fetch & prefill

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);
        const res = await axios.get(`/api/admin/products/${productId}`);
        console.log("Res: ", res);
        const data = res.data.product;

        reset({
          type: data.type,
          title: data.title,
          description: data.description,
          price: (data.price / 100).toFixed(2),
          topics: Array.isArray(data.topics) ? data.topics.join(", ") : "",
          language: data.language,
          thumbnail: data.thumbnail ?? "",
          isActive: data.isActive ?? false,
          isFeatured: data.isFeatured ?? false,
          ...(data.type === "book"
            ? {
                author: data.author ?? "",
                stockQuantity: data.stockQuantity ?? 0,
                publisher: data.publisher ?? "",
                isbn: data.isbn ?? "",
                edition: data.edition ?? "",
              }
            : {
                fileUrl: data.fileUrl ?? "",
                fileSize: data.fileSize ?? 0,
              }),
        });

        setHasImageUploaded(!!data.thumbnail);
        if (data.type === "pdf") setHasFileUploaded(!!data.fileUrl);
      } catch (err) {
        console.error("[EditProduct] fetchProduct failed:", err);
        const msg = axios.isAxiosError(err)
          ? (err.response?.data?.error ?? "Failed to load product.")
          : "Unexpected error while loading product.";
        setFetchError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId, reset]);

  // Upload handlers

  const handleThumbnailUpload = (res: { url: string }) => {
    setValue("thumbnail", res.url, { shouldValidate: true });
    setHasImageUploaded(true);
    toast.success("Thumbnail uploaded successfully!");
  };

  const handleImageRemove = () => {
    setValue("thumbnail", "");
    setHasImageUploaded(false);
    toast.success("Thumbnail removed");
  };

  const handleFileUpload = (res: { url: string; size: number }) => {
    setValue("fileUrl", res.url, { shouldValidate: true });
    setValue("fileSize", res.size, { shouldValidate: true });
    setHasFileUploaded(true);
    toast.success("File uploaded successfully!");
  };

  const handleFileRemove = () => {
    setValue("fileUrl", "");
    setValue("fileSize", 0);
    setHasFileUploaded(false);
    toast.success("File removed");
  };

  // Submit

  const onSubmit = async (data: FrontendUpdateProductValues) => {
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      const remaining = Math.ceil(
        (RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000,
      );
      toast.error(`Please wait ${remaining} more second(s).`);
      return;
    }
    setLastSubmitTime(now);

    const backendParsed = backendUpdateProductSchema.safeParse(data);
    if (!backendParsed.success) {
      toast.error("Invalid data. Please check your inputs.");
      console.error(backendParsed.error.flatten());
      return;
    }

    try {
      const res = await axios.patch(
        `/api/admin/products/${productId}`,
        backendParsed.data,
      );
      toast.success(res.data.message ?? "Product updated successfully!");
      router.push("/admin/products");
      setUploadKey((prev) => prev + 1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error ?? "Failed to update product.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  // Loading / error states

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-400 font-medium">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return <ErrorState message="Failed to load product" />;
  }

  // Form
  return (
    <div className="py-4 md:py-8">
      <div className="w-full md:max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Page header */}
        <div>
          <div className="flex items-center justify-between gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-secondary-dark">
              Edit Product
            </h1>
            <TypeBadge type={type} />
          </div>
          <p className="mt-1 text-sm text-secondary-dark/60">
            Update your product details, files, and visibility settings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-6"
        >
          {/* Files & Media */}
          <Section
            icon={<UploadIcon className="w-3.5 h-3.5 text-blue-500" />}
            title="Files & Media"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Upload
                key={`thumbnail-${uploadKey}`}
                uploadType="image"
                onSuccess={handleThumbnailUpload}
                onRemove={handleImageRemove}
              />
              <input type="hidden" {...register("thumbnail")} />

              {type === "pdf" && (
                <PdfFields
                  form={
                    form as unknown as import("react-hook-form").UseFormReturn<FrontendUpdatePdfValues>
                  }
                  uploadKey={uploadKey}
                  onFileUpload={handleFileUpload}
                  onFileRemove={handleFileRemove}
                />
              )}
            </div>
          </Section>

          {/* Core details */}
          <Section
            icon={<AlignLeft className="w-3.5 h-3.5 text-blue-500" />}
            title="Product Details"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="title"
                label="Title"
                type="text"
                placeholder="Enter title"
                register={register("title")}
                error={form.formState.errors.title}
              />
              <Input
                name="price"
                label="Price (INR)"
                type="text"
                placeholder="0.00"
                register={register("price")}
                error={form.formState.errors.price}
              />
              <Input
                name="topics"
                label="Topics"
                type="text"
                placeholder="e.g., GP Rating, Navigation"
                register={register("topics", {
                  setValueAs: (v) => {
                    if (typeof v === "string") {
                      return v
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean);
                    }
                    if (Array.isArray(v)) return v;
                    return [];
                  },
                })}
                error={
                  Array.isArray(form.formState.errors.topics)
                    ? form.formState.errors.topics[0]
                    : form.formState.errors.topics
                }
              />
              <Input
                type="text"
                name="language"
                label="Language"
                placeholder="English"
                register={register("language")}
                error={form.formState.errors.language}
              />
              <div className="md:col-span-2">
                <Input
                  as="textarea"
                  name="description"
                  label="Description"
                  placeholder="Enter a short description of this product"
                  register={register("description")}
                  error={form.formState.errors.description}
                />
              </div>
            </div>
          </Section>

          {type === "book" && (
            <BookFields
              form={
                form as unknown as import("react-hook-form").UseFormReturn<FrontendUpdateBookValues>
              }
            />
          )}

          {/* Visibility */}
          <Section
            icon={<Layers className="w-3.5 h-3.5 text-blue-500" />}
            title="Visibility & Featuring"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Toggle
                label="Publish Product"
                description="Make this product available for purchase"
                name="isActive"
                register={register}
              />
              <Toggle
                label="Feature This Product"
                description="Highlight this product on the homepage"
                name="isFeatured"
                register={register}
              />
            </div>
          </Section>

          <input type="hidden" {...register("type")} />

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
