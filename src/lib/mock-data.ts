export type EmployeeRole = "cocina" | "estacion" | "reposteria" | "mesero" | (string & {});
export type EmployeeStatus = "activo" | "descanso" | "inactivo";
export type TipStatus = "abierta" | "cerrada";
export type PaymentStatus = "pagado" | "pendiente";
export type PurchaseStatus = "pendiente";

export type Employee = {
  id: string;
  name: string;
  short_name?: string;
  role: EmployeeRole;
  phone: string;
  documentId?: string;
  birthDate?: string;
  address?: string;
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

export type TipWeekData = {
  id: string;
  startDate: string;
  endDate: string;
  status: TipStatus;
  dailyTips: Record<string, number>;
  payments: Record<string, PaymentStatus>;
  schedule: Record<string, Record<string, boolean>>;
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
    id: "lilina",
    name: "Liliana",
    role: "cocina",
    phone: "",
    status: "activo",
    hiredAt: "2026-01-01",
    baseShift: "Cocina",
    contractType: "Pendiente",
    salaryBase: "Pendiente",
    eps: "Pendiente",
    arl: "Pendiente",
    pensionFund: "Pendiente",
    emergencyContact: "Pendiente",
    emergencyPhone: "",
    emergencyRelation: "Pendiente",
    internalNotes: "Tip eligible.",
  },
  {
    id: "sandra",
    name: "Sandra",
    role: "cocina",
    phone: "",
    status: "activo",
    hiredAt: "2026-01-01",
    baseShift: "Cocina",
    contractType: "Pendiente",
    salaryBase: "Pendiente",
    eps: "Pendiente",
    arl: "Pendiente",
    pensionFund: "Pendiente",
    emergencyContact: "Pendiente",
    emergencyPhone: "",
    emergencyRelation: "Pendiente",
    internalNotes: "Tip eligible.",
  },
  {
    id: "valeria",
    name: "Valeria",
    role: "cocina",
    phone: "",
    status: "activo",
    hiredAt: "2026-01-01",
    baseShift: "Cocina",
    contractType: "Pendiente",
    salaryBase: "Pendiente",
    eps: "Pendiente",
    arl: "Pendiente",
    pensionFund: "Pendiente",
    emergencyContact: "Pendiente",
    emergencyPhone: "",
    emergencyRelation: "Pendiente",
    internalNotes: "Tip eligible.",
  },
  {
    id: "andrea",
    name: "Andrea",
    role: "estacion",
    phone: "",
    status: "activo",
    hiredAt: "2026-01-01",
    baseShift: "Estación",
    contractType: "Pendiente",
    salaryBase: "Pendiente",
    eps: "Pendiente",
    arl: "Pendiente",
    pensionFund: "Pendiente",
    emergencyContact: "Pendiente",
    emergencyPhone: "",
    emergencyRelation: "Pendiente",
    internalNotes: "Tip eligible.",
  },
  {
    id: "yamile",
    name: "Yamile",
    role: "estacion",
    phone: "",
    status: "activo",
    hiredAt: "2026-01-01",
    baseShift: "Estación",
    contractType: "Pendiente",
    salaryBase: "Pendiente",
    eps: "Pendiente",
    arl: "Pendiente",
    pensionFund: "Pendiente",
    emergencyContact: "Pendiente",
    emergencyPhone: "",
    emergencyRelation: "Pendiente",
    internalNotes: "Tip eligible.",
  },
  {
    id: "mildrey",
    name: "Mildrey",
    role: "estacion",
    phone: "",
    status: "activo",
    hiredAt: "2026-01-01",
    baseShift: "Estación",
    contractType: "Pendiente",
    salaryBase: "Pendiente",
    eps: "Pendiente",
    arl: "Pendiente",
    pensionFund: "Pendiente",
    emergencyContact: "Pendiente",
    emergencyPhone: "",
    emergencyRelation: "Pendiente",
    internalNotes: "Tip eligible.",
  },
  {
    id: "yeral",
    name: "Yeral",
    role: "reposteria",
    phone: "",
    status: "activo",
    hiredAt: "2026-01-01",
    baseShift: "Repostería",
    contractType: "Pendiente",
    salaryBase: "Pendiente",
    eps: "Pendiente",
    arl: "Pendiente",
    pensionFund: "Pendiente",
    emergencyContact: "Pendiente",
    emergencyPhone: "",
    emergencyRelation: "Pendiente",
    internalNotes: "Tip eligible.",
  },
  {
    id: "huber",
    name: "Huber",
    role: "mesero",
    phone: "",
    status: "activo",
    hiredAt: "2026-01-01",
    baseShift: "Mesero",
    contractType: "Pendiente",
    salaryBase: "Pendiente",
    eps: "Pendiente",
    arl: "Pendiente",
    pensionFund: "Pendiente",
    emergencyContact: "Pendiente",
    emergencyPhone: "",
    emergencyRelation: "Pendiente",
    internalNotes: "Tip eligible.",
  },
  {
    id: "wilton",
    name: "Wilton",
    role: "mesero",
    phone: "",
    status: "activo",
    hiredAt: "2026-01-01",
    baseShift: "Mesero",
    contractType: "Pendiente",
    salaryBase: "Pendiente",
    eps: "Pendiente",
    arl: "Pendiente",
    pensionFund: "Pendiente",
    emergencyContact: "Pendiente",
    emergencyPhone: "",
    emergencyRelation: "Pendiente",
    internalNotes: "Tip eligible.",
  },
];

