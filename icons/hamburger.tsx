import { cn } from "@/lib/utils";

interface HamburgerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeVarients = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

export default function Hamburger({ size = "md", className }: HamburgerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={
        (cn("lucide lucide-menu-icon lucide-menu"),
        sizeVarients[size],
        className)
      }
    >
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </svg>
  );
}
