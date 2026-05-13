"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, LockKeyhole } from "lucide-react";

import { signIn } from "@/lib/supabase/auth-browser";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;

    const { data, error: authError } = await signIn(email, password);

    if (authError || !data?.user) {
      setLoading(false);
      setError(true);
      return;
    }

    const role = data.user.user_metadata?.role ?? "employee";
    router.push(role === "admin" ? "/admin" : "/empleado");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="panel w-full max-w-sm p-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-black text-white mb-4">
          <Coffee className="size-5" />
        </div>
        <h1 className="mb-6 text-base font-medium text-neutral-900">Admin</h1>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="h-10 w-full rounded-[10px] border border-black/15 bg-white px-3 text-base font-normal text-neutral-900 outline-none focus:border-black/40"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Clave
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="h-10 w-full rounded-[10px] border border-black/15 bg-white px-3 text-base font-normal text-neutral-900 outline-none focus:border-black/40"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">Correo o clave incorrectos.</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-[10px] bg-black text-sm font-medium text-white disabled:opacity-50"
          >
            <LockKeyhole className="size-4" />
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
