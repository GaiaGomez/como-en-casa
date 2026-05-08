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
  addDays,
  currentWorkWeek,
  employees as mockEmployees,
  formatCurrency,
  getWeekLabel,
  getWorkDayLabel,
  getWorkDayShortLabel,
  tipWeeks,
  type Employee,
  type PaymentStatus,
  type WorkDay,
} from "@/lib/mock-data";

const roleLabels: Record<string, string> = {
  cocina: "Cocina",
  estacion: "Estación",
  reposteria: "Repostería",
  mesero: "Mesero",
};

const areaGroups = [
  { role: "cocina", label: "Cocina" },
  { role: "estacion", label: "Estación" },
  { role: "reposteria", label: "Repostería" },
  { role: "mesero", label: "Meseros" },
] as const;

const statusLabels: Record<string, string> = {
  activo: "Activo",
  descanso: "Descanso",
  inactivo: "Inactivo",
};

const openTipWeek = tipWeeks.find((w) => w.status === "abierta") ?? tipWeeks[0];
const closedTipWeek = tipWeeks.find((w) => w.status === "cerrada") ?? tipWeeks[1] ?? openTipWeek;
const employeeIds = mockEmployees.map((employee) => employee.id);

type TeamWeek = {
  id: string;
  startDate: string;
  endDate: string;
  dailyTips: Record<string, number>;
  payments: Record<string, PaymentStatus>;
  workWeek: WorkDay[];
};

function createWorkWeek(
  startDate: string,
  workedByDay: Array<Record<string, boolean>>
): WorkDay[] {
  return workedByDay.map((worked, index) => {
    const date = addDays(startDate, index);
    return {
      date,
      label: getWorkDayLabel(date),
      shortLabel: getWorkDayShortLabel(date),
      worked,
    };
  });
}

function createDailyTips(startDate: string, amounts: number[]) {
  return Object.fromEntries(
    amounts.map((amount, index) => [addDays(startDate, index), amount])
  );
}

const teamWeeks: TeamWeek[] = [
  {
    id: closedTipWeek.id,
    startDate: closedTipWeek.startDate,
    endDate: closedTipWeek.endDate,
    dailyTips: closedTipWeek.dailyTips,
    payments: closedTipWeek.payments,
    workWeek: createWorkWeek(closedTipWeek.startDate, [
      { lilina: true, sandra: true, valeria: true, andrea: true, yamile: true, mildrey: true, yeral: true, huber: true, wilton: true },
      { lilina: true, sandra: false, valeria: true, andrea: true, yamile: false, mildrey: true, yeral: true, huber: true, wilton: false },
      { lilina: true, sandra: true, valeria: false, andrea: true, yamile: true, mildrey: true, yeral: false, huber: true, wilton: true },
      { lilina: false, sandra: true, valeria: true, andrea: true, yamile: true, mildrey: false, yeral: true, huber: true, wilton: true },
      { lilina: true, sandra: true, valeria: true, andrea: false, yamile: true, mildrey: true, yeral: true, huber: false, wilton: true },
      { lilina: true, sandra: true, valeria: true, andrea: true, yamile: false, mildrey: true, yeral: true, huber: true, wilton: true },
      { lilina: true, sandra: true, valeria: true, andrea: true, yamile: true, mildrey: true, yeral: true, huber: true, wilton: true },
    ]),
  },
  {
    id: openTipWeek.id,
    startDate: openTipWeek.startDate,
    endDate: openTipWeek.endDate,
    dailyTips: openTipWeek.dailyTips,
    payments: openTipWeek.payments,
    workWeek: currentWorkWeek,
  },
  {
    id: "tips-2026-05-09",
    startDate: "2026-05-09",
    endDate: "2026-05-15",
    dailyTips: createDailyTips("2026-05-09", [242000, 154000, 138000, 149000, 157000, 166000, 225000]),
    payments: Object.fromEntries(employeeIds.map((id) => [id, "pendiente" as PaymentStatus])),
    workWeek: createWorkWeek("2026-05-09", [
      { lilina: true, sandra: true, valeria: true, andrea: true, yamile: true, mildrey: true, yeral: true, huber: true, wilton: true },
      { lilina: true, sandra: false, valeria: true, andrea: true, yamile: false, mildrey: true, yeral: true, huber: true, wilton: false },
      { lilina: true, sandra: true, valeria: true, andrea: true, yamile: true, mildrey: false, yeral: false, huber: true, wilton: true },
      { lilina: false, sandra: true, valeria: true, andrea: true, yamile: true, mildrey: true, yeral: true, huber: true, wilton: true },
      { lilina: true, sandra: true, valeria: false, andrea: false, yamile: true, mildrey: true, yeral: true, huber: true, wilton: true },
      { lilina: true, sandra: true, valeria: true, andrea: true, yamile: true, mildrey: true, yeral: true, huber: false, wilton: true },
      { lilina: true, sandra: true, valeria: true, andrea: true, yamile: true, mildrey: true, yeral: true, huber: true, wilton: true },
    ]),
  },
];

