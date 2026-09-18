import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
  className?: string;
  width?: "wide" | "narrow" | "article";
};

export function PageShell({
  children,
  className,
  width = "wide",
}: PageShellProps) {
  return (
    <div
      className={cn(
        "page-shell",
        width === "wide" && "page-shell-wide",
        width === "narrow" && "page-shell-narrow",
        width === "article" && "page-shell-article",
        className,
      )}
    >
      {children}
    </div>
  );
}
