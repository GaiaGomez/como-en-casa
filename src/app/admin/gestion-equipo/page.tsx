"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Check, Pencil, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  currentWorkWeek,
  employees as mockEmployees,
  formatCurrency,
  tipWeeks,
  type Employee,
  type PaymentStatus,
  type WorkDay,
} from "@/lib/mock-data";

const roleLabels: Record<string, string> = {
  barista: "Barista",
  cocina: "Cocina",
  servicio: "Servicio",
  caja: "Caja",
};

const statusLabels: Record<string, string> = {
  activo: "Activo",
  descanso: "Descanso",
  inactivo: "Inactivo",
};

const openTipWeek = tipWeeks.find((w) => w.status === "abierta") ?? tipWeeks[0];

export default function TeamManagementPage() {
  const [team, setTeam] = useState<Employee[]>(mockEmployees);
  const [workWeek, setWorkWeek] = useState<WorkDay[]>(currentWorkWeek);
  const [dailyTips, setDailyTips] = useState<Record<string, number>>(openTipWeek.dailyTips);
  const [activeTab, setActiveTab] = useState<"dias" | "propinas" | "gestion">("dias");
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [dialogEmployee, setDialogEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeTeam = useMemo(
    () => team.filter((employee) => employee.status === "activo"),
    [team]
  );

  const dailyTipRows = useMemo(
    () => Object.entries(dailyTips).sort(([a], [b]) => a.localeCompare(b)),
    [dailyTips]
  );
  const weeklyTipTotal = useMemo(
    () => Object.values(dailyTips).reduce((total, amount) => total + amount, 0),
    [dailyTips]
  );

  const totalWorkedDays = useMemo(
    () =>
      workWeek.reduce(
        (total, day) => total + Object.values(day.worked).filter(Boolean).length,
        0
      ),
    [workWeek]
  );

  const tipDistribution = useMemo(() => {
    if (!openTipWeek) return [];
    return activeTeam.map((employee) => {
      const daysWorked = workWeek.filter((day) => day.worked[employee.id]).length;
      const raw =
        totalWorkedDays === 0 ? 0 : (weeklyTipTotal * daysWorked) / totalWorkedDays;
      return {
        employee,
        daysWorked,
        amount: Math.round(raw / 1000) * 1000,
        paymentStatus: (openTipWeek.payments[employee.id] ?? "pendiente") as PaymentStatus,
      };
    });
  }, [workWeek, activeTeam, totalWorkedDays, weeklyTipTotal]);

  const displayedTipTotal = useMemo(
    () => tipDistribution.reduce((sum, item) => sum + item.amount, 0),
    [tipDistribution]
  );

  function toggleWorked(employeeId: string, date: string) {
    setWorkWeek((week) =>
      week.map((day) =>
        day.date === date
          ? { ...day, worked: { ...day.worked, [employeeId]: !day.worked[employeeId] } }
          : day
      )
    );
  }

  function openAddEmployee() {
    setDialogMode("add");
    setDialogEmployee(null);
    setIsDialogOpen(true);
  }

  function openEditEmployee(employee: Employee) {
    setDialogMode("edit");
    setDialogEmployee(employee);
    setIsDialogOpen(true);
  }

  function handleEmployeeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const status = String(formData.get("status") ?? "activo") as Employee["status"];

    if (!name || !role) return;

    if (dialogMode === "edit" && dialogEmployee) {
      setTeam((current) =>
        current.map((employee) =>
          employee.id === dialogEmployee.id
            ? { ...employee, name, role, phone, status }
            : employee
        )
      );
      setIsDialogOpen(false);
      return;
    }

    const id = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const employee: Employee = {
      id: `${id || "empleado"}-${Date.now()}`,
      name,
      role,
      phone,
      status,
      hiredAt: new Date().toISOString().slice(0, 10),
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
      week.map((day) => ({ ...day, worked: { ...day.worked, [employee.id]: false } }))
    );
    setIsDialogOpen(false);
    event.currentTarget.reset();
  }

  return (
    <>
      {/* Tabs */}
      <div className="mb-3 flex gap-1.5">
        {(["dias", "propinas", "gestion"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-[10px] border px-3 py-1.5 text-sm font-medium leading-none transition ${
              activeTab === tab
                ? "border-white bg-white text-black"
                : "border-white/25 bg-black text-white/70 hover:border-white/50 hover:text-white"
            }`}
          >
            {tab === "dias" ? "Horario" : tab === "propinas" ? "Propinas" : "Personal"}
          </button>
        ))}
      </div>

      {activeTab === "dias" ? (
        /* Schedule — wrapped in white panel so nothing floats on black */
        <section className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <div className="grid min-w-[338px] grid-cols-[50px_repeat(7,32px)_32px] gap-0.5 p-2 text-sm sm:min-w-[410px] sm:grid-cols-[58px_repeat(7,40px)_40px]">
              <div className="sticky left-0 z-10 bg-white py-2 pr-0.5 font-medium text-black/40">
                Equipo
              </div>
              {workWeek.map((day) => (
                <div
                  key={day.date}
                  className="py-2 text-center text-xs font-semibold leading-tight text-black/40"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-black/20 bg-white text-black sm:hidden">
                    {getDayShortLabel(day.label)}
                  </span>
                  <span className="hidden sm:block">{day.shortLabel}</span>
                </div>
              ))}
              <div className="py-2 text-center text-xs font-semibold text-black/40">
                Total
              </div>

              {activeTeam.map((employee) => (
                <div key={employee.id} className="contents">
                  <div className="sticky left-0 z-10 flex h-9 items-center bg-white pr-0.5 sm:h-10">
                    <div>
                      <p className="truncate font-semibold leading-tight text-black">
                        {getEmployeeDisplayName(employee.name)}
                      </p>
                      <p className="text-xs text-black/40">
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
                        aria-label={`${employee.name} ${worked ? "trabajó" : "no trabajó"} el ${day.label}`}
                        className={`mx-auto my-auto flex h-6 w-6 items-center justify-center rounded-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 sm:h-8 sm:w-8 ${
                          worked
                            ? "border border-black bg-black text-white"
                            : "border border-black/20 bg-white text-transparent hover:border-black/40"
                        }`}
                      >
                        {worked ? <Check className="size-3 stroke-[3]" aria-hidden="true" /> : null}
                      </button>
                    );
                  })}
                  <div className="mx-auto my-auto flex h-6 w-6 items-center justify-center rounded-lg border border-black/20 bg-white text-xs font-semibold text-black sm:h-8 sm:w-8">
                    {getEmployeeDays(employee.id, workWeek)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : activeTab === "propinas" ? (
        <section className="space-y-3">
          <div className="panel p-4">
            {dailyTipRows.map(([date]) => (
              <TipInputRow
                key={date}
                label={getDayLabel(date)}
                value={dailyTips[date] ?? 0}
                onChange={(value) => {
                  setDailyTips((current) => ({
                    ...current,
                    [date]: value,
                  }));
                }}
              />
            ))}
            <MoneyRow label="Total semana" value={formatCurrency(weeklyTipTotal)} strong />
          </div>

          <div className="panel p-4">
            {tipDistribution.map((item) => (
              <MoneyRow
                key={item.employee.id}
                label={item.employee.name}
                meta={`${item.daysWorked}d`}
                value={formatCurrency(item.amount)}
              />
            ))}
            <MoneyRow label="Total" value={formatCurrency(displayedTipTotal)} strong />
          </div>
        </section>
      ) : (
        <section className="space-y-2">
          {team.map((employee) => (
            <article key={employee.id} className="panel px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 flex-1 truncate font-semibold text-black">
                  {employee.name}
                </p>
                <div className="flex shrink-0 items-center gap-1.5">
                  <span className={`tag ${employee.status === "activo" ? "tag-active" : ""}`}>
                    {statusLabels[employee.status] ?? employee.status}
                  </span>
                  <button
                    type="button"
                    className="tag cursor-pointer hover:border-black/30"
                    onClick={() => openEditEmployee(employee)}
                  >
                    <Pencil className="size-3" />
                    Editar
                  </button>
                </div>
              </div>
              <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-black/45">
                <span>{getRoleLabel(employee.role)}</span>
                <span>{employee.phone}</span>
              </div>
            </article>
          ))}
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 rounded-[10px] bg-white px-3 text-sm font-semibold text-black hover:bg-white/90"
            onClick={openAddEmployee}
          >
            <Plus className="size-4" />
            Nuevo empleado
          </button>
        </section>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
            setDialogEmployee(null);
            setDialogMode("add");
          }
        }}
      >
        <DialogContent className="bottom-0 top-auto max-h-[88vh] overflow-y-auto rounded-t-[16px] border-0 bg-white text-black sm:bottom-auto sm:rounded-[16px] sm:top-1/2 sm:max-w-md sm:-translate-y-1/2">
          <DialogHeader>
            <DialogTitle className="text-xl text-black">
              {dialogMode === "edit" && dialogEmployee
                ? `Editar ${dialogEmployee.name}`
                : "Nuevo empleado"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEmployeeSubmit}>
            <FormField id="name"  label="Nombre"    defaultValue={dialogEmployee?.name ?? ""}  required />
            <FormField id="role"  label="Cargo"     defaultValue={dialogEmployee?.role ?? ""}  required />
            <FormField id="phone" label="Teléfono"  defaultValue={dialogEmployee?.phone ?? ""} />
            <div className="space-y-1.5">
              <label htmlFor="status" className="text-xs font-medium text-black/50">Estado</label>
              <select
                id="status"
                name="status"
                defaultValue={dialogEmployee?.status ?? "activo"}
                className="w-full rounded-[10px] border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black/40"
              >
                <option value="activo">Activo</option>
                <option value="descanso">Descanso</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <button type="submit" className="h-9 w-full rounded-[10px] bg-black text-sm font-semibold text-white">
              Guardar
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FormField({
  id,
  label,
  defaultValue = "",
  required = false,
}: {
  id: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-black/50">{label}</label>
      <input
        id={id}
        name={id}
        defaultValue={defaultValue}
        required={required}
        className="h-9 w-full rounded-[10px] border border-black/15 bg-white px-3 text-sm text-black outline-none focus:border-black/40"
      />
    </div>
  );
}


function TipInputRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-black/[0.07] py-2 last:border-b-0">
      <span className="text-sm text-black/70">{label}</span>
      <div className="flex shrink-0 items-center gap-1">
        <span className="text-sm font-semibold text-black">$</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label={`Editar propinas de ${label}`}
          className="h-8 w-28 rounded-[8px] border border-black/30 bg-white px-2 text-right text-sm font-bold text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
          value={String(value)}
          onChange={(event) => {
            const parsed = Number(event.target.value.replace(/\D/g, ""));
            onChange(Number.isFinite(parsed) ? parsed : 0);
          }}
        />
      </div>
    </div>
  );
}

function getRoleLabel(role: string) {
  return roleLabels[role] ?? role;
}

function getEmployeeDays(employeeId: string, week: WorkDay[]) {
  return week.filter((day) => day.worked[employeeId]).length;
}

function getDayShortLabel(label: string) {
  const shortDays: Record<string, string> = {
    Lunes: "L", Martes: "M", Miércoles: "X", Jueves: "J",
    Viernes: "V", Sábado: "S", Domingo: "D",
  };
  return shortDays[label] ?? label.charAt(0);
}

function getEmployeeDisplayName(name: string) {
  const firstName = name.trim().split(/\s+/)[0] ?? name;
  const friendlyShortNames: Record<string, string> = { valentina: "Valen" };
  const lookupKey = firstName.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  if (friendlyShortNames[lookupKey]) return friendlyShortNames[lookupKey];
  return firstName.length > 8 ? firstName.slice(0, 5) : firstName;
}

function MoneyRow({
  label, meta, value, strong = false, subtle = false,
}: {
  label: string; meta?: string; value: string; strong?: boolean; subtle?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-black/[0.07] py-2 last:border-b-0">
      <div className="flex min-w-0 items-baseline gap-2">
        <span className={strong ? "font-bold text-black" : subtle ? "text-sm text-black/40" : "truncate text-sm text-black/70"}>
          {label}
        </span>
        {meta ? <span className="text-xs text-black/35">{meta}</span> : null}
      </div>
      <span className={strong ? "shrink-0 font-bold text-black" : subtle ? "shrink-0 text-sm text-black/40" : "shrink-0 text-sm font-medium text-black"}>
        {value}
      </span>
    </div>
  );
}

function getDayLabel(date: string) {
  const formatter = new Intl.DateTimeFormat("es-CO", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return formatter.format(new Date(`${date}T00:00:00`)).replace(",", "");
}
