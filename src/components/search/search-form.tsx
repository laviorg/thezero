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
    <form action="/busca" role="search" className="flex w-full gap-2">
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
      />
      <Button type="submit" size="lg" className="px-4">
        <Search />
        <span className="hidden sm:inline">Buscar</span>
      </Button>
    </form>
  );
}
