import Link from "next/link";

import type { CelebrationPackage } from "@/lib/supabase/packages";

export function PackageCard({ pkg }: { pkg: CelebrationPackage }) {
  return (
    <div className="flex flex-col justify-between rounded-[20px] border border-black/10 bg-white p-5">
      <div>
        <h2 className="text-base font-semibold text-neutral-900">{pkg.name}</h2>
        <p className="mt-1.5 text-sm text-neutral-500">{pkg.description}</p>
      </div>
      <Link
        href={`/reservar?momento=${pkg.slug}`}
        className="mt-5 inline-flex h-9 items-center justify-center rounded-[10px] bg-black px-4 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Reservar momento
      </Link>
    </div>
  );
}
