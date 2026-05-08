"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, HandCoins, LogOut, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cafeInfo } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/gestion-equipo", label: "Gestión equipo", icon: Users },
  { href: "/admin/propinas", label: "Propinas", icon: HandCoins },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#11100e] text-[#f7f1e8]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#171512] px-4 py-5 lg:flex lg:flex-col">
        <Link href="/admin" className="flex items-center gap-3 px-2">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[#d98b3a] text-[#17100b]">
            <Coffee className="size-5" />
          </span>
          <span>
            <span className="block text-base font-semibold text-white">{cafeInfo.name}</span>
            <span className="block text-xs text-[#a8a09a]">Admin</span>
          </span>
        </Link>

        <Separator className="my-5 bg-white/10" />

        <nav className="space-y-1">
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
                  "flex h-12 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-[#bdb6ae] transition-colors hover:bg-white/10 hover:text-white",
                  isActive && "bg-[#d98b3a] text-[#17100b] hover:bg-[#d98b3a] hover:text-[#17100b]"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <p className="mt-auto px-2 text-xs font-medium text-[#8f8780]">
          {cafeInfo.todayLabel}
        </p>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#11100e]/90 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#d98b3a]">
                Operación
              </p>
              <h1 className="text-lg font-semibold text-white">Como en Casa</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-2xl border-white/10 bg-white/5 text-[#f7f1e8] hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/login">
                  <LogOut className="size-4" />
                  <span className="sr-only">Salir</span>
                </Link>
              </Button>
            </div>
          </div>
          <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-white/10 bg-[#11100e]/95 px-4 py-3 backdrop-blur lg:hidden">
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
                    "flex h-12 items-center justify-center gap-2 rounded-2xl px-3 text-sm font-medium text-[#bdb6ae]",
                    isActive && "bg-[#d98b3a] text-[#17100b]"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
