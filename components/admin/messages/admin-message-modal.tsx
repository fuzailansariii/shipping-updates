"use client";

import BottomSheetModal from "@/components/bottom-sheet-modal";
import { useAdminMessageModal } from "@/stores/admin-message-modal-store";
import { formatDate } from "@/utils/pdf-helper";
import axios from "axios";
import { Mail, User, Calendar, MessageSquare } from "lucide-react";
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminMessageModal({
  onMarkedRead,
}: {
  // Callback so MessagesPage can update its local list when a message is read
  onMarkedRead?: (id: string) => void;
}) {
  const { isOpen, selectedMessage, closeMessageModal, markSelectedAsRead } =
    useAdminMessageModal();

  // Mark as read when modal opens, if not already read
  React.useEffect(() => {
    if (!selectedMessage || selectedMessage.isRead) return;

    const markRead = async () => {
      try {
        await axios.patch(`/api/admin/messages/${selectedMessage.id}`, {
          isRead: true,
        });
        markSelectedAsRead();
        onMarkedRead?.(selectedMessage.id);
      } catch {
        // Non-critical — modal still shows, just won't update read status
        console.error("Failed to mark message as read");
      }
    };

    markRead();
  }, [selectedMessage?.id]);

  return (
    <BottomSheetModal
      isOpen={isOpen}
      onClose={closeMessageModal}
      title="Message"
      subTitle={selectedMessage?.subject ?? "No subject"}
    >
      {selectedMessage ? (
        <>
          {/* ── Sender Info ── */}
          <div className="px-2 space-y-3">
            <SectionLabel>From</SectionLabel>
            <InfoRow
              icon={<User className="w-3.5 h-3.5 text-gray-400" />}
              label="Name"
              value={selectedMessage.name}
            />
            <InfoRow
              icon={<Mail className="w-3.5 h-3.5 text-gray-400" />}
              label="Email"
              value={selectedMessage.email}
            />
            <InfoRow
              icon={<Calendar className="w-3.5 h-3.5 text-gray-400" />}
              label="Received"
              value={
                selectedMessage.createdAt
                  ? formatDate(selectedMessage.createdAt)
                  : "—"
              }
            />
          </div>

          <div className="border-t border-dashed border-gray-200" />

          {/* ── Message Body ── */}
          <div className="px-2 space-y-2">
            <SectionLabel>Message</SectionLabel>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap wrap-break-word">
                {selectedMessage.message}
              </p>
            </div>
          </div>

          <div className="h-4" />
        </>
      ) : (
        <p className="text-center text-gray-400 text-sm py-10 px-2">
          No message selected.
        </p>
      )}
    </BottomSheetModal>
  );
}
