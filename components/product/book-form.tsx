"use client";
import {
  backendSchema,
  BookFormData,
  frontendBookSchema,
  RATE_LIMIT_MS,
} from "@/lib/validations/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input-form";
import { toast } from "sonner";
import Upload from "../upload";
import { AlignLeft, UploadIcon } from "lucide-react";
import axios from "axios";
import { Toggle } from "../toggle";
import { ChildFormRef } from "./product-upload-form";
import { useProductSubmit } from "@/lib/hooks/useProductForm";

interface BookUploadFormProps {
  onChange?: () => void;
}

const BookUploadForm = forwardRef<ChildFormRef, BookUploadFormProps>(
  function BookUploadForm({ onChange }, ref) {
    const [hasImageUploaded, setHasImageUploaded] = useState(false);
    const [uploadKey, setUploadKey] = useState(Date.now());

    // hook
    const { submitProduct } = useProductSubmit();

    const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { isSubmitting, errors, isDirty, isValid },
    } = useForm<BookFormData>({
      resolver: zodResolver(frontendBookSchema),
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
      },
    });

    // Expose isDirty to the parent via ref.
    useImperativeHandle(ref, () => ({ isDirty }), [isDirty]);

    const handleThumbnailUpload = (response: { url: string }) => {
      setValue("thumbnail", response.url, { shouldValidate: true });
      setHasImageUploaded(true);
      onChange?.(); // notify parent this form is now dirty
      toast.success("Thumbnail uploaded successfully!");
    };

    const handleImageRemove = () => {
      setHasImageUploaded(false);
      setValue("thumbnail", "");
      onChange?.();
      toast.success("Thumbnail removed");
    };

    const onSubmit = async (data: BookFormData) => {
      const success = await submitProduct(data as Record<string, unknown>);
      if (success) {
        reset();
        setHasImageUploaded(false);
        setUploadKey((prev) => prev + 1);
      }
    };

    // const onSubmit = async (data: BookFormData) => {
    //   const now = Date.now();
    //   if (now - lastSubmitTime < RATE_LIMIT_MS) {
    //     const remaining = Math.ceil(
    //       (RATE_LIMIT_MS - (now - lastSubmitTime)) / 1000,
    //     );
    //     toast.error(
    //       `Please wait ${remaining} more second(s) before submitting again.`,
    //     );
    //     return;
    //   }
    //   setLastSubmitTime(now);

    //   const backendParsed = backendSchema.safeParse(data);
    //   if (!backendParsed.success) {
    //     toast.error("Invalid data. Please check your inputs.");
    //     console.error(backendParsed.error.flatten());
    //     return;
    //   }

    //   try {
    //     const response = await axios.post(
    //       "/api/admin/products",
    //       backendParsed.data,
    //     );
    //     if (response.status === 201) {
    //       toast.success(response.data.message);
    //       reset();
    //       setHasImageUploaded(false);
    //       setUploadKey((prev) => prev + 1);
    //     } else {
    //       toast.error(response.data.error);
    //     }
    //   } catch (error) {
    //     if (axios.isAxiosError(error)) {
    //       const message =
    //         error.response?.data?.error ?? "Upload failed. Please try again.";
    //       toast.error(message);
    //     } else {
    //       toast.error("An unexpected error occurred.");
    //     }
    //   }
    // };

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={onChange}
        className="space-y-8"
        aria-label="Book upload form"
      >
        {/* Upload Section */}
        <div className="bg-neutral-100 rounded-2xl p-6 border border-gray-300">
          <h2 className="text-xl font-semibold text-neutral-700 mb-6 flex items-center gap-2">
            <UploadIcon className="w-5 h-5 text-blue-500" />
            Upload Files
          </h2>
          <div className="w-full md:max-w-1/2 mx-auto">
            <Upload
              key={`book-thumbnail-${uploadKey}`}
              uploadType="image"
              onSuccess={handleThumbnailUpload}
              onRemove={handleImageRemove}
            />
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-neutral-100 rounded-2xl p-6 border border-gray-300">
          <h2 className="text-xl font-semibold text-neutral-700 mb-6 flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-blue-500" />
            Book Details
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="title"
                label="Book Title"
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
                error={errors.topics?.root ?? errors.topics?.[0]}
              />
              <Input
                as="textarea"
                name="description"
                label="Description"
                placeholder="Provide a detailed description of your book..."
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
                register={register("stockQuantity", { valueAsNumber: true })}
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
            </div>

            <input type="hidden" {...register("thumbnail")} />

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
          disabled={isSubmitting || !hasImageUploaded || !isValid}
          className="w-full py-3 px-6 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Publishing..." : "Publish Book"}
        </button>
      </form>
    );
  },
);

export default BookUploadForm;
