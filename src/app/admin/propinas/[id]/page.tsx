import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  calculateTipDistribution,
  formatCurrency,
  getTipWeek,
  getWeekTotalHours,
  tipWeeks,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return tipWeeks.map((week) => ({ id: week.id }));
}

export default async function TipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const week = getTipWeek(id);

  if (!week) {
    notFound();
  }

  const distribution = calculateTipDistribution(week.totalTips, week.payments);
  const paidCount = distribution.filter(
    (item) => item.paymentStatus === "pagado"
  ).length;

  return (
    <>
      <PageHeader
        title={week.label}
        description={`${week.startDate} a ${week.endDate}. Reparto calculado desde las horas registradas en horarios mock.`}
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/propinas">Volver</Link>
          </Button>
        }
      />

      <section className="mb-4 grid gap-4 md:grid-cols-3">
        <Card className="border-[#eadccb] bg-[#fffaf2]">
          <CardHeader>
            <CardTitle>Total Fudo</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatCurrency(week.totalTips)}
          </CardContent>
        </Card>
        <Card className="border-[#eadccb] bg-[#fffaf2]">
          <CardHeader>
            <CardTitle>Horas repartidas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {getWeekTotalHours()} h
          </CardContent>
        </Card>
        <Card className="border-[#eadccb] bg-[#fffaf2]">
          <CardHeader>
            <CardTitle>Estado</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Badge variant={week.status === "abierta" ? "outline" : "secondary"}>
              {week.status}
            </Badge>
            <span className="text-sm text-[#6f5a47]">
              {paidCount}/{distribution.length} pagados
            </span>
          </CardContent>
        </Card>
      </section>

      <Card className="border-[#eadccb] bg-[#fffaf2]">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Dias trabajados</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead className="text-right">Propina</TableHead>
                <TableHead>Pago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distribution.map((item) => (
                <TableRow key={item.employee.id}>
                  <TableCell className="font-medium">{item.employee.name}</TableCell>
                  <TableCell>{item.daysWorked}</TableCell>
                  <TableCell>{item.hours} h</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(item.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.paymentStatus === "pagado" ? "secondary" : "outline"}
                    >
                      {item.paymentStatus}
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
