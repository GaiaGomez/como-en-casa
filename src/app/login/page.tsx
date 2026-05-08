import Link from "next/link";
import { Coffee, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f3ea] px-4 py-10 text-[#2c2118]">
      <Card className="w-full max-w-sm border-[#eadccb] bg-[#fffaf2] shadow-sm">
        <CardHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-lg bg-[#6f4e37] text-white">
            <Coffee className="size-5" />
          </div>
          <CardTitle className="text-xl">Como en Casa Admin</CardTitle>
          <p className="text-sm leading-6 text-[#6f5a47]">
            Entrada interna para revisar turnos y repartir propinas semanales.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input id="email" type="email" defaultValue="duena@comoencasa.co" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contrasena</Label>
            <Input id="password" type="password" defaultValue="admin-demo" />
          </div>
          <Button className="w-full bg-[#6f4e37] hover:bg-[#5d412f]" asChild>
            <Link href="/admin">
              <LockKeyhole className="size-4" />
              Entrar
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
