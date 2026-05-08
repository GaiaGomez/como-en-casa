import { Clock } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  cafeInfo,
  currentShiftWeek,
  employees,
  getDayTotalHours,
  getEmployeeHours,
  getWeekTotalHours,
} from "@/lib/mock-data";

export default function WeekPage() {
  const activeEmployees = employees.filter((employee) => employee.status === "activo");

  return (
    <>
      <PageHeader
        title="Semana"
        description="Horas para propinas"
      />

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="rounded-[2rem] border-white/10 bg-[#1b1814]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#bdb6ae]">
              <Clock className="size-4 text-[#d98b3a]" />
              Café
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cafeInfo.hours.map((item) => (
              <div
                key={item.days}
                className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <span className="font-medium text-white">{item.days}</span>
                <span className="text-right text-sm font-semibold text-[#d98b3a]">
                  {item.time}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/10 bg-[#1b1814]">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[#bdb6ae]">Resumen</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <SimpleStat label="Total horas" value={`${getWeekTotalHours()} h`} />
            <SimpleStat label="Activos" value={`${activeEmployees.length}`} />
            <SimpleStat label="Semana" value="4 al 10 mayo" />
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[#1b1814]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead className="bg-white/[0.04] text-left text-[#bdb6ae]">
              <tr>
                <th className="px-4 py-3 font-semibold">Persona</th>
                {currentShiftWeek.map((day) => (
                  <th key={day.date} className="px-3 py-3 text-center font-semibold">
                    <span className="block">{day.label}</span>
                    <span className="text-xs font-normal text-[#8f8780]">
                      {day.date.slice(8)}/{day.date.slice(5, 7)}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-t border-white/10">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-white">{employee.name}</p>
                    <p className="text-xs text-[#a8a09a]">{employee.baseShift}</p>
                  </td>
                  {currentShiftWeek.map((day) => {
                    const hours = day.hours[employee.id] ?? 0;

                    return (
                      <td key={day.date} className="px-3 py-4 text-center">
                        <span
                          className={
                            hours > 0
                              ? "inline-flex min-w-12 justify-center rounded-full bg-[#2b251d] px-3 py-1 font-semibold text-[#d98b3a]"
                              : "text-[#5f5952]"
                          }
                        >
                          {hours > 0 ? `${hours} h` : "-"}
                        </span>
                      </td>
                    );
                  })}
                  <td className="px-4 py-4 text-right text-base font-semibold text-white">
                    {getEmployeeHours(employee.id)} h
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-white/10 bg-white/[0.03] font-semibold text-white">
              <tr>
                <td className="px-4 py-3">Total por día</td>
                {currentShiftWeek.map((day) => (
                  <td key={day.date} className="px-3 py-3 text-center">
                    {getDayTotalHours(day)} h
                  </td>
                ))}
                <td className="px-4 py-3 text-right">{getWeekTotalHours()} h</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </>
  );
}

function SimpleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-sm text-[#a8a09a]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}
