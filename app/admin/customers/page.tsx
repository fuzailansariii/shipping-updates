import { desc } from "drizzle-orm";
import { db } from "@/utils/db";
import { orders } from "@/utils/db/schema";
import { formatDate } from "@/utils/pdf-helper";
import { isAdmin } from "@/lib/auth-helper";

export default async function CustomersPage() {
  const admin = await isAdmin();

  if (!admin) {
    return null;
  }

  const customers = await db
    .select({
      id: orders.clerkUserId,
      name: orders.buyerName,
      email: orders.buyerEmail,
      phone: orders.buyerPhone,
      lastOrderAt: orders.createdAt,
      totalSpent: orders.totalAmount,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(50);

  return (
    <div className="py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-dark">Customers</h1>
          <p className="mt-1 text-sm text-secondary-dark/60">
            Recent customers with their contact details and last order info.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-2">Last Order</div>
          <div className="col-span-2 text-right">Total Amount</div>
        </div>

        {customers.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No customers found yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 text-sm">
            {customers.map((customer) => (
              <div
                key={`${customer.id}-${customer.lastOrderAt?.toISOString()}`}
                className="px-4 py-3 hover:bg-gray-50/80 transition-colors"
              >
                {/* Mobile layout */}
                <div className="flex flex-col gap-1 md:hidden">
                  <div className="flex justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 line-clamp-1">
                        {customer.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                        ID: {customer.id}
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-gray-500 shrink-0">
                      <p>
                        {customer.lastOrderAt
                          ? formatDate(customer.lastOrderAt)
                          : "-"}
                      </p>
                      <p className="mt-1 font-semibold text-emerald-700">
                        ₹{(customer.totalSpent ?? 0) / 100}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 line-clamp-1">
                    {customer.email || "-"}
                  </p>
                  <p className="text-xs text-gray-700 line-clamp-1">
                    {customer.phone || "-"}
                  </p>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <p className="font-semibold text-gray-900 line-clamp-1">
                      {customer.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      ID: {customer.id}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-gray-700 line-clamp-1">
                      {customer.email || "-"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-700 line-clamp-1">
                      {customer.phone || "-"}
                    </p>
                  </div>
                  <div className="col-span-2 text-gray-700 text-xs">
                    {customer.lastOrderAt
                      ? formatDate(customer.lastOrderAt)
                      : "-"}
                  </div>
                  <div className="col-span-2 text-right font-semibold text-emerald-700">
                    ₹{(customer.totalSpent ?? 0) / 100}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
