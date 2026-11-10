"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { LogoMark } from "./decor";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/momentos", label: "Momentos" },
  { href: "/carta", label: "Carta" },
  { href: "/tienda", label: "Tienda" },
];

/**
 * Header público.
 * Es "use client" solo porque necesita usePathname() para marcar
 * el link activo; el resto es markup estático.
 */
export function PublicHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-cec-ink/10 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center text-cec-ink transition-transform hover:-rotate-6"
          aria-label="Como en Casa — inicio"
        >
          <LogoMark className="h-12 text-black sm:h-14" />
        </Link>

        <nav className="flex items-center gap-1 rounded-full border border-cec-ink/15 bg-white p-1">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors sm:px-4 sm:text-sm",
                  active
                    ? "bg-cec-ink text-white"
                    : "text-cec-ink hover:bg-neutral-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
