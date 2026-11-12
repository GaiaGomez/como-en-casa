import { type PackageVariant, getPackageDetails } from "@/lib/package-details";
import { createServerSupabase } from "./server";

export type { PackageVariant };

export type CelebrationPackage = {
  id: string;
  slug: string;
  name: string;
  description: string;
  position: number;
  priceLabel: string;
  servingsLabel: string;
  variants: PackageVariant[];
  images: string[];
  includes: string[];
  conditions: string[];
};

type SupabasePackageRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  position: number;
};

// Static details win for all card content; DB provides identity fields only.
// Description prefers static copy; falls back to DB value when not set.
function mergePackage(
  id: string,
  slug: string,
  name: string,
  dbDescription: string,
  position: number,
): CelebrationPackage {
  const d = getPackageDetails(slug);
  return {
    id,
    slug,
    // El nombre comercial de package-details gana; si no hay, se usa el de la BD.
    name: d.name ?? name,
    description: d.description ?? dbDescription,
    position,
    priceLabel: d.priceLabel,
    servingsLabel: d.servingsLabel,
    variants: d.variants,
    images: d.images,
    includes: d.includes,
    conditions: d.conditions,
  };
}

// Respaldo si Supabase no está disponible. Mismo orden que la migración
// supabase/migrations/20261112_momentos.sql.
const FALLBACK_PACKAGES: CelebrationPackage[] = [
  mergePackage("1", "momento-de-celebracion",      "Momento de celebración",         "", 1),
  mergePackage("2", "momento-con-minicake",        "Momento con minicake",           "", 2),
  mergePackage("3", "pinta-tu-torta",              "Pinta tu torta",                 "", 3),
  mergePackage("4", "torta-de-corazon",            "Momento torta de corazón",       "", 4),
  mergePackage("5", "aniversario-corazon",         "Momento de aniversario",         "", 5),
  mergePackage("6", "momento-como-en-casa",        "Momento Como en Casa",           "", 6),
  mergePackage("7", "momento-felicidad-con-torta", "Momento de felicidad con torta", "", 7),
  mergePackage("8", "momento-de-felicidad",        "Momento de felicidad",           "", 8),
];

export async function getPackages(): Promise<CelebrationPackage[]> {
  const supabase = await createServerSupabase();
  if (!supabase) return FALLBACK_PACKAGES;

  const { data, error } = await supabase
    .from("celebration_packages")
    .select("id, slug, name, description, position")
    .eq("active", true)
    .order("position");

  if (error) {
    console.error("[getPackages] error:", error.message);
    return FALLBACK_PACKAGES;
  }
  if (!data || data.length === 0) return FALLBACK_PACKAGES;

  return (data as SupabasePackageRow[]).map((row) =>
    mergePackage(row.id, row.slug, row.name, row.description, row.position)
  );
}
