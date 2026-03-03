import React from "react";

interface MessageCardProps {
  customer: string;
  subject: string;
  message: string;
  time: string;
  unread?: boolean;
}

export default function MessageCard({
  customer,
  subject,
  message,
  time,
  unread = false,
}: MessageCardProps) {
  return (
    <div
      className={`
        relative flex flex-col
        px-4 py-3.5 rounded-xl cursor-pointer
        border border-transparent
        hover:bg-white/3 hover:border-white/6
        transition-all duration-150
      `}
    >
      {/* Unread indicator */}
      {unread && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-blue-400/80" />
      )}

      <div className="flex items-center justify-between gap-3">
        {/* Avatar + name */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 w-6 h-6 rounded-full bg-black/8 flex items-center justify-center text-[10px] font-semibold font-roboto text-black/60 uppercase">
            {customer.charAt(0)}
          </div>
          <p
            className={`text-xs truncate ${
              unread
                ? "font-semibold text-secondary-dark/90"
                : "font-medium text-primary-dark/60"
            }`}
          >
            {customer}
          </p>
        </div>

        <span className="shrink-0 text-[10px] text-primary-dark/70">
          {time}
        </span>
      </div>

      <p className="text-sm text-secondary-dark/70 line-clamp-1 leading-relaxed pl-8 font-semibold font-lato">
        <span className="">About - </span>
        {subject}
      </p>
      <p className="text-xs text-secondary-dark/70 line-clamp-2 leading-relaxed pl-8">
        {message}
      </p>
    </div>
  );
}
