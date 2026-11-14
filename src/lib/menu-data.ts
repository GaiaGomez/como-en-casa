// ─────────────────────────────────────────────────────────────
// Carta de Como en Casa (2026) — fuente única de datos de /carta.
// Transcrita del PDF "Menú 2026 — Como en Casa".
// Para cambiar un precio o un plato, se edita SOLO este archivo.
// ─────────────────────────────────────────────────────────────

export type MenuOption = { name: string; description: string };

export type MenuItem = {
  name: string;
  /** Precio formateado tal cual se muestra ("$19.900"). Opcional en ítems informativos. */
  price?: string;
  description?: string;
  /** Dato corto que va al lado del nombre en gris ("6 und.", "con helado $14.500"). */
  detail?: string;
  /** Variantes con su propia descripción (ej. tipos de bruschetta). */
  options?: MenuOption[];
};

/** Tabla de precios con varias columnas (ej. 1 taza / 2 tazas). */
export type MenuTable = {
  columns: string[];
  rows: { name: string; prices: string[] }[];
};

export type MenuGroup = {
  /** Subtítulo pequeño dentro de la sección ("Tortas", "Macarons"). */
  title?: string;
  /** Texto que aplica a todo el grupo ("Huevos fritos en cazuela…"). */
  note?: string;
  items?: MenuItem[];
  table?: MenuTable;
};

export type MenuKind = "comer" | "beber";

export type MenuSection = {
  /** Se usa como ancla en la URL (/carta#hamburguesas). */
  id: string;
  title: string;
  kind: MenuKind;
  /** Foto en /public/carta. Si no hay, la tarjeta va solo con el título. */
  image?: string;
  /** Clase de color pastel de la tarjeta. */
  accent: string;
  /** Nota que aplica a toda la sección ("Acompañadas de papas"). */
  note?: string;
  groups: MenuGroup[];
  /** Notas al final de la sección. */
  footnotes?: string[];
};

const STD = "Servidos con papas a la francesa, arepa con queso, lechuga, guacamole y pico de gallo.";

export const MENU_PDF_URL = "/carta/carta-como-en-casa-2026.pdf";

