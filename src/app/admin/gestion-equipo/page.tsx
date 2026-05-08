import { Plus, UserRound } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  currentWorkWeek,
  employees,
  getDayTotalWorked,
  getEmployeeDaysWorked,
  getWeekTotalDays,
} from "@/lib/mock-data";

const roleLabels = {
  barista: "Barista",
  cocina: "Cocina",
  servicio: "Servicio",
  caja: "Caja",
};

export default function TeamManagementPage() {
  return (
    <>
      <PageHeader
        title="Gestión equipo"
        description={`${getWeekTotalDays()} días trabajados`}
        action={
          <Button className="rounded-2xl bg-[#d98b3a] font-semibold text-[#17100b] hover:bg-[#eda24f]">
            <Plus className="size-4" />
            Empleado
          </Button>
        }
      />

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#1b1814]">
        <div className="grid grid-cols-[minmax(132px,1fr)_repeat(7,44px)_48px] gap-2 overflow-x-auto p-3 text-sm">
          <div className="sticky left-0 z-10 bg-[#1b1814] px-1 py-2 font-medium text-[#bdb6ae]">
            Equipo
          </div>
          {currentWorkWeek.map((day) => (
            <div key={day.date} className="py-2 text-center font-medium text-[#bdb6ae]">
              {day.shortLabel}
            </div>
          ))}
          <div className="py-2 text-center font-medium text-[#bdb6ae]">Total</div>

          {employees.map((employee) => (
            <div
              key={employee.id}
              className="contents"
            >
              <div className="sticky left-0 z-10 flex min-h-12 items-center bg-[#1b1814] px-1">
                <div>
                  <p className="font-semibold leading-tight text-white">{employee.name}</p>
                  <p className="text-xs text-[#8f8780]">{roleLabels[employee.role]}</p>
                </div>
              </div>
              {currentWorkWeek.map((day) => {
                const worked = day.worked[employee.id] ?? false;

                return (
                  <button
                    key={day.date}
                    type="button"
                    aria-pressed={worked}
                    className={
                      worked
                        ? "flex size-11 items-center justify-center rounded-2xl bg-[#d98b3a] text-sm font-bold text-[#17100b]"
                        : "flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-bold text-[#5f5952]"
                    }
                  >
                    {worked ? "✓" : ""}
                  </button>
                );
              })}
              <div className="flex size-11 items-center justify-center rounded-2xl bg-white/[0.04] text-sm font-semibold text-white">
                {getEmployeeDaysWorked(employee.id)}
              </div>
            </div>
          ))}

          <div className="sticky left-0 z-10 bg-[#1b1814] px-1 py-3 font-semibold text-white">
            Total
          </div>
          {currentWorkWeek.map((day) => (
            <div
              key={day.date}
              className="flex size-11 items-center justify-center rounded-2xl bg-[#2b251d] text-sm font-semibold text-[#d98b3a]"
            >
              {getDayTotalWorked(day)}
            </div>
          ))}
          <div className="flex size-11 items-center justify-center rounded-2xl bg-[#d98b3a] text-sm font-bold text-[#17100b]">
            {getWeekTotalDays()}
          </div>
        </div>
      </section>

      <section className="mt-5 space-y-3">
        {employees.map((employee) => {
          const isActive = employee.status === "activo";

          return (
            <article
              key={employee.id}
              className="flex items-center justify-between gap-3 rounded-[1.75rem] border border-white/10 bg-[#1b1814] p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.04] text-[#d98b3a]">
                  <UserRound className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{employee.name}</p>
                  <p className="text-sm text-[#a8a09a]">
                    {roleLabels[employee.role]} · {employee.phone}
                  </p>
                </div>
              </div>
              <Badge
                className={
                  isActive
                    ? "shrink-0 rounded-full bg-[#1f4d32] text-[#9df2b1]"
                    : "shrink-0 rounded-full bg-[#3c2b11] text-[#ffbd63]"
                }
              >
                {isActive ? "Activo" : "Inactivo"}
              </Badge>
            </article>
          );
        })}
      </section>
    </>
  );
}
