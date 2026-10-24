import { readFileSync, existsSync, readdirSync } from 'node:fs';
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
function assetExists(url) {
  const clean = decodeURIComponent(url.split('?')[0].split('#')[0]);
  assert(clean.startsWith(base), `檔案連結未包含 base: ${url}`);
  return existsSync(join(dist, clean.slice(base.length)));
}
assert(existsSync(join(dist, 'index.html')), '首頁不存在');
assert(existsSync(join(dist, 'plants/index.html')), '/plants/ 不存在');
const home = html('index.html');
const list = html('plants/index.html');
function listNames(content) {
  const match = content.match(/<ol\b[^>]*data-plant-list[^>]*>([\s\S]*?)<\/ol>/);
  return match ? [...match[1].matchAll(/<li\b[^>]*>[\s\S]*?<a\b[^>]*>([^<]+)<\/a>/g)].map((m)=>m[1].trim()) : [];
}
assert.deepEqual(listNames(home),published.map((p)=>p.name),'首頁清單順序錯誤');
assert.deepEqual(listNames(list),published.map((p)=>p.name),'/plants/ 與首頁不一致');
let pagesChecked=0;
for (const [index, p] of published.entries()) {
  assert(existsSync(join(dist,route(p.slug))), `缺少植物頁：${p.slug}`);
  const content=html(route(p.slug));
  assert(content.includes(p.name) && content.includes(p.scientificName), `${p.slug} 文字缺漏`);
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
