import { readdirSync } from "fs";
import { join } from "path";
import { ShowcaseSection } from "./ShowcaseSection";

function getGeniales() {
  try {
    const dir = join(process.cwd(), "public/geniales");
    return readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f))
      .sort()
      .map((f, i) => ({ src: `/geniales/${f}`, alt: `Detalle ${i + 1}` }));
  } catch {
    return [];
  }
}

export function ShowcaseSectionServer() {
  const photos = getGeniales();
  return <ShowcaseSection photos={photos} />;
}
