import { EmployeeShell } from "@/components/admin/employee-shell";

export default function EmpleadoLayout({ children }: { children: React.ReactNode }) {
  return <EmployeeShell>{children}</EmployeeShell>;
}
