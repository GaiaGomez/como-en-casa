export type EmployeeRole = "barista" | "cocina" | "servicio" | "caja";
export type EmployeeStatus = "activo" | "descanso" | "inactivo";
export type TipStatus = "abierta" | "cerrada";
export type PaymentStatus = "pagado" | "pendiente";

export type Employee = {
  id: string;
  name: string;
  role: EmployeeRole;
  phone: string;
  status: EmployeeStatus;
  hiredAt: string;
  baseShift: string;
};

export type ShiftDay = {
  date: string;
  label: string;
  hours: Record<string, number>;
};

export type TipWeek = {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  totalTips: number;
  status: TipStatus;
  payments: Record<string, PaymentStatus>;
};

export type TipDistribution = {
  employee: Employee;
  hours: number;
  daysWorked: number;
  amount: number;
  paymentStatus: PaymentStatus;
};

export const employees: Employee[] = [
  {
    id: "ana",
    name: "Ana Maria Rios",
    role: "servicio",
    phone: "300 481 2219",
    status: "activo",
    hiredAt: "2024-09-12",
    baseShift: "Manana y almuerzo",
  },
  {
    id: "luis",
    name: "Luis Fernando Cano",
    role: "barista",
    phone: "311 260 4490",
    status: "activo",
    hiredAt: "2023-11-03",
    baseShift: "Apertura",
  },
  {
    id: "maria",
    name: "Maria Jose Perez",
    role: "cocina",
    phone: "315 090 1140",
    status: "activo",
    hiredAt: "2022-05-18",
    baseShift: "Produccion",
  },
  {
    id: "camilo",
    name: "Camilo Restrepo",
    role: "caja",
    phone: "302 700 1803",
    status: "descanso",
    hiredAt: "2025-01-27",
    baseShift: "Cierre",
  },
  {
    id: "valentina",
    name: "Valentina Gomez",
    role: "servicio",
    phone: "320 881 9442",
    status: "activo",
    hiredAt: "2024-02-10",
    baseShift: "Tarde",
  },
];

export const currentShiftWeek: ShiftDay[] = [
  {
    date: "2026-05-04",
    label: "Lun",
    hours: { ana: 8, luis: 7, maria: 8, camilo: 0, valentina: 6 },
  },
  {
    date: "2026-05-05",
    label: "Mar",
    hours: { ana: 8, luis: 7, maria: 8, camilo: 6, valentina: 0 },
  },
  {
    date: "2026-05-06",
    label: "Mie",
    hours: { ana: 0, luis: 7, maria: 8, camilo: 6, valentina: 7 },
  },
  {
    date: "2026-05-07",
    label: "Jue",
    hours: { ana: 8, luis: 0, maria: 8, camilo: 6, valentina: 7 },
  },
  {
    date: "2026-05-08",
    label: "Vie",
    hours: { ana: 9, luis: 8, maria: 8, camilo: 6, valentina: 7 },
  },
  {
    date: "2026-05-09",
    label: "Sab",
    hours: { ana: 10, luis: 8, maria: 9, camilo: 7, valentina: 8 },
  },
  {
    date: "2026-05-10",
    label: "Dom",
    hours: { ana: 6, luis: 0, maria: 7, camilo: 0, valentina: 6 },
  },
];

export const tipWeeks: TipWeek[] = [
  {
    id: "tips-2026-05-04",
    label: "Semana 4-10 mayo",
    startDate: "2026-05-04",
    endDate: "2026-05-10",
    totalTips: 1280000,
    status: "abierta",
    payments: {
      ana: "pendiente",
      luis: "pendiente",
      maria: "pagado",
      camilo: "pendiente",
      valentina: "pendiente",
    },
  },
  {
    id: "tips-2026-04-27",
    label: "Semana 27 abril-3 mayo",
    startDate: "2026-04-27",
    endDate: "2026-05-03",
    totalTips: 1165000,
    status: "cerrada",
    payments: {
      ana: "pagado",
      luis: "pagado",
      maria: "pagado",
      camilo: "pagado",
      valentina: "pagado",
    },
  },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getEmployeeHours(employeeId: string, week = currentShiftWeek) {
  return week.reduce((total, day) => total + (day.hours[employeeId] ?? 0), 0);
}

export function getEmployeeDaysWorked(employeeId: string, week = currentShiftWeek) {
  return week.filter((day) => (day.hours[employeeId] ?? 0) > 0).length;
}

export function getWeekTotalHours(week = currentShiftWeek) {
  return employees.reduce((total, employee) => {
    return total + getEmployeeHours(employee.id, week);
  }, 0);
}

export function calculateTipDistribution(
  totalTips: number,
  payments: Record<string, PaymentStatus> = {}
): TipDistribution[] {
  const totalHours = getWeekTotalHours();

  return employees.map((employee) => {
    const hours = getEmployeeHours(employee.id);
    const rawAmount = totalHours === 0 ? 0 : (totalTips * hours) / totalHours;

    return {
      employee,
      hours,
      daysWorked: getEmployeeDaysWorked(employee.id),
      amount: Math.round(rawAmount / 100) * 100,
      paymentStatus: payments[employee.id] ?? "pendiente",
    };
  });
}

export function getTipWeek(id: string) {
  return tipWeeks.find((week) => week.id === id);
}

export function getOpenTipWeek() {
  return tipWeeks.find((week) => week.status === "abierta");
}
