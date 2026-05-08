export type EmployeeRole = "barista" | "cocina" | "servicio" | "caja" | (string & {});
export type EmployeeStatus = "activo" | "descanso" | "inactivo";
export type TipStatus = "abierta" | "cerrada";
export type PaymentStatus = "pagado" | "pendiente";
export type PurchaseStatus = "pendiente";

export type Employee = {
  id: string;
  name: string;
  role: EmployeeRole;
  phone: string;
  status: EmployeeStatus;
  hiredAt: string;
  baseShift: string;
  contractType: string;
  salaryBase: string;
  eps: string;
  arl: string;
  pensionFund: string;
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelation: string;
  internalNotes: string;
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

export type ManualShoppingItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category?: string;
  status: PurchaseStatus;
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
    contractType: "Tiempo parcial",
    salaryBase: "Por turno",
    eps: "Sura",
    arl: "Positiva",
    pensionFund: "Protección",
    emergencyContact: "Claudia Ríos",
    emergencyPhone: "300 111 9821",
    emergencyRelation: "Mamá",
    internalNotes: "Prefiere turnos de tarde.",
  },
  {
    id: "luis",
    name: "Luis Fernando Cano",
    role: "barista",
    phone: "311 260 4490",
    status: "activo",
    hiredAt: "2023-11-03",
    baseShift: "Café y cierre",
    contractType: "Indefinido",
    salaryBase: "$1.600.000",
    eps: "Nueva EPS",
    arl: "Sura",
    pensionFund: "Porvenir",
    emergencyContact: "Diana Cano",
    emergencyPhone: "311 000 4490",
    emergencyRelation: "Hermana",
    internalNotes: "Responsable de cierre y máquina.",
  },
  {
    id: "maria",
    name: "María José Pérez",
    role: "cocina",
    phone: "315 090 1140",
    status: "activo",
    hiredAt: "2022-05-18",
    baseShift: "Producción",
    contractType: "Indefinido",
    salaryBase: "$1.800.000",
    eps: "Sanitas",
    arl: "Positiva",
    pensionFund: "Colfondos",
    emergencyContact: "José Pérez",
    emergencyPhone: "315 222 1140",
    emergencyRelation: "Papá",
    internalNotes: "Apoya compras de cocina.",
  },
  {
    id: "camilo",
    name: "Camilo Restrepo",
    role: "caja",
    phone: "302 700 1803",
    status: "descanso",
    hiredAt: "2025-01-27",
    baseShift: "Cierre",
    contractType: "Tiempo parcial",
    salaryBase: "Por turno",
    eps: "Coosalud",
    arl: "Sura",
    pensionFund: "Porvenir",
    emergencyContact: "Laura Restrepo",
    emergencyPhone: "302 900 1803",
    emergencyRelation: "Pareja",
    internalNotes: "Disponible fines de semana.",
  },
  {
    id: "valentina",
    name: "Valentina Gómez",
    role: "servicio",
    phone: "320 881 9442",
    status: "activo",
    hiredAt: "2024-02-10",
    baseShift: "Tarde",
    contractType: "Prestación de servicios",
    salaryBase: "Por día",
    eps: "Sura",
    arl: "Positiva",
    pensionFund: "Protección",
    emergencyContact: "Marcela Gómez",
    emergencyPhone: "320 500 9442",
    emergencyRelation: "Tía",
    internalNotes: "Muy buena con atención en mesa.",
  },
];

export const currentWorkWeek: WorkDay[] = [
  {
    date: "2026-05-02",
    label: "Sábado",
    shortLabel: "Sáb 02/05",
    worked: { ana: true, luis: true, maria: true, camilo: false, valentina: true },
  },
  {
    date: "2026-05-03",
    label: "Domingo",
    shortLabel: "Dom 03/05",
    worked: { ana: true, luis: true, maria: true, camilo: true, valentina: false },
  },
  {
    date: "2026-05-04",
    label: "Lunes",
    shortLabel: "Lun 04/05",
    worked: { ana: false, luis: true, maria: true, camilo: true, valentina: true },
  },
  {
    date: "2026-05-05",
    label: "Martes",
    shortLabel: "Mar 05/05",
    worked: { ana: true, luis: false, maria: true, camilo: true, valentina: true },
  },
  {
    date: "2026-05-06",
    label: "Miércoles",
    shortLabel: "Mié 06/05",
    worked: { ana: true, luis: true, maria: true, camilo: true, valentina: true },
  },
  {
    date: "2026-05-07",
    label: "Jueves",
    shortLabel: "Jue 07/05",
    worked: { ana: true, luis: true, maria: true, camilo: true, valentina: true },
  },
  {
    date: "2026-05-08",
    label: "Viernes",
    shortLabel: "Vie 08/05",
    worked: { ana: true, luis: false, maria: true, camilo: false, valentina: true },
  },
];

