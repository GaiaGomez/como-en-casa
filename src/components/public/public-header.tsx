import Link from "next/link";

const navLinks = [
  { href: "/momentos", label: "Momentos" },
  { href: "/reservar", label: "Reservar" },
  { href: "/tienda", label: "Tienda" },
];

export function PublicHeader() {
  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-base font-semibold text-neutral-900">
          Como en Casa
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
