import type { ImageMetadata } from 'astro';

// Astro resolves these local assets at build time for its <Image /> component.
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/plants/*.{jpg,jpeg,png,webp}'
);

export async function getPlantImage(file: string): Promise<ImageMetadata> {
  const key = `/src/assets/plants/${file}`;
  const importer = images[key];
  if (!importer) throw new Error(`找不到植物圖片：${file}`);
  return (await importer()).default;
}
