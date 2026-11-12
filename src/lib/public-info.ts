// Datos públicos del local, compartidos por el home y el footer.
// Antes vivían dentro de (public)/page.tsx; se movieron aquí para no
// duplicarlos ahora que el footer también los muestra.
// Contacto actualizado a la línea nueva de WhatsApp del negocio.

// WhatsApp ÚNICO del negocio: +57 310 848 2320 (nov 2026).
// Lo usan todos los botones de la web (Inicio, footer, íconos) y las reservas.
// Formato wa.me: código de país + número, sin "+", espacios ni guiones.
// Si el número cambia, se cambia SOLO aquí.
export const BUSINESS_WHATSAPP = "573108482320";
export const WHATSAPP_URL = `https://wa.me/${BUSINESS_WHATSAPP}`;

// Alias para el formulario de reservas (mismo número).
export const RESERVATIONS_WHATSAPP = BUSINESS_WHATSAPP;

export const SCHEDULE = [
  { day: "Lunes a jueves", hours: "4:30 p.m. – 9:00 p.m." },
  { day: "Viernes", hours: "4:30 p.m. – 10:00 p.m." },
  { day: "Sábado", hours: "11:00 a.m. – 10:00 p.m." },
  { day: "Domingos y festivos", hours: "3:00 p.m. – 10:00 p.m." },
];

// Mismo horario que SCHEDULE pero en formato que el código puede usar
// (24 h, por día de la semana: 0 = domingo … 6 = sábado). Si cambia el
// horario, actualizar AMBOS. Lo usa el formulario de reservas para ofrecer
// solo horas en las que el local está abierto.
export const OPENING_HOURS: Record<number, { open: string; close: string }> = {
  0: { open: "15:00", close: "22:00" },
  1: { open: "16:30", close: "21:00" },
  2: { open: "16:30", close: "21:00" },
  3: { open: "16:30", close: "21:00" },
  4: { open: "16:30", close: "21:00" },
  5: { open: "16:30", close: "22:00" },
  6: { open: "11:00", close: "22:00" },
};

export const ADDRESS = { line1: "Carrera 49 # 54-47", line2: "Bello, Antioquia" };

export const INSTAGRAM = "@como.encasa21";

export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM.replace("@", "")}`;

// Mapa embebido: la URL clásica con output=embed no necesita API key.
const MAPS_QUERY = encodeURIComponent("Carrera 49 #54-47, Bello, Antioquia, Colombia");
export const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${MAPS_QUERY}&z=16&hl=es&output=embed`;

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Carrera+49+%2354-47+Bello+Antioquia";
