"use server";

import { createServerSupabase } from "./server";

export async function ensureTipWeek(startDate: string, endDate: string): Promise<string | null> {
  const supabase = await createServerSupabase();
  if (!supabase) {
    console.error("[ensureTipWeek] Supabase not configured");
    return null;
  }
  const { data, error } = await supabase
    .from("tip_weeks")
    .upsert({ start_date: startDate, end_date: endDate }, { onConflict: "start_date" })
    .select("id")
    .single();
  if (error) {
    console.error("[ensureTipWeek] error:", error.message, "| code:", error.code, "| details:", error.details);
    return null;
  }
  if (!data) {
    console.error("[ensureTipWeek] no data returned after upsert for start_date:", startDate);
    return null;
  }
  return (data as { id: string }).id;
}

export async function upsertWorkDay(
  weekId: string,
  employeeId: string,
  date: string,
  worked: boolean
): Promise<boolean> {
  const supabase = await createServerSupabase();
  if (!supabase) {
    console.error("[upsertWorkDay] Supabase not configured");
    return false;
  }
  const { error } = await supabase
    .from("work_schedule")
    .upsert(
      { week_id: weekId, employee_id: employeeId, work_date: date, worked },
      { onConflict: "week_id,employee_id,work_date" }
    );
  if (error) {
    console.error("[upsertWorkDay] error:", error.message, "| code:", error.code, "| details:", error.details);
    return false;
  }
  return true;
}

export async function upsertDailyTip(weekId: string, date: string, amount: number): Promise<boolean> {
  const supabase = await createServerSupabase();
  if (!supabase) {
    console.error("[upsertDailyTip] Supabase not configured");
    return false;
  }
  const { error } = await supabase
    .from("tip_daily_amounts")
    .upsert({ week_id: weekId, tip_date: date, amount }, { onConflict: "week_id,tip_date" });
  if (error) {
    console.error("[upsertDailyTip] error:", error.message, "| code:", error.code, "| details:", error.details);
    return false;
  }
  return true;
}
