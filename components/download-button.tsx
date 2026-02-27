"use client";

import { useState } from "react";
import axios from "axios";
import { Download, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { useOrderDetailsStore } from "@/stores/orders-history-store";

type DownloadState = "idle" | "loading" | "success";

interface DownloadButtonProps {
  orderItemId: string;
  orderItemTitle: string;
}

export default function DownloadButton({
  orderItemId,
  orderItemTitle,
}: DownloadButtonProps) {
  const [state, setState] = useState<DownloadState>("idle");
  const { incrementDownloadCount } = useOrderDetailsStore();

  const handleDownload = async () => {
    if (state === "loading") return;
    setState("loading");

    try {
      const response = await axios.get(`/api/downloads/${orderItemId}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/pdf",
      });
      const blobURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobURL;
      link.download = `${orderItemTitle}-SU.pdf`;
      link.click();
      URL.revokeObjectURL(blobURL);
      incrementDownloadCount(orderItemId); // Update count after successful download
      setState("success");
      setTimeout(() => setState("idle"), 2000);
    } catch (error: any) {
      setState("idle");
      console.error(error);
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      className="h-8 px-3 text-xs min-w- transition-all"
      onClick={handleDownload}
      disabled={state === "loading"}
    >
      {state === "loading" && (
        <>
          <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
          Downloading...
        </>
      )}
      {state === "success" && (
        <>
          <CheckCircle2 className="w-3 h-3 mr-1.5 text-green-500" />
          Downloaded!
        </>
      )}
      {state === "idle" && (
        <>
          <Download className="w-3 h-3 mr-1.5" />
          Download
        </>
      )}
    </Button>
  );
}
