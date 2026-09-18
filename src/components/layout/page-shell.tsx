import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  width?: "wide" | "narrow";
};

export function PageShell({
  children,
  className,
  width = "wide",
}: PageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        width === "wide" && "max-w-6xl py-6 sm:py-8",
        width === "narrow" && "max-w-3xl py-8 sm:py-12",
        className,
      )}
    >
      {children}
    </div>
  );
}
