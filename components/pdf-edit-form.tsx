import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PDFFormData, pdfSchema } from "@/lib/validations/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

interface EditPDFFormProps {
  pdfId: string;
  initilaData?: PDFFormData & { id: string };
}

export default function EditPDFForm({ pdfId, initilaData }: EditPDFFormProps) {
  const [hasImageUploaded, setHasImageUploaded] = useState(
    !!initilaData?.thumbnail
  );
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(!initilaData);
  const RATE_LIMIT_MS = 5000; // 5 seconds

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<PDFFormData>({
    resolver: zodResolver(pdfSchema),
    defaultValues: initilaData || {
      title: "",
      description: "",
      price: "",
      fileUrl: "",
      fileSize: 0,
      thumbnail: "",
      topics: [],
      isActive: false,
    },
  });

  //   fetch PDF data if not provided
  useEffect(() => {
    if (!initilaData) {
      fetchPDFData();
    }
  }, [pdfId, initilaData]);

  const fetchPDFData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/admin/pdfs/${pdfId}`);
      const data = response.data;
      console.log("Response Data: ", data);
    } catch (error) {}
  };

  return <div>edit-pdf-form</div>;
}
