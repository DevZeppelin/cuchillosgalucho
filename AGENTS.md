<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs. conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Cuchillos Galucho — sitio

Next.js 16 / React 19 / Tailwind 4. Web de catálogo y venta mayorista de cuchillos artesanales.

- **Catálogo y precios**: viven en un Google Sheet (hoja `INVENTARIO`) sincronizado vía Apps Script en `apps-script/Code.gs`. El precio final es `TOTAL × 1.9`. Las imágenes de producto siguen la convención `N.png` (numeradas por rango) sobre fondo blanco/transparente.
- **Hero de la portada** (`app/components/Hero.tsx`): usa `public/1.png` (foto real de un cuchillo, PNG con fondo transparente) como imagen flotante animada, vía `next/image`. Antes había un `<BladeSvg />` inline dibujado a mano con SVG — se reemplazó por la foto real; no reintroducir el SVG salvo pedido explícito.
- Componentes de página viven en `app/components/`; no hay carpeta `src/`.
