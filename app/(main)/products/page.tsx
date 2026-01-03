"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Image } from "@imagekit/next";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";

interface PDF {
  id: string;
  title: string;
  description: string;
  price: number;
  fileSize: number;
  topics: string[];
  thumbnail: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function PDFs() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/products");
        setPdfs(response.data.pdfs || []);
        setError(null);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        setError("Failed to load PDFs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Container>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Study Materials</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="bg-gray-300 h-48 rounded mb-4"></div>
                <div className="bg-gray-300 h-6 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded mb-4"></div>
                <div className="bg-gray-300 h-8 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant={"destructive"}
            >
              Retry
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // Empty state
  if (pdfs.length === 0) {
    return (
      <Container>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Study Materials</h1>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              No study materials available at the moment.
            </p>
            <p className="text-gray-500 mt-2">Check back soon!</p>
          </div>
        </div>
      </Container>
    );
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <Container>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Study Materials</h1>
          <p className="text-gray-600">
            Comprehensive study materials for shipping entrance exams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pdfs.map((pdf) => (
            <div
              key={pdf.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gray-200">
                {pdf.thumbnail ? (
                  <Image
                    urlEndpoint={pdf.thumbnail}
                    src={pdf.thumbnail}
                    alt={pdf.title}
                    fill
                    className="object-contain"
                    loading="eager"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <File />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {pdf.title}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {pdf.description}
                </p>

                {/* Topics */}
                {pdf.topics && pdf.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {pdf.topics.slice(0, 3).map((topic, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                    {pdf.topics.length > 3 && (
                      <span className="text-xs text-gray-500 py-1">
                        +{pdf.topics.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Price and Size */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{pdf.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatFileSize(pdf.fileSize)}
                  </span>
                </div>

                {/* View Details Button */}
                <Button
                  variant={"default"}
                  className="w-full disabled:cursor-not-allowed"
                  disabled
                >
                  <Link href={`/products`}>Coming Soon</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
