"use client";
import { useOrderDetailsStore } from "@/stores/orders-history-store";
import { formatPrice } from "@/utils/checkout-helper";
import { formatDate } from "@/utils/pdf-helper";
import { BookOpenText, FileText, Package, X } from "lucide-react";
import { useEffect } from "react";
import BottomSheetModal from "./bottom-sheet-modal";
import { getStatusConfig } from "@/utils/status-badge";

export default function OrderDetails() {
  const isOpen = useOrderDetailsStore((s) => s.isOpen);
  const selectedOrder = useOrderDetailsStore((s) => s.selectedOrder);
  const closeOrderDetails = useOrderDetailsStore((s) => s.closeOrderDetails);

  const hasPhysicalBook = selectedOrder?.items.some(
    (item) => item.productType === "book",
  );
  const hasDigitalItems = selectedOrder?.items.some(
    (item) => item.productType === "pdf",
  );

  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const status = selectedOrder
    ? getStatusConfig(selectedOrder.orderStatus)
    : null;

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={closeOrderDetails}
      title="Order Details"
      subTitle={selectedOrder?.orderNumber}
    >
      <div className="overflow-y-auto flex-1 px-3 pb-4 space-y-3">
        {selectedOrder ? (
          <>
            {/* Status + Date row */}
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status?.badge} ${status?.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status?.dot}`} />
                {status?.label}
              </span>
              <p className="text-xs text-gray-400">
                {formatDate(selectedOrder.createdAt)}
              </p>
            </div>

            {/* Items */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Items
              </p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div
                    key={item.id ?? index}
                    className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                        {item.productType === "pdf" ? (
                          <FileText className="w-4 h-4 text-gray-400" />
                        ) : (
                          <BookOpenText className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {item.productTitle}
                        </p>
                        {item.productType === "pdf" ? (
                          <p className="text-xs text-gray-400">
                            Digital Product
                          </p>
                        ) : (
                          item.quantity && (
                            <p className="text-xs text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                    {/* Badge - PDF / Book */}
                    <div className="ml-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {item.productType?.toUpperCase() ?? "ITEM"}
                      </span>
                    </div>

                    {item.price && (
                      <p className="text-sm font-semibold text-gray-700 ml-3 shrink-0">
                        {formatPrice(item.price)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-200" />

            {/* Price Breakdown */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                Summary
              </p>
              <div className="space-y-2">
                {selectedOrder.subTotal && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(selectedOrder.subTotal)}</span>
                  </div>
                )}

                {/* Only show shipping if there are physical items */}
                {hasPhysicalBook && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {selectedOrder.shippingCharges === 0
                        ? "Free"
                        : formatPrice(selectedOrder.shippingCharges ?? 0)}
                    </span>
                  </div>
                )}

                {/* Show digital delivery if any pdf items */}
                {hasDigitalItems && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Digital Delivery</span>
                    <span>Free</span>
                  </div>
                )}

                {/* Only show tax if there are physical items */}
                {hasPhysicalBook && selectedOrder.tax && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (18%)</span>
                    <span>{formatPrice(selectedOrder.tax)}</span>
                  </div>
                )}

                {selectedOrder.discount !== 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>{formatPrice(selectedOrder.discount ?? 0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-gray-200" />

            {/* Delivery Info - Only show delivery address for physical orders */}
            {hasPhysicalBook &&
              selectedOrder.shippingAddress &&
              (() => {
                let addr: any = null;
                let rawAddress: string | null = null;

                try {
                  addr = JSON.parse(selectedOrder.shippingAddress);
                } catch {
                  // Old order — can't reliably parse, show as plain text
                  rawAddress = selectedOrder.shippingAddress;
                }

                return (
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3.5">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                      Delivery Address
                    </p>

                    {addr ? (
                      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
                        <span className="text-gray-400">Name</span>
                        <span className="font-medium text-gray-800">
                          {addr.fullName}
                        </span>

                        <span className="text-gray-400">Phone</span>
                        <span className="font-medium text-gray-800">
                          {addr.phone}
                        </span>

                        <span className="text-gray-400">Address</span>
                        <span className="text-gray-700">
                          {[addr.addressLine1, addr.addressLine2]
                            .filter(Boolean)
                            .join(", ")}
                        </span>

                        {addr.landmark && (
                          <>
                            <span className="text-gray-400">Landmark</span>
                            <span className="text-gray-700">
                              {addr.landmark}
                            </span>
                          </>
                        )}

                        <span className="text-gray-400">City</span>
                        <span className="text-gray-700">{addr.city}</span>

                        <span className="text-gray-400">State</span>
                        <span className="text-gray-700">{addr.state}</span>

                        <span className="text-gray-400">Pincode</span>
                        <span className="text-gray-700">{addr.pincode}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {rawAddress}
                      </p>
                    )}
                  </div>
                );
              })()}

            {/* Payment */}
            {selectedOrder.paymentMethod && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  Payment
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  {selectedOrder.paymentMethod}
                </p>
              </div>
            )}

            {/* Bottom padding for mobile scroll */}
            <div className="h-4" />
          </>
        ) : (
          <p className="text-center text-gray-400 text-sm py-10">
            No order details available.
          </p>
        )}
      </div>
    </BottomSheetModal>
  );
}
