import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/app/components/CartProvider";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { WhatsAppFab } from "@/app/components/WhatsAppFab";
import { CartDrawer } from "@/app/components/CartDrawer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cuchillos Galucho — Forja artesanal argentina",
  description:
    "Cuchillos artesanales argentinos. Acero al carbono, cabos en madera noble y cobre. Hechos a mano por Cuchillos Galucho.",
  openGraph: {
    title: "Cuchillos Galucho — Forja artesanal argentina",
    description:
      "Cuchillos artesanales argentinos. Hechos a mano, listos para toda la vida.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${cormorant.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
