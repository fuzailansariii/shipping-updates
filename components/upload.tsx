"use client";

import { upload } from "@imagekit/next";
import React, { useState } from "react";
import {
  validateFileSimple,
  isPDFFile,
  isImageFile,
} from "@/utils/validate-file";
import axios from "axios";

interface FileUploadProps {
  uploadType: "pdf" | "image" | "all";
  onSuccess: (response: any) => void;
  onProgress?: (progress: number) => void;
}

const Upload = ({ onSuccess, onProgress, uploadType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the file upload process.
   *
   * This function:
   * - Validates file selection.
   * - Retrieves upload authentication credentials.
   * - Initiates the file upload via the ImageKit SDK.
   * - Updates the upload progress.
   * - Catches and processes errors accordingly.
   */
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError("No file selected");
      return;
    }

    if (!file.type) {
      setError("File type is undefined");
      return;
    }

    let validationError: string | null = null;

    if (uploadType === "pdf") {
      validationError = validateFileSimple(file, "pdf");
    } else if (uploadType === "image") {
      validationError = validateFileSimple(file, "image");
    } else if (uploadType === "all") {
      if (isPDFFile(file)) {
        validationError = validateFileSimple(file, "pdf");
      } else if (isImageFile(file)) {
        validationError = validateFileSimple(file, "image");
      } else {
        validationError = "Only PDF and image files are allowed";
      }
    }
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const { data: authRes } = await axios.get("/api/upload-auth");

      const fileData = await upload({
        // Authentication parameters
        expire: authRes.expire,
        token: authRes.token,
        signature: authRes.signature,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        file,
        fileName: file.name,
        // Progress callback to update upload progress state
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });
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
    }
  };

  const getAcceptedFiles = () => {
    if (uploadType === "pdf") return "application/pdf";
    if (uploadType === "image") return "image/*";
    return "application/pdf, image/*";
  };

  return (
    <>
      <input
        type="file"
        accept={getAcceptedFiles()}
        onChange={(e) => {
          handleUpload(e);
          e.target.value = "";
        }}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default Upload;
