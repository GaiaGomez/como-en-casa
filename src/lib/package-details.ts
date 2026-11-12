// Contenido comercial de cada momento (paquete de celebración).
// Indexado por slug. Es la fuente de verdad del contenido de las tarjetas públicas:
// la base de datos (celebration_packages) solo aporta id, slug, nombre base y orden.
// Si cambian precios, fotos o textos, se actualiza AQUÍ.

export type PackageVariant = {
  label: string;
  priceLabel: string;
};

export type PackageDetails = {
  /** Nombre comercial. Si existe, reemplaza el `name` que viene de la BD. */
  name?: string;
  description?: string;
  priceLabel: string;
  servingsLabel: string;
  variants: PackageVariant[];
  /** Rutas dentro de /public. La primera es la portada de la tarjeta. */
  images: string[];
  includes: string[];
  conditions: string[];
};

// Condiciones: cortas y en 2 líneas (antes eran 3 que repetían la idea de "nada de afuera").
const STANDARD_CONDITIONS = [
  "El consumo es de nuestra carta",
  "No se permiten alimentos, bebidas ni decoración de afuera",
];

const DEFAULT: PackageDetails = {
  priceLabel: "A consultar",
  servingsLabel: "",
  variants: [],
  images: [],
  includes: [],
  conditions: STANDARD_CONDITIONS,
};

// Genera ["/momentos/<prefijo>-1.jpg", …] para no escribir cada ruta a mano.
function photos(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `/momentos/${prefix}-${i + 1}.jpg`);
}

