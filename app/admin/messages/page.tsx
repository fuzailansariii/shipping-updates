"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { formatDate } from "@/utils/pdf-helper";
import { cn } from "@/lib/utils";
import {
  useAdminMessageModal,
  Message,
} from "@/stores/admin-message-modal-store";
import AdminMessageModal from "@/components/admin/messages/admin-message-modal";
import DataTable from "@/components/admin/shared/data-table";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const { openMessageModal } = useAdminMessageModal();

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    const controller = new AbortController();

    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("/api/admin/messages", {
          signal: controller.signal,
        });
        setMessages(res.data?.data ?? []);
      } catch (err) {
        if (axios.isCancel(err)) return;
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 403) {
            setError("You are not authorized to view this page.");
          } else {
            setError("Failed to load messages. Please try again.");
          }
        } else {
          setError("Something went wrong while loading messages.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    return () => controller.abort();
  }, [userId, isLoaded]);

  const handleMarkedRead = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)),
    );
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <>
      <div className="py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-secondary-dark flex items-center gap-2">
            Messages
            {unreadCount > 0 && (
              <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-secondary-dark/60">
            Recent contact form submissions from your customers.
          </p>
        </div>

        <DataTable
          columns={[
            { label: "Customer" },
            { label: "Email" },
            { label: "Subject" },
            { label: "Received" },
            { label: "Status" },
          ]}
          data={messages}
          loading={loading}
          error={error}
          gridClassName="grid-cols-5"
          onRowClick={(msg) => openMessageModal(msg)}
          renderRow={(msg) => (
            <>
              {/* Customer name — bold if unread */}
              <span
                className={cn(
                  "text-sm line-clamp-1 flex items-center gap-2 mx-auto",
                  !msg.isRead ? "font-bold text-gray-900" : "text-gray-700",
                )}
              >
                {!msg.isRead && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 inline-block" />
                )}
                {msg.name}
              </span>

              {/* Email */}
              <span className="text-sm text-gray-600 line-clamp-1">
                {msg.email}
              </span>

              {/* Subject */}
              <span className="text-sm text-gray-600 line-clamp-1">
                {msg.subject ?? "—"}
              </span>

              {/* Received */}
              <span className="text-xs text-gray-500">
                {msg.createdAt ? formatDate(msg.createdAt) : "—"}
              </span>

              {/* Status badge */}
              <span
                className={cn(
                  "text-[11px] font-medium px-2 py-0.5 mx-auto rounded-full w-fit",
                  msg.isRead
                    ? "bg-gray-100 text-gray-500"
                    : "bg-blue-50 text-blue-600",
                )}
              >
                {msg.isRead ? "Read" : "Unread"}
              </span>
            </>
          )}
          renderMobileCard={(msg) => (
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                {!msg.isRead && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                )}
                <div className="space-y-0.5 min-w-0">
                  <p
                    className={cn(
                      "text-sm line-clamp-1",
                      !msg.isRead
                        ? "font-bold text-gray-900"
                        : "font-semibold text-gray-700",
                    )}
                  >
                    {msg.name}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {msg.email}
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {msg.subject ?? "No subject"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[11px] text-gray-400">
                  {msg.createdAt ? formatDate(msg.createdAt) : "—"}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium px-2 py-0.5 rounded-full",
                    msg.isRead
                      ? "bg-gray-100 text-gray-500"
                      : "bg-blue-50 text-blue-600",
                  )}
                >
                  {msg.isRead ? "Read" : "Unread"}
                </span>
              </div>
            </div>
          )}
        />
      </div>

      <AdminMessageModal onMarkedRead={handleMarkedRead} />
    </>
  );
}
