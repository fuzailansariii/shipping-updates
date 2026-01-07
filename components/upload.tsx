"use client";

import { upload } from "@imagekit/next";
import React, { useId, useRef, useState } from "react";
import {
  validateFileSimple,
  isPDFFile,
  isImageFile,
} from "@/utils/validate-file";
import axios from "axios";
import { AlertCircle, Check, FileText, Image, Loader2, X } from "lucide-react";

interface FileUploadProps {
  uploadType: "pdf" | "image" | "all";
  onSuccess: (response: any) => void;
  onProgress?: (progress: number) => void;
  onRemove?: () => void;
}

const Upload = ({
  onSuccess,
  onProgress,
  uploadType,
  onRemove,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any | null>(null);
  const [progress, setProgress] = useState(0);
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!file) return "No file selected";
    if (!file.type) return "File type is undefined";

    if (uploadType === "pdf") {
      return validateFileSimple(file, "pdf");
    } else if (uploadType === "image") {
      return validateFileSimple(file, "image");
    } else if (uploadType === "all") {
      if (isPDFFile(file)) return validateFileSimple(file, "pdf");
      if (isImageFile(file)) return validateFileSimple(file, "image");
      return "Only PDF and image files are allowed";
    }
    return null;
  };

  const processFile = async (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const { data: authRes } = await axios.get("/api/upload-auth");

      const fileData = await upload({
        expire: authRes.expire,
        token: authRes.token,
        signature: authRes.signature,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        file,
        fileName: file.name,
        onProgress: (event) => {
          if (!event.lengthComputable) return;

          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
          onProgress?.(percent);
        },
        folder: isPDFFile(file)
          ? "/shipping-updates/pdfs"
          : "/shipping-updates/images",
        tags: [uploadType],
      });

      setUploadedFile(fileData);
      onSuccess(fileData);
    } catch (error: any) {
      console.error("Upload failed:", error);
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setError(null);
    setProgress(0);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetUpload();
    onRemove?.();
  };

  const getAcceptedFiles = () => {
    if (uploadType === "pdf") return "application/pdf";
    if (uploadType === "image") return "image/*";
    return "application/pdf, image/*";
  };

  const getUploadTypeLabel = () => {
    if (uploadType === "pdf") return "PDF Document";
    if (uploadType === "image") return "Thumbnail Image";
    return "PDF or Image File";
  };

  const Icon = uploadType === "pdf" ? FileText : Image;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {getUploadTypeLabel()}
      </label>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all ${
          isDragOver
            ? "border-blue-500 bg-blue-500/10"
            : uploadedFile
            ? "border-green-500 bg-green-500/5"
            : error
            ? "border-red-500 bg-red-500/5"
            : "border-gray-700 bg-neutral-200 hover:border-gray-600"
        }`}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={getAcceptedFiles()}
          onChange={handleUpload}
          disabled={uploading || uploadedFile}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center justify-center text-center space-y-3 pointer-events-none">
          {uploading ? (
            <>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-400">
                  Uploading... {progress}%
                </p>
              </div>
              <div className="w-full bg-gray-400 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : uploadedFile && !error ? (
            <>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-400">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(uploadedFile.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors pointer-events-auto"
                aria-label="Remove file"
              >
                <X />
              </button>
            </>
          ) : error ? (
            <>
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-400">{error}</p>
                <p className="text-xs text-gray-500 mt-1">Click to try again</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                <Icon className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  Drop your {uploadType} here
                </p>
                <p className="text-xs text-gray-600 mt-1">or click to browse</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
