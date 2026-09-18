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
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  ...categoryList.map((category) => ({
    href: category.href,
    label: category.label,
  })),
  { href: "/sobre", label: "Sobre" },
];

function navClass(active: boolean) {
  return active
    ? "text-accent"
    : "text-muted transition-colors hover:text-fg";
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center text-fg outline-none"
          aria-label="The Zero — newsroom"
        >
          <Wordmark className="h-8 w-auto sm:h-9" />
        </Link>

        <nav aria-label="Editorias" className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm tracking-wide ${navClass(active)}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

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
                className="lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="sr-only">The Zero</SheetTitle>
                <Wordmark className="h-8 w-auto text-fg" />
                <SheetDescription className="sr-only">
                  Menu de navegação
                </SheetDescription>
              </SheetHeader>
              <nav className="mt-10 flex flex-col gap-5" aria-label="Menu">
                <SheetClose asChild>
                  <Link href="/" className={navClass(pathname === "/")}>
                    Newsroom
                  </Link>
                </SheetClose>
                {nav.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link href={item.href} className={`text-lg ${navClass(active)}`}>
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
                <SheetClose asChild>
                  <Link href="/busca" className="text-lg text-muted hover:text-fg">
                    Busca
                  </Link>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
