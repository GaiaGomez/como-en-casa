import Link from "next/link";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  getWeekTotalHours,
  tipWeeks,
} from "@/lib/mock-data";

export default function TipsPage() {
  return (
    <>
      <PageHeader
        title="Propinas"
        description="Historial mock de semanas calculadas con total de Fudo, horas trabajadas y estado de pago."
        action={
          <Button className="bg-[#6f4e37] hover:bg-[#5d412f]" asChild>
            <Link href="/admin/propinas/nueva">
              <Plus className="size-4" />
              Nueva propina
            </Link>
          </Button>
        }
      />

      <Card className="border-[#eadccb] bg-[#fffaf2]">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semana</TableHead>
                <TableHead>Total Fudo</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Pagos</TableHead>
                <TableHead className="text-right">Detalle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tipWeeks.map((week) => {
                const distribution = calculateTipDistribution(
                  week.totalTips,
                  week.payments
                );
                const paidCount = distribution.filter(
                  (item) => item.paymentStatus === "pagado"
                ).length;

                return (
                  <TableRow key={week.id}>
                    <TableCell className="font-medium">{week.label}</TableCell>
                    <TableCell>{formatCurrency(week.totalTips)}</TableCell>
                    <TableCell>{getWeekTotalHours()} h</TableCell>
                    <TableCell>
                      <Badge variant={week.status === "abierta" ? "outline" : "secondary"}>
                        {week.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {paidCount}/{distribution.length} pagados
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/propinas/${week.id}`}>Abrir</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
