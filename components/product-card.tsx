// "use client";

// import { formatPrice } from "@/utils/checkout-helper";
// import { Image } from "@imagekit/next";
// import { IndianRupee } from "lucide-react";

// interface ProductProps {
//   title: string;
//   price: number;
//   quantity: number;
//   thumbnail: string; // ImageKit path: "/products/book.jpg"
//   type: "book" | "pdf";
// }

// export default function ProductCard({
//   title,
//   price,
//   quantity,
//   thumbnail,
//   type,
// }: ProductProps) {
//   return (
//     <div className="w-full max-w-2xl border border-gray-200 rounded-xl bg-white shadow-sm">
//       <div className="flex gap-4 p-2">
//         {/* Product Image */}
//         <div className="shrink-0">
//           <Image
//             src={thumbnail}
//             alt={title}
//             width={80}
//             height={80}
//             className="rounded-lg object-cover"
//             transformation={[
//               {
//                 width: 80,
//                 height: 80,
//                 quality: 80,
//                 format: "auto",
//                 crop: "maintain_ratio",
//               },
//             ]}
//           />
//         </div>

//         {/* Product Info */}
//         <div className="flex flex-col flex-1 font-lato">
//           <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">
//             {title}
//           </h2>

//           <p className="mt-1 text-sm text-gray-600">
//             {formatPrice(price)} × {quantity}
//           </p>

//           {type === "pdf" && (
//             <span className="mt-1 inline-block w-fit rounded-md bg-blue-50 py-0.5 px-2 text-xs font-medium text-blue-700">
//               PDF
//             </span>
//           )}
//           {type === "book" && (
//             <span className="mt-1 inline-block w-fit rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
//               Book
//             </span>
//           )}
//         </div>

//         {/* Price */}
//         <p className="text-right items-center flex text-base font-semibold text-green-700">
//           {/* <IndianRupee size={14} /> */}
//           {formatPrice(price * quantity)}
//         </p>
//       </div>
//     </div>
//   );
// }
"use client";

import { formatPrice } from "@/utils/checkout-helper";
import { Image } from "@imagekit/next";

interface ProductCardProps {
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  type: "book" | "pdf";
}

export default function ProductCard({
  title,
  price,
  quantity,
  thumbnail,
  type,
}: ProductCardProps) {
  const totalPrice = price * quantity;

  return (
    <div className="w-full max-w-xl border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200 mb-2">
      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
        {/* Product Image */}
        <div className="shrink-0">
          <div className="relative">
            <Image
              src={thumbnail}
              alt={title}
              width={80}
              height={80}
              className="rounded-lg object-cover w-16 h-16 sm:w-20 sm:h-20"
              transformation={[
                {
                  width: 80,
                  height: 80,
                  quality: 80,
                  format: "auto",
                  crop: "maintain_ratio",
                },
              ]}
            />
            {/* Type Badge on Image */}
            <span
              className={`absolute -top-1 -right-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                type === "pdf"
                  ? "bg-blue-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {type === "pdf" ? "PDF" : "Book"}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1 min-w-0 font-lato font-medium">
          {/* Title */}
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 mb-1">
            {title}
          </h2>

          {/* Price per unit and quantity */}
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
            <span className="font-medium">{formatPrice(price)}</span>
            <span>×</span>
            <span className="font-medium">{quantity}</span>
            {quantity > 1 && (
              <span className="text-gray-400">
                ({quantity} {quantity > 1 ? "items" : "item"})
              </span>
            )}
          </div>
        </div>

        {/* Total Price */}
        <div className="flex flex-col items-end justify-center shrink-0">
          <p className="text-base sm:text-lg font-medium text-gray-900">
            {formatPrice(totalPrice)}
          </p>
          {quantity > 1 && (
            <p className="text-xs text-gray-500 mt-0.5">Total</p>
          )}
        </div>
      </div>
    </div>
  );
}
