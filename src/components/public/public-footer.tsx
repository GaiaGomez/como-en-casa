import Link from "next/link";

import { ADDRESS, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/public-info";
import { LogoFull, SocialLinks } from "./decor";

/**
 * Footer público: cierra todas las páginas con la marca en grande
 * y los datos de contacto que ya existían en el home.
 */
export function PublicFooter() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-cec-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-[auto_1fr_auto] sm:items-end sm:px-6 lg:px-8">
        <LogoFull spin className="size-40 text-white sm:size-48" />

        <div className="space-y-1 text-sm text-white/75">
          <p className="cec-display pb-3 text-2xl text-white">Te esperamos con el café listo.</p>
          <p className="font-medium text-white">{ADDRESS.line1}</p>
          <p>{ADDRESS.line2}</p>
          <SocialLinks instagramUrl={INSTAGRAM_URL} whatsappUrl={WHATSAPP_URL} tone="light" className="pt-4" />
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
          {[
            { href: "/momentos", label: "Momentos" },
            { href: "/carta", label: "Carta" },
            { href: "/tienda", label: "Tienda" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-neutral-300">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
