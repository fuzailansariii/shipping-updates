// components/admin/messages/messages-list.tsx
import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../shared/section-header";
import MessageCard from "../shared/message-card";

interface Message {
  id: string;
  customer: string;
  message: string;
  time: string;
}

interface MessagesListProps {
  messages: Message[];
}

export default function MessagesList({ messages }: MessagesListProps) {
  return (
    <div className="w-full md:flex-1">
      <SectionHeader
        title="Messages"
        href="/admin/messages"
        hrefLabel="View all"
      />
      <div className="rounded-2xl border border-black/7 overflow-hidden divide-y divide-black/3">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <MessageCard
              customer={msg.customer}
              message={msg.message}
              time={msg.time}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
