// Products
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

// Address
export interface Address {
  id: string;
  clerkUserId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  landmark: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
