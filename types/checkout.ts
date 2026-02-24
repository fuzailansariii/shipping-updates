import { CartItem } from "@/stores/cart-types";

export interface CheckoutPreviewRequest {
  items: CartItem[];
}

export interface SafeItem {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}
export interface CheckoutPreviewResponse {
  success: boolean;
  data?: {
    subTotal: number;
    tax: number;
    shippingCharges: number;
    totalAmount: number;
    items: SafeItem[];
  };
  error?: string;
}
