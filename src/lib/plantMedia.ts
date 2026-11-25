import { z } from 'zod';
import rawPlantMedia from '../data/plant-media.json';

const text = z.string().trim().min(1);

const plantMediaSchema = z.array(z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  illustrationAlt: text,
  illustrationCaption: text,
  photoId: z.number().int().positive(),
  observationId: z.number().int().positive(),
  photoTaxon: text,
  photoLocation: text,
  photoAlt: text,
  photoCaption: text,
  photoLicense: z.literal('CC0 1.0'),
}).strict()).superRefine((items, context) => {
  const slugs = new Set<string>();
  const photoIds = new Set<number>();

  items.forEach((item, index) => {
    if (slugs.has(item.slug)) {
      context.addIssue({ code: 'custom', path: [index, 'slug'], message: '導覽圖片的 slug 不可重複' });
    }
    if (photoIds.has(item.photoId)) {
      context.addIssue({ code: 'custom', path: [index, 'photoId'], message: '每個植物點需使用不同的實拍照片' });
    }
    slugs.add(item.slug);
    photoIds.add(item.photoId);
  });
});

export type PlantGuideMedia = z.infer<typeof plantMediaSchema>[number];

export const plantGuideMedia: PlantGuideMedia[] = plantMediaSchema.parse(rawPlantMedia);

const mediaBySlug = new Map(plantGuideMedia.map((media) => [media.slug, media]));

export function getPlantGuideMedia(slug: string): PlantGuideMedia {
  const media = mediaBySlug.get(slug);
  if (!media) throw new Error(`缺少植物導覽圖片資料：${slug}`);
  return media;
}

export function guideIllustrationPath(slug: string, width?: 480 | 960): string {
  const suffix = width ? `-${width}` : '';
  return `guide-media/illustrations/${slug}-plate${suffix}.webp`;
}

export function guidePhotoPath(slug: string, width?: 480 | 960): string {
  const suffix = width ? `-${width}` : '';
  return `guide-media/photos/${slug}${suffix}.webp`;
}
