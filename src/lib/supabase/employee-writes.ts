import { createBrowserSupabase } from "./browser";

export async function softDeleteEmployee(id: string): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("employees")
    .update({ active: false })
    .or(`local_key.eq.${id},id.eq.${id}`);

  return !error;
}
