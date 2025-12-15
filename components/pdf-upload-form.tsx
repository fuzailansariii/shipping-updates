"use client";
import React from "react";
import Upload from "./upload";
import { pdfSchema, PDFFormData } from "@/lib/validations/zod-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "./ui/input-form";
import { AlignLeft, UploadIcon } from "lucide-react";

export const PDFUploadForm = () => {
  const {
    register,
    handleSubmit,
    formState: { disabled, errors },
    reset,
    setValue,
  } = useForm<PDFFormData>({
    resolver: zodResolver(pdfSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      fileUrl: "",
      fileSize: "",
      topics: [],
      isActive: false,
    },
  });

  const onSubmit = (data: PDFFormData) => {
    const processedData = {
      ...data,
      price: Number(data.price),
      isActive: data.isActive ?? true,
      fileSize: data.fileSize,
      fileUrl: data.fileUrl,
    };
    console.log("PDF Upload Form Data:", processedData);
  };

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
          onSubmit={handleSubmit(onSubmit, (errors) =>
            console.error("Validation Errors:", errors)
          )}
          className="space-y-8"
        >
          <div className="bg-neutral-100 rounded-2xl p-6 border border-gray-300">
            <h2 className="text-xl font-semibold text-neutral-700 mb-6 flex items-center gap-2">
              <UploadIcon className="w-5 h-5 text-blue-500" />
              Upload Files
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Upload
                uploadType="pdf"
                onSuccess={(response) => {
                  setValue("fileUrl", response.fileUrl, {
                    shouldValidate: true,
                  });
                  setValue("fileSize", response.fileSize, {
                    shouldValidate: true,
                  });
                }}
              />
              <Upload
                uploadType="image"
                onSuccess={(response) => {
                  setValue("thumbnail", response.fileUrl, {
                    shouldValidate: true,
                  });
                  setValue("fileSize", response.fileSize, {
                    shouldValidate: true,
                  });
                }}
              />
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
                  placeholder="e.g., Programming, Web Development"
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
                <input type="hidden" {...register("fileSize")} />
                <input type="hidden" {...register("fileUrl")} />
              </div>

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
                  />
                  <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.top-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all font-medium shadow-lg shadow-blue-500/20"
          >
            Publish Document
          </button>
        </form>
      </div>
    </div>
  );
};
