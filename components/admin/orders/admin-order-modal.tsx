"use client";
import BottomSheetModal from "@/components/bottom-sheet-modal";
import { Button } from "@/components/ui/button";
import { useAdminOrderModal } from "@/stores/admin-order-modal-store";
import { formatPrice } from "@/utils/checkout-helper";
import { formatDate } from "@/utils/pdf-helper";
import axios from "axios";
import type { OrderItem } from "@/utils/db/schema";
import {
  BookOpenText,
  FileText,
  Loader2,
  MapPin,
  Package,
  Phone,
  User,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "failed",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

const statusStyles: Record<
  OrderStatus,
  { bg: string; text: string; dot: string }
> = {
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  confirmed: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  packed: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
  shipped: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-400",
  },
  delivered: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-400" },
  failed: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
};

function StatusPill({ status }: { status: string }) {
  const s = statusStyles[status as OrderStatus] ?? {
    bg: "bg-gray-50",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
      {children}
    </p>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-medium">{label}</p>
        <p className="text-sm text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function AdminOrderModal() {
  const { isOpen, selectedOrder, closeModal, updateSelectedOrder } =
    useAdminOrderModal();
  const router = useRouter();

  const [orderStatus, setOrderStatus] = useState<OrderStatus>(
    (selectedOrder?.orderStatus as OrderStatus) ?? "pending",
  );
  const [awbNumber, setAwbNumber] = useState(selectedOrder?.awbNumber ?? "");
  const [courierPartner, setCourierPartner] = useState(
    selectedOrder?.courierPartner ?? "",
  );
  const [notes, setNotes] = useState(selectedOrder?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync local state when selectedOrder changes (modal opens with new order)
  React.useEffect(() => {
    if (selectedOrder) {
      setOrderStatus((selectedOrder.orderStatus as OrderStatus) ?? "pending");
      setAwbNumber(selectedOrder.awbNumber ?? "");
      setCourierPartner(selectedOrder.courierPartner ?? "");
      setNotes(selectedOrder.notes ?? "");
      setError(null);
    }
  }, [selectedOrder?.id]);

  const hasPhysicalBook = selectedOrder?.items.some(
    (i: { productType: string }) => i.productType === "book",
  );
  const hasDigitalItems = selectedOrder?.items.some(
    (i: { productType: string }) => i.productType === "pdf",
  );

  async function handleSave() {
    if (!selectedOrder) return;
    setSaving(true);
    setError(null);

    try {
      // 1. PATCH — update order
      const patchRes = await axios.patch(
        `/api/admin/orders/${selectedOrder.id}`,
        {
          orderStatus,
          awbNumber: awbNumber || undefined,
          courierPartner: courierPartner || undefined,
          notes: notes || undefined,
        },
      );

      if (patchRes.status !== 200) {
        const error = patchRes.data.data;
        throw new Error(error.error ?? "Failed to update order");
      }

      // 2. GET — fetch fresh order with items
      const getRes = await fetch(`/api/admin/orders/${selectedOrder.id}`);
      if (!getRes.ok) throw new Error("Failed to refresh order");

      const { data: freshOrder } = await getRes.json();

      // 3. Update modal + refresh table
      updateSelectedOrder(freshOrder);
      router.refresh();
      closeModal();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={closeModal}
      title="Manage Order"
      subTitle={selectedOrder?.orderNumber ?? "—"}
    >
      {selectedOrder ? (
        <>
          {/* ── Status + Date ── */}
          <div className="flex items-center justify-between px-2">
            <StatusPill status={selectedOrder.orderStatus} />
            <p className="text-xs text-gray-400">
              {formatDate(selectedOrder.createdAt)}
            </p>
          </div>

          {/* ── Customer Info ── */}
          <div className="space-y-3 px-2">
            <SectionLabel>Customer</SectionLabel>
            <InfoRow
              icon={<User className="w-3.5 h-3.5 text-gray-400" />}
              label="Name"
              value={selectedOrder.buyerName}
            />
            <InfoRow
              icon={<CreditCard className="w-3.5 h-3.5 text-gray-400" />}
              label="Email"
              value={selectedOrder.buyerEmail}
            />
            <InfoRow
              icon={<Phone className="w-3.5 h-3.5 text-gray-400" />}
              label="Phone"
              value={selectedOrder.buyerPhone}
            />
          </div>

          <div className="border-t border-dashed border-gray-300" />

          {/* ── Items ── */}
          <div className="px-2">
            <SectionLabel>Items</SectionLabel>
            <div className="space-y-2">
              {selectedOrder.items.map((item: OrderItem, index: number) => (
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
                      <p className="text-xs text-gray-400">
                        {item.productType === "pdf"
                          ? "Digital Product"
                          : `Qty: ${item.quantity}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {item.productType?.toUpperCase()}
                    </span>
                    <p className="text-sm font-semibold text-gray-700">
                      {formatPrice(item.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300" />

          {/* ── Price Summary ── */}
          <div className="px-2">
            <SectionLabel>Summary</SectionLabel>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.subTotal)}</span>
              </div>
              {hasPhysicalBook && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {selectedOrder.shippingCharges === 0
                      ? "Free"
                      : formatPrice(selectedOrder.shippingCharges)}
                  </span>
                </div>
              )}
              {hasDigitalItems && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Digital Delivery</span>
                  <span>Free</span>
                </div>
              )}
              {hasPhysicalBook && selectedOrder.tax > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>{formatPrice(selectedOrder.tax)}</span>
                </div>
              )}
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>- {formatPrice(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>{formatPrice(selectedOrder.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300" />

          {/* ── Shipping Address ── */}
          {hasPhysicalBook && selectedOrder.shippingAddress && (
            <div className="px-2">
              <SectionLabel>Shipping Address</SectionLabel>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedOrder.shippingAddress}
                </p>
              </div>
            </div>
          )}

          {/* ── Payment ── */}
          <div className="px-2">
            <SectionLabel>Payment</SectionLabel>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 capitalize">
                {selectedOrder.paymentMethod}
              </span>
              <StatusPill status={selectedOrder.paymentStatus} />
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300" />

          {/* ── Admin Actions ── */}
          <div className="space-y-3 px-2">
            <SectionLabel>Update Order</SectionLabel>

            {/* Order Status */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-medium">
                Order Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                className="w-full text-sm rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* AWB Number */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-medium">
                AWB Number
              </label>
              <input
                type="text"
                value={awbNumber}
                onChange={(e) => setAwbNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full text-sm rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
              />
            </div>

            {/* Courier Partner */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-medium">
                Courier Partner
              </label>
              <input
                type="text"
                value={courierPartner}
                onChange={(e) => setCourierPartner(e.target.value)}
                placeholder="e.g. Bluedart, Delhivery"
                className="w-full text-sm rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500 font-medium">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note about this order..."
                rows={3}
                className="w-full text-sm rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              variant={"secondary"}
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>

          {/* Bottom padding for mobile */}
          <div className="h-4" />
        </>
      ) : (
        <p className="text-center text-gray-400 text-sm py-10 px-2">
          No order selected.
        </p>
      )}
    </BottomSheetModal>
  );
}
