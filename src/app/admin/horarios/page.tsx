import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currentShiftWeek, employees, getEmployeeHours, getWeekTotalHours } from "@/lib/mock-data";

export default function ShiftsPage() {
  return (
    <>
      <PageHeader
        title="Horarios"
        description="Tabla semanal con empleados en filas, dias en columnas y horas calculadas al final."
      />
      <Card className="border-[#eadccb] bg-[#fffaf2]">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                {currentShiftWeek.map((day) => (
                  <TableHead key={day.date} className="text-center">
                    <span className="block">{day.label}</span>
                    <span className="text-xs font-normal text-[#7a6654]">
                      {day.date.slice(5)}
                    </span>
                  </TableHead>
                ))}
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  {currentShiftWeek.map((day) => {
                    const hours = day.hours[employee.id] ?? 0;
                    return (
                      <TableCell
                        key={day.date}
                        className="min-w-20 text-center"
                      >
                        <span className={hours > 0 ? "font-medium" : "text-[#b39b83]"}>
                          {hours > 0 ? `${hours} h` : "-"}
                        </span>
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-right font-semibold">
                    {getEmployeeHours(employee.id)} h
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total horas</TableCell>
                {currentShiftWeek.map((day) => (
                  <TableCell key={day.date} className="text-center">
                    {Object.values(day.hours).reduce((sum, hours) => sum + hours, 0)} h
                  </TableCell>
                ))}
                <TableCell className="text-right">{getWeekTotalHours()} h</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
