import { createBrowserSupabase } from "./browser";

export async function ensureTipWeek(startDate: string, endDate: string): Promise<string | null> {
  const supabase = createBrowserSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("tip_weeks")
    .upsert({ start_date: startDate, end_date: endDate }, { onConflict: "start_date" })
    .select("id")
    .single();
  if (error || !data) return null;
  return (data as { id: string }).id;
}

export async function upsertWorkDay(
  weekId: string,
  employeeId: string,
  date: string,
  worked: boolean
): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;
  const { error } = await supabase
    .from("work_schedule")
    .upsert(
      { week_id: weekId, employee_id: employeeId, work_date: date, worked },
      { onConflict: "week_id,employee_id,work_date" }
    );
  return !error;
}

export async function upsertDailyTip(weekId: string, date: string, amount: number): Promise<boolean> {
  const supabase = createBrowserSupabase();
  if (!supabase) return false;
  const { error } = await supabase
    .from("tip_daily_amounts")
    .upsert({ week_id: weekId, tip_date: date, amount }, { onConflict: "week_id,tip_date" });
  return !error;
}
