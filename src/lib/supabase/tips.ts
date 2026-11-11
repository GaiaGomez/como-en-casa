import { tipWeeks as mockTipWeeks, type TipWeekData } from "@/lib/mock-data";
import { createServerSupabase } from "./server";

type WeekRow = { id: string; start_date: string; end_date: string; status: string };
type AmountRow = { week_id: string; tip_date: string; amount: number };
type ScheduleRow = { week_id: string; employee_id: string; work_date: string; worked: boolean };
type PaymentRow = { week_id: string; employee_id: string; status: string };

export async function getTipWeeks(): Promise<TipWeekData[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return mockFallback();

  const { data: weeks, error: weeksError } = await supabase
    .from("tip_weeks")
    .select("id, start_date, end_date, status")
    .order("start_date", { ascending: true });

  if (weeksError) {
    // Antes devolvía semanas de prueba: se editaban datos falsos que al
    // recargar "desaparecían". Ahora: vacío + log para ver el error real.
    console.error("[getTipWeeks] error:", weeksError.message, "| code:", weeksError.code);
    return [];
  }
  if (!weeks || weeks.length === 0) return [];

  const weekIds = (weeks as WeekRow[]).map((w) => w.id);

  const [{ data: amounts, error: amountsErr }, { data: schedule, error: scheduleErr }, { data: payments, error: paymentsErr }] =
    await Promise.all([
      supabase.from("tip_daily_amounts").select("week_id, tip_date, amount").in("week_id", weekIds),
      supabase.from("work_schedule").select("week_id, employee_id, work_date, worked").in("week_id", weekIds),
      supabase.from("tip_payments").select("week_id, employee_id, status").in("week_id", weekIds),
    ]);

  if (amountsErr || scheduleErr || paymentsErr) {
    console.error("[getTipWeeks] error leyendo detalle:", amountsErr?.message, scheduleErr?.message, paymentsErr?.message);
    return [];
  }

  return (weeks as WeekRow[]).map((week) => {
    const dailyTips: Record<string, number> = {};
    (amounts as AmountRow[] ?? [])
      .filter((a) => a.week_id === week.id)
      .forEach((a) => { dailyTips[a.tip_date] = a.amount; });

    const scheduleByDate: Record<string, Record<string, boolean>> = {};
    (schedule as ScheduleRow[] ?? [])
      .filter((s) => s.week_id === week.id)
      .forEach((s) => {
        if (!scheduleByDate[s.work_date]) scheduleByDate[s.work_date] = {};
        scheduleByDate[s.work_date][s.employee_id] = s.worked;
      });

    const paymentsMap: Record<string, "pagado" | "pendiente"> = {};
    (payments as PaymentRow[] ?? [])
      .filter((p) => p.week_id === week.id)
      .forEach((p) => { paymentsMap[p.employee_id] = p.status as "pagado" | "pendiente"; });

    return {
      id: week.id,
      startDate: week.start_date,
      endDate: week.end_date,
      status: week.status as "abierta" | "cerrada",
      dailyTips,
      payments: paymentsMap,
      schedule: scheduleByDate,
    };
  });
}

function mockFallback(): TipWeekData[] {
  return mockTipWeeks.map((w) => ({
    id: "",
    startDate: w.startDate,
    endDate: w.endDate,
    status: w.status,
    dailyTips: w.dailyTips,
    payments: w.payments,
    schedule: {},
  }));
}
