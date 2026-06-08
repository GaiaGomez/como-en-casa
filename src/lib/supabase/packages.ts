import { getPackageDetails } from "@/lib/package-details";
import { createServerSupabase } from "./server";

export type CelebrationPackage = {
  id: string;
  slug: string;
  name: string;
  description: string;
  position: number;
  priceLabel: string;
  servingsLabel: string;
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

// Merge a DB row with static details. Static content wins for all card fields;
// description falls back to the DB value when no static description is set.
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
    name,
    description: d.description ?? dbDescription,
    position,
    priceLabel: d.priceLabel,
    servingsLabel: d.servingsLabel,
    includes: d.includes,
    conditions: d.conditions,
  };
}

const FALLBACK_PACKAGES: CelebrationPackage[] = [
  mergePackage("1", "momento-de-celebracion", "Momento de celebración",  "El momento perfecto para celebrar juntos.",                     1),
  mergePackage("2", "momento-de-felicidad",   "Momento de felicidad",    "Regala una experiencia llena de amor.",                         2),
  mergePackage("3", "momento-con-minicake",   "Momento con minicake",    "Una celebración dulce con minicake incluido.",                  3),
  mergePackage("4", "momento-como-en-casa",   "Momento Como en Casa",    "Nuestra experiencia más completa y especial.",                  4),
  mergePackage("5", "torta-de-corazon",       "Torta de corazón",        "Una torta en forma de corazón para los que amas.",              5),
  mergePackage("6", "aniversario-corazon",    "Aniversario corazón",     "Celebra tu amor con una experiencia única.",                    6),
  mergePackage("7", "pinta-tu-torta",         "Pinta tu torta",          "Una actividad especial: personaliza y decora tu propia torta.", 7),
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
