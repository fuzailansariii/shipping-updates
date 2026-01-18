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
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

// Checkout
export interface CheckoutStore {
  step: 1 | 2 | 3 | 4;

  // address
  savedAddresses: Address[];
  shippingAddress: Address | null;

  //   order
  orderId: string | null;

  //   ui state
  loading: boolean;
  error: string | null;

  //   actions
  setStep: (step: 1 | 2 | 3 | 4) => void;
  setShippingAddress: (address: Address) => void;
  setSavedAddresses: (addresses: Address[]) => void;
  createOrder: (orderData: unknown) => Promise<void>;
  reset: () => void;
}
