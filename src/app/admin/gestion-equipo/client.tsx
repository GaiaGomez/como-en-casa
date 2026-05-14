"use client";

import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";

import { insertEmployee, softDeleteEmployee, updateEmployee } from "@/lib/supabase/employee-writes";
import { ensureTipWeek, upsertDailyTip, upsertWorkDay } from "@/lib/supabase/tip-actions";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  addDays,
  currentWorkWeek,
  formatCurrency,
  getWorkDayLabel,
  getWorkDayShortLabel,
  tipWeeks,
  type Employee,
  type PaymentStatus,
  type TipWeekData,
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

type TeamTab = "dias" | "propinas" | "gestion";

const queryToTab: Record<string, TeamTab> = {
  horario: "dias",
  propinas: "propinas",
  personal: "gestion",
};

const tabToQuery: Record<TeamTab, string> = {
  dias: "horario",
  propinas: "propinas",
  gestion: "personal",
};

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
    id: "tips-2026-05-15",
    startDate: "2026-05-15",
    endDate: "2026-05-21",
    dailyTips: createDailyTips("2026-05-15", [242000, 154000, 138000, 149000, 157000, 166000, 225000]),
    payments: {},
    workWeek: createWorkWeek("2026-05-15", [
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

function tipWeekDataToTeamWeek(data: TipWeekData): TeamWeek {
  const workWeek: WorkDay[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(data.startDate, i);
    return {
      date,
      label: getWorkDayLabel(date),
      shortLabel: getWorkDayShortLabel(date),
      worked: data.schedule[date] ?? {},
    };
  });
  return {
    id: data.id || data.startDate,
    startDate: data.startDate,
    endDate: data.endDate,
    dailyTips: data.dailyTips,
    payments: data.payments,
    workWeek,
  };
}

export function TeamManagementClient({
  initialEmployees,
  initialWeeks = [],
  canEditHorario = true,
  canEditPropinas = true,
  canEditEquipo = true,
}: {
  initialEmployees: Employee[];
  initialWeeks?: TipWeekData[];
  canEditHorario?: boolean;
  canEditPropinas?: boolean;
  canEditEquipo?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [team, setTeam] = useState<Employee[]>(initialEmployees);
  const [weekIndex, setWeekIndex] = useState(() =>
    initialWeeks.length > 0 ? initialWeeks.length - 1 : 1
  );
  const [weeks, setWeeks] = useState<TeamWeek[]>(() =>
    initialWeeks.length > 0 ? initialWeeks.map(tipWeekDataToTeamWeek) : teamWeeks
  );
  const weekDbIds = useRef<Record<string, string>>(
    Object.fromEntries(
      initialWeeks.filter((w) => w.id).map((w) => [w.startDate, w.id])
    )
  );
  const pendingTipWrites = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [activeTab, setActiveTab] = useState<TeamTab>("dias");
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [dialogEmployee, setDialogEmployee] = useState<Employee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    setActiveTab(tab ? (queryToTab[tab] ?? "dias") : "dias");
  }, [searchParams]);

  const activeTeam = useMemo(
    () => team.filter((employee) => employee.status === "activo"),
    [team]
  );
  const horarioGroups = useMemo(() => {
    const knownOrder = areaGroups.map((g) => g.role as string);
    const allRoles = [...new Set(activeTeam.map((e) => e.role))];
    const sorted = [
      ...knownOrder.filter((r) => allRoles.includes(r)),
      ...allRoles.filter((r) => !knownOrder.includes(r)),
    ];
    return sorted.map((role) => ({
      role,
      label: roleLabels[role] ?? role,
      employees: activeTeam.filter((e) => e.role === role),
    }));
  }, [activeTeam]);
  const currentWeek = weeks[weekIndex] ?? weeks[1];
  const workWeek = currentWeek.workWeek;
  const dailyTips = currentWeek.dailyTips;
  const weekRange = getCompactWeekLabel(currentWeek.startDate, currentWeek.endDate);

  const dailyTipRows = useMemo(
    () => workWeek.map((day) => [day.date, dailyTips[day.date] ?? 0] as const),
    [dailyTips, workWeek]
  );
  const weeklyTipTotal = useMemo(
    () => dailyTipRows.reduce((total, [, amount]) => total + amount, 0),
    [dailyTipRows]
  );

  const totalWorkedDays = useMemo(
    () =>
      activeTeam.reduce((total, employee) => {
        return total + workWeek.filter((day) => day.worked[employee.id]).length;
      }, 0),
    [activeTeam, workWeek]
  );

  const tipDistribution = useMemo(() => {
    const workers = activeTeam.filter((e) =>
      workWeek.some((day) => day.worked[e.id])
    );
    let assigned = 0;
    const amountMap: Record<string, number> = {};
    workers.forEach((employee, index) => {
      const daysWorked = workWeek.filter((day) => day.worked[employee.id]).length;
      const isLast = index === workers.length - 1;
      const amount =
        totalWorkedDays === 0
          ? 0
          : isLast
            ? weeklyTipTotal - assigned
            : Math.round((weeklyTipTotal * daysWorked) / totalWorkedDays);
      assigned += amount;
      amountMap[employee.id] = amount;
    });
    return activeTeam.map((employee) => ({
      employee,
      daysWorked: workWeek.filter((day) => day.worked[employee.id]).length,
      amount: amountMap[employee.id] ?? 0,
      paymentStatus: currentWeek.payments[employee.id] ?? "pendiente",
    }));
  }, [activeTeam, currentWeek.payments, totalWorkedDays, weeklyTipTotal, workWeek]);

  const displayedTipTotal = useMemo(
    () => tipDistribution.reduce((sum, item) => sum + item.amount, 0),
    [tipDistribution]
  );

  async function toggleWorked(employeeId: string, date: string) {
    if (!canEditHorario) return;

    const week = weeks[weekIndex];
    if (!week) return;
    const currentWorked = week.workWeek.find((d) => d.date === date)?.worked[employeeId] ?? false;
    const newWorked = !currentWorked;

    setWeeks((current) =>
      current.map((w, i) =>
        i === weekIndex
          ? {
              ...w,
              workWeek: w.workWeek.map((day) =>
                day.date === date
                  ? { ...day, worked: { ...day.worked, [employeeId]: newWorked } }
                  : day
              ),
            }
          : w
      )
    );

    let dbId = weekDbIds.current[week.startDate];
    if (!dbId) {
      const created = await ensureTipWeek(week.startDate, week.endDate);
      if (!created) { alert("No se pudo guardar el cambio en el servidor."); return; }
      weekDbIds.current[week.startDate] = created;
      dbId = created;
    }
    const saved = await upsertWorkDay(dbId, employeeId, date, newWorked);
    if (!saved) alert("No se pudo guardar el cambio en el servidor.");
  }

  function updateDailyTip(date: string, value: number) {
    if (!canEditPropinas) return;

    const week = weeks[weekIndex];
    if (!week) return;

    setWeeks((current) =>
      current.map((w, i) =>
        i === weekIndex ? { ...w, dailyTips: { ...w.dailyTips, [date]: value } } : w
      )
    );

    const writeKey = `${week.startDate}:${date}`;
    clearTimeout(pendingTipWrites.current[writeKey]);
    pendingTipWrites.current[writeKey] = setTimeout(async () => {
      let dbId = weekDbIds.current[week.startDate];
      if (!dbId) {
        const created = await ensureTipWeek(week.startDate, week.endDate);
        if (!created) { alert("No se pudo guardar el cambio en el servidor."); return; }
        weekDbIds.current[week.startDate] = created;
        dbId = created;
      }
      const saved = await upsertDailyTip(dbId, date, value);
      if (!saved) alert("No se pudo guardar el cambio en el servidor.");
    }, 700);
  }

  function selectTab(tab: TeamTab) {
    setActiveTab(tab);

    const params = new URLSearchParams(searchParams);
    params.set("tab", tabToQuery[tab]);
    router.push(`${pathname}?${params.toString()}`);
  }

  function openAddEmployee() {
    if (!canEditEquipo) return;
    setDialogMode("add");
    setDialogEmployee(null);
    setIsDialogOpen(true);
  }

  function openEditEmployee(employee: Employee) {
    if (!canEditEquipo) return;
    setDialogMode("edit");
    setDialogEmployee(employee);
    setIsDialogOpen(true);
  }

  async function handleEmployeeSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canEditEquipo) return;
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const role = String(formData.get("role") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const documentId = String(formData.get("documentId") ?? "").trim();
    const birthDate = String(formData.get("birthDate") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const emergencyContact = String(formData.get("emergencyContact") ?? "").trim();
    const emergencyPhone = String(formData.get("emergencyPhone") ?? "").trim();
    const hiredAt = String(formData.get("hiredAt") ?? "").trim();
    const contractType = String(formData.get("contractType") ?? "").trim();
    const eps = String(formData.get("eps") ?? "").trim();
    const internalNotes = String(formData.get("internalNotes") ?? "").trim();
    const status = String(formData.get("status") ?? "activo") as Employee["status"];

    if (!name || !role) return;

    if (dialogMode === "edit" && dialogEmployee) {
      setTeam((current) =>
        current.map((employee) =>
          employee.id === dialogEmployee.id
            ? {
                ...employee,
                name,
                role,
                phone,
                documentId,
                birthDate,
                address,
                emergencyContact,
                emergencyPhone,
                hiredAt: hiredAt || employee.hiredAt,
                contractType,
                eps,
                internalNotes,
                status,
              }
            : employee
        )
      );
      setIsDialogOpen(false);
      const saved = await updateEmployee(dialogEmployee.id, {
        name,
        role,
        phone: phone || undefined,
        active: status === "activo",
      });
      if (!saved) alert("No se pudo guardar el cambio en el servidor.");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const employee: Employee = {
      id: tempId,
      name,
      role,
      phone,
      documentId,
      birthDate,
      address,
      status,
      hiredAt: hiredAt || new Date().toISOString().slice(0, 10),
      baseShift: role,
      contractType: contractType || "Pendiente",
      salaryBase: "Pendiente",
      eps: eps || "Pendiente",
      arl: "Pendiente",
      pensionFund: "Pendiente",
      emergencyContact: emergencyContact || "Pendiente",
      emergencyPhone,
      emergencyRelation: "Pendiente",
      internalNotes: internalNotes || "Sin notas.",
    };

    setTeam((current) => [...current, employee]);
    setWeeks((current) =>
      current.map((week) => ({
        ...week,
        workWeek: week.workWeek.map((day) => ({
          ...day,
          worked: { ...day.worked, [tempId]: false },
        })),
      }))
    );
    setIsDialogOpen(false);
    event.currentTarget.reset();

    const realId = await insertEmployee({ name, role, phone: phone || undefined });
    if (realId) {
      setTeam((current) =>
        current.map((e) => (e.id === tempId ? { ...e, id: realId } : e))
      );
      setWeeks((current) =>
        current.map((week) => ({
          ...week,
          workWeek: week.workWeek.map((day) => {
            const worked = { ...day.worked };
            worked[realId] = worked[tempId] ?? false;
            delete worked[tempId];
            return { ...day, worked };
          }),
        }))
      );
    } else {
      alert("No se pudo guardar el empleado en el servidor. Recarga para ver el estado real.");
    }
  }

  async function deleteEmployee(employee: Employee) {
    if (!canEditEquipo) return;
    const confirmed = window.confirm(
      "¿Eliminar a esta persona del equipo?\nThis action cannot be undone."
    );

    if (!confirmed) return;

    setTeam((current) => current.filter((candidate) => candidate.id !== employee.id));
    setWeeks((current) =>
      current.map((week) => ({
        ...week,
        workWeek: week.workWeek.map((day) => {
          const worked = { ...day.worked };
          delete worked[employee.id];
          return { ...day, worked };
        }),
        payments: Object.fromEntries(
          Object.entries(week.payments).filter(([employeeId]) => employeeId !== employee.id)
        ),
      }))
    );

    const saved = await softDeleteEmployee(employee.id);
    if (!saved) {
      alert("No se pudo guardar el cambio en el servidor. Recarga para ver el estado real.");
    }
  }

  return (
    <section className="w-full lg:mx-auto lg:max-w-5xl xl:max-w-6xl">
      <div className="mb-3 flex items-center justify-between gap-2 rounded-[16px] border border-white/10 bg-white/[0.03] p-1">
        <button
          type="button"
          onClick={() => setWeekIndex((current) => Math.max(0, current - 1))}
          disabled={weekIndex === 0}
          className="flex h-7 w-7 items-center justify-center rounded-[10px] border border-white/25 bg-black text-lg font-medium leading-none text-neutral-400 transition hover:border-white/50 hover:text-white disabled:opacity-35"
          aria-label="Semana anterior"
        >
          ‹
        </button>
        <p className="min-w-0 flex-1 truncate text-center text-sm font-medium text-white">
          {weekRange}
        </p>
        <button
          type="button"
          onClick={() => setWeekIndex((current) => Math.min(weeks.length - 1, current + 1))}
          disabled={weekIndex === weeks.length - 1}
          className="flex h-7 w-7 items-center justify-center rounded-[10px] border border-white/25 bg-black text-lg font-medium leading-none text-neutral-400 transition hover:border-white/50 hover:text-white disabled:opacity-35"
          aria-label="Semana siguiente"
        >
          ›
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-3 grid grid-cols-3 gap-1.5">
        {(["dias", "propinas", "gestion"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => selectTab(tab)}
            className={`h-8 rounded-[12px] border px-3 text-sm font-medium leading-none transition ${
              activeTab === tab
                ? "border-white bg-white text-black"
                : "border-white/25 bg-black text-neutral-400 hover:border-white/50 hover:text-white"
            }`}
          >
            {tab === "dias" ? "Horario" : tab === "propinas" ? "Propinas" : "Personal"}
          </button>
        ))}
      </div>

      {activeTab === "dias" ? (
        <section className="panel w-full max-w-full overflow-hidden rounded-[20px]">
          {!canEditHorario && (
            <p className="border-b border-black/[0.04] px-4 py-2 text-xs font-normal text-neutral-400">Solo lectura</p>
          )}
          <div className="overflow-x-auto">
            <div
              className="grid gap-0 p-2.5 [grid-template-columns:minmax(72px,0.8fr)_repeat(7,minmax(26px,1fr))_24px] lg:mx-auto lg:w-max lg:gap-x-2 lg:p-4 lg:[grid-template-columns:minmax(120px,180px)_repeat(7,minmax(36px,44px))_32px]"
            >
              <div className="sticky left-0 z-10 border-b border-black/[0.04] bg-white lg:border-black/[0.06]" aria-hidden="true" />
              {workWeek.map((day) => (
                <div
                  key={day.date}
                  className="flex h-6 items-center justify-center border-b border-l border-black/[0.04] text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400 lg:border-black/[0.06] lg:pb-2"
                >
                  {getDayShortLabel(day.label)}
                </div>
              ))}
              <div className="border-b border-l border-black/[0.04] lg:border-black/[0.06]" aria-hidden="true" />

              {horarioGroups.map((group) => (
                  <div key={group.role} className="contents">
                    {group.employees.map((employee) => (
                      <div key={employee.id} className="contents">
                        <div className="sticky left-0 z-10 flex min-h-8 min-w-0 items-center border-b border-black/[0.04] bg-white pr-1 lg:min-h-10 lg:border-black/[0.05]">
                          <p className="truncate text-base font-medium leading-5 text-neutral-900">
                            {getEmployeeDisplayName(employee.short_name ?? employee.name)}
                          </p>
                        </div>
                        {workWeek.map((day) => {
                          const worked = day.worked[employee.id] ?? false;
                          return (
                            <div
                              key={day.date}
                              className="flex min-h-8 items-center justify-center border-b border-l border-black/[0.04] lg:min-h-10 lg:border-black/[0.05]"
                            >
                              <button
                                type="button"
                                aria-pressed={worked}
                                onClick={() => toggleWorked(employee.id, day.date)}
                                aria-label={`${employee.name} ${worked ? "trabajó" : "no trabajó"} el ${day.label}`}
                                disabled={!canEditHorario}
                                className={`mx-auto flex h-6 w-6 items-center justify-center rounded-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-2 disabled:cursor-default ${
                                  worked
                                    ? "border border-black bg-black text-white"
                                    : "border border-black/15 bg-white text-transparent hover:border-black/35"
                                }`}
                              >
                                {worked ? <Check className="size-2.5 stroke-[3]" aria-hidden="true" /> : null}
                              </button>
                            </div>
                          );
                        })}
                        <div className="flex min-h-8 items-center justify-center border-b border-l border-black/[0.04] text-sm font-normal text-neutral-400 lg:min-h-10 lg:border-black/[0.05]">
                          {getEmployeeDays(employee.id, workWeek)}
                        </div>
                      </div>
                    ))}
                  </div>
              ))}
            </div>
          </div>
        </section>
      ) : activeTab === "propinas" ? (
        <section className="space-y-3 lg:mx-auto lg:max-w-2xl">
          {!canEditPropinas && (
            <p className="text-xs font-normal text-neutral-400">Solo lectura</p>
          )}
          <div className="panel overflow-hidden rounded-[20px]">
            {dailyTipRows.map(([date, value]) => (
              <TipInputRow
                key={date}
                label={getDayLabel(date)}
                value={value}
                readOnly={!canEditPropinas}
                onChange={(value) => updateDailyTip(date, value)}
              />
            ))}
            <MoneyRow label="Total semana" value={formatCurrency(weeklyTipTotal)} strong />
          </div>

          <div className="panel overflow-hidden rounded-[20px]">
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
        <section className="space-y-3 lg:mx-auto lg:max-w-3xl">
          <div className="panel overflow-hidden rounded-[20px]">
            {team.map((employee, index) => (
              <div
                key={employee.id}
                className={`flex items-center justify-between gap-3 px-4 py-3 ${index > 0 ? "border-t border-black/[0.07]" : ""}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-medium text-neutral-900">{employee.name}</p>
                  <EmployeeMeta employee={employee} />
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                  <span className={`tag ${employee.status === "activo" ? "tag-active" : ""}`}>
                    {statusLabels[employee.status] ?? employee.status}
                  </span>
                  {canEditEquipo && (
                    <>
                      <button
                        type="button"
                        className="tag cursor-pointer hover:border-black/30"
                        onClick={() => openEditEmployee(employee)}
                      >
                        <Pencil className="size-3" />
                        Editar
                      </button>
                      <button
                        type="button"
                        className="tag cursor-pointer hover:border-black/30"
                        onClick={() => deleteEmployee(employee)}
                      >
                        <Trash2 className="size-3" />
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {canEditEquipo && (
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-[14px] border border-black/20 bg-white px-4 text-sm font-medium text-neutral-900 hover:border-black/40"
              onClick={openAddEmployee}
            >
              <Plus className="size-4" />
              Nuevo empleado
            </button>
          )}
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
            <DialogTitle className="text-base font-medium text-neutral-900">
              {dialogMode === "edit" && dialogEmployee
                ? `Editar ${dialogEmployee.name}`
                : "Nuevo empleado"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleEmployeeSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField id="name" label="Nombre" defaultValue={dialogEmployee?.name ?? ""} required />
              <FormField id="role" label="Cargo" defaultValue={dialogEmployee?.role ?? ""} required />
              <FormField id="phone" label="Teléfono" defaultValue={dialogEmployee?.phone ?? ""} />
              <FormField id="documentId" label="Documento" defaultValue={dialogEmployee?.documentId ?? ""} />
              <FormField id="birthDate" label="Nacimiento" type="date" defaultValue={dialogEmployee?.birthDate ?? ""} />
              <FormField id="hiredAt" label="Ingreso" type="date" defaultValue={dialogEmployee?.hiredAt ?? ""} />
              <FormField id="address" label="Dirección" defaultValue={dialogEmployee?.address ?? ""} />
              <FormField id="contractType" label="Contrato" defaultValue={dialogEmployee?.contractType ?? ""} />
              <FormField id="eps" label="EPS" defaultValue={dialogEmployee?.eps ?? ""} />
              <FormField id="emergencyContact" label="Contacto emergencia" defaultValue={dialogEmployee?.emergencyContact ?? ""} />
              <FormField id="emergencyPhone" label="Tel. emergencia" defaultValue={dialogEmployee?.emergencyPhone ?? ""} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="status" className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Estado</label>
              <select
                id="status"
                name="status"
                defaultValue={dialogEmployee?.status ?? "activo"}
                className="w-full rounded-[10px] border border-black/15 bg-white px-3 py-2 text-base font-normal text-neutral-900 outline-none focus:border-black/40"
              >
                <option value="activo">Activo</option>
                <option value="descanso">Descanso</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="internalNotes" className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">Notas internas</label>
              <textarea
                id="internalNotes"
                name="internalNotes"
                defaultValue={dialogEmployee?.internalNotes ?? ""}
                rows={3}
                className="min-h-20 w-full resize-y rounded-[10px] border border-black/15 bg-white px-3 py-2 text-base font-normal text-neutral-900 outline-none focus:border-black/40"
              />
            </div>
            <button type="submit" className="h-9 w-full rounded-[10px] bg-black text-sm font-medium text-white">
              Guardar
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function FormField({
  id,
  label,
  type = "text",
  defaultValue = "",
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="h-9 w-full rounded-[10px] border border-black/15 bg-white px-3 text-base font-normal text-neutral-900 outline-none focus:border-black/40"
      />
    </div>
  );
}

function EmployeeMeta({ employee }: { employee: Employee }) {
  const metaItems = [
    getRoleLabel(employee.role),
    employee.phone,
    employee.documentId ? `Doc. ${employee.documentId}` : "",
    employee.hiredAt ? `Ingreso ${employee.hiredAt}` : "",
    employee.contractType && employee.contractType !== "Pendiente"
      ? employee.contractType
      : "",
    employee.eps && employee.eps !== "Pendiente" ? `EPS ${employee.eps}` : "",
    employee.emergencyContact && employee.emergencyContact !== "Pendiente"
      ? `Emergencia: ${employee.emergencyContact}${employee.emergencyPhone ? ` · ${employee.emergencyPhone}` : ""}`
      : "",
    employee.address,
    employee.internalNotes && employee.internalNotes !== "Sin notas."
      ? employee.internalNotes
      : "",
  ].filter((item): item is string => Boolean(item));

  return (
    <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-sm font-normal text-neutral-400">
      {metaItems.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

function TipInputRow({
  label,
  value,
  onChange,
  readOnly = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-black/[0.05] px-4 py-3 last:border-b-0">
      <span className="text-base font-medium text-neutral-900">{label}</span>
      <div className="flex shrink-0 items-center gap-1">
        <span className="text-sm font-medium text-neutral-900">$</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label={`Propinas de ${label}`}
          readOnly={readOnly}
          className={`h-8 w-28 rounded-[8px] border border-black/30 bg-white px-2 text-right text-base font-semibold text-neutral-900 outline-none transition ${readOnly ? "cursor-default" : "focus:border-black focus:ring-2 focus:ring-black/10"}`}
          value={String(value)}
          onChange={readOnly ? undefined : (event) => {
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
    <div className="flex items-baseline justify-between gap-3 border-b border-black/[0.05] px-4 py-3 last:border-b-0">
      <div className="flex min-w-0 items-baseline gap-2">
        <span className={strong ? "text-base font-medium text-neutral-900" : subtle ? "text-sm font-normal text-neutral-400" : "block min-w-0 truncate text-base font-medium text-neutral-900"}>
          {label}
        </span>
        {meta ? <span className="text-sm font-normal text-neutral-400">{meta}</span> : null}
      </div>
      <span className={strong ? "shrink-0 text-base font-medium text-neutral-900" : subtle ? "shrink-0 text-sm font-normal text-neutral-400" : "shrink-0 text-sm font-medium text-neutral-900"}>
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
    return `Semana del ${startDay} de ${startMonth} de ${startYear} al ${endDay} de ${endMonth} de ${endYear}`;
  }

  if (startMonth !== endMonth) {
    return `Semana del ${startDay} de ${startMonth} al ${endDay} de ${endMonth}`;
  }

  return `Semana del ${startDay} al ${endDay} de ${endMonth}`;
}
