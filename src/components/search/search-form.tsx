import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchForm({
  defaultValue = "",
  autoFocus = false,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
}) {
  return (
    <form
      action="/busca"
      role="search"
      className="flex w-full gap-2 border border-white/10 bg-surface/60 p-2 transition-colors focus-within:border-accent/70"
    >
      <label htmlFor="q" className="sr-only">
        Buscar matérias
      </label>
      <Input
        id="q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder="IA, Cursor, Steam Deck, setup..."
        autoComplete="off"
        className="border-transparent bg-transparent"
      />
      <Button type="submit" size="lg" className="px-4">
        <Search />
        <span className="hidden sm:inline">Buscar</span>
      </Button>
    </form>
  );
}
