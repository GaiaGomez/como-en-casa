// Static marketing content for each celebration package.
// Keyed by slug. This is the source of truth for all public card content.
// Update here when prices, descriptions, or details change.

export type PackageVariant = {
  label: string;
  priceLabel: string;
};

export type PackageDetails = {
  description?: string;
  priceLabel: string;
  servingsLabel: string;
  variants: PackageVariant[];
  includes: string[];
  conditions: string[];
};

const STANDARD_CONDITIONS = [
  "Se consume de la carta",
  "No se permite ingresar alimentos ni bebidas",
  "No se permite ingresar decoración externa",
];

const DEFAULT: PackageDetails = {
  priceLabel: "A consultar",
  servingsLabel: "",
  variants: [],
  includes: [],
  conditions: STANDARD_CONDITIONS,
};

const DETAILS: Record<string, PackageDetails> = {
  "momento-de-celebracion": {
    description: "Ideal para cumpleaños, aniversarios o fechas especiales rápidas.",
    priceLabel: "$40.000",
    servingsLabel: "",
    variants: [
      { label: "Valor", priceLabel: "$40.000" },
    ],
    includes: [
      "Espacio decorado para el momento",
      "Foto y tarjeta personalizada",
      "3 globos con helio en color personalizado",
      "Letrero decorativo",
      "Tarjeta de obsequio",
      "Vela de flor",
      "Postre de cumpleaños con vela volcán",
    ],
    conditions: STANDARD_CONDITIONS,
  },
  "momento-de-felicidad": {
    description: "Un momento completo con torta rectangular personalizada y decoración especial.",
    priceLabel: "$210.000",
    servingsLabel: "Para 16 porciones",
    variants: [
      { label: "Para 16 porciones", priceLabel: "$210.000" },
    ],
    includes: [
      "Torta rectangular decorada y personalizada",
      "Decoración con globos",
      "Letrero decorativo",
      "Tarjeta con foto personalizada",
      "Tarjeta con vela de flor",
    ],
    conditions: STANDARD_CONDITIONS,
  },
  "momento-con-minicake": {
    description: "Una opción pequeña y especial con mini cake personalizado.",
    priceLabel: "$65.000",
    servingsLabel: "Para 1 a 4 porciones",
    variants: [
      { label: "Para 1 a 4 porciones", priceLabel: "$65.000" },
    ],
    includes: [
      "Mini cake personalizado",
      "Espacio decorado para el momento",
      "Globos",
      "Letrero decorativo",
      "Tarjeta personalizada",
      "Tarjeta con vela de flor",
    ],
    conditions: STANDARD_CONDITIONS,
  },
  "momento-como-en-casa": {
    description: "Una experiencia completa para celebrar con torta personalizada y decoración.",
    priceLabel: "Desde $130.000",
    servingsLabel: "",
    variants: [
      { label: "Para 1 a 5 personas", priceLabel: "$130.000" },
      { label: "Para 1 a 12 personas", priceLabel: "$220.000" },
    ],
    includes: [
      "Torta decorada y personalizada",
      "Servilletas y platos decorados para la torta",
      "Espacio decorado con globos",
      "Letrero decorativo",
      "Tarjeta con foto personalizada",
      "Tarjeta con vela de flor",
    ],
    conditions: STANDARD_CONDITIONS,
  },
  "torta-de-corazon": {
    description: "Momento especial con torta de corazón decorada y personalizada.",
    priceLabel: "Desde $125.000",
    servingsLabel: "",
    variants: [
      { label: "Para 1 a 6 porciones", priceLabel: "$125.000" },
      { label: "Para 1 a 13 porciones", priceLabel: "$200.000" },
    ],
    includes: [
      "Torta de corazón decorada y personalizada",
      "Servilletas y platos decorados para la torta",
      "Espacio decorado con globos",
      "Letrero decorativo",
      "Tarjeta con foto personalizada",
      "Tarjeta con vela de flor",
    ],
    conditions: STANDARD_CONDITIONS,
  },
  "aniversario-corazon": {
    description: "Una experiencia romántica con torta de corazón y decoración de aniversario.",
    priceLabel: "Desde $125.000",
    servingsLabel: "",
    variants: [
      { label: "Para 1 a 6 porciones", priceLabel: "$125.000" },
      { label: "Para 1 a 13 porciones", priceLabel: "$200.000" },
    ],
    includes: [
      "Torta de corazón decorada",
      "Decoración romántica para aniversario",
      "Globos y letrero decorativo",
      "Tarjeta personalizada",
      "Tarjeta con vela de flor",
    ],
    conditions: STANDARD_CONDITIONS,
  },
  "pinta-tu-torta": {
    description: "Una experiencia creativa para pintar y decorar tu propia torta.",
    priceLabel: "Desde $45.000",
    servingsLabel: "",
    variants: [
      { label: "Torta sola", priceLabel: "$45.000" },
      { label: "Experiencia completa", priceLabel: "$80.000" },
    ],
    includes: [
      "Torta sabor vainilla con relleno de frutos rojos y crema de chocolate blanco",
      "Pintura comestible",
      "Sprinkles para decorar",
      "Mini mariposas comestibles",
      "Blonda de madera",
      "Caja para llevar",
      "Decoración con globos de helio y tarjeta de cumpleaños (solo experiencia completa)",
    ],
    conditions: [
      "Reserva tu experiencia",
      "Sujeto a disponibilidad",
    ],
  },
};

export function getPackageDetails(slug: string): PackageDetails {
  return DETAILS[slug] ?? DEFAULT;
}
