import { z } from 'zod';

const requiredText = z.string().trim().min(1, '不得為空白');
const optionalText = z.preprocess(
  (value) => value == null || (typeof value === 'string' && value.trim() === '') ? undefined : value,
  requiredText.optional(),
);

const imageSchema = z.object({
  file: z.string().regex(/^[a-z0-9][a-z0-9-]*\.(?:jpg|jpeg|png|webp)$/, '圖片必須是安全的本地檔名（jpg/jpeg/png/webp）'),
  alt: requiredText,
  credit: optionalText,
}).strict();

const common = {
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug 只能使用小寫英數字與連字號'),
  order: z.number().int().positive(),
  name: requiredText,
  isDemo: z.boolean(),
};

const optionalFields = {
  scientificName: optionalText,
  family: optionalText,
  aliases: z.array(requiredText).max(10).optional(),
  image: imageSchema.optional(),
  appearance: optionalText,
  habitat: optionalText,
  ecologicalFunctions: optionalText,
  windbreakRole: optionalText,
  sourceUrls: z.array(z.string().url()).optional(),
};

const draftPlantSchema = z.object({
  ...common,
  status: z.literal('draft'),
  ...optionalFields,
}).strict();

const publishedPlantSchema = z.object({
  ...common,
  status: z.literal('published'),
  scientificName: requiredText,
  family: requiredText,
  aliases: optionalFields.aliases,
  image: imageSchema,
  appearance: requiredText,
  habitat: requiredText,
  ecologicalFunctions: requiredText,
  windbreakRole: requiredText,
  sourceUrls: optionalFields.sourceUrls,
}).strict();

export const plantSchema = z.discriminatedUnion('status', [draftPlantSchema, publishedPlantSchema]);

export const plantsSchema = z.array(plantSchema).superRefine((plants, context) => {
  const slugs = new Map<string, number>();
  const orders = new Map<number, number>();
  plants.forEach((plant, index) => {
    if (slugs.has(plant.slug)) {
      context.addIssue({ code: 'custom', path: [index, 'slug'], message: `slug 與第 ${slugs.get(plant.slug)! + 1} 筆重複` });
    } else slugs.set(plant.slug, index);
    if (orders.has(plant.order)) {
      context.addIssue({ code: 'custom', path: [index, 'order'], message: `order 與第 ${orders.get(plant.order)! + 1} 筆重複` });
    } else orders.set(plant.order, index);
  });
});

export type Plant = z.infer<typeof plantSchema>;
export type PublishedPlant = z.infer<typeof publishedPlantSchema>;
