import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BookFormData,
  PdfFormData,
  UpdateProductData,
  updateProductSchema,
} from "@/lib/validations/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { AlignLeft, Loader2, UploadIcon } from "lucide-react";
import Input from "./ui/input-form";
import Upload from "./upload";

type ProductType = "book" | "pdf";

interface EditPDFFormProps {
  productId: string;
  initialData?: BookFormData | PdfFormData;
}

export default function EditPDFForm({
  productId,
  initialData,
}: EditPDFFormProps) {
  const [type, setType] = useState<ProductType>(initialData?.type || "book");
  const [hasImageUploaded, setHasImageUploaded] = useState(
    !!initialData?.thumbnail
  );
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(!initialData);
  const RATE_LIMIT_MS = 5000; // 5 seconds

  const form = useForm<UpdateProductData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      type: type,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  //   fetch PDF data if not provided
  useEffect(() => {
    if (!initialData) {
      fetchPDFData();
    }
  }, [productId, initialData]);

  // Fetch PDF data function
  const fetchPDFData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/admin/products/${productId}`);
      const data = response.data.product;

      const productType = data.type as ProductType;
      setType(productType);

      // Reset form with all data at once
      form.reset({
        type: productType,
        title: data.title,
        description: data.description,
        price: String(data.price),
        topics: data.topics,
        language: data.language,
        thumbnail: data.thumbnail,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        ...(productType === "book"
          ? {
              author: data.author,
              stockQuantity: data.stockQuantity,
              publisher: data.publisher,
              isbn: data.isbn,
              edition: data.edition,
            }
          : {
              fileUrl: data.fileUrl,
              fileSize: data.fileSize,
              stockQuantity: 0,
            }),
      });
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

  const onSubmit = async (data: UpdateProductData) => {
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
      console.log("Submitting data:", data);
      const response = await axios.patch(
        `/api/admin/products/${productId}`,
        data
      );
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
          onSubmit={handleSubmit(onSubmit, (errors) => {
            console.log("❌ FORM ERRORS", errors);
            toast.error("Form validation failed");
          })}
          className="space-y-8"
          aria-label="PDF upload form"
        >
          <div className="bg-neutral-100 rounded-2xl p-6 border border-gray-300">
            <h2 className="text-xl font-semibold text-neutral-700 mb-6 flex items-center gap-2">
              <UploadIcon className="w-5 h-5 text-blue-500" />
              Upload Files
            </h2>

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
                  register={register("price")}
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

                <Input
                  type="text"
                  name="language"
                  placeholder="English"
                  label="Language"
                  register={register("language")}
                  error={errors.language}
                />

                {/* Render inputs based on type */}
                {type === "book" && (
                  <>
                    <Input
                      type="text"
                      name="author"
                      label="Author"
                      placeholder="3rd Officer - M. Hussain"
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
                )}

                <input type="hidden" {...register("type")} />
              </div>
              {/* isActive, isFeatured Toggle */}
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
                      aria-label="Publish Document"
                    />
                    <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
                <div className="flex items-center justify-between p-4 bg-neutral-700 rounded-lg border border-gray-800">
                  <div>
                    <label className="text-sm font-medium text-gray-200">
                      Feature Document
                    </label>
                    <p className="text-xs text-gray-400 mt-1">
                      Highlight this document on the homepage
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("isFeatured")}
                      className="sr-only peer"
                      aria-label="Publish Document"
                    />
                    <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>
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
