import { MoveRight } from "lucide-react";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  href?: string;
  hrefLabel?: string;
}

export default function SectionHeader({
  title,
  href,
  hrefLabel,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold text-secondary-dark">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-xs flex justify-center items-center gap-1 text-secondary-dark underline hover:text-secondary-dark/80 transition-colors font-lato"
        >
          {hrefLabel ?? "View all"}
          <MoveRight size={10} />
        </Link>
      )}
    </div>
  );
}
