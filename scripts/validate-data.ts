import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { plantsSchema } from '../src/lib/plantSchema';
import { plantGuideMedia } from '../src/lib/plantMedia';

const root = process.cwd();
const raw = JSON.parse(readFileSync(resolve(root, 'src/data/plants.json'), 'utf8'));
const parsed = plantsSchema.safeParse(raw);
if (!parsed.success) {
  console.error(parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n'));
  process.exit(1);
}
const all = parsed.data;
const published = all.filter((p) => p.status === 'published');
const mediaBySlug = new Map(plantGuideMedia.map((media) => [media.slug, media]));
const missingMedia = published.filter((plant) => !mediaBySlug.has(plant.slug));
const orphanedMedia = plantGuideMedia.filter((media) => !published.some((plant) => plant.slug === media.slug));
if (plantGuideMedia.length !== published.length || missingMedia.length || orphanedMedia.length) {
  console.error('植物導覽媒體必須與所有已發布點位一一對應。');
  if (missingMedia.length) console.error('缺少媒體：\n' + missingMedia.map((plant) => `- ${plant.slug}`).join('\n'));
  if (orphanedMedia.length) console.error('找不到相符植物的媒體：\n' + orphanedMedia.map((media) => `- ${media.slug}`).join('\n'));
  process.exit(1);
}
const directory = resolve(root, 'public/plants');
if (!existsSync(directory)) { console.error(`圖片目錄不存在：${directory}`); process.exit(1); }
const fileNames = readdirSync(directory).filter((file) => /\.svg$/i.test(file));
const referenced = new Set(published.map((p) => p.image.file));
const missing = published.filter((p) => !existsSync(resolve(directory, p.image.file)));
const unused = fileNames.filter((file) => !referenced.has(file));
const mapAsset = resolve(root, 'public/images/forest-map.svg');
if (!existsSync(mapAsset)) { console.error(`參考地圖底圖不存在：${mapAsset}`); process.exit(1); }
if (missing.length || unused.length) {
  if (missing.length) console.error('published 缺少圖片：\n' + missing.map((p) => `- ${p.slug}: ${p.image.file}`).join('\n'));
  if (unused.length) console.error('圖片目錄內包含未被 published 引用的資產（可能是草稿圖片）：\n' + unused.map((file) => `- ${file}`).join('\n'));
  process.exit(1);
}

const mediaFiles = published.flatMap((plant) =>
  [
    `guide-media/illustrations/${plant.slug}-plate.webp`,
    `guide-media/illustrations/${plant.slug}-plate-480.webp`,
    `guide-media/illustrations/${plant.slug}-plate-960.webp`,
    `guide-media/photos/${plant.slug}.webp`,
    `guide-media/photos/${plant.slug}-480.webp`,
    `guide-media/photos/${plant.slug}-960.webp`,
  ].map((file) => resolve(root, 'public', file)));
const missingMediaFiles = mediaFiles.filter((file) => !existsSync(file));
if (missingMediaFiles.length) {
  console.error('植物導覽媒體輸出不完整：\n' + missingMediaFiles.map((file) => `- ${file}`).join('\n'));
  process.exit(1);
}
console.log(`資料驗證成功：${all.length} 筆，published ${published.length} 筆、draft ${all.length - published.length} 筆，地圖圖示 ${referenced.size} 張、插圖與實拍各 ${published.length} 張。`);
