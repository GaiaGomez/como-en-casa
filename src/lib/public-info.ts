// Datos públicos del local, compartidos por el home y el footer.
// Antes vivían dentro de (public)/page.tsx; se movieron aquí para no
// duplicarlos ahora que el footer también los muestra.
// Contacto actualizado a la línea nueva de WhatsApp del negocio.

// WhatsApp oficial del negocio ("Como En Casa New").
// Formato wa.me: código de país + número, sin "+", espacios ni guiones.
export const BUSINESS_WHATSAPP = "573044907873";
export const WHATSAPP_URL = `https://wa.me/${BUSINESS_WHATSAPP}`;

export const SCHEDULE = [
  { day: "Lunes a jueves", hours: "4:30 p.m. – 9:00 p.m." },
  { day: "Viernes", hours: "4:30 p.m. – 10:00 p.m." },
  { day: "Sábado", hours: "11:00 a.m. – 10:00 p.m." },
  { day: "Domingos y festivos", hours: "3:00 p.m. – 10:00 p.m." },
];

export const ADDRESS = { line1: "Carrera 49 # 54-47", line2: "Bello, Antioquia" };

export const INSTAGRAM = "@como.encasa21";

export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM.replace("@", "")}`;

// Mapa embebido: la URL clásica con output=embed no necesita API key.
const MAPS_QUERY = encodeURIComponent("Carrera 49 #54-47, Bello, Antioquia, Colombia");
export const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${MAPS_QUERY}&z=16&hl=es&output=embed`;

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Carrera+49+%2354-47+Bello+Antioquia";