export default function TeamManagementPage() {
  const [team, setTeam] = useState<Employee[]>(mockEmployees);
  const [weekIndex, setWeekIndex] = useState(1);
  const [weeks, setWeeks] = useState<TeamWeek[]>(teamWeeks);
  const [activeTab, setActiveTab] = useState<"dias" | "propinas" | "gestion">("dias");
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [dialogEmployee, setDialogEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeTeam = useMemo(
    () => team.filter((employee) => employee.status === "activo"),
    [team]
  );
  const groupedActiveTeam = useMemo(
    () =>
      Object.fromEntries(
        areaGroups.map((group) => [
          group.role,
          activeTeam.filter((employee) => employee.role === group.role),
        ])
      ) as Record<(typeof areaGroups)[number]["role"], Employee[]>,
    [activeTeam]
  );
  const currentWeek = weeks[weekIndex] ?? weeks[1];
  const workWeek = currentWeek.workWeek;
  const dailyTips = currentWeek.dailyTips;
  const weekRange = getCompactWeekLabel(currentWeek.startDate, currentWeek.endDate);

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
      activeTeam.reduce((total, employee) => {
        return total + workWeek.filter((day) => day.worked[employee.id]).length;
      }, 0),
    [activeTeam, workWeek]
  );

  const tipDistribution = useMemo(() => {
    let assigned = 0;
    const eligibleTeam = activeTeam.filter((employee) =>
      workWeek.some((day) => day.worked[employee.id])
    );

    return eligibleTeam.map((employee, index) => {
      const daysWorked = workWeek.filter((day) => day.worked[employee.id]).length;
      const isLast = index === eligibleTeam.length - 1;
      const amount =
        totalWorkedDays === 0
          ? 0
          : isLast
            ? weeklyTipTotal - assigned
            : Math.round((weeklyTipTotal * daysWorked) / totalWorkedDays);

      assigned += amount;

      return {
        employee,
        daysWorked,
        amount,
        paymentStatus: currentWeek.payments[employee.id] ?? "pendiente",
      };
    });
  }, [activeTeam, currentWeek.payments, totalWorkedDays, weeklyTipTotal, workWeek]);

  const displayedTipTotal = useMemo(
    () => tipDistribution.reduce((sum, item) => sum + item.amount, 0),
    [tipDistribution]
  );

  function toggleWorked(employeeId: string, date: string) {
    setWeeks((current) =>
      current.map((week, index) =>
        index === weekIndex
          ? {
              ...week,
              workWeek: week.workWeek.map((day) =>
                day.date === date
                  ? { ...day, worked: { ...day.worked, [employeeId]: !day.worked[employeeId] } }
                  : day
              ),
            }
          : week
      )
    );
  }

  function updateDailyTip(date: string, value: number) {
    setWeeks((current) =>
      current.map((week, index) =>
        index === weekIndex
          ? { ...week, dailyTips: { ...week.dailyTips, [date]: value } }
          : week
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
    setWeeks((current) =>
      current.map((week) => ({
        ...week,
        workWeek: week.workWeek.map((day) => ({
          ...day,
          worked: { ...day.worked, [employee.id]: false },
        })),
      }))
    );
    setIsDialogOpen(false);
    event.currentTarget.reset();
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setWeekIndex((current) => Math.max(0, current - 1))}
          disabled={weekIndex === 0}
          className="flex h-7 w-7 items-center justify-center rounded-[10px] border border-white/25 bg-black text-lg font-medium leading-none text-white/70 transition hover:border-white/50 hover:text-white disabled:opacity-35"
          aria-label="Semana anterior"
        >
          ‹
        </button>
        <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold text-white">
          {weekRange}
        </p>
        <button
          type="button"
          onClick={() => setWeekIndex((current) => Math.min(weeks.length - 1, current + 1))}
          disabled={weekIndex === weeks.length - 1}
          className="flex h-7 w-7 items-center justify-center rounded-[10px] border border-white/25 bg-black text-lg font-medium leading-none text-white/70 transition hover:border-white/50 hover:text-white disabled:opacity-35"
          aria-label="Semana siguiente"
        >
          ›
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-3 flex gap-1.5">
        {(["dias", "propinas", "gestion"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`h-7 rounded-[10px] border px-3 text-sm font-medium leading-none transition ${
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
        <section className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <div className="grid min-w-[346px] grid-cols-[70px_repeat(7,24px)_18px] gap-x-2 gap-y-2 p-3 text-sm sm:min-w-[400px] sm:grid-cols-[90px_repeat(7,24px)_18px] sm:gap-x-2.5">
              <div className="sticky left-0 z-10 bg-white" aria-hidden="true" />
              {workWeek.map((day) => (
                <div
                  key={day.date}
                  className="flex h-6 items-center justify-center text-[0.65rem] font-semibold text-black/35"
                >
                  <span className="sm:hidden">{getDayShortLabel(day.label)}</span>
                  <span className="hidden sm:inline">{day.shortLabel.slice(0, 3)}</span>
                </div>
              ))}
              <div aria-hidden="true" />

              {areaGroups.map((group) => {
                const employees = groupedActiveTeam[group.role];
                if (employees.length === 0) return null;

                return (
                  <div key={group.role} className="contents">
                    {employees.map((employee) => (
                      <div key={employee.id} className="contents">
                        <div className="sticky left-0 z-10 flex min-h-8 min-w-0 items-center bg-white pr-1">
                          <p className="truncate text-[0.85rem] font-normal leading-5 text-black">
                            {getEmployeeDisplayName(employee.name)}
                          </p>
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
                              className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 ${
                                worked
                                  ? "border border-black bg-black text-white"
                                  : "border border-black/15 bg-white text-transparent hover:border-black/35"
                              }`}
                            >
                              {worked ? <Check className="size-2.5 stroke-[3]" aria-hidden="true" /> : null}
                            </button>
                          );
                        })}
                        <div className="flex min-h-8 items-center justify-center text-xs font-semibold text-black/45">
                          {getEmployeeDays(employee.id, workWeek)}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : activeTab === "propinas" ? (
        <section className="space-y-3">
          <div className="panel overflow-hidden">
            {dailyTipRows.map(([date]) => (
              <TipInputRow
                key={date}
                label={getDayLabel(date)}
                value={dailyTips[date] ?? 0}
                onChange={(value) => updateDailyTip(date, value)}
              />
            ))}
            <MoneyRow label="Total semana" value={formatCurrency(weeklyTipTotal)} strong />
          </div>

          <div className="panel overflow-hidden">
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
        <section className="space-y-3">
          <div className="panel overflow-hidden">
            {team.map((employee, index) => (
              <div
                key={employee.id}
                className={`flex items-center justify-between gap-3 px-3 py-2 ${index > 0 ? "border-t border-black/[0.07]" : ""}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-black">{employee.name}</p>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-black/45">
                    <span>{getRoleLabel(employee.role)}</span>
                    {employee.phone ? <span>{employee.phone}</span> : null}
                  </div>
                </div>
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
            ))}
          </div>
          <button
            type="button"
            className="inline-flex h-7 items-center gap-1.5 rounded-[10px] border border-black/20 bg-white px-3 text-sm font-semibold text-black hover:border-black/40"
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
        <DialogContent className="left-0 translate-x-0 translate-y-0 bottom-0 top-auto max-h-[88vh] max-w-full overflow-y-auto rounded-t-[16px] border-0 bg-white text-black sm:left-1/2 sm:bottom-auto sm:max-w-md sm:rounded-[16px] sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
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
    <div className="flex items-center justify-between gap-3 px-3 py-2">
      <span className="text-sm text-black">{label}</span>
      <div className="flex shrink-0 items-center gap-1">
        <span className="text-sm font-semibold text-black">$</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label={`Editar propinas de ${label}`}
          className="h-7 w-24 rounded-[8px] border border-black/30 bg-white px-2 text-right text-xs font-bold text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
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
  const friendlyShortNames: Record<string, string> = {};
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
    <div className="flex items-baseline justify-between gap-3 px-3 py-2">
      <div className="flex min-w-0 items-baseline gap-2">
        <span className={strong ? "font-bold text-black" : subtle ? "text-sm text-black/45" : "block min-w-0 truncate text-sm text-black"}>
          {label}
        </span>
        {meta ? <span className="text-xs text-black/45">{meta}</span> : null}
      </div>
      <span className={strong ? "shrink-0 font-bold text-black" : subtle ? "shrink-0 text-sm text-black/45" : "shrink-0 text-sm font-medium text-black"}>
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

function getCompactWeekLabel(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const monthFormatter = new Intl.DateTimeFormat("es-CO", { month: "long" });
  const getMonth = (date: Date) => monthFormatter.format(date);

  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = getMonth(start);
  const endMonth = getMonth(end);
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear !== endYear) {
    return `Del ${startDay} de ${startMonth} de ${startYear} al ${endDay} de ${endMonth} de ${endYear}`;
  }

  if (startMonth !== endMonth) {
    return `Del ${startDay} de ${startMonth} al ${endDay} de ${endMonth}`;
  }

  return `Del ${startDay} al ${endDay} de ${endMonth}`;
}
