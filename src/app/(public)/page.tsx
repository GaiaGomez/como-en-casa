import Link from "next/link";
import { Clock, MapPin, AtSign, MessageCircle } from "lucide-react";

const LINA_WHATSAPP = process.env.NEXT_PUBLIC_LINA_WHATSAPP_NUMBER ?? "TODO_AGREGAR_NUMERO";

const SCHEDULE = [
  { day: "Lunes a jueves", hours: "4:30 p.m. – 9:00 p.m." },
  { day: "Viernes", hours: "4:30 p.m. – 10:00 p.m." },
  { day: "Sábado", hours: "11:00 a.m. – 10:00 p.m." },
  { day: "Domingos y festivos", hours: "3:00 p.m. – 10:00 p.m." },
];

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Carrera+49+%2354-47+Bello+Antioquia";

export default function HomePage() {
  const whatsappUrl = `https://wa.me/${LINA_WHATSAPP}`;

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-12">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
          Como en Casa
        </h1>
        <p className="mt-2 text-lg font-medium text-neutral-500">
          Café y repostería fina en Bello.
        </p>
        <p className="mt-4 max-w-md text-base text-neutral-600">
          Un lugar para celebrar, compartir algo dulce y disfrutar momentos especiales.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/momentos"
            className="inline-flex h-11 items-center rounded-xl bg-neutral-950 px-6 text-sm font-medium text-white hover:bg-neutral-800 active:bg-neutral-900"
          >
            Ver momentos
          </Link>
          <Link
            href="/carta"
            className="inline-flex h-11 items-center rounded-xl border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-900 hover:border-neutral-400"
          >
            Ver carta
          </Link>
        </div>
      </section>

      {/* Quick cards */}
      <section>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
          ¿Qué quieres hacer?
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/momentos"
            className="flex flex-col gap-2 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-2xl">🎉</span>
            <span className="text-sm font-semibold text-neutral-900">Momentos especiales</span>
            <span className="text-xs text-neutral-500">
              Celebra cumpleaños, aniversarios y más con decoración y torta personalizada.
            </span>
          </Link>
          <Link
            href="/carta"
            className="flex flex-col gap-2 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-2xl">☕</span>
            <span className="text-sm font-semibold text-neutral-900">Nuestra carta</span>
            <span className="text-xs text-neutral-500">
              Cafés, postres, bebidas y opciones para compartir.
            </span>
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-2 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-2xl">💬</span>
            <span className="text-sm font-semibold text-neutral-900">Escríbenos</span>
            <span className="text-xs text-neutral-500">
              Cuéntanos qué necesitas por WhatsApp.
            </span>
          </a>
        </div>
      </section>

      {/* Horarios + dirección */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Clock className="size-4 text-neutral-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Horarios
            </p>
          </div>
          <ul className="space-y-3">
            {SCHEDULE.map((s) => (
              <li key={s.day} className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-neutral-900">{s.day}</span>
                <span className="text-xs text-neutral-500">{s.hours}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="size-4 text-neutral-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
              Dónde estamos
            </p>
          </div>
          <p className="text-sm font-medium text-neutral-900">Carrera 49 # 54-47</p>
          <p className="text-sm text-neutral-500">Bello, Antioquia</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <AtSign className="size-3.5 shrink-0" />
              <span>@como.encasa21</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <MessageCircle className="size-3.5 shrink-0" />
              <span>304 137 5361</span>
            </div>
          </div>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-9 items-center rounded-xl bg-neutral-950 px-4 text-xs font-medium text-white hover:bg-neutral-800 active:bg-neutral-900"
          >
            Abrir en Google Maps
          </a>
        </div>
      </section>
    </div>
  );
}
