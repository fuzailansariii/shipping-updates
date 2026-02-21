export type PricingItem = {
  price: number;
  quantity: number;
  type: string;
};

export type PricingResult = {
  subTotal: number;
  tax: number;
  shippingCharges: number;
  totalAmount: number;
};

export function calculatePricing(items: PricingItem[]): PricingResult {
  const hasBooks = items.some((item) => item.type === "book");

  const subTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const taxableAmount = items
    .filter((item) => item.type === "book")
    .reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 18% GST on books only
  const tax = Math.round((taxableAmount * 18) / 100);

  // ₹500 shipping = 50000 paise threshold
  const shippingCharges = hasBooks && subTotal < 50000 ? 500 : 0;

  const totalAmount = subTotal + tax + shippingCharges;

  return {
    subTotal,
    tax,
    shippingCharges,
    totalAmount,
  };
}
