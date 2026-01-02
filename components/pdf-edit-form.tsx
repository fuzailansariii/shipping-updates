import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  PDFFormData,
  pdfSchema,
  UpdatePDFData,
  updatePdfSchema,
} from "@/lib/validations/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { AlignLeft, Loader2, UploadIcon } from "lucide-react";
import Input from "./ui/input-form";
import Upload from "./upload";
// import { Image } from "@imagekit/next";

interface EditPDFFormProps {
  pdfId: string;
  initialData?: PDFFormData & { id: string };
}

export default function EditPDFForm({ pdfId, initialData }: EditPDFFormProps) {
  const [hasImageUploaded, setHasImageUploaded] = useState(
    !!initialData?.thumbnail
  );
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(!initialData);
  const RATE_LIMIT_MS = 5000; // 5 seconds

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<UpdatePDFData>({
    resolver: zodResolver(updatePdfSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      topics: [],
      thumbnail: "",
      isActive: false,
    },
  });

  //   fetch PDF data if not provided
  useEffect(() => {
    if (!initialData) {
      fetchPDFData();
    }
  }, [pdfId, initialData]);

  // Fetch PDF data function
  const fetchPDFData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/admin/pdfs/${pdfId}`);
      const data = response.data.pdf;

      setValue("title", data.title);
      setValue("description", data.description);
      setValue("price", data.price);
      // setValue("fileUrl", data.fileUrl);
      // setValue("fileSize", data.fileSize);
      setValue("thumbnail", data.thumbnail);
      setValue("topics", data.topics);
      setValue("isActive", data.isActive);

      setHasImageUploaded(!!data.thumbnail);
    } catch (error) {
      toast.error("Failed to load PDF data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThumbnailUpload = (response: any) => {
    setValue("thumbnail", response.url, {
      shouldValidate: true,
    });
    setHasImageUploaded(true);
    toast.success("Thumbnail uploaded successfully!");
  };

  const handleImageRemove = () => {
    setHasImageUploaded(false);
    setValue("thumbnail", "");
    toast.success("Thumbnail removed");
  };

  const onSubmit = async (data: UpdatePDFData) => {
    // Rate Limiting
    const now = Date.now();
    if (now - lastSubmitTime < RATE_LIMIT_MS) {
      const remainingTime = Math.ceil(
        (RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000
      );
      toast.error(
        `Please wait ${remainingTime} more second(s) before submitting again.`
      );
      return;
    }
    setLastSubmitTime(now);

    try {
      // Transform data for API (convert price to number)
      // const updateData = {
      //   title: data.title,
      //   description: data.description,
      //   price: Number(data.price), // Convert string to number for API
      //   thumbnail: data.thumbnail,
      //   topics: data.topics,
      //   isActive: data.isActive,
      // };
      console.log("Submitting data:", data);
      const response = await axios.patch(`/api/admin/pdfs/${pdfId}`, data);
      if (response.data.success) {
        toast.success(response.data.message || "PDF updated successfully!");
      } else {
        toast.error(response.data.error || "Failed to update PDF.");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response?.data?.error ||
            "An error occurred while updating the PDF."
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error("Error updating PDF:", error);
    }
  };

  // const currentThumbnail = watch("thumbnail");

  if (isLoading) {
    return (
      <div className="min-h-screen w-full items-center justify-center flex">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-700 mb-2">
            Upload PDF Document
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
          <div className="bg-neutral-100 rounded-2xl p-6 border border-gray-300">
            <h2 className="text-xl font-semibold text-neutral-700 mb-6 flex items-center gap-2">
              <UploadIcon className="w-5 h-5 text-blue-500" />
              Upload Files
            </h2>

            {/* Current Thumbnail */}
            {/* {currentThumbnail && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Current Thumbnail:</p>
                <Image
                  src={currentThumbnail}
                  alt="Current thumbnail"
                  className="w-40 h-40 object-cover rounded-lg border border-gray-300"
                  width={500}
                  height={500}
                  loading="eager"
                />
              </div>
            )} */}
            <div className="max-w-md">
              {/* File upload components */}
              <Upload
                uploadType="image"
                onSuccess={handleThumbnailUpload}
                onRemove={handleImageRemove}
              />
              <input type="hidden" {...register("thumbnail")} />
            </div>
          </div>

          {/* Document Details */}
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
                  register={register("price", {
                    valueAsNumber: true,
                  })}
                  error={errors.price}
                />

                <Input
                  name="topics"
                  label="Topics (comma-separated)"
                  type="text"
                  placeholder="e.g., GP Rating, Shipping Updates"
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
                {/* <input type="hidden" {...register("fileUrl")} />
                <input type="hidden" {...register("fileSize")} /> */}
              </div>

              {/* Publish Toggle */}
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
                    aria-label="Publish Document"
                  />
                  <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Publishing..." : "Publish Document"}
          </button>
        </form>
      </div>
    </div>
  );
}
