"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Box, ShoppingCart, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Inicio", icon: Home },
  { href: "/admin/gestion-equipo", label: "Equipo", icon: Users },
  { href: "/admin/inventario", label: "Inventario", icon: Box },
  { href: "/admin/compras", label: "Compras", icon: ShoppingCart },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black text-white">
      <div>
        <header className="sticky top-0 z-20 border-b border-white/10 bg-black backdrop-blur-sm">
          <div className="flex min-h-12 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <img
              src="/logo-como-en-casa.png"
              alt="Como en Casa"
              className="h-10 w-auto max-w-[110px] object-contain sm:h-12 sm:max-w-[130px]"
            />
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-black/20 bg-white text-black transition-colors hover:border-black/40"
                aria-label="Salir"
              >
                <LogOut className="size-4" />
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-5 sm:px-6 lg:px-8">
          {children}
        </main>
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/95 px-1.5 py-1.5 backdrop-blur">
          <div className="mx-auto grid max-w-xl grid-cols-4 gap-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-7 items-center justify-center gap-0.5 rounded-[10px] border border-transparent px-1 text-[0.66rem] font-medium leading-none whitespace-nowrap overflow-hidden transition-colors hover:text-white sm:gap-1 sm:text-xs",
                    isActive
                      ? "border-white bg-white text-black hover:text-black"
                      : "border-white/25 bg-black text-white/70 hover:border-white/50 hover:text-white"
                  )}
                >
                  <Icon className="size-3" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
