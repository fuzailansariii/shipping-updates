"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { formatDate } from "@/utils/pdf-helper";
import { formatPrice } from "@/utils/checkout-helper";
import { cn } from "@/lib/utils";
import DataTable from "@/components/admin/shared/data-table";
import {
  useAdminCustomerModal,
  Customer,
} from "@/stores/admin-customer-modal-store";
import AdminCustomerModal from "@/components/admin/customer/admin-customer-modal";

export default function CustomersPage({
  initialCustomers,
}: {
  initialCustomers: Customer[];
}) {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  const { openCustomerModal } = useAdminCustomerModal();

  return (
    <>
      <div className="py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-secondary-dark">
              Customers
            </h1>
            <p className="mt-1 text-sm text-secondary-dark/60">
              All registered customers from Clerk.
            </p>
          </div>
        </div>

        <DataTable
          columns={[
            { label: "Customer" },
            { label: "Email" },
            { label: "Joined" },
            { label: "Last Sign In" },
          ]}
          data={customers}
          gridClassName="grid-cols-4"
          loading={false}
          error={null}
          onRowClick={(customer) => openCustomerModal(customer)}
          renderRow={(customer) => (
            <>
              {/* Name + ID */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {customer.firstName || customer.lastName
                    ? `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim()
                    : "—"}
                </span>
                <span className="text-[11px] text-gray-400 line-clamp-1">
                  {customer.phone}
                </span>
              </div>

              {/* Email */}
              <span className="text-sm text-gray-600 line-clamp-1">
                {customer.email || "—"}
              </span>

              {/* Joined */}
              <span className="text-xs text-gray-500">
                {formatDate(new Date(customer.createdAt))}
              </span>

              {/* Last sign in */}
              <span className="text-xs text-gray-500">
                {customer.lastSignInAt
                  ? formatDate(new Date(customer.lastSignInAt))
                  : "Never"}
              </span>
            </>
          )}
          renderMobileCard={(customer) => (
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5 min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {customer.firstName || customer.lastName
                    ? `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim()
                    : "—"}
                </p>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {customer.email || "—"}
                </p>
                {/* <p className="text-[11px] text-gray-400 line-clamp-1">
                  {customer.id}
                </p> */}
              </div>
              <div className="text-right shrink-0 space-y-0.5">
                <p className="text-[11px] text-gray-400">
                  Joined {formatDate(new Date(customer.createdAt))}
                </p>
                {/* <p className="text-[11px] text-gray-400">
                  {customer.lastSignInAt
                    ? `Last seen ${formatDate(new Date(customer.lastSignInAt))}`
                    : "Never signed in"}
                </p> */}
              </div>
            </div>
          )}
        />
      </div>

      <AdminCustomerModal />
    </>
  );
}
