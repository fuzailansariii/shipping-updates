"use client";
import React, { useEffect, useState } from "react";
import Upload from "./upload";
import {
  ProductFormData,
  BookFormData,
  bookSchema,
  PdfFormData,
  pdfSchema,
} from "@/lib/validations/zod-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./ui/input-form";
import { AlignLeft, UploadIcon } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

// type definition for form data
type ProductType = "book" | "pdf";

export const PDFUploadForm = () => {
  const [hasProductUploaded, setHasProductUploaded] = React.useState(false);
  const [hasImageUploaded, setHasImageUploaded] = React.useState(false);
  const [lastSubmitTime, setLastSubmitTime] = React.useState<number>(0);
  const [uploadKey, setUploadKey] = useState(Date.now()); // to reset upload components
  const [type, setType] = useState<ProductType>("book");
  const RATE_LIMIT_MS = 5000; // 5 seconds

  // separate forms for book and pdf
  const bookForm = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      type: "book",
      title: "",
      description: "",
      price: "",
      topics: [],
      thumbnail: "",
      images: [],
      language: "English",
      author: "",
      stockQuantity: 1,
      isActive: false,
      isFeatured: false,
      publisher: "",
      isbn: "",
      edition: "",
      fileUrl: undefined,
      fileSize: undefined,
    },
  });

  const pdfForm = useForm<PdfFormData>({
    resolver: zodResolver(pdfSchema),
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
      stockQuantity: 0,
      isActive: false,
      isFeatured: false,
    },
  });

  const form = type === "book" ? bookForm : pdfForm;
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitted, errors },
    setValue,
  } = form;

  const handlePdfUpload = (response: any) => {
    setValue("fileUrl", response.url, {
      shouldValidate: true,
    });
    setValue("fileSize", Number(response.size), {
      shouldValidate: true,
    });
    setHasProductUploaded(true);
    toast.success("PDF uploaded successfully!");
  };

  const handleThumbnailUpload = (response: any) => {
    setValue("thumbnail", response.url, {
      shouldValidate: true,
    });
    setHasImageUploaded(true);
    toast.success("Thumbnail uploaded successfully!");
  };

  const handlePdfRemove = () => {
    setHasProductUploaded(false);
    setValue("fileUrl", "");
    setValue("fileSize", 0);
    toast.success("PDF removed");
  };

  const handleImageRemove = () => {
    setHasImageUploaded(false);
    setValue("thumbnail", "");
    toast.success("Thumbnail removed");
  };

  // useEffect to reset form when type changes
  useEffect(() => {
    if (type === "book") {
      bookForm.reset({ ...bookForm.formState.defaultValues, type: "book" });
    } else {
      pdfForm.reset({ ...pdfForm.formState.defaultValues, type: "pdf" });
    }

    // Reset upload-related UI state
    setHasImageUploaded(false);
    setHasProductUploaded(false);
    setUploadKey((prev) => prev + 1); // Force remount of Upload components
  }, [type]);

  const onSubmit = async (data: ProductFormData) => {
    // Rate Limiting
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      const remainingTime = Math.ceil(
        (RATE_LIMIT_MS - (now - (lastSubmitTime || 0))) / 1000
      );
      toast.error(
        `Please wait ${remainingTime} more second(s) before submitting again.`
      );
      return;
    }
    setLastSubmitTime(now);
    if (!data.thumbnail) {
      toast.error("Please upload a thumbnail before submitting.");
      return;
    }

    if (type === "pdf" && (!data.fileUrl || !data.fileSize)) {
      toast.error("Please upload the PDF file before submitting.");
      return;
    }

    try {
      const processedData = {
        ...data,
        isActive: data.isActive ?? false,
        isFeatured: data.isFeatured ?? false,
        fileSize: data.fileSize,
        fileUrl: data.fileUrl,
      };
      console.log("PDF Upload Form Data:", processedData);
      // Here you can send `processedData` to your backend API
      const response = await axios.post("/api/admin/products", processedData);
      if (response.status === 201) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error);
      }
      console.log("PDF Data: ", response);
      // toast.success("PDF document uploaded successfully!");
      reset();
      setHasProductUploaded(false);
      setHasImageUploaded(false);
      setUploadKey((prev) => prev + 1); // Reset upload components
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Upload failed. Please try again.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  const isUploadComplete =
    type === "pdf" ? hasProductUploaded && hasImageUploaded : hasImageUploaded;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-700 mb-2">
            Upload Book or PDF
          </h1>
          <p className="text-gray-700">
            Share your knowledge with the community
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
          aria-label="PDF upload form"
        >
          {/* <div className="flex justify-center items-center mx-auto"> */}
          <div className="flex flex-col items-center md:items-start gap-2 font-lato">
            <label className="text-sm font-semibold text-gray-700">
              Product Type
            </label>

            <div className="relative flex w-52 rounded-full bg-gray-200 h-11">
              {/* Sliding Indicator */}
              <div
                className={`absolute top-1 left-1 h-9 w-25 rounded-full bg-white shadow transition-transform duration-300 ${
                  type === "book" ? "translate-x-25" : ""
                }`}
              />

              {/* PDF */}
              <button
                type="button"
                onClick={() => {
                  setType("pdf");
                  // No need to manually set the value, the form switch handles it
                }}
                className={`relative z-10 w-1/2 rounded-full text-sm font-semibold transition ${
                  type === "pdf" ? "text-black" : "text-neutral-500"
                }`}
              >
                PDF
              </button>

              {/* BOOK */}
              <button
                type="button"
                onClick={() => {
                  setType("book");
                  // No need to manually set the value, the form switch handles it
                }}
                className={`relative z-10 w-1/2 rounded-full text-sm font-semibold transition ${
                  type === "book" ? "text-black" : "text-neutral-500"
                }`}
              >
                BOOK
              </button>
              {/* </div> */}
            </div>
          </div>
          <div className="bg-neutral-100 rounded-2xl p-6 border border-gray-300">
            <h2 className="text-xl font-semibold text-neutral-700 mb-6 flex items-center gap-2">
              <UploadIcon className="w-5 h-5 text-blue-500" />
              Upload Files
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File upload components */}
              {type === "pdf" ? (
                <>
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
                </>
              ) : (
                <Upload
                  key={`book-thumbnail-${uploadKey}`}
                  uploadType="image"
                  onSuccess={handleThumbnailUpload}
                  onRemove={handleImageRemove}
                />
              )}
            </div>
          </div>

          <div className="bg-neutral-100 rounded-2xl p-6 border border-gray-300">
            <h2 className="text-xl font-semibold text-neutral-700 mb-6 flex items-center gap-2">
              <AlignLeft className="w-5 h-5 text-blue-500" />
              Document Details
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
                  placeholder={`Provide a detailed description of your ${
                    type === "book" ? "Book" : "PDF"
                  } content...`}
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

                {type === "book" ? (
                  <>
                    <Input
                      type="text"
                      name="author"
                      label="Author"
                      placeholder="2nd Officer - M. Hussain"
                      register={register("author")}
                      error={errors.author}
                    />
                    <Input
                      type="text"
                      name="stockQuantity"
                      label="Stock Quantity"
                      placeholder="50"
                      register={register("stockQuantity", {
                        valueAsNumber: true,
                      })}
                      error={errors.stockQuantity}
                    />
                    <Input
                      type="text"
                      name="publisher"
                      label="Publisher"
                      placeholder="M. Hussain"
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
                      placeholder="3rd Edition"
                      register={register("edition")}
                      error={errors.edition}
                    />
                  </>
                ) : (
                  <>
                    <input type="hidden" {...register("fileSize")} />
                    <input type="hidden" {...register("fileUrl")} />
                  </>
                )}

                <input type="hidden" {...register("thumbnail")} />
              </div>

              {/* Checkbox for isActive and isFeatured */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-neutral-700 rounded-lg border border-gray-800">
                  <div>
                    <label className="text-sm font-medium text-gray-200">
                      Publish Document
                    </label>
                    <p className="text-xs text-gray-400 mt-1">
                      Make this document available for purchase
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="sr-only peer"
                      aria-label="Publish Product"
                    />
                    <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-700 rounded-lg border border-gray-800">
                  <div>
                    <label className="text-sm font-medium text-gray-200">
                      Feature This Document
                    </label>
                    <p className="text-xs text-gray-400 mt-1">
                      Feature this document on the homepage
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isFeatured")}
                      className="sr-only peer"
                      aria-label="Feature Product"
                    />
                    <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isUploadComplete}
            className="w-full py-3 px-6 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Publishing..." : "Publish Document"}
          </button>
        </form>
      </div>
    </div>
  );
};
