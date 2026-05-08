"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Coffee,
  HandCoins,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard },
  { href: "/admin/empleados", label: "Empleados", icon: Users },
  { href: "/admin/horarios", label: "Horarios", icon: CalendarDays },
  { href: "/admin/propinas", label: "Propinas", icon: HandCoins },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f8f3ea] text-[#2c2118]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#e6d8c5] bg-[#fffaf2] px-4 py-5 lg:flex lg:flex-col">
        <Link href="/admin" className="flex items-center gap-3 px-2">
          <span className="flex size-10 items-center justify-center rounded-lg bg-[#6f4e37] text-white">
            <Coffee className="size-5" />
          </span>
          <span>
            <span className="block text-base font-semibold">Como en Casa</span>
            <span className="block text-xs text-[#7a6654]">Operacion interna</span>
          </span>
        </Link>

        <Separator className="my-5 bg-[#eadccb]" />

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
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-[#6a5543] transition-colors hover:bg-[#f0e2d0] hover:text-[#2c2118]",
                  isActive && "bg-[#6f4e37] text-white hover:bg-[#6f4e37] hover:text-white"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-lg bg-[#f0e2d0] p-3 text-sm text-[#5e4a39]">
          <p className="font-medium text-[#2c2118]">MVP operativo</p>
          <p className="mt-1 text-xs leading-5">
            Datos mock centralizados para validar propinas antes de conectar sistemas.
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-[#e6d8c5] bg-[#fffaf2]/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#9a6b3f]">
                Cafe restaurante
              </p>
              <h1 className="text-lg font-semibold">Administracion</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">
                  <LogOut className="size-4" />
                  Salir
                </Link>
              </Button>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
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
                    "flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-medium text-[#6a5543]",
                    isActive && "bg-[#6f4e37] text-white"
                  )}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
