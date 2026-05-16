"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Box, ShoppingCart, X } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/demo", label: "Inicio", icon: Home },
  { href: "/demo/equipo", label: "Equipo", icon: Users },
  { href: "/demo/inventario", label: "Inventario", icon: Box },
  { href: "/demo/compras", label: "Compras", icon: ShoppingCart },
];

export function DemoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-[100svh] flex-col bg-black text-white">
      <header className="shrink-0 z-20 border-b border-white/10 bg-black pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex min-h-12 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo-como-en-casa.png"
              alt="Como en Casa"
              className="h-10 w-auto max-w-[110px] object-contain sm:h-12 sm:max-w-[130px]"
            />
            <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-amber-400">
              Demo
            </span>
          </div>
          <Link
            href="/login"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-white/20 bg-white/5 text-neutral-400 transition-colors hover:border-white/40 hover:text-white"
            aria-label="Salir del demo"
          >
            <X className="size-4" />
          </Link>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-7xl px-4 pt-5 pb-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <nav className="shrink-0 z-50 border-t border-white/10 bg-black/95 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+4px)]">
        <div className="mx-auto grid max-w-xl grid-cols-4 gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/demo" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-11 items-center justify-center gap-1 rounded-xl border px-1 text-sm font-medium leading-none whitespace-nowrap overflow-hidden transition-colors hover:text-white sm:h-8 sm:rounded-[10px]",
                  isActive
                    ? "border-white bg-white text-black hover:text-black"
                    : "border-white/25 bg-black text-neutral-400 hover:border-white/50 hover:text-white"
                )}
              >
                <Icon className="size-3.5 sm:size-3" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
