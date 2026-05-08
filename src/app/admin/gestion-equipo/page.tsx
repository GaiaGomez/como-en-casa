"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Info, Plus, UserRound } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  currentWorkWeek,
  employees as mockEmployees,
  type Employee,
  type WorkDay,
} from "@/lib/mock-data";

const roleLabels: Record<string, string> = {
  barista: "Barista",
  cocina: "Cocina",
  servicio: "Servicio",
  caja: "Caja",
};

const weekRange = "Semana del 11 al 17 de mayo";

export default function TeamManagementPage() {
  const [team, setTeam] = useState<Employee[]>(mockEmployees);
  const [workWeek, setWorkWeek] = useState<WorkDay[]>(currentWorkWeek);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const totalWorkedDays = useMemo(
    () =>
      team.reduce(
        (total, employee) => total + getEmployeeDays(employee.id, workWeek),
        0
      ),
    [team, workWeek]
  );

  function toggleWorked(employeeId: string, date: string) {
    setWorkWeek((week) =>
      week.map((day) =>
        day.date === date
          ? {
              ...day,
              worked: {
                ...day.worked,
                [employeeId]: !day.worked[employeeId],
              },
            }
          : day
      )
    );
  }

  function addEmployee(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    if (!name || !role) {
      return;
    }

    const id = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const employee: Employee = {
      id: `${id || "empleado"}-${Date.now()}`,
      name,
      role,
      phone,
      status: "activo",
      hiredAt: "2026-05-11",
      baseShift: role,
      contractType: "Pendiente",
      salaryBase: "Pendiente",
      eps: "Pendiente",
      arl: "Pendiente",
      pensionFund: "Pendiente",
      emergencyContact: "Pendiente",
      emergencyPhone: "Pendiente",
      emergencyRelation: "Pendiente",
      internalNotes: "Sin notas.",
    };

    setTeam((current) => [...current, employee]);
    setWorkWeek((week) =>
      week.map((day) => ({
        ...day,
        worked: { ...day.worked, [employee.id]: false },
      }))
    );
    setIsAddOpen(false);
    event.currentTarget.reset();
  }

  return (
    <>
      <PageHeader title="Gestión equipo" description={weekRange} />

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#1b1814]">
        <div className="overflow-x-auto">
          <div className="grid min-w-[720px] grid-cols-[minmax(142px,1fr)_repeat(7,72px)_56px] gap-2 p-3 text-sm">
            <div className="sticky left-0 z-10 bg-[#1b1814] px-1 py-2 font-medium text-[#bdb6ae]">
              Equipo
            </div>
            {workWeek.map((day) => (
              <div
                key={day.date}
                className="py-2 text-center text-xs font-semibold leading-tight text-[#bdb6ae]"
              >
                {day.shortLabel}
              </div>
            ))}
            <div className="py-2 text-center text-xs font-semibold text-[#bdb6ae]">
              Total
            </div>

            {team.map((employee) => (
              <div key={employee.id} className="contents">
                <div className="sticky left-0 z-10 flex min-h-12 items-center bg-[#1b1814] px-1">
                  <div>
                    <p className="font-semibold leading-tight text-white">
                      {employee.name}
                    </p>
                    <p className="text-xs text-[#8f8780]">
                      {getRoleLabel(employee.role)}
                    </p>
                  </div>
                </div>
                {workWeek.map((day) => {
                  const worked = day.worked[employee.id] ?? false;

                  return (
                    <button
                      key={day.date}
                      type="button"
                      aria-pressed={worked}
                      onClick={() => toggleWorked(employee.id, day.date)}
                      className={
                        worked
                          ? "flex h-12 items-center justify-center rounded-2xl bg-[#d98b3a] text-sm font-bold text-[#17100b]"
                          : "flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-transparent text-sm font-bold text-[#5f5952]"
                      }
                    >
                      {worked ? "✓" : ""}
                    </button>
                  );
                })}
                <div className="flex h-12 items-center justify-center rounded-2xl bg-white/[0.04] text-sm font-semibold text-white">
                  {getEmployeeDays(employee.id, workWeek)}
                </div>
              </div>
            ))}

            <div className="sticky left-0 z-10 bg-[#1b1814] px-1 py-3 font-semibold text-white">
              Total
            </div>
            {workWeek.map((day) => (
              <div
                key={day.date}
                className="flex h-12 items-center justify-center rounded-2xl bg-[#2b251d] text-sm font-semibold text-[#d98b3a]"
              >
                {getDayTotal(day, team)}
              </div>
            ))}
            <div className="flex h-12 items-center justify-center rounded-2xl bg-[#d98b3a] text-sm font-bold text-[#17100b]">
              {totalWorkedDays}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 space-y-3">
        {team.map((employee) => {
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
                  <p className="truncate text-sm text-[#a8a09a]">
                    {getRoleLabel(employee.role)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge
                  className={
                    isActive
                      ? "rounded-full bg-[#1f4d32] text-[#9df2b1]"
                      : "rounded-full bg-[#3c2b11] text-[#ffbd63]"
                  }
                >
                  {isActive ? "Activo" : "Inactivo"}
                </Badge>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => setSelectedEmployee(employee)}
                >
                  <Info className="size-4" />
                  <span className="sr-only">Ver info</span>
                </Button>
              </div>
            </article>
          );
        })}
      </section>

      <Button
        type="button"
        className="mt-5 h-12 w-full rounded-2xl bg-[#d98b3a] font-semibold text-[#17100b] hover:bg-[#eda24f] sm:w-auto"
        onClick={() => setIsAddOpen(true)}
      >
        <Plus className="size-4" />
        Empleado
      </Button>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="bottom-0 top-auto max-h-[85vh] overflow-y-auto rounded-b-none border-white/10 bg-[#1b1814] text-white sm:bottom-auto sm:top-1/2 sm:max-w-md sm:-translate-y-1/2 sm:rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Nuevo empleado</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={addEmployee}>
            <Field name="name" label="Nombre" required />
            <Field name="role" label="Cargo" required />
            <Field name="phone" label="Teléfono" />
            <Button className="h-12 w-full rounded-2xl bg-[#d98b3a] font-semibold text-[#17100b] hover:bg-[#eda24f]">
              Guardar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(selectedEmployee)}
        onOpenChange={(open) => !open && setSelectedEmployee(null)}
      >
        <DialogContent className="bottom-0 top-auto max-h-[88vh] overflow-y-auto rounded-b-none border-white/10 bg-[#1b1814] text-white sm:bottom-auto sm:top-1/2 sm:max-w-lg sm:-translate-y-1/2 sm:rounded-[2rem]">
          {selectedEmployee ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl text-white">
                  {selectedEmployee.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <InfoSection
                  title="Datos básicos"
                  rows={[
                    ["Nombre", selectedEmployee.name],
                    ["Cargo", getRoleLabel(selectedEmployee.role)],
                    ["Teléfono", selectedEmployee.phone || "Sin teléfono"],
                    ["Estado", selectedEmployee.status],
                  ]}
                />
                <InfoSection
                  title="Contrato"
                  rows={[
                    ["Tipo", selectedEmployee.contractType],
                    ["Ingreso", selectedEmployee.hiredAt],
                    ["Salario/base", selectedEmployee.salaryBase],
                  ]}
                />
                <InfoSection
                  title="Seguridad social"
                  rows={[
                    ["EPS", selectedEmployee.eps],
                    ["ARL", selectedEmployee.arl],
                    ["Pensión", selectedEmployee.pensionFund],
                  ]}
                />
                <InfoSection
                  title="Emergencia"
                  rows={[
                    ["Contacto", selectedEmployee.emergencyContact],
                    ["Teléfono", selectedEmployee.emergencyPhone],
                    ["Parentesco", selectedEmployee.emergencyRelation],
                  ]}
                />
                <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                  <h3 className="font-semibold text-white">Notas internas</h3>
                  <p className="mt-2 text-sm text-[#bdb6ae]">
                    {selectedEmployee.internalNotes}
                  </p>
                </section>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({
  name,
  label,
  required = false,
}: {
  name: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-[#bdb6ae]">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        required={required}
        className="h-12 rounded-2xl border-white/10 bg-white/5 text-white"
      />
    </div>
  );
}

function InfoSection({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, string]>;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <h3 className="font-semibold text-white">{title}</h3>
      <div className="mt-3 space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 text-sm">
            <span className="text-[#8f8780]">{label}</span>
            <span className="text-right text-[#f7f1e8]">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function getRoleLabel(role: string) {
  return roleLabels[role] ?? role;
}

function getEmployeeDays(employeeId: string, week: WorkDay[]) {
  return week.filter((day) => day.worked[employeeId]).length;
}

function getDayTotal(day: WorkDay, team: Employee[]) {
  return team.filter((employee) => day.worked[employee.id]).length;
}
