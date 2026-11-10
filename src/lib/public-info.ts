// Datos públicos del local, compartidos por el home y el footer.
// Antes vivían dentro de (public)/page.tsx; se movieron aquí para no
// duplicarlos ahora que el footer también los muestra.
// Los valores son exactamente los que ya estaban en la web.

export const LINA_WHATSAPP =
  process.env.NEXT_PUBLIC_LINA_WHATSAPP_NUMBER ?? "TODO_AGREGAR_NUMERO";

export const WHATSAPP_URL = `https://wa.me/${LINA_WHATSAPP}`;

export const SCHEDULE = [
  { day: "Lunes a jueves", hours: "4:30 p.m. – 9:00 p.m." },
  { day: "Viernes", hours: "4:30 p.m. – 10:00 p.m." },
  { day: "Sábado", hours: "11:00 a.m. – 10:00 p.m." },
  { day: "Domingos y festivos", hours: "3:00 p.m. – 10:00 p.m." },
];

export const ADDRESS = { line1: "Carrera 49 # 54-47", line2: "Bello, Antioquia" };

export const INSTAGRAM = "@como.encasa21";
export const PHONE = "304 137 5361";

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Carrera+49+%2354-47+Bello+Antioquia";
