"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, LockKeyhole } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim();
    const password = formData.get("password") as string;

    if (email === "duena@comoencasa.co" && password === "admin-demo") {
      router.push("/admin");
    } else {
      setLoading(false);
      setError(true);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <div className="panel w-full max-w-sm p-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-black text-white mb-4">
          <Coffee className="size-5" />
        </div>
        <h1 className="text-2xl font-semibold text-black mb-6">Admin</h1>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-gray-600">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue="duena@comoencasa.co"
              className="h-9 w-full rounded-[10px] border border-black/15 bg-white px-3 text-sm text-black outline-none focus:border-black/40"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-medium text-gray-600">
              Clave
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              defaultValue="admin-demo"
              className="h-9 w-full rounded-[10px] border border-black/15 bg-white px-3 text-sm text-black outline-none focus:border-black/40"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">Correo o clave incorrectos.</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-[10px] bg-black text-sm font-semibold text-white disabled:opacity-50"
          >
            <LockKeyhole className="size-4" />
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
