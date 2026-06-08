// Static rich content for each celebration package.
// Keyed by slug to match celebration_packages.slug in the DB.
// Update prices and details here when they change.

export type PackageDetails = {
  priceLabel: string;
  servingsLabel: string;
  includes: string[];
  conditions: string[];
};

const DEFAULT: PackageDetails = {
  priceLabel: "A consultar",
  servingsLabel: "",
  includes: [],
  conditions: [
    "Reserva con mínimo 48 horas de anticipación",
    "Sujeto a disponibilidad",
  ],
};

const DETAILS: Record<string, PackageDetails> = {
  "momento-de-celebracion": {
    priceLabel: "A consultar",
    servingsLabel: "Para 6 a 10 personas",
    includes: [
      "Decoración del espacio al estilo de la ocasión",
      "Torta personalizada",
      "Globos y detalles de celebración",
      "Atención personalizada durante el momento",
    ],
    conditions: [
      "Reserva con mínimo 48 horas de anticipación",
      "El diseño de la torta se confirma al reservar",
      "Sujeto a disponibilidad",
    ],
  },
  "momento-de-felicidad": {
    priceLabel: "A consultar",
    servingsLabel: "Para 4 a 8 personas",
    includes: [
      "Decoración especial del espacio",
      "Torta de celebración",
      "Detalles sorpresa para el homenajeado",
      "Atención personalizada durante el momento",
    ],
    conditions: [
      "Reserva con mínimo 48 horas de anticipación",
      "El mensaje de la tarjeta se confirma al reservar",
      "Sujeto a disponibilidad",
    ],
  },
  "momento-con-minicake": {
    priceLabel: "A consultar",
    servingsLabel: "Para 1 a 4 personas",
    includes: [
      "Minicake personalizado",
      "Decoración del espacio",
      "Detalles de celebración",
      "Atención personalizada",
    ],
    conditions: [
      "Reserva con mínimo 24 horas de anticipación",
      "El diseño del minicake se confirma al reservar",
      "Sujeto a disponibilidad",
    ],
  },
  "momento-como-en-casa": {
    priceLabel: "A consultar",
    servingsLabel: "Para 8 a 15 personas",
    includes: [
      "Decoración completa del espacio",
      "Torta personalizada de gran formato",
      "Globos, flores y detalles",
      "Servicio de mesero dedicado",
      "Coordinación y atención personalizada del momento",
    ],
    conditions: [
      "Reserva con mínimo 72 horas de anticipación",
      "Todos los detalles se coordinan antes del evento",
      "Sujeto a disponibilidad",
    ],
  },
  "torta-de-corazon": {
    priceLabel: "A consultar",
    servingsLabel: "De 10 a 15 porciones",
    includes: [
      "Torta en forma de corazón con diseño personalizado",
      "Decoración del espacio",
      "Atención personalizada",
    ],
    conditions: [
      "Reserva con mínimo 48 horas de anticipación",
      "El diseño debe confirmarse al reservar",
      "Sujeto a disponibilidad",
    ],
  },
  "aniversario-corazon": {
    priceLabel: "A consultar",
    servingsLabel: "Para 2 a 6 personas",
    includes: [
      "Decoración romántica del espacio",
      "Torta de corazón personalizada",
      "Detalles especiales para la pareja",
      "Atención personalizada",
    ],
    conditions: [
      "Reserva con mínimo 48 horas de anticipación",
      "El mensaje y diseño se confirman al reservar",
      "Sujeto a disponibilidad",
    ],
  },
  "pinta-tu-torta": {
    priceLabel: "A consultar",
    servingsLabel: "Para 2 a 8 personas",
    includes: [
      "Torta base lista para decorar",
      "Kit de colores comestibles",
      "Utensilios de decoración",
      "Guía y acompañamiento durante la experiencia",
      "Atención personalizada",
    ],
    conditions: [
      "La experiencia dura aproximadamente 60-90 minutos",
      "Reserva con mínimo 24 horas de anticipación",
      "Disponible para grupos de hasta 8 personas",
    ],
  },
};

export function getPackageDetails(slug: string): PackageDetails {
  return DETAILS[slug] ?? DEFAULT;
}
