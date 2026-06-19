"use client";

import { OWNER_WHATSAPP } from "@/app/lib/whatsapp";
import { useEffect, useState } from "react";

export function WhatsAppFab() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent("Hola! Vi la web de Cuchillos Galucho y quería consultar.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className={`fixed bottom-6 right-6 z-30 bg-[#25D366] hover:bg-[#1ebe57] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.6 6.32A8 8 0 005.93 17.5l-1.18 4.31 4.41-1.16a8 8 0 008.43-13.32zm-5.6 12.3a6.65 6.65 0 01-3.38-.92l-.24-.14-2.62.69.7-2.56-.16-.26a6.65 6.65 0 1112.34-3.55 6.65 6.65 0 01-6.64 6.74zm3.64-4.97c-.2-.1-1.17-.58-1.35-.64-.18-.07-.31-.1-.45.1-.13.2-.51.64-.63.78-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99a6 6 0 01-1.1-1.37c-.12-.2-.01-.31.09-.41.1-.1.2-.23.3-.35.1-.12.13-.2.2-.34.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.48-.16-.39-.33-.34-.45-.34h-.39c-.13 0-.34.05-.52.25s-.69.67-.69 1.65c0 .98.71 1.92.81 2.05.1.13 1.39 2.12 3.37 2.97.47.2.84.32 1.13.41.47.15.9.13 1.24.08.38-.06 1.17-.48 1.34-.94.17-.46.17-.86.12-.94-.05-.08-.18-.13-.38-.23z" />
      </svg>
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
    </a>
  );
}