export const MENU: MenuSection[] = [
  // ═══════════════════════════ COMER ═══════════════════════════
  {
    id: "para-picar",
    title: "Para picar",
    kind: "comer",
    image: "/carta/para-picar.jpg",
    accent: "bg-cec-blush",
    groups: [
      {
        items: [
          {
            name: "Bruschettas",
            price: "$19.900",
            description: "Base de pan crujiente con toppings a tu elección:",
            options: [
              {
                name: "Variadas",
                description:
                  "guacamole y queso · pasta de tomate y parmesano · confitura de fruta · queso crema y jamón",
              },
              { name: "Mexicana", description: "maicitos con queso" },
              { name: "Argentina", description: "chimichurri de la casa y queso parmesano" },
              { name: "Mediterránea", description: "pasta de tomate y queso parmesano" },
            ],
          },
          { name: "Empanaditas", detail: "6 und.", price: "$13.000" },
          { name: "Palitos de queso", detail: "6 und.", price: "$13.000" },
          {
            name: "Tabla de charcutería",
            price: "$35.000",
            description: "Jamón, cábano, queso mozzarella, chimichurri y tostadas finas hierbas.",
          },
          { name: "Albóndigas napolitanas", price: "$24.000" },
          { name: "Ceviche de chorizo", price: "$25.000" },
          { name: "Croissant de mantequilla", price: "$8.500" },
        ],
      },
    ],
  },
  {
    id: "brunch",
    title: "Brunch",
    kind: "comer",
    image: "/carta/brunch.jpg",
    accent: "bg-cec-sky",
    groups: [
      {
        title: "Omelettes",
        note: "Tortilla de huevos batidos, acompañada de pan tostado, mermelada y fruta.",
        items: [
          { name: "Hawaiano", price: "$24.000", description: "Jamón, piña y queso mozzarella." },
          { name: "Veracruzano", price: "$24.000", description: "Tocineta, maicitos, jamón y queso mozzarella." },
          {
            name: "Del rancho",
            price: "$26.000",
            description: "Salchicha ranchera, tocineta, cebolla caramelizada y queso mozzarella.",
          },
        ],
      },
      {
        title: "Cazuelitas de huevo",
        note: "Huevos fritos en cazuela, acompañados de pan tostado.",
        items: [
          {
            name: "Amanecer mediterráneo",
            price: "$29.900",
            description: "Jamón serrano, tomate, queso mozzarella y guacamole.",
          },
          {
            name: "Amanecer mexicano",
            price: "$29.900",
            description: "Carne molida, pico de gallo, maicitos, chips de tortilla y guacamole.",
          },
        ],
      },
      {
        title: "Croissants",
        items: [
          { name: "Americano", price: "$18.000", description: "Huevo, tocineta, queso, lechuga y pasta de tomate." },
          {
            name: "Serrano",
            price: "$20.000",
            description: "Jamón serrano, tomate, lechuga, pasta de tomate y queso crema.",
          },
          { name: "Francés", price: "$21.000", description: "Helado de vainilla, almendras, nueces y arequipe." },
        ],
      },
      {
        title: "Waffles",
        items: [
          { name: "Arándanos, helado de frutos rojos, mermelada de fresas y moras", price: "$22.000" },
          { name: "Brevas, queso, helado de vainilla y salsa de caramelo", price: "$22.000" },
          { name: "Pan de yuca con helado de vainilla, bocadillo y queso", price: "$24.000" },
          { name: "Pan de yuca con huevo, tocineta y guacamole", price: "$27.000" },
        ],
      },
    ],
  },
  {
    id: "reposteria",
    title: "Repostería",
    kind: "comer",
    image: "/carta/reposteria.jpg",
    accent: "bg-cec-lilac",
    groups: [
      {
        title: "Tortas",
        items: [
          { name: "Envinada", price: "$13.500" },
          { name: "Cheesecake", price: "$14.500" },
          { name: "Zanahoria", price: "$14.500" },
          { name: "Red Velvet", price: "$14.500" },
          { name: "Chocolate", price: "$14.500" },
          { name: "Tarta", price: "$18.000" },
        ],
      },
      {
        title: "Macarons",
        items: [
          { name: "Unidad", price: "$5.500" },
          { name: "A partir de 4 unidades", detail: "c/u", price: "$4.600" },
          { name: "Caja para llevar", price: "$33.000" },
        ],
      },
      {
        title: "Más dulce",
        items: [
          { name: "Tostadas francesas", price: "$23.000", description: "Con crema de avellanas y fruta." },
          { name: "Galleta", detail: "con helado $14.500", price: "$11.000" },
          { name: "Brownie", detail: "con helado $15.500", price: "$11.000" },
        ],
      },
    ],
  },
  {
    id: "parrilla",
    title: "Parrilla",
    kind: "comer",
    image: "/carta/parrilla.jpg",
    accent: "bg-cec-sage",
    note: STD,
    groups: [
      {
        items: [
          { name: "Pollo a la plancha", price: "$34.000" },
          { name: "Solomo redondo", price: "$37.000" },
          { name: "Punta de anca", price: "$39.000" },
          { name: "Churrasco", price: "$39.000" },
          { name: "Chuleta", price: "$37.000" },
          { name: "Lomito de cerdo en salsa de frutos del bosque y tocineta", price: "$54.000" },
          {
            name: "Salteado",
            price: "$34.000",
            description:
              "Pimentón y cebolla salteados, acompañado de pan brioche y queso derretido. Con tu elección: res o pollo.",
          },
        ],
      },
    ],
  },
  {
    id: "recomendados",
    title: "Recomendados",
    kind: "comer",
    image: "/carta/recomendados.jpg",
    accent: "bg-cec-blush",
    groups: [
      {
        items: [
          {
            name: "Fajitas",
            price: "$36.000",
            description:
              "3 tortillas de maíz, vegetales, queso mozzarella derretido, guacamole, pico de gallo, crema agria y salsa de la casa. Con tu elección: res o pollo.",
          },
          {
            name: "Choripán",
            price: "$23.000",
            description: "Chorizo santarrosano en pan brioche, acompañado de chimichurri y queso mozzarella.",
          },
          {
            name: "Nachos de la casa",
            price: "$33.000",
            description:
              "Carne molida, chips de tortilla, pico de gallo, salsa de la casa, guacamole, frijoles caraotas, queso y chorizo.",
          },
          {
            name: "Nachos",
            price: "$25.000",
            description: "Carne molida, chips de tortilla, pico de gallo, salsa de la casa y guacamole.",
          },
          {
            name: "Maicitos",
            price: "$28.000",
            description:
              "Maíces tiernos bañados en queso, acompañados de nachos. Con tu elección: carne, pollo o rancheros.",
          },
        ],
      },
    ],
  },
  {
    id: "especiales",
    title: "Especiales de la casa",
    kind: "comer",
    image: "/carta/especiales.jpg",
    accent: "bg-cec-sky",
    groups: [
      {
        items: [
          {
            name: "Pastas boloñesa",
            price: "$35.000",
            description: "Pastas con carne molida, pasta de tomate y queso parmesano.",
          },
          {
            name: "Pastas de pollo en salsa Alfredo",
            price: "$35.000",
            description: "Pastas con pollo en salsa Alfredo, maicitos, tocineta y queso parmesano.",
          },
          {
            name: "Sándwich",
            price: "$26.000",
            description: "Pan de orégano, jamón, pepinillos agridulces, lechuga, rodajas de tomate y queso.",
          },
          {
            name: "Sándwich de carne desmechada",
            price: "$27.000",
            description: "Pan de orégano, carne desmechada, rodajas de tomate, lechuga y queso.",
          },
          {
            name: "Ensalada César",
            price: "$27.000",
            description: "Base de lechuga, trozos de pollo, queso en cubos, tomate, pasas y tostaditas.",
          },
        ],
      },
    ],
  },
  {
    id: "bowls",
    title: "Bowls",
    kind: "comer",
    image: "/carta/bowls.jpg",
    accent: "bg-cec-sage",
    groups: [
      {
        items: [
          {
            name: "Bowl Como en Casa",
            price: "$37.000",
            description:
              "Arroz, carne desmechada, maicitos, chorizo, pico de gallo, guacamole, frijoles caraotas y chips de plátano.",
          },
          {
            name: "Bowl de salmón",
            price: "$42.000",
            description:
              "Arroz, vegetales (zucchini, calabacín, zanahoria), guacamole, mango, salmón y vinagre balsámico.",
          },
        ],
      },
    ],
  },
  {
    id: "papas",
    title: "Papas",
    kind: "comer",
    image: "/carta/papas.jpg",
    accent: "bg-cec-lilac",
    groups: [
      {
        items: [
          { name: "Chori-papa", price: "$22.000" },
          {
            name: "Papas tradición",
            price: "$29.000",
            description:
              "Papas fritas, carne desmechada, salchichas, pico de gallo, lechuga, pepinillos agridulces, queso, guacamole y salsa de la casa.",
          },
          { name: "Salchipapas", price: "$15.000", description: "Papas a la francesa, salchichas y salsas de la casa." },
          { name: "Porción de papas", price: "$9.000" },
        ],
      },
    ],
  },
  {
    id: "hamburguesas",
    title: "Hamburguesas",
    kind: "comer",
    image: "/carta/hamburguesas.jpg",
    accent: "bg-cec-sky",
    note: "Todas acompañadas de papas.",
    groups: [
      {
        items: [
          {
            name: "Clásica sencilla",
            price: "$27.700",
            description: "Carne artesanal, lechuga, rodaja de tomate, tocineta, pepinillos agridulces y queso mozzarella.",
          },
          {
            name: "Clásica doble carne",
            price: "$34.700",
            description: "Doble carne artesanal, lechuga, tomate, tocineta, pepinillos agridulces y queso mozzarella.",
          },
          {
            name: "Clásica doble queso",
            price: "$31.700",
            description: "Carne artesanal con doble queso mozzarella, lechuga, tomate, tocineta y pepinillos agridulces.",
          },
          {
            name: "Pollo",
            price: "$27.700",
            description: "Filete de pollo, lechuga, tomate, tocineta, pepinillos agridulces y queso mozzarella.",
          },
          {
            name: "Hawaiana",
            price: "$29.700",
            description: "Carne artesanal, lechuga, tomate, piña, tocineta y queso mozzarella.",
          },
          {
            name: "Ahumada",
            price: "$34.700",
            description:
              "Carne de cerdo ahumada en barril, lechuga, tomate, pepinillos agridulces, tocineta y queso mozzarella.",
          },
          {
            name: "Santarrosana",
            price: "$33.700",
            description:
              "Carne con el sabor del chorizo santarrosano, lechuga, tomate, queso mozzarella y queso crema.",
          },
          {
            name: "Argentina",
            price: "$33.700",
            description: "Carne con especias, hierbas aromáticas y vino, lechuga, tomate, chimichurri y queso mozzarella.",
          },
          {
            name: "Alemana",
            price: "$33.700",
            description:
              "Carne con el sabor de las mejores salchichas alemanas, lechuga, tomate, queso mozzarella y chucrut.",
          },
          {
            name: "Italiana",
            price: "$33.700",
            description:
              "Carne elaborada con tomates reducidos en albahaca y parmesano, lechuga, queso mozzarella y tomate.",
          },
        ],
      },
    ],
  },
  {
    id: "vegetariano",
    title: "Vegetariano",
    kind: "comer",
    accent: "bg-cec-sage",
    groups: [
      {
        items: [
          { name: "Salchipapa vegetariana", price: "$17.000" },
          { name: "Choripán vegetariano", price: "$26.000" },
          { name: "Papa tradición vegetariana", price: "$31.000" },
          { name: "Nachos vegetarianos", price: "$29.000" },
          { name: "Cazuelita de huevo amanecer mexicana vegetariana", price: "$33.000" },
          { name: "Maicitos de carne vegetariana", price: "$31.000" },
          {
            name: "Carne vegetariana a la plancha",
            price: "$33.700",
            description:
              "Proteína vegetariana con papas a la francesa, lechuga, arepa con queso, guacamole y pico de gallo.",
          },
          {
            name: "Hamburguesa vegetariana",
            price: "$33.700",
            description: "Proteína vegetal, cama de lechuga, tomate y queso.",
          },
          { name: "Bowl Como en Casa vegetariano", price: "$37.000" },
          { name: "Bowl vegetariano", price: "$30.000" },
        ],
      },
    ],
    footnotes: [
      "Salchicha tradicional: elaborada con gluten de trigo.",
      "Carne de hamburguesa: lentejas y proteína de soya.",
      "Carne molida: a base de vegetales, arveja y lentejas.",
      "Chorizo: soya y quinoa.",
    ],
  },

  // ═══════════════════════════ BEBER ═══════════════════════════
  {
    id: "barista",
    title: "Menú del barista",
    kind: "beber",
    image: "/carta/barista.jpg",
    accent: "bg-cec-sage",
    groups: [
      {
        title: "Cafés",
        items: [
          { name: "Espresso doble", price: "$6.500" },
          { name: "Americano", price: "$7.000" },
          { name: "Piccolo", price: "$7.500" },
          { name: "Cappuccino", price: "$8.700" },
          { name: "Cappuccino marshmallows", price: "$11.000" },
          { name: "Latte", price: "$9.700" },
          { name: "Tinto campesino", price: "$4.200" },
        ],
      },
      {
        title: "Preparaciones manuales",
        table: {
          columns: ["1 taza", "2 tazas"],
          rows: [
            { name: "Aeropress", prices: ["$10.500", "$16.500"] },
            { name: "Prensa francesa", prices: ["$10.500", "$16.500"] },
            { name: "V60", prices: ["$10.500", "$16.500"] },
            { name: "Chemex", prices: ["$12.000", "$18.400"] },
          ],
        },
      },
      {
        title: "Especiales",
        items: [
          { name: "Mocaccino caliente", price: "$11.500" },
          { name: "Cappuccino especias", price: "$10.000" },
          { name: "Café bombón", price: "$10.500" },
          { name: "Affogato", price: "$16.500" },
          { name: "Affogato brownie", price: "$18.500" },
        ],
      },
      {
        title: "Frappés (café granizado)",
        items: [
          { name: "Frappé tradicional", price: "$11.700" },
          { name: "Brownie y chantilly", price: "$14.700" },
          { name: "Trozos de galleta y chantilly", price: "$14.700" },
          { name: "Arequipe, chocolate y chantilly", price: "$14.700" },
          { name: "Adición leche vegetal", price: "+$2.700" },
        ],
      },
    ],
  },
  {
    id: "cafe-frio",
    title: "Café frío",
    kind: "beber",
    image: "/carta/cafe-frio.jpg",
    accent: "bg-cec-blush",
    groups: [
      {
        items: [
          { name: "Shakerato", price: "$10.500" },
          { name: "Americano", price: "$8.700" },
          { name: "Latte", price: "$10.200" },
          { name: "Latte con rosas", price: "$13.000" },
          { name: "Mocaccino", price: "$11.500" },
          { name: "Orange coffee", price: "$11.000" },
          { name: "Cold brew", price: "$10.000" },
          { name: "Cold brew nitro", price: "$17.000" },
          { name: "Cold brew frutos rojos", price: "$18.500" },
          { name: "Cold brew frutos amarillos", price: "$18.500" },
          { name: "Avocoffee", price: "$17.000" },
        ],
      },
    ],
  },
  {
    id: "hora-del-te",
    title: "Hora del té",
    kind: "beber",
    image: "/carta/hora-del-te.jpg",
    accent: "bg-cec-lilac",
    groups: [
      {
        title: "Tés",
        items: [
          { name: "Negro con rosas", price: "$11.900" },
          { name: "Earl Grey con lavanda", price: "$11.900" },
          { name: "Negro con melocotón y jengibre", price: "$11.900" },
          { name: "Bayas del bosque con rosas", price: "$11.900" },
          { name: "Mariposa", price: "$11.900" },
          { name: "Chai caliente", price: "$9.900" },
          { name: "Chai marshmallows", price: "$11.900" },
          { name: "Chai frío", price: "$13.400" },
          { name: "Matcha caliente", price: "$11.400" },
          { name: "Matcha con rosas caliente", price: "$13.400" },
          { name: "Matcha frío", price: "$13.900" },
          { name: "Matcha con rosas frío", price: "$15.900" },
        ],
      },
      {
        title: "Infusiones calientes",
        items: [
          { name: "Frutos rojos", price: "$9.000" },
          { name: "Frutos amarillos", price: "$9.000" },
        ],
      },
      {
        title: "Infusiones frías",
        items: [
          { name: "Jardín de lavanda", price: "$18.000" },
          { name: "Pasión Té", price: "$18.000" },
        ],
      },
    ],
  },
  {
    id: "bebidas-frias",
    title: "Bebidas frías",
    kind: "beber",
    image: "/carta/bebidas-frias.jpg",
    accent: "bg-cec-sky",
    groups: [
      {
        title: "Sodas saborizadas",
        items: [
          { name: "Café", price: "$16.500" },
          { name: "Frutos rojos", price: "$9.900" },
          { name: "Frutos amarillos", price: "$9.900" },
          { name: "Uchuva", price: "$9.900" },
          { name: "Michelada", price: "$8.900" },
        ],
      },
      {
        title: "Limonadas",
        items: [
          { name: "Café", price: "$11.500" },
          { name: "Natural", price: "$10.300" },
          { name: "Sandía", price: "$14.500" },
          { name: "Hierbabuena", price: "$11.000" },
          { name: "Coco", price: "$14.500" },
          { name: "Cereza", price: "$14.500" },
          { name: "Mango biche", price: "$14.500" },
          { name: "Aguacate", price: "$14.500" },
        ],
      },
      {
        title: "Jugos",
        items: [
          { name: "Frutos del bosque", price: "$10.300" },
          { name: "Frutos amarillos", price: "$10.300" },
          { name: "Mandarina", price: "$10.300" },
          { name: "Borojó", price: "$10.300" },
          { name: "Piña coco", price: "$10.300" },
          { name: "Tamarindo", price: "$11.300" },
          { name: "Maracuyá coco", price: "$10.300" },
          { name: "Adición leche", price: "+$3.800" },
        ],
      },
      {
        title: "Malteadas",
        items: [
          { name: "Chocolate", price: "$19.000" },
          { name: "Limón", price: "$19.000" },
          { name: "Red Velvet", price: "$19.000" },
          { name: "Zanahoria", price: "$19.000" },
        ],
      },
    ],
  },
  {
    id: "otras-bebidas",
    title: "Otras bebidas",
    kind: "beber",
    accent: "bg-cec-blush",
    groups: [
      {
        items: [
          { name: "Vaso con leche", price: "$5.200" },
          { name: "Botella con agua", price: "$5.200" },
          { name: "Botella agua con gas", price: "$6.200" },
          { name: "Bretaña personal", price: "$7.200" },
          { name: "Milo caliente", price: "$10.000" },
          { name: "Milo frío", price: "$13.200" },
          { name: "Chocolate en leche", price: "$8.000" },
          { name: "Coca-Cola 400 ml", price: "$7.000" },
        ],
      },
    ],
  },
  {
    id: "con-licor",
    title: "Bebidas con licor",
    kind: "beber",
    image: "/carta/con-licor.jpg",
    accent: "bg-cec-lilac",
    groups: [
      {
        title: "Cócteles",
        items: [
          { name: "Cuba libre", price: "$23.800" },
          { name: "Mimosa", price: "$24.500" },
          { name: "Café irlandés", price: "$20.200" },
          { name: "Espresso martini", price: "$22.500" },
          { name: "Mojito de café", price: "$21.500" },
          { name: "Cremoso de café y whiskey", price: "$19.000" },
          { name: "Cara Honey", price: "$32.000" },
          { name: "Margarita", price: "$30.900" },
          { name: "Mojito Jäger", price: "$32.000" },
          { name: "Mojito cubano", price: "$27.300" },
          { name: "Jägerbomb", price: "$26.000" },
          { name: "Tequila sunrise", price: "$29.000" },
          { name: "Coco loco", price: "$33.300" },
          { name: "Ruso blanco", price: "$29.700" },
          { name: "Aperol", price: "$30.000" },
        ],
      },
      {
        title: "Tragos",
        items: [
          { name: "Crema de whiskey", price: "$10.000" },
          { name: "Vodka Absolut", price: "$15.000" },
          { name: "Aguardiente Antioqueño", price: "$10.500" },
          { name: "Ron Viejo de Caldas", price: "$10.500" },
          { name: "Whiskey Red Label", price: "$22.500" },
          { name: "Jack Daniel's", price: "$22.500" },
          { name: "Jägermeister", price: "$22.500" },
        ],
      },
      {
        title: "Cervezas",
        items: [
          { name: "Águila", price: "$7.000" },
          { name: "Águila Light", price: "$7.000" },
          { name: "Pilsen", price: "$7.000" },
          { name: "Heineken", price: "$8.500" },
          { name: "Club Colombia Dorada", price: "$8.000" },
          { name: "Club Colombia Roja", price: "$8.000" },
          { name: "Adición michelada", price: "+$3.000" },
        ],
      },
      {
        title: "Cervezas artesanales",
        items: [
          { name: "Barrabás · Fugitivo Jengibre", detail: "rubia", price: "$16.000" },
          { name: "Barrabás · Rebeldía", detail: "roja", price: "$16.000" },
          { name: "Barrabás · Magdalena Cafeína", detail: "oscura", price: "$16.000" },
          { name: "Lardy Brewing · Wee Heavy", detail: "roja", price: "$16.000" },
          { name: "Lardy Brewing · Waka Waka", detail: "negra", price: "$16.000" },
          { name: "Lardy Brewing · Helles", detail: "dorada", price: "$16.000" },
        ],
      },
      {
        title: "Vinos",
        items: [
          { name: "Copa de vino", price: "$22.000" },
          { name: "Vino caliente", price: "$24.000" },
          { name: "Limonada de vino", price: "$20.000" },
        ],
      },
      {
        title: "Sangría de la casa",
        items: [
          { name: "Copa", price: "$24.000" },
          { name: "Jarra", price: "$71.000" },
        ],
      },
      {
        title: "Cafés con licor",
        items: [
          {
            name: "Cappuccino con licor",
            price: "$15.000",
            description: "Cappuccino de la casa, crema de whiskey y whiskey Jack Daniel's Honey.",
          },
          { name: "Carajillo con whiskey", price: "$11.500" },
          { name: "Carajillo con ron", price: "$11.500" },
          { name: "Carajillo con aguardiente", price: "$11.500" },
        ],
      },
    ],
  },
];
