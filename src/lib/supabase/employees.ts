import { employees as mockEmployees, type Employee, type EmployeeStatus } from "@/lib/mock-data";
import { createServerSupabase } from "./server";

// Forma exacta de una fila de la tabla `employees` en Supabase (snake_case).
type SupabaseEmployeeRow = {
  id: string;
  name: string;
  short_name: string | null;
  role: string;
  phone: string | null;
  active: boolean;
  status: string | null;
  created_at: string;
  hired_at: string | null;
  document_id: string | null;
  birth_date: string | null;
  address: string | null;
  contract_type: string | null;
  eps: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  internal_notes: string | null;
};

const EMPLOYEE_COLUMNS =
  "id, name, short_name, role, phone, active, status, created_at, hired_at, document_id, birth_date, address, contract_type, eps, emergency_contact, emergency_phone, internal_notes";

const VALID_STATUS: EmployeeStatus[] = ["activo", "descanso", "inactivo"];

// Convierte la fila de BD (snake_case) al tipo que usa la UI (camelCase).
// Antes los campos de contrato/EPS/emergencia se rellenaban con "Pendiente"
// fijo, por eso lo que se escribía en el formulario "se borraba" al recargar.
function mapRow(row: SupabaseEmployeeRow): Employee {
  const status = VALID_STATUS.includes(row.status as EmployeeStatus)
    ? (row.status as EmployeeStatus)
    : "activo";
  return {
    id: row.id,
    name: row.name,
    short_name: row.short_name ?? undefined,
    role: row.role,
    phone: row.phone ?? "",
    documentId: row.document_id ?? "",
    birthDate: row.birth_date ?? "",
    address: row.address ?? "",
    status,
    hiredAt: row.hired_at ?? row.created_at.slice(0, 10),
    baseShift: row.role,
    contractType: row.contract_type ?? "",
    salaryBase: "Pendiente",
    eps: row.eps ?? "",
    arl: "Pendiente",
    pensionFund: "Pendiente",
    emergencyContact: row.emergency_contact ?? "",
    emergencyPhone: row.emergency_phone ?? "",
    emergencyRelation: "Pendiente",
    internalNotes: row.internal_notes ?? "",
  };
}

export async function getEmployees(): Promise<Employee[]> {
  const supabase = await createServerSupabase();
  // Mock SOLO cuando no hay Supabase configurado (desarrollo local sin .env).
  if (!supabase) return mockEmployees;

  // `active` = no eliminado (soft delete). El estado laboral va en `status`.
  const { data, error } = await supabase
    .from("employees")
    .select(EMPLOYEE_COLUMNS)
    .eq("active", true)
    .order("name");

  if (error) {
    // Antes aquí se devolvían empleados de prueba: la UI mostraba datos falsos
    // y cualquier edición sobre ellos "desaparecía". Mejor lista vacía + log.
    console.error("[getEmployees] error:", error.message, "| code:", error.code);
    return [];
  }

  return ((data ?? []) as SupabaseEmployeeRow[]).map(mapRow);
}
