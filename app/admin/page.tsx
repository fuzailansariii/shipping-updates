"use client";
import Upload from "@/components/upload";
import React from "react";

export default function Admin() {
  return (
    <>
      <Upload uploadType="pdf" onSuccess={(res) => console.log(res)} />
      <Upload uploadType="image" onSuccess={(res) => console.log(res)} />
    </>
  );
}
