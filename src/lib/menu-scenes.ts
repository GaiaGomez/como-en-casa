// ─────────────────────────────────────────────────────────────
// Escenas de la carta web: cada escena es una pantalla con una foto
// de fondo (las mismas de la carta impresa) y una o varias secciones
// de menu-data.ts encima.
//
// Las fotos viven en /public/carta/fondos/:
//   {id}.jpg          → foto completa (vertical, 1000×1500)
//   {id}-piedra.jpg   → la misma foto con los platos borrados digitalmente;
//                       se estira por toda la pantalla para que la piedra
//                       "continúe" y la foto parezca una sola gigante.
//
// textPos/freeY/photoSide se calcularon midiendo dónde están los platos
// en cada foto (para no poner nunca texto encima de la comida):
//   textPos "bottom" → los platos están arriba: en móvil la foto va arriba
//                      y el texto empieza en freeY (fracción del alto).
//   textPos "top"    → los platos están abajo: en móvil el texto va primero
//                      y la foto cierra la escena.
//   photoSide        → en desktop, de qué lado de la pantalla va la foto.
// ─────────────────────────────────────────────────────────────

export type MenuScene = {
  id: string;
  /** ids de MENU que se muestran en esta escena, en orden. */
  sections: string[];
  /** Frase pequeña sobre el título. */
  kicker: string;
  textPos: "top" | "bottom";
  freeY: number;
  photoSide: "left" | "right";
  /** La foto tiene platos arriba Y abajo: se centra con un fundido suave en ambos extremos. */
  centered?: boolean;
  /** Escena oscura (texto claro), p. ej. licores. */
  dark?: boolean;
};

export const SCENES: MenuScene[] = [
  {
    id: "para-picar",
    sections: ["para-picar"],
    kicker: "Para compartir en la mesa",
    textPos: "bottom",
    freeY: 0.596,
    photoSide: "right",
  },
  {
    id: "brunch",
    sections: ["brunch"],
    kicker: "Para empezar el día",
    textPos: "top",
    freeY: 0.12,
    centered: true,
    photoSide: "right",
  },
  {
    id: "reposteria",
    sections: ["reposteria"],
    kicker: "Hecha en casa",
    textPos: "top",
    freeY: 0.381,
    photoSide: "right",
  },
  {
    id: "parrilla",
    sections: ["parrilla", "recomendados"],
    kicker: "Del fuego a la mesa",
    textPos: "bottom",
    freeY: 0.515,
    photoSide: "right",
  },
  {
    id: "especiales",
    sections: ["especiales"],
    kicker: "Lo de siempre, como en casa",
    textPos: "top",
    freeY: 0.12,
    centered: true,
    photoSide: "left",
  },
  {
    id: "bowls",
    sections: ["bowls", "papas"],
    kicker: "Para todos los antojos",
    textPos: "top",
    freeY: 0.12,
    centered: true,
    photoSide: "right",
  },
  {
    id: "hamburguesas",
    sections: ["hamburguesas"],
    kicker: "Todas acompañadas de papas",
    textPos: "top",
    freeY: 0.12,
    centered: true,
    photoSide: "right",
  },
  {
    id: "vegetariano",
    sections: ["vegetariano"],
    kicker: "Proteínas vegetales hechas en casa",
    textPos: "top",
    freeY: 0.12,
    centered: true,
    photoSide: "right",
  },
  {
    id: "barista",
    sections: ["barista"],
    kicker: "Café de especialidad",
    textPos: "top",
    freeY: 0.525,
    photoSide: "right",
  },
  {
    id: "cafe-frio",
    sections: ["cafe-frio", "otras-bebidas"],
    kicker: "Para los días de calor",
    textPos: "top",
    freeY: 0.47,
    photoSide: "right",
  },
  {
    id: "hora-del-te",
    sections: ["hora-del-te"],
    kicker: "Una pausa con calma",
    textPos: "top",
    freeY: 0.629,
    photoSide: "right",
  },
  {
    id: "bebidas-frias",
    sections: ["bebidas-frias"],
    kicker: "Para refrescarse",
    textPos: "top",
    freeY: 0.374,
    photoSide: "right",
  },
  {
    id: "con-licor",
    sections: ["con-licor"],
    kicker: "Para brindar",
    textPos: "top",
    freeY: 0.431,
    photoSide: "right",
    dark: true,
  },
];

export const sceneImage = (id: string) => `/carta/fondos/${id}.jpg`;
export const sceneStone = (id: string) => `/carta/fondos/${id}-piedra.jpg`;
