"use client";
import EditPDFForm from "@/components/pdf-edit-form";
import { PDFUploadForm } from "@/components/pdf-upload-form";
import SidebarHeader from "@/components/admin-header";
import Input from "@/components/ui/input-form";
import Upload from "@/components/upload";
import React from "react";

export default function Admin() {
  return (
    <>
      <PDFUploadForm />
      {/* <EditPDFForm productId="JVcSKYuMWfFyCh9_iX2uf" /> */}
    </>
  );
}