export const tipWeeks: TipWeek[] = [
  {
    id: "tips-2026-05-02",
    label: "Semana 2 al 8 de mayo",
    startDate: "2026-05-02",
    endDate: "2026-05-08",
    totalTips: 1280000,
    dailyTips: {
      "2026-05-02": 268000,
      "2026-05-03": 162000,
      "2026-05-04": 145000,
      "2026-05-05": 158000,
      "2026-05-06": 162000,
      "2026-05-07": 175000,
      "2026-05-08": 210000,
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
    id: "tips-2026-04-25",
    label: "Semana 25 de abril al 1 de mayo",
    startDate: "2026-04-25",
    endDate: "2026-05-01",
    totalTips: 1165000,
    dailyTips: {
      "2026-04-25": 260000,
      "2026-04-26": 152000,
      "2026-04-27": 120000,
      "2026-04-28": 135000,
      "2026-04-29": 142000,
      "2026-04-30": 151000,
      "2026-05-01": 205000,
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

export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  supplier?: string;
  unit: string;
  currentStock: number;
  idealStock: number;
};

export const inventory: InventoryItem[] = [
  { id: "pollo-100",          name: "Pollo corte 100 gr",                 category: "Proteínas",          supplier: "Supermercado OR",    unit: "un",    currentStock: 14,   idealStock: 24   },
  { id: "pollo-150",          name: "Pollo corte 150 gr",                 category: "Proteínas",          supplier: "Supermercado OR",    unit: "un",    currentStock: 8,    idealStock: 18   },
  { id: "res-mariposa-200",   name: "Carne res corte mariposa 200 gr",    category: "Proteínas",          supplier: "Supermercado OR",    unit: "un",    currentStock: 6,    idealStock: 14   },
  { id: "huevos",             name: "Huevos",                             category: "Proteínas",          supplier: "Supermercado OR",    unit: "un",    currentStock: 25,   idealStock: 30   },
  { id: "tomate",             name: "Tomate",                             category: "Verduras y frutas",  supplier: "Mario",              unit: "kg",    currentStock: 1,    idealStock: 4    },
  { id: "lechuga",            name: "Lechuga",                            category: "Verduras y frutas",  supplier: "Mario",              unit: "un",    currentStock: 2,    idealStock: 6    },
  { id: "cebolla-roja",       name: "Cebolla roja",                       category: "Verduras y frutas",  supplier: "Mario",              unit: "kg",    currentStock: 1,    idealStock: 3    },
  { id: "banano",             name: "Banano",                             category: "Verduras y frutas",  supplier: "Mario",              unit: "un",    currentStock: 8,    idealStock: 20   },
  { id: "fresa",              name: "Fresa",                              category: "Verduras y frutas",  supplier: "Mario",              unit: "g",     currentStock: 400,  idealStock: 1000 },
  { id: "leche",              name: "Leche entera",                       category: "Lácteos",            supplier: "D1",                 unit: "L",     currentStock: 4,    idealStock: 10   },
  { id: "crema",              name: "Crema de leche",                     category: "Lácteos",            supplier: "D1",                 unit: "L",     currentStock: 2,    idealStock: 6    },
  { id: "mantequilla",        name: "Mantequilla",                        category: "Lácteos",            supplier: "D1",                 unit: "un",    currentStock: 3,    idealStock: 8    },
  { id: "harina",             name: "Harina de trigo",                    category: "Harinas y panadería", supplier: "D1",                 unit: "kg",    currentStock: 1,    idealStock: 5    },
  { id: "pan-hamburguesa",    name: "Pan hamburguesa",                    category: "Harinas y panadería", supplier: "Sin proveedor",      unit: "un",    currentStock: 10,   idealStock: 24   },
  { id: "cafe",               name: "Café molido",                        category: "Abarrotes",          supplier: "Sin proveedor",      unit: "g",     currentStock: 1500, idealStock: 2000 },
  { id: "azucar",             name: "Azúcar",                             category: "Abarrotes",          supplier: "D1",                 unit: "kg",    currentStock: 2,    idealStock: 5    },
  { id: "nachos",             name: "Nachos",                             category: "Abarrotes",          supplier: "Distribuidora La 50", unit: "kg",    currentStock: 1,    idealStock: 4    },
  { id: "salsa-bbq",          name: "Salsa BBQ",                          category: "Salsas y aderezos",  supplier: "D1",                 unit: "un",    currentStock: 1,    idealStock: 3    },
  { id: "mayonesa",           name: "Mayonesa",                           category: "Salsas y aderezos",  supplier: "D1",                 unit: "un",    currentStock: 1,    idealStock: 3    },
  { id: "servilletas",        name: "Servilletas",                        category: "Insumos y aseo",     supplier: "Distribuidora La 50", unit: "pkg",   currentStock: 1,    idealStock: 5    },
  { id: "bolsas-basura",      name: "Bolsas de basura",                   category: "Insumos y aseo",     supplier: "Distribuidora La 50", unit: "rollo", currentStock: 0,    idealStock: 2    },
  { id: "gaseosas",           name: "Gaseosas surtidas",                  category: "Bebidas",            supplier: "Sin proveedor",      unit: "un",    currentStock: 12,   idealStock: 24   },
  { id: "producto-pendiente", name: "Producto por clasificar",            category: "Sin categoría",      supplier: "Sin proveedor",      unit: "un",    currentStock: 0,    idealStock: 1    },
];

export const manualShoppingItems: ManualShoppingItem[] = [
  {
    id: "manual-velas-cumpleanos",
    name: "Velas de cumpleaños",
    quantity: 1,
    unit: "paq",
    category: "Sin categoría",
    status: "pendiente",
  },
];

const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const shortDayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function addDays(dateStr: string, days: number) {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getSaturdayWeekStart(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  const daysSinceSaturday = (date.getDay() + 1) % 7;
  date.setDate(date.getDate() - daysSinceSaturday);
  return date.toISOString().slice(0, 10);
}

export function getFridayWeekEnd(startDate: string) {
  return addDays(startDate, 6);
}

export function getWeekDateRange(startDate: string) {
  return Array.from({ length: 7 }, (_, index) => addDays(startDate, index));
}

export function getWeekLabel(startDate: string, endDate = getFridayWeekEnd(startDate)) {
  const formatter = new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
  });

  return `${formatter.format(new Date(`${startDate}T00:00:00`))} al ${formatter.format(new Date(`${endDate}T00:00:00`))}`;
}

export function getWorkDayLabel(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return dayNames[date.getDay()];
}

export function getWorkDayShortLabel(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${shortDayNames[date.getDay()]} ${day}/${month}`;
}

export function getBuyQty(item: InventoryItem): number {
  return Math.max(item.idealStock - item.currentStock, 0);
}

export function getStockRatio(item: InventoryItem): number {
  return item.idealStock === 0 ? 1 : item.currentStock / item.idealStock;
}

export function getStockLevel(item: InventoryItem): "bien" | "bajo" | "crítico" {
  const ratio = getStockRatio(item);
  if (ratio >= 0.7) return "bien";
  if (ratio >= 0.4) return "bajo";
  return "crítico";
}

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

export function getWeekTotalDays(week = currentWorkWeek, team = employees) {
  return team.reduce((total, employee) => {
    return total + getEmployeeDaysWorked(employee.id, week);
  }, 0);
}

export function calculateTipDistribution(
  totalTips: number,
  payments: Record<string, PaymentStatus> = {},
  week = currentWorkWeek,
  team = employees
): TipDistribution[] {
  const totalDays = getWeekTotalDays(week, team);

  return team.map((employee) => {
    const daysWorked = getEmployeeDaysWorked(employee.id, week);
    const rawAmount = totalDays === 0 ? 0 : (totalTips * daysWorked) / totalDays;

    return {
      employee,
      daysWorked,
      amount: Math.round(rawAmount),
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
