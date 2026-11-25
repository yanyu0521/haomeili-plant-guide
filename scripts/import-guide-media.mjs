import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const manifest = JSON.parse(await readFile(resolve(root, 'src/data/plant-media.json'), 'utf8'));
const photoDirectory = resolve(root, 'public/guide-media/photos');
const illustrationDirectory = resolve(root, 'public/guide-media/illustrations');
const illustrationSourceDirectory = resolve(root, 'src/assets/guide-illustrations-source');
await Promise.all([
  mkdir(photoDirectory, { recursive: true }),
  mkdir(illustrationDirectory, { recursive: true }),
  mkdir(illustrationSourceDirectory, { recursive: true }),
]);

const observations = new Map();
for (let offset = 0; offset < manifest.length; offset += 20) {
  const ids = manifest.slice(offset, offset + 20).map(({ observationId }) => observationId).join(',');
  const response = await fetch(`https://api.inaturalist.org/v1/observations/${ids}`);
  if (!response.ok) throw new Error(`iNaturalist API 回應 ${response.status}`);
  const payload = await response.json();
  for (const observation of payload.results) observations.set(observation.id, observation);
}

async function writeResponsiveImage(source, directory, slug, prefix = '') {
  for (const width of [480, 960, 1440]) {
    const suffix = width === 1440 ? '' : `-${width}`;
    const filename = `${slug}${prefix}${suffix}.webp`;
    const destination = join(directory, filename);
    await sharp(source, { limitInputPixels: 32_000_000 })
      .rotate()
      .resize({ width, height: width, fit: 'contain', background: '#f4f0e5' })
      .webp({ quality: 84, effort: 5 })
      .toFile(destination);
  }
}

for (const [index, media] of manifest.entries()) {
  const observation = observations.get(media.observationId);
  if (!observation) throw new Error(`找不到 ${media.slug} 的觀察紀錄 ${media.observationId}`);
  const photo = observation.photos.find(({ id }) => id === media.photoId);
  if (!photo || photo.license_code !== 'cc0') throw new Error(`${media.slug} 的指定照片未確認為 CC0`);
  if (observation.user.login !== 'leaf0605') throw new Error(`${media.slug} 的上傳者資料不符`);
  if (observation.taxon.name !== media.photoTaxon) throw new Error(`${media.slug} 的照片物種名稱不符`);
  if (observation.user.name !== '葉子') throw new Error(`${media.slug} 的攝影者署名不符`);
  if (index < 14 && observation.quality_grade !== 'research') throw new Error(`${media.slug} 的觀察尚未達研究級`);
  if (index === 14 && (!observation.captive || observation.quality_grade !== 'casual')) {
    throw new Error('白千層樹皮參考照應明確標示為栽培個體與非研究級觀察');
  }

  const imageResponse = await fetch(`https://inaturalist-open-data.s3.amazonaws.com/photos/${media.photoId}/original.jpeg`);
  if (!imageResponse.ok) throw new Error(`${media.slug} 的原始照片下載失敗：${imageResponse.status}`);
  await writeResponsiveImage(Buffer.from(await imageResponse.arrayBuffer()), photoDirectory, media.slug);

  const pngMaster = join(illustrationSourceDirectory, `${media.slug}-plate.png`);
  const webpMaster = join(illustrationSourceDirectory, `${media.slug}-plate-source.webp`);
  let illustrationSource;
  try {
    await access(webpMaster);
    illustrationSource = await readFile(webpMaster);
  } catch {
    illustrationSource = await sharp(pngMaster).webp({ quality: 94, effort: 6 }).toBuffer();
    await writeFile(webpMaster, illustrationSource);
  }
  await writeResponsiveImage(illustrationSource, illustrationDirectory, media.slug, '-plate');
  await rm(pngMaster, { force: true });

  console.log(`${String(index + 1).padStart(2, '0')} ${media.slug}: CC0 photo ${media.photoId}, photo and illustration variants written`);
}
