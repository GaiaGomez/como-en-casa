import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { employees, getEmployeeHours } from "@/lib/mock-data";

const roleLabels = {
  barista: "Barista",
  cocina: "Cocina",
  servicio: "Servicio",
  caja: "Caja",
};

export default function EmployeesPage() {
  return (
    <>
      <PageHeader
        title="Empleados"
        description="Equipo base usado para horarios y calculo de propinas del MVP."
      />
      <Card className="border-[#eadccb] bg-[#fffaf2]">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Turno base</TableHead>
                <TableHead>Horas semana</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{roleLabels[employee.role]}</TableCell>
                  <TableCell>{employee.phone}</TableCell>
                  <TableCell>{employee.baseShift}</TableCell>
                  <TableCell>{getEmployeeHours(employee.id)} h</TableCell>
                  <TableCell>
                    <Badge
                      variant={employee.status === "activo" ? "secondary" : "outline"}
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
