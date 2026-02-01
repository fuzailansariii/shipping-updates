import { cn } from "@/lib/utils";

export default function Container({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "max-w-5xl min-h-screen mx-auto mt-20 md:py-15 py-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