// Guía de copy: frases cortas, tono cercano, de "tú". Lo que ya dice la opción
// (porciones, precio) NO se repite en "Incluye" ni en la descripción.
const DETAILS: Record<string, PackageDetails> = {
  "momento-de-celebracion": {
    name: "Momento de celebración",
    description: "Llegas y la mesa ya está lista para celebrar. Tú solo pides de la carta y disfrutas.",
    priceLabel: "$40.000",
    servingsLabel: "",
    variants: [{ label: "Mesa decorada", priceLabel: "$40.000" }],
    images: photos("momento-celebracion", 9),
    includes: [
      "3 globos con helio del color que quieras",
      "Letrero de luces",
      "Tarjeta con foto, de regalo",
      "Vela de flor",
      "Postre de cumpleaños",
    ],
    conditions: STANDARD_CONDITIONS,
  },
  "momento-con-minicake": {
    name: "Momento con minicake",
    description: "Pequeñito pero con todo: un mini cake con nombre o foto y una mesa solo para ustedes.",
    priceLabel: "$65.000",
    servingsLabel: "Para 1 a 4 porciones",
    variants: [{ label: "1 a 4 porciones", priceLabel: "$65.000" }],
    images: photos("momento-minicake", 7),
    includes: [
      "Mini cake personalizado",
      "Mesa con tarjeta personalizada",
      "Globos y letrero",
      "Tarjeta con vela de flor",
    ],
    conditions: STANDARD_CONDITIONS,
  },
  "pinta-tu-torta": {
    name: "Pinta tu torta",
    description: "Te damos la torta, tú pones el arte. Ideal para un cumple, una cita o una tarde con amigos. Y te la llevas.",
    priceLabel: "Desde $45.000",
    servingsLabel: "",
    variants: [
      { label: "Solo la torta", priceLabel: "$45.000" },
      { label: "Con decoración de cumple", priceLabel: "$80.000" },
    ],
    images: photos("pinta-tu-torta", 3),
    includes: [
      "Torta de vainilla con frutos rojos y crema de chocolate blanco",
      "Pintura comestible, sprinkles y mini mariposas",
      "Blonda de madera y caja para llevar",
      "Con decoración: globos con helio y tarjeta de cumpleaños",
    ],
    conditions: ["Reserva con anticipación", "Sujeto a disponibilidad"],
  },
  "torta-de-corazon": {
    name: "Momento torta de corazón",
    description: "La torta que todos quieren en sus fotos, en el color que elijas y con la mesa lista.",
    priceLabel: "Desde $125.000",
    servingsLabel: "",
    variants: [
      { label: "1 a 6 porciones", priceLabel: "$125.000" },
      { label: "1 a 13 porciones", priceLabel: "$200.000" },
    ],
    images: photos("torta-corazon", 9),
    includes: [
      "Torta de corazón personalizada",
      "Platos y servilletas decorados",
      "Globos y letrero",
      "Tarjeta con foto",
      "Tarjeta con vela de flor",
    ],
    conditions: STANDARD_CONDITIONS,
  },
  "aniversario-corazon": {
    name: "Momento de aniversario",
    description: "Celebren su amor sin organizar nada. Nosotros ponemos la torta, la mesa y los detalles.",
    priceLabel: "Desde $125.000",
    servingsLabel: "",
    variants: [
      { label: "1 a 6 porciones", priceLabel: "$125.000" },
      { label: "1 a 13 porciones", priceLabel: "$200.000" },
    ],
    images: photos("aniversario-corazon", 4),
    includes: [
      "Torta de corazón",
      "Mesa con tarjeta personalizada",
      "Globos y letrero",
      "Tarjeta con vela de flor",
    ],
    conditions: STANDARD_CONDITIONS,
  },
  "momento-como-en-casa": {
    name: "Momento Como en Casa",
    description: "Nuestro plan más completo. Tú solo llegas, el resto corre por nuestra cuenta.",
    priceLabel: "Desde $130.000",
    servingsLabel: "",
    variants: [
      { label: "1 a 5 personas", priceLabel: "$130.000" },
      { label: "1 a 12 personas", priceLabel: "$220.000" },
    ],
    images: photos("momento-como-en-casa", 7),
    includes: [
      "Torta personalizada",
      "Platos y servilletas decorados",
      "Globos y letrero",
      "Tarjeta con foto",
      "Tarjeta con vela de flor",
    ],
    conditions: STANDARD_CONDITIONS,
  },
  "momento-felicidad-con-torta": {
    name: "Momento de felicidad con torta",
    description: "Escoge tu torta favorita y nosotros armamos la mesa. El precio va según la torta.",
    priceLabel: "Desde $125.000",
    servingsLabel: "",
    variants: [
      { label: "Chocolate · 10 a 15 porciones", priceLabel: "$125.000" },
      { label: "Red velvet · 10 a 15 porciones", priceLabel: "$125.000" },
      { label: "María Luisa · 10 a 15 porciones", priceLabel: "$125.000" },
      { label: "Zanahoria · 10 a 15 porciones", priceLabel: "$135.000" },
      { label: "Selva negra · 10 a 15 porciones", priceLabel: "$155.000" },
      { label: "Chocolate · 20 a 25 porciones", priceLabel: "$185.000" },
      { label: "Red velvet · 20 a 25 porciones", priceLabel: "$185.000" },
      { label: "María Luisa · 20 a 25 porciones", priceLabel: "$185.000" },
      { label: "Zanahoria · 20 a 25 porciones", priceLabel: "$190.000" },
      { label: "Selva negra · 20 a 25 porciones", priceLabel: "$198.000" },
    ],
    images: photos("felicidad-con-torta", 7),
    includes: [
      "Mesa decorada",
      "Tarjeta con foto, de regalo",
      "Tarjeta con vela de flor",
      "Red velvet y María Luisa: eliges crema o fruta al reservar",
    ],
    conditions: STANDARD_CONDITIONS,
  },
  "momento-de-felicidad": {
    name: "Momento de felicidad",
    description: "Para celebrar en grande con todo el parche: una torta rectangular que alcanza para todos.",
    priceLabel: "$210.000",
    servingsLabel: "Para 1 a 16 porciones",
    variants: [{ label: "1 a 16 porciones", priceLabel: "$210.000" }],
    images: photos("momento-felicidad", 7),
    includes: [
      "Torta rectangular personalizada",
      "Globos y letrero",
      "Tarjeta con foto",
      "Tarjeta con vela de flor",
    ],
    conditions: STANDARD_CONDITIONS,
  },
};

export function getPackageDetails(slug: string): PackageDetails {
  return DETAILS[slug] ?? DEFAULT;
}
