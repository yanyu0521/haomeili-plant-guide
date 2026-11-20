import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = process.cwd();
const dist = join(root, 'dist');
const base = '/haomeili-plant-guide/';
const plants = JSON.parse(readFileSync(join(root, 'src/data/plants.json'), 'utf8'));
const published = plants.filter((p) => p.status === 'published').sort((a,b) => a.order-b.order);
const draft = plants.filter((p) => p.status === 'draft');
const html = (file) => readFileSync(join(dist, file), 'utf8');
const route = (slug) => `plants/${slug}/index.html`;
function findLinks(text) { return [...text.matchAll(/href="([^"]+)"/g)].map((m)=>m[1]); }
function findSources(text) { return [...text.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((m)=>m[1]); }
function htmlText(text) {
  return text.replace(/<[^>]*>/g, ' ')
    .replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&apos;', "'");
}
function assetExists(url) {
  const clean = decodeURIComponent(url.split('?')[0].split('#')[0]);
  assert(clean.startsWith(base), `檔案連結未包含 base: ${url}`);
  return existsSync(join(dist, clean.slice(base.length)));
}
assert(existsSync(join(dist, 'index.html')), '首頁不存在');
assert(existsSync(join(dist, 'plants/index.html')), '/plants/ 不存在');
const home = html('index.html');
const list = html('plants/index.html');
function checkDirectory(content) {
  const list = content.match(/<ol\b[^>]*data-plant-list[^>]*>([\s\S]*?)<\/ol>/);
  assert(list, '植物名錄缺少導覽點');
  const rows = [...list[1].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)];
  assert.equal(rows.length, published.length, '植物名錄點位數量錯誤');
  for (const [index, row] of rows.entries()) {
    const plant = published[index];
    const links = [...row[1].matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
    assert.equal(links.length, 2, `${plant.name} 應有獨立的介紹和地圖連結`);
    assert.deepEqual(findLinks(row[1]), [
      `${base}plants/${plant.slug}/`,
      `${base}map/#map-point-${plant.slug}`,
    ], `${plant.name} 名錄順序或連結目標錯誤`);
    const detail = links[0][2];
    assert.equal(htmlText(detail.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1] ?? '').trim(), plant.name);
    assert(findSources(detail).length === 1 && htmlText(detail).includes(plant.fieldCue),
      `${plant.name} 的插圖和辨識線索應可點進詳情`);
  }
}
function homeFeaturedSlugs(content) {
  return [...content.matchAll(/<a\b[^>]*class="plant-rail-card"[^>]*href="([^"]+)"[^>]*aria-label="第 \d+ 個點位：[^，]+，查看植物介紹"/g)]
    .map((match) => match[1].replace(`${base}plants/`, '').replace(/\/$/, ''));
}
assert.deepEqual(homeFeaturedSlugs(home),published.slice(0,3).map((p)=>p.slug),'首頁精選點位順序錯誤');
assert(home.includes(`aria-label="瀏覽全部 ${published.length} 個植物導覽點"`),'首頁植物總數錯誤');
checkDirectory(list);
let pagesChecked=0;
for (const [index, p] of published.entries()) {
  assert(existsSync(join(dist,route(p.slug))), `缺少植物頁：${p.slug}`);
  const content=html(route(p.slug));
  const visibleText = htmlText(content);
  assert(visibleText.includes(p.name) && visibleText.includes(p.scientificName), `${p.slug} 文字缺漏`);
  for (const title of ['基本資料','外觀特徵','生長環境','生態功能','防風林角色'])
    assert(content.includes(title),`${p.slug} 缺少資訊卡：${title}`);
  if (p.isDemo) assert(content.includes('尚未確認為好美里現場植物'),`${p.slug} 缺示範警語`);
  const links=findLinks(content);
  const prev = index ? `${base}plants/${published[index-1].slug}/` : null;
  const next = index+1<published.length ? `${base}plants/${published[index+1].slug}/` : null;
  if (prev) assert(links.includes(prev),`${p.slug} 缺上一種連結`);
  if (next) assert(links.includes(next),`${p.slug} 缺下一種連結`);
  assert(findSources(content).length === 1,`${p.slug} 植物照片非單張`);
  for(const src of findSources(content)) assert(assetExists(src),`缺少最佳化圖片：${src}`);
  pagesChecked++;
}
for(const p of draft) {
  assert(!existsSync(join(dist,route(p.slug))),`草稿不應產出：${p.slug}`);
  assert(!home.includes(`${base}plants/${p.slug}/`),`草稿不應出現在首頁：${p.slug}`);
}
for(const page of [home,list,...published.map((p)=>html(route(p.slug)))]) {
  for(const href of findLinks(page)) {
    if (href.startsWith('https:')||href.startsWith('http:')||href.startsWith('#')||href.startsWith('mailto:')) continue;
    assert(href.startsWith(base),`站內連結未套 base：${href}`);
    const clean=href.slice(base.length).split('?')[0].split('#')[0];
    const target=clean.endsWith('/') ? join(dist,clean,'index.html') : join(dist,clean);
    assert(existsSync(target),`站內連結不存在：${href}`);
  }
}
console.log(`靜態輸出驗收成功：首頁、植物清單、${pagesChecked} 個植物頁、draft 排除、導覽、圖片與 base 路徑。`);