export const currentWorkWeek: WorkDay[] = [
  {
    date: "2026-05-08",
    label: "Viernes",
    shortLabel: "Vie 08/05",
    worked: { lilina: true, sandra: true, valeria: true, andrea: true, yamile: true, mildrey: false, yeral: true, huber: true, wilton: true },
  },
  {
    date: "2026-05-09",
    label: "Sábado",
    shortLabel: "Sáb 09/05",
    worked: { lilina: true, sandra: false, valeria: true, andrea: true, yamile: false, mildrey: true, yeral: true, huber: true, wilton: false },
  },
  {
    date: "2026-05-10",
    label: "Domingo",
    shortLabel: "Dom 10/05",
    worked: { lilina: false, sandra: true, valeria: true, andrea: true, yamile: true, mildrey: true, yeral: false, huber: true, wilton: true },
  },
  {
    date: "2026-05-11",
    label: "Lunes",
    shortLabel: "Lun 11/05",
    worked: { lilina: true, sandra: true, valeria: false, andrea: false, yamile: true, mildrey: true, yeral: true, huber: true, wilton: true },
  },
  {
    date: "2026-05-12",
    label: "Martes",
    shortLabel: "Mar 12/05",
    worked: { lilina: true, sandra: true, valeria: true, andrea: true, yamile: true, mildrey: true, yeral: true, huber: false, wilton: true },
  },
  {
    date: "2026-05-13",
    label: "Miércoles",
    shortLabel: "Mié 13/05",
    worked: { lilina: true, sandra: true, valeria: true, andrea: true, yamile: true, mildrey: false, yeral: true, huber: true, wilton: true },
  },
  {
    date: "2026-05-14",
    label: "Jueves",
    shortLabel: "Jue 14/05",
    worked: { lilina: true, sandra: false, valeria: true, andrea: true, yamile: true, mildrey: true, yeral: false, huber: true, wilton: true },
  },
];

