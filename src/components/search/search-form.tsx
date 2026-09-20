import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchForm({
  defaultValue = "",
  autoFocus = false,
  inputId = "q",
  showSubmitLabel = "sm",
}: {
  defaultValue?: string;
  autoFocus?: boolean;
  inputId?: string;
  showSubmitLabel?: "sm" | "always";
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
      <Button type="submit" size="lg" className="px-4">
        <Search />
        <span className={showSubmitLabel === "always" ? undefined : "hidden sm:inline"}>
          Buscar
        </span>
      </Button>
    </form>
  );
}
