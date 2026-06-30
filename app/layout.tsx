import type { Metadata } from "next";
import { Geist, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/app/components/CartProvider";
import { ThemeProvider } from "@/app/components/ThemeProvider";
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
    "Cuchillos artesanales argentinos. Acero Inoxidable 420, cabos en madera noble. Hechos a mano por Cuchillos Galucho.",
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
      suppressHydrationWarning
    >
      <head>
        {/* Evita el destello (FOUC) al cargar el tema guardado */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'light';if(t==='dark')document.documentElement.classList.add('dark');})();`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <WhatsAppFab />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
