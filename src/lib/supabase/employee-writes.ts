import type { EmployeeStatus } from "@/lib/mock-data";
import { createBrowserSupabase } from "./browser";

// Campos editables desde el formulario de "Personal".
export type EmployeeFields = {
  name: string;
  role: string;
  phone?: string;
  documentId?: string;
  birthDate?: string;
  address?: string;
  hiredAt?: string;
  contractType?: string;
  eps?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  internalNotes?: string;
  status?: EmployeeStatus;
};

// Traduce camelCase (UI) → snake_case (BD). Strings vacíos se guardan como
// NULL para no mezclar "" con "sin dato".
function toRow(fields: EmployeeFields) {
  const orNull = (v?: string) => (v && v.trim() ? v.trim() : null);
  return {
    name: fields.name,
    role: fields.role,
    phone: orNull(fields.phone),
    document_id: orNull(fields.documentId),
    birth_date: orNull(fields.birthDate),
    address: orNull(fields.address),
    hired_at: orNull(fields.hiredAt),
    contract_type: orNull(fields.contractType),
    eps: orNull(fields.eps),
    emergency_contact: orNull(fields.emergencyContact),
    emergency_phone: orNull(fields.emergencyPhone),
    internal_notes: orNull(fields.internalNotes),
    status: fields.status ?? "activo",
  };
}

export async function insertEmployee(fields: EmployeeFields): Promise<string | null> {
  const supabase = createBrowserSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("employees")
    .insert({ ...toRow(fields), active: true })
    .select("id")
    .single();
  if (error || !data) {
    console.error("[insertEmployee] error:", error?.message, "| code:", error?.code);
    return null;
  }
  return (data as { id: string }).id;
}

export async function updateEmployee(id: string, fields: EmployeeFields): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;
  // .select("id") hace que Supabase devuelva las filas afectadas. Si RLS
  // bloquea el UPDATE, NO hay error: simplemente 0 filas. Sin este check,
  // la app creía que guardó y al recargar el cambio "se borraba".
  const { data, error } = await supabase
    .from("employees")
    .update(toRow(fields))
    .eq("id", id)
    .select("id");
  if (error || !data || data.length === 0) {
    console.error("[updateEmployee] no se actualizó:", error?.message ?? "0 filas (¿RLS?)");
    return false;
  }
  return true;
}

export async function softDeleteEmployee(id: string): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;

  const { data, error } = await supabase
    .from("employees")
    .update({ active: false })
    .eq("id", id)
    .select("id");

  return !error && !!data && data.length > 0;
}
