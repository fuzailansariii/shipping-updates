import { CartItem } from "@/stores/cart-types";
import { OrderItemInput } from "@/lib/validations/zod-schema";
import { DB } from "./db";
import { products } from "./db/schema";
import { eq } from "drizzle-orm";

// Check if the Cart Item has physical books
export function hasPhysicalBooks(items: CartItem[]) {
  return items.some((item) => item.type === "book");
}

// check if the Cart Item has only PDF's
export function hasPdfOnly(items: CartItem[]) {
  return items.every((item) => item.type === "pdf");
}

// calculate ORDER total
export function calculateOrderTotals(items: CartItem[]) {
  const hasBooks = hasPhysicalBooks(items);

  //   Calulation of subtotal
  const subTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  //   Shipping charge
  let shippingCharges = 0;
  if (hasBooks) {
    shippingCharges = subTotal >= 500 ? 0 : 50;
  }

  // TAX: 18% GST only on books
  const taxableAmount = items
    .filter((item) => item.type === "book")
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = taxableAmount * 0.18;

  const totalAmount = subTotal + shippingCharges + tax;

  return {
    subTotal: parseFloat(subTotal.toFixed(2)),
    shippingCharge: parseFloat(shippingCharges.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    discount: 0,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
  };
}

// Convert Cart Items to Order Items
export function cartItemsToOrderItems(cartItems: CartItem[]): OrderItemInput[] {
  return cartItems.map((item) => ({
    productId: item.productId,
    productType: item.type,
    productTitle: item.title,
    quantity: item.quantity,
    unitPrice: item.price,
    totalPrice: parseFloat((item.price * item.quantity).toFixed(2)),
  }));
}

// Format Address for storage
interface Address {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}
export function formatAddressForStorage(address: Address) {
  const parts = [
    address.fullName,
    address.phone,
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.pincode,
    address.landmark,
  ].filter(Boolean); // Remove empty values
  return parts.join(", ");
}

// Validate Stock availability
export async function validateStockAvailability(
  items: CartItem[],
  db: DB
): Promise<{ isValid: boolean; errors: string[] }> {
  const errors: string[] = [];

  for (const item of items) {
    if (item.type === "book") {
      // Fetch latest product stock from DB
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.productId),
      });

      if (!product) {
        errors.push(`Product ${item.title} not found`);
        continue;
      }

      //   if (product.stockQuantity < item.quantity) {
      //     errors.push(
      //       `Only ${product.stockQuantity} units available for ${item.title}`
      //     );
      //   }

      if (item.maxStock && item.quantity > item.maxStock) {
        errors.push(`Only ${item.maxStock} units available for ${item.title}`);
      }
    }
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}
