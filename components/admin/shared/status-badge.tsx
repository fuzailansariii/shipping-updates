import { getStatusConfig } from "@/utils/status-badge";

type Props = {
  status: string;
};

export default function StatusBadge({ status }: Props) {
  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mx-auto text-xs font-medium ${config.badge}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
