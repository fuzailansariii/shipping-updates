"use client";

import BottomSheetModal from "@/components/bottom-sheet-modal";
import { Button } from "@/components/ui/button";
import { useAdminCustomerModal } from "@/stores/admin-customer-modal-store";
import { formatDate } from "@/utils/pdf-helper";
import { Mail, Calendar, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

// ─── Sub-components ───────────────────────────────────────────────────────────

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
      <div className="min-w-0">
        <p className="text-[10px] text-gray-400 font-medium">{label}</p>
        <p className="text-sm text-gray-800 font-medium wrap-break-word">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Avatar — initials fallback if no imageUrl ────────────────────────────────

function CustomerAvatar({
  firstName,
  lastName,
}: {
  firstName: string | null;
  lastName: string | null;
}) {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

  return (
    <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold shrink-0">
      {initials}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminCustomerModal() {
  const { isOpen, selectedCustomer, closeCustomerModal } =
    useAdminCustomerModal();

  const router = useRouter();

  const fullName =
    selectedCustomer?.firstName || selectedCustomer?.lastName
      ? `${selectedCustomer.firstName ?? ""} ${selectedCustomer.lastName ?? ""}`.trim()
      : "Unknown Customer";

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={closeCustomerModal}
      title="Customer Details"
      subTitle={fullName}
    >
      {selectedCustomer ? (
        <>
          {/* ── Identity ── */}
          <div className="flex items-center gap-4 px-2">
            <CustomerAvatar
              firstName={selectedCustomer.firstName}
              lastName={selectedCustomer.lastName}
            />
            <div className="min-w-0">
              <p className="text-base font-bold text-gray-900 truncate">
                {fullName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {selectedCustomer.id}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200" />

          {/* ── Details ── */}
          <div className="px-2 space-y-3">
            <SectionLabel>Details</SectionLabel>
            <InfoRow
              icon={<Mail className="w-3.5 h-3.5 text-gray-400" />}
              label="Email"
              value={selectedCustomer.email || "—"}
            />
            <InfoRow
              icon={<Calendar className="w-3.5 h-3.5 text-gray-400" />}
              label="Joined"
              value={formatDate(new Date(selectedCustomer.createdAt))}
            />
          </div>

          <div className="border-t border-dashed border-gray-200" />

          {/* ── Actions ── */}
          <div className="px-2 space-y-3">
            <SectionLabel>Actions</SectionLabel>
            <Button
              variant="outline"
              className="w-full border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600"
              onClick={() => {
                closeCustomerModal();
                router.push(`/admin/orders?customerId=${selectedCustomer.id}`);
              }}
            >
              <ShoppingBag className="w-4 h-4" />
              View Orders
            </Button>
          </div>

          <div className="h-4" />
        </>
      ) : (
        <p className="text-center text-gray-400 text-sm py-10 px-2">
          No customer selected.
        </p>
      )}
    </BottomSheetModal>
  );
}
