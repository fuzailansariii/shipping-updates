export interface Product {
  type: "book" | "pdf";
  id: string;
  title: string;
  description: string;
  price: number;

  // Optional / conditional
  fileSize?: number | null;
  stockQuantity?: number;

  topics?: string[];
  thumbnail?: string | null;

  author?: string;
  publisher?: string;
  isbn?: string;
  edition?: string;
  language?: string;

  isActive: boolean;
  isFeatured?: boolean;
  createdAt: string;
}
