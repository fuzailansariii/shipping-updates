import { desc } from "drizzle-orm";
import { db } from "@/utils/db";
import { contactMessages } from "@/utils/db/schema";
import { formatDate } from "@/utils/pdf-helper";
import { isAdmin } from "@/lib/auth-helper";

export default async function MessagesPage() {
  const admin = await isAdmin();

  if (!admin) {
    return null;
  }

  const messages = await db
    .select({
      id: contactMessages.id,
      name: contactMessages.name,
      email: contactMessages.email,
      subject: contactMessages.subject,
      message: contactMessages.message,
      createdAt: contactMessages.createdAt,
    })
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt))
    .limit(50);

  return (
    <div className="py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-dark">Messages</h1>
          <p className="mt-1 text-sm text-secondary-dark/60">
            Recent contact form submissions from your customers.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wide">
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Subject</div>
          <div className="col-span-2">Received</div>
          <div className="col-span-2 text-right">Preview</div>
        </div>

        {messages.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No messages received yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="px-4 py-3 hover:bg-gray-50/80 transition-colors"
              >
                {/* Mobile layout */}
                <div className="flex flex-col gap-1 md:hidden">
                  <div className="flex justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 line-clamp-1">
                        {msg.name}
                      </p>
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {msg.email || "-"}
                      </p>
                    </div>
                    <p className="text-[11px] text-gray-500 shrink-0">
                      {msg.createdAt ? formatDate(msg.createdAt) : "-"}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    <span className="font-medium text-gray-700">
                      {msg.subject || "No subject"}:
                    </span>{" "}
                    {msg.message}
                  </p>
                  <p className="text-[11px] text-gray-400 line-clamp-1">
                    ID: {msg.id}
                  </p>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-3">
                    <p className="font-semibold text-gray-900 line-clamp-1">
                      {msg.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                      ID: {msg.id}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-gray-700 line-clamp-1">
                      {msg.email || "-"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-700 line-clamp-1">
                      {msg.subject || "-"}
                    </p>
                  </div>
                  <div className="col-span-2 text-gray-700 text-xs">
                    {msg.createdAt ? formatDate(msg.createdAt) : "-"}
                  </div>
                  <div className="col-span-2 text-right text-xs text-gray-600 line-clamp-2">
                    {msg.message}
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
