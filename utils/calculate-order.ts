// import { CartItem } from "@/stores/cart-types";

// export function calculateOrder(cartItems: CartItem[]) {
//   const hasBooks = cartItems.some((item) => item.type === "book");

//   const subTotal = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0,
//   );

//   const taxableAmount = cartItems
//     .filter((item) => item.type === "book")
//     .reduce((sum, item) => sum + item.price * item.quantity, 0);

//   const tax = taxableAmount * 0.18;

//   const shipping = hasBooks && subTotal < 500 ? 50 : 0;

//   return {
//     subTotal,
//     tax,
//     shipping,
//     total: subTotal + tax + shipping,
//   };
// }
