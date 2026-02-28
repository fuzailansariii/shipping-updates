"use client";
import AdminMenuCard from "@/components/admin/admin-menu-card";
import Overview from "@/components/admin/overview";
import EditPDFForm from "@/components/product/product-edit-form";
import { ProductUploadForm } from "@/components/product/product-upload-form";
import { AnimatePresence, motion } from "framer-motion";

export default function Admin() {
  return (
    <>
      <Overview />
    </>
  );
}
