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
import type { NavMenuSection } from "@/lib/site-nav";
import { cn } from "@/lib/utils";
import { ChevronDown, Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type OpenMenu = {
  pathname: string;
  id: string | null;
};

function navClass(active: boolean) {
  return active
    ? "font-medium text-accent"
    : "text-muted transition-colors hover:text-fg";
}

function sectionActive(pathname: string, section: NavMenuSection) {
  if (
    section.id === "reviews" &&
    (pathname === "/vale-a-pena" || pathname.startsWith("/vale-a-pena/"))
  ) {
    return true;
  }
  return pathname === section.href || pathname.startsWith(`${section.href}/`);
}

function submenuAriaLabel(section: NavMenuSection) {
  return section.id === "reviews"
    ? "Por produto"
    : `Assuntos em ${section.label}`;
}

function toggleAriaLabel(section: NavMenuSection, open: boolean) {
  if (section.id === "reviews") {
    return open ? "Fechar linhas de produto" : "Abrir linhas de produto";
  }
  return open
    ? `Fechar assuntos de ${section.label}`
    : `Abrir assuntos de ${section.label}`;
}

function DesktopNavMenu({
  section,
  pathname,
  open,
  align,
  onOpen,
  onClose,
  onToggle,
}: {
  section: NavMenuSection;
  pathname: string;
  open: boolean;
  align: "left" | "right";
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  const active = sectionActive(pathname, section);

  if (section.links.length === 0) {
    return (
      <Link
        href={section.href}
        className={cn("text-sm tracking-wide whitespace-nowrap", navClass(active))}
        aria-current={active ? "page" : undefined}
      >
        {section.label}
      </Link>
    );
  }

  const wide = section.links.length > 8;

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onClose();
        }
      }}
    >
      <div className="flex items-center">
        <Link
          href={section.href}
          className={cn("text-sm tracking-wide whitespace-nowrap", navClass(active))}
          aria-current={active ? "page" : undefined}
        >
          {section.label}
        </Link>
        <button
          type="button"
          className={cn(
            "inline-flex size-6 items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            active ? "text-accent" : "text-muted hover:text-fg",
          )}
          aria-expanded={open}
          aria-controls={`menu-${section.id}`}
          aria-label={toggleAriaLabel(section, open)}
          onClick={onToggle}
        >
          <ChevronDown
            aria-hidden
            className={cn("size-3.5 transition-transform", open && "rotate-180")}
          />
        </button>
      </div>
      <div
        hidden={!open}
        className={cn(
          "absolute top-full z-50 pt-2",
          align === "right" ? "right-0" : "left-0",
        )}
      >
        <nav
          id={`menu-${section.id}`}
          aria-label={submenuAriaLabel(section)}
          className="border border-border border-t-2 border-t-accent bg-bg p-2 shadow-card"
        >
          <p className="px-2 pt-1 pb-1 text-[0.65rem] tracking-[0.16em] text-muted uppercase">
            {section.menuLabel}
          </p>
          <ul
            className={cn(
              wide ? "grid w-[26rem] grid-cols-2 gap-x-1" : "w-60",
            )}
          >
            {section.links.map((link) => {
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

function MobileNavSection({
  section,
  pathname,
}: {
  section: NavMenuSection;
  pathname: string;
}) {
  const active = sectionActive(pathname, section);

  return (
    <div className="flex flex-col gap-3">
      <SheetClose asChild>
        <Link
          href={section.href}
          className={cn("text-lg", navClass(active))}
          aria-current={active ? "page" : undefined}
        >
          {section.label}
        </Link>
      </SheetClose>
      {section.links.length > 0 ? (
        <nav
          aria-label={submenuAriaLabel(section)}
          className="flex flex-col gap-2.5 border-l border-border pl-4"
        >
          <p className="text-[0.65rem] tracking-[0.16em] text-muted uppercase">
            {section.menuLabel}
          </p>
          {section.links.map((link) => {
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
  sections,
}: {
  sections: readonly NavMenuSection[];
}) {
  const pathname = usePathname();
  const [menu, setMenu] = useState<OpenMenu>({ pathname, id: null });

  if (menu.pathname !== pathname) {
    setMenu({ pathname, id: null });
  }

  const openId = menu.pathname === pathname ? menu.id : null;

  useEffect(() => {
    if (!openId) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenu((current) =>
          current.id ? { ...current, id: null } : current,
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

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

        <nav aria-label="Navegação" className="hidden items-center gap-3 xl:gap-4 lg:flex">
          {sections.map((section, index) => (
            <DesktopNavMenu
              key={section.id}
              section={section}
              pathname={pathname}
              open={openId === section.id}
              align={index >= 3 ? "right" : "left"}
              onOpen={() => setMenu({ pathname, id: section.id })}
              onClose={() =>
                setMenu((current) =>
                  current.id === section.id
                    ? { pathname, id: null }
                    : current,
                )
              }
              onToggle={() =>
                setMenu((current) => ({
                  pathname,
                  id:
                    current.pathname === pathname && current.id === section.id
                      ? null
                      : section.id,
                }))
              }
            />
          ))}
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
                {sections.map((section) => (
                  <MobileNavSection
                    key={section.id}
                    section={section}
                    pathname={pathname}
                  />
                ))}
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
