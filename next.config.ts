import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto. Sin esto, Next/Turbopack sube de directorio,
  // encuentra un package-lock.json suelto en Documentos/01_Webs/ y toma esa
  // carpeta como raíz, lo que rompe la resolución de módulos ("Could not find
  // the module .../global-error.js").
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Optimizador de Next desactivado: se agotó la capa gratuita de Vercel y
    // las fotos ya son chicas. Las imágenes se sirven tal cual desde /public
    // (y desde los hosts remotos de abajo) sin pasar por /_next/image.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Airtable (reservado para uso futuro)
      { protocol: "https", hostname: "*.airtableusercontent.com" },
      { protocol: "https", hostname: "dl.airtable.com" },
      // Google Drive — URLs de "uc?export=view&id=..."
      { protocol: "https", hostname: "drive.google.com" },
      // CDN de Google (Drive, Fotos, etc.)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
      // Google Cloud Storage (si usás un bucket)
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
