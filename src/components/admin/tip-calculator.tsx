"use client";

import { useMemo, useState } from "react";
import { Calculator, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
      <Card className="rounded-[2rem] border-white/10 bg-[#1b1814]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#bdb6ae]">
            <Calculator className="size-4 text-[#d98b3a]" />
            Total de Fudo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="totalTips" className="text-[#bdb6ae]">
              Propinas
            </Label>
            <Input
              id="totalTips"
              type="number"
              min={0}
              step={1000}
              value={totalTips}
              onChange={(event) => setTotalTips(Number(event.target.value))}
              className="h-14 rounded-2xl border-white/10 bg-white/5 text-lg font-semibold text-white"
            />
          </div>

          <div className="grid gap-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-sm text-[#a8a09a]">Horas</p>
              <p className="mt-1 text-3xl font-semibold text-white">{totalHours} h</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <p className="text-sm text-[#a8a09a]">Reparto</p>
              <p className="mt-1 text-3xl font-semibold text-white">
                {formatCurrency(distributed)}
              </p>
            </div>
          </div>

          <Button className="h-12 w-full rounded-2xl bg-[#d98b3a] font-semibold text-[#17100b] hover:bg-[#eda24f]">
            <CheckCircle2 className="size-4" />
            Guardar
          </Button>
        </CardContent>
      </Card>

      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#1b1814]">
        <div className="grid grid-cols-[1.4fr_0.6fr_0.6fr_0.8fr_0.8fr] gap-3 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#bdb6ae] max-lg:hidden">
          <span>Persona</span>
          <span>Días</span>
          <span>Horas</span>
          <span className="text-right">Recibe</span>
          <span className="text-right">Pago</span>
        </div>
        <div className="divide-y divide-white/10">
          {distribution.map((item) => (
            <div
              key={item.employee.id}
              className="grid gap-3 px-4 py-4 lg:grid-cols-[1.4fr_0.6fr_0.6fr_0.8fr_0.8fr] lg:items-center"
            >
              <div>
                <p className="text-base font-semibold text-white">{item.employee.name}</p>
                <p className="text-sm text-[#a8a09a]">{item.employee.baseShift}</p>
              </div>
              <p className="text-sm text-white">
                <span className="text-[#a8a09a] lg:hidden">Días: </span>
                <span className="font-semibold">{item.daysWorked}</span>
              </p>
              <p className="text-sm text-white">
                <span className="text-[#a8a09a] lg:hidden">Horas: </span>
                <span className="font-semibold">{item.hours} h</span>
              </p>
              <p className="text-lg font-semibold text-white lg:text-right">
                {formatCurrency(item.amount)}
              </p>
              <div className="lg:text-right">
                <Badge className="rounded-full bg-[#3c2b11] text-[#ffbd63]">Pendiente</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
