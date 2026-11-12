import type { NextConfig } from "next";

// Dominio oficial de la web. Todo lo demás redirige aquí.
const OFFICIAL_HOST = "comoencasa.vercel.app";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Cualquier ruta (/:path*) que entre por el dominio viejo…
        source: "/:path*",
        // …solo si el host es como-en-casa-admin.vercel.app (o una de sus
        // URLs de preview). Sin esta condición la regla también correría en
        // comoencasa.vercel.app y crearía un bucle de redirecciones.
        has: [{ type: "host", value: "como-en-casa-admin(-.*)?\\.vercel\\.app" }],
        // …va a la misma ruta en el dominio oficial (conserva ?query).
        destination: `https://${OFFICIAL_HOST}/:path*`,
        // 308 = redirección permanente: Google y WhatsApp aprenden que la
        // dirección correcta es la nueva.
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
