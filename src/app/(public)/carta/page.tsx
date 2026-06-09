const CATEGORIES = [
  {
    emoji: "☕",
    name: "Café",
    description: "Espressos, lattes, capuchinos y más.",
  },
  {
    emoji: "🍰",
    name: "Repostería",
    description: "Tortas, cupcakes y postres artesanales.",
  },
  {
    emoji: "🍮",
    name: "Postres",
    description: "Opciones dulces para cualquier momento.",
  },
  {
    emoji: "🥤",
    name: "Bebidas",
    description: "Fríos, calientes y especiales de temporada.",
  },
];

export default function CartaPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Nuestra carta
        </h1>
        <p className="mt-2 text-base text-neutral-500">
          Explora nuestros cafés, postres y opciones para compartir.
        </p>
      </section>

      {/* Category cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <span className="text-2xl">{cat.emoji}</span>
            <h2 className="mt-3 text-base font-semibold text-neutral-900">{cat.name}</h2>
            <p className="mt-1 text-sm text-neutral-500">{cat.description}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-neutral-400">
        Carta sujeta a disponibilidad.
      </p>
    </div>
  );
}