export const tipWeeks: TipWeek[] = [
  {
    id: "tips-2026-05-08",
    label: "Semana del viernes 8 al jueves 14 de mayo",
    startDate: "2026-05-08",
    endDate: "2026-05-14",
    totalTips: 1280000,
    dailyTips: {
      "2026-05-08": 268000,
      "2026-05-09": 162000,
      "2026-05-10": 145000,
      "2026-05-11": 158000,
      "2026-05-12": 162000,
      "2026-05-13": 175000,
      "2026-05-14": 210000,
    },
    status: "abierta",
    payments: {
      lilina: "pendiente",
      sandra: "pendiente",
      valeria: "pendiente",
      andrea: "pendiente",
      yamile: "pendiente",
      mildrey: "pendiente",
      yeral: "pendiente",
      huber: "pendiente",
      wilton: "pendiente",
    },
  },
  {
    id: "tips-2026-05-01",
    label: "Semana del viernes 1 al jueves 7 de mayo",
    startDate: "2026-05-01",
    endDate: "2026-05-07",
    totalTips: 1165000,
    dailyTips: {
      "2026-05-01": 260000,
      "2026-05-02": 152000,
      "2026-05-03": 120000,
      "2026-05-04": 135000,
      "2026-05-05": 142000,
      "2026-05-06": 151000,
      "2026-05-07": 205000,
    },
    status: "cerrada",
    payments: {
      lilina: "pagado",
      sandra: "pagado",
      valeria: "pagado",
      andrea: "pagado",
      yamile: "pagado",
      mildrey: "pagado",
      yeral: "pagado",
      huber: "pagado",
      wilton: "pagado",
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

export function formatUnit(unit: string) {
  const normalized = unit.trim().toLowerCase();
  if (normalized === "paquete" || normalized === "paquetes" || normalized === "paq") return "paq.";
  return unit;
}

export const inventory: InventoryItem[] = [
  { id: "carne-ahumada",              name: "Carne ahumada",                         category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 28, idealStock: 40 },
  { id: "carne-desmechada",           name: "Carne desmechada",                      category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 61, idealStock: 70 },
  { id: "carne-molida",               name: "Carne molida",                          category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 17, idealStock: 30 },
  { id: "pollo-corte-100-gr",         name: "Pollo corte 100 gr",                    category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 41, idealStock: 50 },
  { id: "pollo-corte-150-gr",         name: "Pollo corte 150 gr",                    category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 25, idealStock: 35 },
  { id: "carne-res-corte-mariposa-200-gr", name: "Carne res corte mariposa 200 gr",     category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 9, idealStock: 20 },
  { id: "chorizo-santarrosano",        name: "Chorizo santarrosano",                   category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 19, idealStock: 30 },
  { id: "carne-hamburguesa",          name: "Carne de hamburguesa",                   category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 23, idealStock: 35 },
  { id: "veggie",                     name: "Veggie",                                category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 6, idealStock: 12 },
  { id: "salchicha-italiana",         name: "Salchicha italiana",                    category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 19, idealStock: 30 },
  { id: "salchicha-argentina",        name: "Salchicha argentina",                   category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 28, idealStock: 35 },
  { id: "salchicha-alemana",          name: "Salchicha alemana",                     category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 23, idealStock: 30 },
  { id: "salchicha-santarrosana",     name: "Salchicha santarrosana",                category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 26, idealStock: 35 },
  { id: "punta-de-anca",              name: "Punta de anca",                         category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 9, idealStock: 25 },
  { id: "chuleta",                    name: "Chuleta",                               category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 22, idealStock: 30 },
  { id: "churrasco",                  name: "Churrasco",                             category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 33, idealStock: 40 },
  { id: "tocineta",                   name: "Tocineta",                              category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 0, idealStock: 0 },
  { id: "salchicha-ranchera",         name: "Salchicha ranchera",                    category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 0, idealStock: 0 },
  { id: "cabano",                     name: "Cabano",                                category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 0, idealStock: 0 },
  { id: "serrano",                   name: "Serrano",                               category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 0, idealStock: 0 },
  { id: "huevos",                    name: "Huevos",                                category: "Proteínas",          supplier: "Supermercado OR",    unit: "un", currentStock: 0, idealStock: 0 },

  { id: "maracuya",                  name: "Maracuyá",                              category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 0, idealStock: 0 },
  { id: "arandanos",                 name: "Arándanos",                             category: "Verduras y frutas",  supplier: "Mario",              unit: "g", currentStock: 1000, idealStock: 1500 },
  { id: "cilantro",                  name: "Cilantro",                              category: "Verduras y frutas",  supplier: "Mario",              unit: "g", currentStock: 400, idealStock: 1000 },
  { id: "repollo-morado",            name: "Repollo morado",                        category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 0, idealStock: 0 },
  { id: "fruta-del-dia",             name: "Fruta del día",                         category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 0, idealStock: 0 },
  { id: "lechuga",                   name: "Lechuga",                               category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 10, idealStock: 15 },
  { id: "limones",                   name: "Limones",                               category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 0, idealStock: 0 },
  { id: "perejil",                   name: "Perejil",                               category: "Verduras y frutas",  supplier: "Mario",              unit: "g", currentStock: 200, idealStock: 500 },
  { id: "aji",                       name: "Ají",                                   category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 0, idealStock: 0 },
  { id: "papas",                     name: "Papas",                                 category: "Verduras y frutas",  supplier: "Mario",              unit: "kg", currentStock: 1, idealStock: 5 },
  { id: "pepinos",                   name: "Pepinos",                               category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 6, idealStock: 10 },
  { id: "pimenton",                  name: "Pimentón",                              category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 6, idealStock: 10 },
  { id: "pina",                      name: "Piña",                                  category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 2, idealStock: 4 },
  { id: "tomate-chonto",             name: "Tomate chonto",                         category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 5, idealStock: 10 },
  { id: "guacamole",                 name: "Guacamole",                             category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 0, idealStock: 0 },
  { id: "tomate-rinon",             name: "Tomate riñón",                         category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 10, idealStock: 15 },
  { id: "cebolla-blanca",            name: "Cebolla blanca",                        category: "Verduras y frutas",  supplier: "Mario",              unit: "un", currentStock: 5, idealStock: 10 },
  { id: "cebolla-rama",              name: "Cebolla rama",                          category: "Verduras y frutas",  supplier: "Mario",              unit: "g", currentStock: 300, idealStock: 600 },

  { id: "crema-agria",              name: "Crema agria",                           category: "Lácteos",            supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "queso-bloque",             name: "Queso bloque",                          category: "Lácteos",            supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "queso-cheddar",            name: "Queso cheddar",                         category: "Lácteos",            supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "queso-tajado",             name: "Queso tajado",                          category: "Lácteos",            supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "crema-de-leche",           name: "Crema de leche",                        category: "Lácteos",            supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "leche",                    name: "Leche",                                 category: "Lácteos",            supplier: "Sin proveedor",      unit: "L", currentStock: 0, idealStock: 0 },
  { id: "queso-parmesano",          name: "Queso parmesano",                      category: "Lácteos",            supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "queso-crema",              name: "Queso crema",                           category: "Lácteos",            supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "mozzarella",               name: "Mozzarella",                            category: "Lácteos",            supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "helado-vainilla",          name: "Helado de vainilla",                   category: "Lácteos",            supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "helado-frutos-rojos",      name: "Helado de frutos rojos",               category: "Lácteos",            supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "mantequilla",              name: "Mantequilla",                           category: "Lácteos",            supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },

  { id: "harina-de-trigo",          name: "Harina de trigo",                      category: "Harinas y panadería", supplier: "Sin proveedor",      unit: "kg", currentStock: 0, idealStock: 0 },
  { id: "pan-baguette",             name: "Pan baguette",                          category: "Harinas y panadería", supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "pan-tajado",               name: "Pan tajado",                            category: "Harinas y panadería", supplier: "Sin proveedor",      unit: "paquete", currentStock: 0, idealStock: 0 },
  { id: "tortillas-mexicanas",      name: "Tortillas mexicanas",                   category: "Harinas y panadería", supplier: "Sin proveedor",      unit: "paquete", currentStock: 0, idealStock: 0 },
  { id: "masa-pan-de-yuca",         name: "Masa pan de yuca",                      category: "Harinas y panadería", supplier: "Sin proveedor",      unit: "paquete", currentStock: 0, idealStock: 0 },

  { id: "aceite",                   name: "Aceite",                                category: "Abarrotes",          supplier: "Sin proveedor",      unit: "L", currentStock: 0, idealStock: 0 },
  { id: "especias",                 name: "Especias",                              category: "Abarrotes",          supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "sal-abarrotes",            name: "Sal",                                   category: "Abarrotes",          supplier: "Sin proveedor",      unit: "g", currentStock: 0, idealStock: 0 },
  { id: "ajo",                      name: "Ajo",                                   category: "Abarrotes",          supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "canela",                   name: "Canela",                                category: "Abarrotes",          supplier: "Sin proveedor",      unit: "g", currentStock: 0, idealStock: 0 },
  { id: "brevas",                   name: "Brevas",                                category: "Abarrotes",          supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "nachos",                   name: "Nachos",                                category: "Abarrotes",          supplier: "Distribuidora La 50", unit: "kg", currentStock: 0, idealStock: 5 },
  { id: "nibs-de-chocolate",        name: "Nibs de chocolate",                     category: "Abarrotes",          supplier: "Sin proveedor",      unit: "paquete", currentStock: 0, idealStock: 0 },
  { id: "pasta",                    name: "Pasta",                                 category: "Abarrotes",          supplier: "Sin proveedor",      unit: "paquete", currentStock: 0, idealStock: 0 },
  { id: "alonjoli",                 name: "Alonjolí",                              category: "Abarrotes",          supplier: "Sin proveedor",      unit: "g", currentStock: 0, idealStock: 0 },
  { id: "miel-de-maple",            name: "Miel de maple",                         category: "Abarrotes",          supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "oregano",                  name: "Orégano",                               category: "Abarrotes",          supplier: "Sin proveedor",      unit: "g", currentStock: 0, idealStock: 0 },
  { id: "paprika",                  name: "Paprika",                               category: "Abarrotes",          supplier: "Sin proveedor",      unit: "g", currentStock: 0, idealStock: 0 },
  { id: "pimienta",                 name: "Pimienta",                              category: "Abarrotes",          supplier: "Sin proveedor",      unit: "g", currentStock: 0, idealStock: 0 },
  { id: "crema-de-avellanas",       name: "Crema de avellanas",                   category: "Abarrotes",          supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },

  { id: "salsa-de-tomate",         name: "Salsa de tomate",                       category: "Salsas y aderezos",  supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "salsa-bbq",                name: "Salsa BBQ",                             category: "Salsas y aderezos",  supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "salsa-de-humo",           name: "Salsa de humo",                         category: "Salsas y aderezos",  supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "salsa-negra",              name: "Salsa negra",                            category: "Salsas y aderezos",  supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "salsa-para-carnes",        name: "Salsa para carnes",                     category: "Salsas y aderezos",  supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "salsa-soya",               name: "Salsa soya",                            category: "Salsas y aderezos",  supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "sazonador-de-pollo",       name: "Sazonador de pollo",                    category: "Salsas y aderezos",  supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "vinagre",                  name: "Vinagre",                               category: "Salsas y aderezos",  supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "mostaza",                  name: "Mostaza",                               category: "Salsas y aderezos",  supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "topping-de-salsa",         name: "Topping de salsa",                      category: "Salsas y aderezos",  supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },

  { id: "bolsas-transparentes-10x14", name: "Bolsas transparentes 10x14",            category: "Insumos y aseo",     supplier: "Distribuidora La 50", unit: "paquete", currentStock: 0, idealStock: 0 },
  { id: "bolsas-transparentes-6x8",  name: "Bolsas transparentes 6x8",             category: "Insumos y aseo",     supplier: "Distribuidora La 50", unit: "paquete", currentStock: 0, idealStock: 0 },
  { id: "esponjas",                 name: "Esponjas",                               category: "Insumos y aseo",     supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "jabon-liquido",            name: "Jabón líquido",                          category: "Insumos y aseo",     supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "desengrasante",            name: "Desengrasante",                         category: "Insumos y aseo",     supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "hipoclorito",              name: "Hipoclorito",                           category: "Insumos y aseo",     supplier: "Sin proveedor",      unit: "un", currentStock: 0, idealStock: 0 },
  { id: "papeles-de-hamburguesa",   name: "Papeles de hamburguesa",               category: "Insumos y aseo",     supplier: "Sin proveedor",      unit: "paquete", currentStock: 0, idealStock: 0 },
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

export function getTodayColombiaDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDays(dateStr: string, days: number) {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function getFridayWeekStart(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  const daysSinceFriday = (date.getDay() + 2) % 7;
  date.setDate(date.getDate() - daysSinceFriday);
  return date.toISOString().slice(0, 10);
}

export function getThursdayWeekEnd(startDate: string) {
  return addDays(startDate, 6);
}

export function getWeekDateRange(startDate: string) {
  return Array.from({ length: 7 }, (_, index) => addDays(startDate, index));
}

export function getWeekLabel(startDate: string, endDate = getThursdayWeekEnd(startDate)) {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const monthFormatter = new Intl.DateTimeFormat("es-CO", { month: "long" });
  const startMonth = monthFormatter.format(start);
  const endMonth = monthFormatter.format(end);
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  if (startYear !== endYear) {
    return `Del ${start.getDate()} de ${startMonth} de ${startYear} al ${end.getDate()} de ${endMonth} de ${endYear}`;
  }

  if (startMonth !== endMonth) {
    return `Del ${start.getDate()} de ${startMonth} al ${end.getDate()} de ${endMonth}`;
  }

  return `Del ${start.getDate()} al ${end.getDate()} de ${endMonth}`;
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
