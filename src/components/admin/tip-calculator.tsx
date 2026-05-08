"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/lib/mock-data";

export function TipCalculator() {
  const [totalTips, setTotalTips] = useState(1280000);
  const distribution = useMemo(
    () => calculateTipDistribution(totalTips),
    [totalTips]
  );
  const totalHours = getWeekTotalHours();
  const distributed = distribution.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card className="border-[#eadccb] bg-[#fffaf2]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="size-5 text-[#9a6b3f]" />
            Total de Fudo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totalTips">Propinas semanales</Label>
            <Input
              id="totalTips"
              type="number"
              min={0}
              step={1000}
              value={totalTips}
              onChange={(event) => setTotalTips(Number(event.target.value))}
              className="h-10 bg-white"
            />
          </div>
          <div className="rounded-lg border border-[#eadccb] bg-white/70 p-3">
            <p className="text-sm text-[#6f5a47]">Horas trabajadas</p>
            <p className="mt-1 text-2xl font-semibold">{totalHours} h</p>
          </div>
          <div className="rounded-lg border border-[#eadccb] bg-white/70 p-3">
            <p className="text-sm text-[#6f5a47]">Total distribuido</p>
            <p className="mt-1 text-2xl font-semibold">
              {formatCurrency(distributed)}
            </p>
          </div>
          <p className="text-sm leading-6 text-[#6f5a47]">
            El reparto se calcula proporcional a las horas de la semana mock.
            Los valores se redondean a centenas para que sea facil pagar en caja.
          </p>
        </CardContent>
      </Card>

      <Card className="border-[#eadccb] bg-[#fffaf2]">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Dias</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead className="text-right">Valor</TableHead>
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
                    <Badge variant="outline">pendiente</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
