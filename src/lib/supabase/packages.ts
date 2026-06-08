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

const FALLBACK_PACKAGES: CelebrationPackage[] = [
  { id: "1", slug: "momento-de-celebracion", name: "Momento de celebración",  description: "El momento perfecto para celebrar juntos.",                     position: 1, ...getPackageDetails("momento-de-celebracion") },
  { id: "2", slug: "momento-de-felicidad",   name: "Momento de felicidad",    description: "Regala una experiencia llena de amor.",                         position: 2, ...getPackageDetails("momento-de-felicidad") },
  { id: "3", slug: "momento-con-minicake",   name: "Momento con minicake",    description: "Una celebración dulce con minicake incluido.",                  position: 3, ...getPackageDetails("momento-con-minicake") },
  { id: "4", slug: "momento-como-en-casa",   name: "Momento Como en Casa",    description: "Nuestra experiencia más completa y especial.",                  position: 4, ...getPackageDetails("momento-como-en-casa") },
  { id: "5", slug: "torta-de-corazon",       name: "Torta de corazón",        description: "Una torta en forma de corazón para los que amas.",              position: 5, ...getPackageDetails("torta-de-corazon") },
  { id: "6", slug: "aniversario-corazon",    name: "Aniversario corazón",     description: "Celebra tu amor con una experiencia única.",                    position: 6, ...getPackageDetails("aniversario-corazon") },
  { id: "7", slug: "pinta-tu-torta",         name: "Pinta tu torta",          description: "Una actividad especial: personaliza y decora tu propia torta.", position: 7, ...getPackageDetails("pinta-tu-torta") },
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

  return (data as SupabasePackageRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    position: row.position,
    ...getPackageDetails(row.slug),
  }));
}
