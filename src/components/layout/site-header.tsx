"use client";

import { Wordmark } from "@/components/brand/logo";
import { SearchForm } from "@/components/search/search-form";
import { ThemeSwitcher, ThemeToggle } from "@/components/theme/theme-toggle";
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

const nav = categoryList.map((category) => ({
  href: category.href,
  label: category.label,
}));

function navClass(active: boolean) {
  return active
    ? "font-medium text-accent"
    : "text-muted transition-colors hover:text-fg";
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border border-t-[3px] border-t-accent bg-bg/85 backdrop-blur-md">
      <div className="shell-frame site-header-bar">
        <Link
          href="/"
          className="site-header-brand flex items-center text-fg outline-none"
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

        <div className="site-header-actions flex items-center gap-1">
          <ThemeToggle className="max-lg:hidden" />
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="max-lg:hidden"
          >
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
                  Menu de navegação, busca e aparência
                </SheetDescription>
              </SheetHeader>
              <div className="mt-8">
                <p className="eyebrow mb-3 text-muted">Busca</p>
                <SearchForm inputId="menu-q" compact />
              </div>
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
                  <Link href="/sobre" className="text-lg text-muted hover:text-fg">
                    Sobre
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/contato" className="text-lg text-muted hover:text-fg">
                    Contato
                  </Link>
                </SheetClose>
              </nav>
              <div className="mt-auto pt-8">
                <p className="eyebrow mb-3 text-muted">Aparência</p>
                <ThemeSwitcher />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
