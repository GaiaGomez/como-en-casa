import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/page-header";
import { employees, getEmployeeDaysWorked, getEmployeeHours } from "@/lib/mock-data";

const roleLabels = {
  barista: "Barista",
  cocina: "Cocina",
  servicio: "Servicio",
  caja: "Caja",
};

export default function TeamPage() {
  return (
    <>
      <PageHeader
        title="Equipo"
        description="Perfiles activos"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {employees.map((employee) => {
          const isActive = employee.status === "activo";

          return (
            <article
              key={employee.id}
              className="rounded-[2rem] border border-white/10 bg-[#1b1814] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{employee.name}</h3>
                  <p className="mt-1 text-sm text-[#a8a09a]">
                    {roleLabels[employee.role]} · {employee.baseShift}
                  </p>
                </div>
                <Badge
                  className={
                    isActive
                      ? "rounded-full bg-[#1f4d32] text-[#9df2b1]"
                      : "rounded-full bg-[#3c2b11] text-[#ffbd63]"
                  }
                >
                  {isActive ? "Activo" : "Descanso"}
                </Badge>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-sm text-[#a8a09a]">Horas</p>
                  <p className="mt-1 text-3xl font-semibold text-white">
                    {getEmployeeHours(employee.id)} h
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <p className="text-sm text-[#a8a09a]">Días</p>
                  <p className="mt-1 text-3xl font-semibold text-white">
                    {getEmployeeDaysWorked(employee.id)}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-[#a8a09a]">{employee.phone}</p>
            </article>
          );
        })}
      </section>
    </>
  );
}
