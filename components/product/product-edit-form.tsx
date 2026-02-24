import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { AlignLeft, Loader2, UploadIcon } from "lucide-react";
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
import { UseFormReturn } from "react-hook-form";

interface EditProductProps {
  productId: string;
}

export default function EditProduct({ productId }: EditProductProps) {
  const [hasImageUploaded, setHasImageUploaded] = useState(false);
  const [hasFileUploaded, setHasFileUploaded] = useState(false); // For PDF file
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadKey, setUploadKey] = useState(Date.now());
  const RATE_LIMIT_MS = 5000;

  const form = useForm<FrontendUpdateProductValues>({
    resolver: zodResolver(frontendUpdateProductSchema),
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const type = watch("type");

  // Type assertions for easier access to type-specific fields and errors
  const bookForm = form as UseFormReturn<FrontendUpdateBookValues>;
  const pdfForm = form as UseFormReturn<FrontendUpdatePdfValues>;

  /** Fetch product and prefill form */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/admin/products/${productId}`);
        const data = res.data.product;

        reset({
          type: data.type,
          title: data.title,
          description: data.description,
          price: (data.price / 100).toFixed(2),
          topics: data.topics ?? [],
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
      } catch {
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId, reset]);

  /** Handle uploads */
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

  /** Submit handler */
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

    // backend schema handles paise conversion — no manual parseFloat needed
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
      setUploadKey((prev) => prev + 1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error ?? "Failed to update product.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-700 mb-2">
            Edit Product
          </h1>
          <p className="text-gray-700">Update your product information</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
          aria-label="Edit product form"
        >
          {/* Upload Section */}
          <div className="bg-neutral-100 rounded-2xl p-6 border border-gray-300">
            <h2 className="text-xl font-semibold text-neutral-700 mb-6 flex items-center gap-2">
              <UploadIcon className="w-5 h-5 text-blue-500" />
              Upload Files
            </h2>

            {/* Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Thumbnail */}
              <Upload
                key={`thumbnail-${uploadKey}`}
                uploadType="image"
                onSuccess={handleThumbnailUpload}
                onRemove={handleImageRemove}
              />
              <input type="hidden" {...register("thumbnail")} />

              {/* PDF file (only if type === pdf) */}
              {type === "pdf" && (
                <>
                  <Upload
                    key={`file-${uploadKey}`}
                    uploadType="pdf"
                    onSuccess={handleFileUpload}
                    onRemove={handleFileRemove}
                  />
                  <input type="hidden" {...register("fileUrl")} />
                  <input type="hidden" {...register("fileSize")} />
                </>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-neutral-100 rounded-2xl p-6 border border-gray-300">
            <h2 className="text-xl font-semibold text-neutral-700 mb-6 flex items-center gap-2">
              <AlignLeft className="w-5 h-5 text-blue-500" />
              Product Details
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="title"
                  label="Title"
                  type="text"
                  placeholder="Enter title"
                  register={bookForm.register("title")}
                  error={bookForm.formState.errors.title}
                />
                <Input
                  name="price"
                  label="Price (INR)"
                  type="text"
                  placeholder="0.00"
                  register={bookForm.register("price")}
                  error={bookForm.formState.errors.price}
                />
                <Input
                  name="topics"
                  label="Topics"
                  type="text"
                  placeholder="e.g., GP Rating"
                  register={bookForm.register("topics", {
                    setValueAs: (v) =>
                      typeof v === "string"
                        ? v
                            .split(",")
                            .map((x) => x.trim())
                            .filter(Boolean)
                        : v,
                  })}
                  error={
                    Array.isArray(bookForm.formState.errors.topics)
                      ? bookForm.formState.errors.topics[0]
                      : bookForm.formState.errors.topics
                  }
                />
                <Input
                  as="textarea"
                  name="description"
                  label="Description"
                  placeholder="Enter description"
                  register={bookForm.register("description")}
                  error={bookForm.formState.errors.description}
                />
                <Input
                  type="text"
                  name="language"
                  label="Language"
                  placeholder="English"
                  register={bookForm.register("language")}
                  error={bookForm.formState.errors.language}
                />

                {/* Book-specific fields */}
                {type === "book" && (
                  <>
                    <Input
                      type="text"
                      name="author"
                      label="Author"
                      placeholder="Author name"
                      register={bookForm.register("author")}
                      error={bookForm.formState.errors.author}
                    />
                    <Input
                      type="number"
                      name="stockQuantity"
                      label="Stock Quantity"
                      placeholder="50"
                      register={bookForm.register("stockQuantity", {
                        valueAsNumber: true,
                      })}
                      error={bookForm.formState.errors.stockQuantity}
                    />
                    <Input
                      type="text"
                      name="publisher"
                      label="Publisher"
                      placeholder="Publisher"
                      register={bookForm.register("publisher")}
                      error={bookForm.formState.errors.publisher}
                    />
                    <Input
                      type="text"
                      name="isbn"
                      label="ISBN"
                      placeholder="123-45-678-9"
                      register={bookForm.register("isbn")}
                      error={bookForm.formState.errors.isbn}
                    />
                    <Input
                      type="text"
                      name="edition"
                      label="Edition"
                      placeholder="1st Edition"
                      register={bookForm.register("edition")}
                      error={bookForm.formState.errors.edition}
                    />
                  </>
                )}

                <input type="hidden" {...bookForm.register("type")} />
              </div>

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
            disabled={isSubmitting}
            className="w-full py-3 px-6 rounded-lg bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
