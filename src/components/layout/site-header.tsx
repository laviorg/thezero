"use client";

import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { categoryList } from "@/lib/categories";
import { site } from "@/lib/site";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const editorias = categoryList.map((category) => ({
  href: category.href,
  label: category.label,
}));

const extraNav = [{ href: "/sobre", label: "Sobre" }] as const;

function navClass(active: boolean) {
  return active
    ? "text-accent"
    : "text-muted transition-colors hover:text-fg";
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-bg/92 backdrop-blur-md">
      <div className="shell-frame flex h-11 items-center justify-between gap-4 sm:h-12">
        <Link
          href="/"
          className="flex items-center text-fg outline-none"
          aria-label="The Zero — newsroom"
        >
          <Wordmark className="h-[1.65rem] w-auto sm:h-7" />
        </Link>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/busca" aria-label="Buscar matérias">
              <Search />
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Abrir menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="sr-only">The Zero</SheetTitle>
                <Wordmark className="h-8 w-auto text-fg" />
                <SheetDescription>{site.tagline}</SheetDescription>
              </SheetHeader>
              <nav className="mt-8 flex flex-col" aria-label="Menu">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className={`border-b border-white/10 py-3 text-lg ${navClass(pathname === "/")}`}
                    aria-current={pathname === "/" ? "page" : undefined}
                  >
                    Newsroom
                  </Link>
                </SheetClose>
                {editorias.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={`border-b border-white/10 py-3 text-lg ${navClass(active)}`}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
                {extraNav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={`border-b border-white/10 py-3 text-lg ${navClass(active)}`}
                        aria-current={active ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
                <SheetClose asChild>
                  <Link
                    href="/busca"
                    className="py-3 text-lg text-muted hover:text-fg"
                  >
                    Busca
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <nav
        aria-label="Editorias"
        className="hidden border-t border-white/10 md:block"
      >
        <div className="shell-frame flex h-9 items-center gap-4 overflow-x-auto">
          {editorias.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 text-[0.76rem] tracking-[0.12em] uppercase ${navClass(active)}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="mx-1 h-3 w-px shrink-0 bg-white/15" aria-hidden />
          {extraNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 text-[0.76rem] tracking-[0.12em] uppercase ${navClass(active)}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
