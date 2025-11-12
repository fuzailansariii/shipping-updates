import { cn } from "@/lib/utils";

export default function Container({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("max-w-5xl h-screen mx-auto mt-20 pt-15", className)}>
      {children}
    </div>
  );
}
