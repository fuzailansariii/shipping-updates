export interface CartItem {
  productId: string;
  type: "book" | "pdf";
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  maxStock?: number; // Only for books
}

export interface CartState {
  items: CartItem[];
  subTotal: number;
  tax: number;
  shipping: number;
  total: number;
  isOpen: boolean;
}

export interface CartAction {
  addToCart: (product: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotal: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}
