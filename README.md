# 好美里防風林植物導覽

Astro 靜態網站，以手機為主的海岸植物導覽。植物資料由 `src/data/plants.json` 管理，頁面包含植物名錄、互動分布地圖、個別植物介紹，以及「好美里閃身戰：守住防風林」遊戲。GitHub Pages 專案 base：`/haomeili-plant-guide/`。

目前收錄參考地圖上的 15 個植物點位。首頁精選、植物名錄與植物詳情可切換植物墨線插圖和 CC0 實拍照片，選擇會保存在瀏覽器。照片附拍攝地、攝影者及來源紀錄；木麻黃（長枝）照片作同屬物種參考，白千層照片說明其為栽培個體。植物介紹依林業、農業、水利與國家公園等公開資料整理；圖上位置沿用參考地圖的相對位置，不是 GPS 測量座標。

地圖底圖與植物圖示取自 [1920 保安林・植物紀錄地圖](https://ieason0911.github.io/haomei-1920-forest-map/)（Ieason0911）；網站內頁提供來源連結與來源標示。

## 操作

Node.js 22.16+（建議 24），在專案根目錄執行：

```bash
npm install
npm run dev
npm run validate:data
npm run check
npm run build
npm run test:site
```

啟動後網址：`http://localhost:4321/haomeili-plant-guide/`。

## 路由與功能

- `/haomeili-plant-guide/`：導覽首頁、地圖預覽與植物名錄。
- `/haomeili-plant-guide/plants/`：依地圖點位順序排列的植物名錄。
- `/haomeili-plant-guide/map/`：互動植物地圖，點選圖上編號或右側植物名稱前往個別介紹。
- `/haomeili-plant-guide/game/`：四站海岸植物防風遊戲，使用三線移動與植物技能守住防風林，再辨認植物特徵。
- `/haomeili-plant-guide/plants/[slug]/`：植物基本資料、外觀特徵、生長環境、生態功能、防風林角色、地圖位置與資料來源。
- 所有植物頁透過 `getStaticPaths()` 產生；不存在的 slug 沿用 GitHub Pages 預設 404。
- 使用 Astro、TypeScript、Zod 與原生 CSS；不使用資料庫、後端或前端 UI 框架。

## 專案組織

- `src/data/plants.json`：植物資料與參考地圖座標。
- `src/data/plant-media.json`：15 個植物插圖／照片、照片圖說、CC0 授權和來源紀錄。
- `src/lib/plantSchema.ts`：植物資料驗證；`src/lib/plants.ts`：發布篩選與排序。
- `src/lib/plantMedia.ts`：導覽媒體驗證、查詢與站內圖片路徑。
- `src/components/GuideMediaToggle.astro`、`src/components/GuideMediaImage.astro`：跨頁切換控制和圖片。
- `src/lib/paths.ts`：GitHub Pages base 路徑。
- `src/components/ForestMap.astro`：可重用的互動地圖與植物位置標記。
- `src/lib/gameStations.ts`、`src/lib/coastalGame.ts`、`src/lib/forestGamePage.ts`：遊戲關卡資料、戰鬥邏輯與頁面流程。
- `src/assets/game/`、`public/game-art/`：遊戲森林背景與植物插圖。
- `public/images/forest-map.svg`：參考網站地圖底圖。
- `public/plants/`：取自參考網站的植物 SVG 圖示；不是實拍照片。
- `src/assets/guide-illustrations-source/`：原始高解析植物辨識圖版。
- `public/guide-media/`：供頁面載入的響應式圖版與實拍 WebP。
- `src/assets/fonts/`：自託管 Noto Serif TC 頁面字體與 SIL Open Font License。
- `scripts/validate-data.ts`：植物資料、植物圖示與地圖資產檢查。
- `scripts/import-guide-media.mjs`：重新核對 iNaturalist 單張授權，並更新照片與插圖尺寸。
- `scripts/test-site.mjs`：靜態頁面與資產驗收。
- `docs/maintenance.md`：維護說明；`docs/DATA_CONTRACT.md`：資料欄位規格。

## 部署

在 GitHub 專案設定中選擇 Pages → GitHub Actions，並手動執行 `.github/workflows/deploy.yml`。發布前需取得專案負責人明確批准。建置時自動設定 `GITHUB_PAGES_SITE=https://<owner>.github.io`，`base` 固定為 `/haomeili-plant-guide`。如使用組織自訂網域，需另檢查設定。
