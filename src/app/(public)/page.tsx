import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-neutral-900">Como en Casa</h1>
      <p className="mt-4 text-lg text-neutral-600">
        Un espacio para celebrar momentos que se sienten como en casa.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/momentos"
          className="inline-flex h-10 items-center rounded-[10px] bg-black px-5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Ver momentos
        </Link>
        <Link
          href="/reservar"
          className="inline-flex h-10 items-center rounded-[10px] border border-black/20 px-5 text-sm font-medium text-neutral-900 hover:border-black/40"
        >
          Reservar momento
        </Link>
      </div>
    </section>
  );
}
