import Link from "next/link";
import { Coffee, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#11100e] px-4 py-10 text-[#f7f1e8]">
      <Card className="w-full max-w-sm rounded-[2rem] border-white/10 bg-[#1b1814] shadow-2xl shadow-black/30">
        <CardHeader className="space-y-5">
          <div className="flex size-14 items-center justify-center rounded-3xl bg-[#d98b3a] text-[#17100b]">
            <Coffee className="size-5" />
          </div>
          <CardTitle className="text-4xl font-semibold tracking-tight text-white">
            Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#bdb6ae]">
              Correo
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue="duena@comoencasa.co"
              className="h-12 rounded-2xl border-white/10 bg-white/5 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#bdb6ae]">
              Clave
            </Label>
            <Input
              id="password"
              type="password"
              defaultValue="admin-demo"
              className="h-12 rounded-2xl border-white/10 bg-white/5 text-white"
            />
          </div>
          <Button
            className="h-12 w-full rounded-2xl bg-[#d98b3a] font-semibold text-[#17100b] hover:bg-[#eda24f]"
            asChild
          >
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
