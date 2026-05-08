import { notFound } from "next/navigation";

import { getTipWeek, tipWeeks } from "@/lib/mock-data";
import { TipDetailClient } from "./client";

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

  return <TipDetailClient week={week} />;
}
