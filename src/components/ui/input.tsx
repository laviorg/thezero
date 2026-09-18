import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full border border-white/12 bg-surface px-3 text-base text-fg placeholder:text-muted outline-none transition-colors focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
