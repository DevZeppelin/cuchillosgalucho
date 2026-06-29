import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
