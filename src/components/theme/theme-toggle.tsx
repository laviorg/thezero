"use client";

import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import type { ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";

const LABELS: Record<ThemePreference, string> = {
  light: "Claro",
  dark: "Escuro",
  system: "Sistema",
};

const NEXT_LABELS: Record<ThemePreference, string> = {
  light: "escuro",
  dark: "sistema",
  system: "claro",
};

function ThemeIcon({
  preference,
  className,
}: {
  preference: ThemePreference;
  className?: string;
}) {
  if (preference === "dark") return <Moon className={className} />;
  if (preference === "system") return <Monitor className={className} />;
  return <Sun className={className} />;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { preference, resolved, cyclePreference } = useTheme();
  const label = LABELS[preference];
  const next = NEXT_LABELS[preference];

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      onClick={cyclePreference}
      aria-label={`Tema: ${label}${preference === "system" ? ` (${resolved === "dark" ? "escuro" : "claro"})` : ""}. Alternar para ${next}.`}
      title={`Tema: ${label}. Clique para ${next}.`}
    >
      <ThemeIcon preference={preference} />
      <span className="sr-only">
        Tema {label}. Próximo: {next}.
      </span>
    </Button>
  );
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const { preference, setPreference } = useTheme();

  return (
    <div
      className={cn("grid grid-cols-3 gap-1 rounded-lg border border-border bg-surface p-1", className)}
      role="radiogroup"
      aria-label="Tema"
    >
      {(["light", "dark", "system"] as const).map((value) => {
        const selected = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setPreference(value)}
            className={cn(
              "inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-2 text-[0.72rem] font-medium tracking-wide uppercase transition-colors",
              selected
                ? "bg-accent text-accent-fg"
                : "text-muted hover:bg-surface-raised hover:text-fg",
            )}
          >
            <ThemeIcon preference={value} className="size-3.5" />
            {LABELS[value]}
          </button>
        );
      })}
    </div>
  );
}
