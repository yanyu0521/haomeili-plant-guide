import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { plantsSchema } from '../src/lib/plantSchema';

const root = process.cwd();
const raw = JSON.parse(readFileSync(resolve(root, 'src/data/plants.json'), 'utf8'));
const parsed = plantsSchema.safeParse(raw);
if (!parsed.success) {
  console.error(parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n'));
  process.exit(1);
}
const all = parsed.data;
const published = all.filter((p) => p.status === 'published');
const directory = resolve(root, 'src/assets/plants');
if (!existsSync(directory)) { console.error(`圖片目錄不存在：${directory}`); process.exit(1); }
const fileNames = readdirSync(directory).filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));
const referenced = new Set(published.map((p) => p.image.file));
const missing = published.filter((p) => !existsSync(resolve(directory, p.image.file)));
const unused = fileNames.filter((file) => !referenced.has(file));
if (missing.length || unused.length) {
  if (missing.length) console.error('published 缺少圖片：\n' + missing.map((p) => `- ${p.slug}: ${p.image.file}`).join('\n'));
  if (unused.length) console.error('圖片目錄內包含未被 published 引用的資產（可能是草稿圖片）：\n' + unused.map((file) => `- ${file}`).join('\n'));
  process.exit(1);
}
console.log(`資料驗證成功：${all.length} 筆，published ${published.length} 筆、draft ${all.length - published.length} 筆，圖片 ${referenced.size} 張。`);
