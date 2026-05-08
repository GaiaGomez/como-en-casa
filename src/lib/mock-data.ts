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

export type WorkDay = {
  date: string;
  label: string;
  shortLabel: string;
  worked: Record<string, boolean>;
};

export type TipWeek = {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  totalTips: number;
  dailyTips: Record<string, number>;
  status: TipStatus;
  payments: Record<string, PaymentStatus>;
};

export type TipDistribution = {
  employee: Employee;
  daysWorked: number;
  amount: number;
  paymentStatus: PaymentStatus;
};

export const cafeInfo = {
  name: "Como en Casa",
  description: "Café y repostería familiar",
  address: "Carrera 49 #54-47, Bello",
  todayDate: "2026-05-08",
  todayLabel: "Viernes 8 de mayo",
  hours: [
    { days: "Lunes a jueves", time: "4:30 p.m. - 9:00 p.m." },
    { days: "Viernes", time: "4:30 p.m. - 10:00 p.m." },
    { days: "Sábado", time: "11:00 a.m. - 10:00 p.m." },
    { days: "Domingos y festivos", time: "3:00 p.m. - 10:00 p.m." },
  ],
  todayHours: "4:30 p.m. - 10:00 p.m.",
};

export const employees: Employee[] = [
  {
    id: "ana",
    name: "Ana María Ríos",
    role: "servicio",
    phone: "300 481 2219",
    status: "activo",
    hiredAt: "2024-09-12",
    baseShift: "Servicio de tarde",
  },
  {
    id: "luis",
    name: "Luis Fernando Cano",
    role: "barista",
    phone: "311 260 4490",
    status: "activo",
    hiredAt: "2023-11-03",
    baseShift: "Café y cierre",
  },
  {
    id: "maria",
    name: "María José Pérez",
    role: "cocina",
    phone: "315 090 1140",
    status: "activo",
    hiredAt: "2022-05-18",
    baseShift: "Producción",
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
    name: "Valentina Gómez",
    role: "servicio",
    phone: "320 881 9442",
    status: "activo",
    hiredAt: "2024-02-10",
    baseShift: "Tarde",
  },
];

export const currentWorkWeek: WorkDay[] = [
  {
    date: "2026-05-04",
    label: "Lunes",
    shortLabel: "Lun",
    worked: { ana: true, luis: true, maria: true, camilo: false, valentina: true },
  },
  {
    date: "2026-05-05",
    label: "Martes",
    shortLabel: "Mar",
    worked: { ana: true, luis: true, maria: true, camilo: true, valentina: false },
  },
  {
    date: "2026-05-06",
    label: "Miércoles",
    shortLabel: "Mié",
    worked: { ana: false, luis: true, maria: true, camilo: true, valentina: true },
  },
  {
    date: "2026-05-07",
    label: "Jueves",
    shortLabel: "Jue",
    worked: { ana: true, luis: false, maria: true, camilo: true, valentina: true },
  },
  {
    date: "2026-05-08",
    label: "Viernes",
    shortLabel: "Vie",
    worked: { ana: true, luis: true, maria: true, camilo: true, valentina: true },
  },
  {
    date: "2026-05-09",
    label: "Sábado",
    shortLabel: "Sáb",
    worked: { ana: true, luis: true, maria: true, camilo: true, valentina: true },
  },
  {
    date: "2026-05-10",
    label: "Domingo",
    shortLabel: "Dom",
    worked: { ana: true, luis: false, maria: true, camilo: false, valentina: true },
  },
];

export const tipWeeks: TipWeek[] = [
  {
    id: "tips-2026-05-04",
    label: "Semana 4 al 10 de mayo",
    startDate: "2026-05-04",
    endDate: "2026-05-10",
    totalTips: 1280000,
    dailyTips: {
      "2026-05-04": 145000,
      "2026-05-05": 158000,
      "2026-05-06": 162000,
      "2026-05-07": 175000,
      "2026-05-08": 210000,
      "2026-05-09": 268000,
      "2026-05-10": 162000,
    },
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
    label: "Semana 27 de abril al 3 de mayo",
    startDate: "2026-04-27",
    endDate: "2026-05-03",
    totalTips: 1165000,
    dailyTips: {
      "2026-04-27": 120000,
      "2026-04-28": 135000,
      "2026-04-29": 142000,
      "2026-04-30": 151000,
      "2026-05-01": 205000,
      "2026-05-02": 260000,
      "2026-05-03": 152000,
    },
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

export function getEmployeeDaysWorked(employeeId: string, week = currentWorkWeek) {
  return week.filter((day) => day.worked[employeeId]).length;
}

export function getWeekTotalDays(week = currentWorkWeek) {
  return employees.reduce((total, employee) => {
    return total + getEmployeeDaysWorked(employee.id, week);
  }, 0);
}

export function calculateTipDistribution(
  totalTips: number,
  payments: Record<string, PaymentStatus> = {}
): TipDistribution[] {
  const totalDays = getWeekTotalDays();

  return employees.map((employee) => {
    const daysWorked = getEmployeeDaysWorked(employee.id);
    const rawAmount = totalDays === 0 ? 0 : (totalTips * daysWorked) / totalDays;

    return {
      employee,
      daysWorked,
      amount: Math.round(rawAmount / 1000) * 1000,
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

export function getTodayShift() {
  return currentWorkWeek.find((day) => day.date === cafeInfo.todayDate);
}

export function getEmployeesWorkingToday() {
  const today = getTodayShift();

  if (!today) {
    return [];
  }

  return employees
    .map((employee) => ({
      employee,
      worked: today.worked[employee.id] ?? false,
    }))
    .filter((item) => item.worked);
}

export function getDayTotalWorked(day: WorkDay) {
  return Object.values(day.worked).filter(Boolean).length;
}

export function getPaymentSummary(payments: Record<string, PaymentStatus>) {
  const values = Object.values(payments);
  const paid = values.filter((status) => status === "pagado").length;

  return {
    paid,
    pending: values.length - paid,
    total: values.length,
  };
}
