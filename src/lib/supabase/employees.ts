import { employees as mockEmployees, type Employee } from "@/lib/mock-data";
import { supabase } from "./client";

type SupabaseEmployeeRow = {
  id: string;
  local_key: string | null;
  name: string;
  short_name: string | null;
  role: string;
  phone: string | null;
  active: boolean;
  created_at: string;
};

function mapRow(row: SupabaseEmployeeRow): Employee {
  return {
    id: row.local_key ?? row.id,
    name: row.name,
    short_name: row.short_name ?? undefined,
    role: row.role,
    phone: row.phone ?? "",
    status: row.active ? "activo" : "inactivo",
    hiredAt: row.created_at.slice(0, 10),
    baseShift: row.role,
    contractType: "Pendiente",
    salaryBase: "Pendiente",
    eps: "Pendiente",
    arl: "Pendiente",
    pensionFund: "Pendiente",
    emergencyContact: "Pendiente",
    emergencyPhone: "Pendiente",
    emergencyRelation: "Pendiente",
    internalNotes: "",
  };
}

export async function getEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from("employees")
    .select("id, local_key, name, short_name, role, phone, active, created_at")
    .order("name");

  if (error || !data || data.length === 0) {
    return mockEmployees;
  }

  return (data as SupabaseEmployeeRow[]).map(mapRow);
}
