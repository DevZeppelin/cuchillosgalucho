import type { Product, GroupedProduct, SizeOption } from "./types";

export function groupProducts(products: Product[]): GroupedProduct[] {
  const map = new Map<string, GroupedProduct>();

  for (const p of products) {
    const key = `${p.categoria}:::${p.nombre}`;

    if (!map.has(key)) {
      // Quitar el sufijo numérico del slug: "cabo-ciervo-16-3" → "cabo-ciervo-16"
      const slug = p.slug.replace(/-\d+$/, "");
      map.set(key, {
        key,
        nombre: p.nombre,
        categoria: p.categoria,
        imagen: p.imagen,
        imagenes: p.imagenes,
        materiales: p.materiales,
        destacado: p.destacado ?? false,
        slug,
        sizes: [],
      });
    }

    const g = map.get(key)!;

    // Prefiere imágenes reales sobre el logo placeholder
    if (
      (g.imagen === "/logo.png" || !g.imagen) &&
      p.imagen &&
      p.imagen !== "/logo.png"
    ) {
      g.imagen = p.imagen;
      g.imagenes = p.imagenes;
    }

    // Si cualquier variante está destacada, el grupo queda destacado
    if (p.destacado) g.destacado = true;

    const size: SizeOption = {
      id: p.id,
      medida:
        p.descripcionCorta ||
        (p.hojaCm > 0 ? `${p.hojaCm} cm` : "Unidad"),
      cm: p.hojaCm,
      precio: p.precio,
      precioMayorista: p.precioMayorista,
      stock: p.stock,
    };
    g.sizes.push(size);
  }

  // Ordenar medidas de menor a mayor (por cm; las sin cm van al final)
  for (const g of map.values()) {
    g.sizes.sort((a, b) => {
      if (a.cm === 0 && b.cm === 0) return 0;
      if (a.cm === 0) return 1;
      if (b.cm === 0) return -1;
      return a.cm - b.cm;
    });
  }

  return Array.from(map.values());
}
