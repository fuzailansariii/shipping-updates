import { ProductType } from "@/lib/validations/product.schema";
import BookUploadForm from "./book-form";
import PdfUploadForm from "./pdf-form";
import { useState } from "react";

export const ProductUploadForm = () => {
  const [type, setType] = useState<ProductType>("book");

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

        {/* Type Switcher */}
        <div className="flex flex-col items-center md:items-start gap-2 font-lato mb-8">
          <label className="text-sm font-semibold text-gray-700">
            Product Type
          </label>
          <div className="relative flex w-52 rounded-full bg-gray-200 h-11">
            <div
              className={`absolute top-1 left-1 h-9 w-25 rounded-full bg-white shadow transition-transform duration-300 ${
                type === "book" ? "translate-x-25" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setType("pdf")}
              className={`relative z-10 w-1/2 rounded-full text-sm font-semibold transition ${
                type === "pdf" ? "text-black" : "text-neutral-500"
              }`}
            >
              PDF
            </button>
            <button
              type="button"
              onClick={() => setType("book")}
              className={`relative z-10 w-1/2 rounded-full text-sm font-semibold transition ${
                type === "book" ? "text-black" : "text-neutral-500"
              }`}
            >
              BOOK
            </button>
          </div>
        </div>

        {/*
          Render separate form components per type.
          The key prop ensures the form fully unmounts and remounts
          when type changes — resetting all state and form values cleanly.
        */}
        {type === "book" ? (
          <BookUploadForm key="book-form" />
        ) : (
          <PdfUploadForm key="pdf-form" />
        )}
      </div>
    </div>
  );
};
