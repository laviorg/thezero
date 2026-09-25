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
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = categoryList.map((category) => ({
  href: category.href,
  label: category.label,
}));

export type ReviewNavLink = {
  href: string;
  label: string;
};

function navClass(active: boolean) {
  return active
    ? "font-medium text-accent"
    : "text-muted transition-colors hover:text-fg";
}

function reviewsActive(pathname: string) {
  return pathname === "/reviews" || pathname.startsWith("/reviews/");
}

function ReviewsDesktopMenu({
  links,
  pathname,
}: {
  links: readonly ReviewNavLink[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const active = reviewsActive(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (links.length === 0) {
    return (
      <Link
        href="/reviews"
        className={cn("text-sm tracking-wide", navClass(active))}
        aria-current={active ? "page" : undefined}
      >
        Reviews
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <div className="flex items-center">
        <Link
          href="/reviews"
          className={cn("text-sm tracking-wide", navClass(active))}
          aria-current={active ? "page" : undefined}
        >
          Reviews
        </Link>
        <button
          type="button"
          className={cn(
            "inline-flex size-6 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            active ? "text-accent" : "text-muted hover:text-fg",
          )}
          aria-expanded={open}
          aria-controls="menu-reviews"
          aria-label={open ? "Fechar linhas de produto" : "Abrir linhas de produto"}
          onClick={() => setOpen((value) => !value)}
        >
          <ChevronDown
            aria-hidden
            className={cn("size-3.5 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>
      <div hidden={!open} className="absolute right-0 top-full z-50 pt-2">
        <nav
          id="menu-reviews"
          aria-label="Por produto"
          className="border border-border border-t-2 border-t-accent bg-bg p-2 shadow-card"
        >
          <p className="px-2 pt-1 pb-1 text-[0.65rem] tracking-[0.16em] text-muted uppercase">
            Por produto
          </p>
          <ul className="grid w-[26rem] grid-cols-2 gap-x-1">
            {links.map((link) => {
              const itemActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-sm px-2 py-1.5 text-sm hover:bg-accent-soft",
                      navClass(itemActive),
                    )}
                    aria-current={itemActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

function ReviewsMobileLinks({
  links,
  pathname,
}: {
  links: readonly ReviewNavLink[];
  pathname: string;
}) {
  const active = reviewsActive(pathname);

  return (
    <div className="flex flex-col gap-3">
      <SheetClose asChild>
        <Link
          href="/reviews"
          className={cn("text-lg", navClass(active))}
          aria-current={active ? "page" : undefined}
        >
          Reviews
        </Link>
      </SheetClose>
      {links.length > 0 ? (
        <nav
          aria-label="Por produto"
          className="flex flex-col gap-2.5 border-l border-border pl-4"
        >
          <p className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">
            Por produto
          </p>
          {links.map((link) => {
            const itemActive = pathname === link.href;
            return (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className={cn("text-base", navClass(itemActive))}
                  aria-current={itemActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}

export function SiteHeader({
  reviewLinks,
}: {
  reviewLinks: readonly ReviewNavLink[];
}) {
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

        <nav aria-label="Navegação" className="hidden items-center gap-6 lg:flex">
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
          <ReviewsDesktopMenu links={reviewLinks} pathname={pathname} />
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
                <SearchForm inputId="menu-q" compact autoFocus={false} />
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
                <ReviewsMobileLinks links={reviewLinks} pathname={pathname} />
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
