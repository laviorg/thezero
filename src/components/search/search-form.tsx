import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchForm({
  defaultValue = "",
  autoFocus = false,
  inputId = "q",
  compact = false,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
  inputId?: string;
  compact?: boolean;
}) {
  return (
    <form
      action="/busca"
      role="search"
      className="flex w-full gap-2 rounded-lg border border-border bg-surface p-2 shadow-card transition-colors focus-within:border-accent/70"
    >
      <label htmlFor={inputId} className="sr-only">
        Buscar matérias
      </label>
      <Input
        id={inputId}
        name="q"
        type="search"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder="IA, Cursor, Steam Deck, setup..."
        autoComplete="off"
        className="border-transparent bg-transparent focus-visible:border-transparent"
      />
      <Button
        type="submit"
        size={compact ? "icon" : "lg"}
        className={compact ? "shrink-0" : "px-4"}
        aria-label={compact ? "Buscar matérias" : undefined}
      >
        <Search />
        {compact ? (
          <span className="sr-only">Buscar</span>
        ) : (
          <span className="hidden sm:inline">Buscar</span>
        )}
      </Button>
    </form>
  );
}
