import { createBrowserSupabase } from "./browser";

export async function insertEmployee(fields: {
  name: string;
  role: string;
  phone?: string;
}): Promise<string | null> {
  const supabase = createBrowserSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("employees")
    .insert({ name: fields.name, role: fields.role, phone: fields.phone ?? null, active: true })
    .select("id")
    .single();
  if (error || !data) return null;
  return (data as { id: string }).id;
}

export async function updateEmployee(
  id: string,
  fields: { name?: string; role?: string; phone?: string; active?: boolean }
): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;
  const update: Record<string, unknown> = {};
  if (fields.name !== undefined) update.name = fields.name;
  if (fields.role !== undefined) update.role = fields.role;
  if (fields.phone !== undefined) update.phone = fields.phone || null;
  if (fields.active !== undefined) update.active = fields.active;
  if (Object.keys(update).length === 0) return true;
  const { error } = await supabase
    .from("employees")
    .update(update)
    .eq("id", id);
  return !error;
}

export async function softDeleteEmployee(id: string): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("employees")
    .update({ active: false })
    .eq("id", id);

  return !error;
}
