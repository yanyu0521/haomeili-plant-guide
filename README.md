# 好美里防風林植物數位導覽網站

Astro 靜態網站，手機優先、原生 CSS、TypeScript + Zod 驗證、JSON 管理植物資訊、無資料庫或後端。GitHub Pages 專案 base：`/haomeili-plant-guide/`。

> **目前為示範開發版。** 3 筆植物資料及 3 張版型測試佔位圖片都不代表現場調查。圖片不是植物實拍。不可在未替換現場照片、校稿與驗收前宣稱為正式導覽內容。

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

建議將首次 `npm install` 產生的 `package-lock.json` 一併提交。啟動後網址：`http://localhost:4321/haomeili-plant-guide/`。

## 功能與路由

- `/haomeili-plant-guide/` 直接顯示按 `order` 排序的純文字清單。
- `/haomeili-plant-guide/plants/` 重用相同的 `PlantList` 元件與資料。
- `/haomeili-plant-guide/plants/[slug]/` 透過 `getStaticPaths()` 靜態生成，僅輸出 published。
- 植物頁：名稱、學名、科別、非空別名、單張圖片、四段介紹、全部直接展開、上一種／下一種。
- 無有效 slug 的路由使用 GitHub Pages 預設 404。
- 不使用 React/Vue、額外客戶端 JS、管理後台、PWA、後端或資料庫。

## 專案組織

- `src/data/plants.json`：唯一資料來源。
- `src/lib/plantSchema.ts`：欄位驗證；`src/lib/plants.ts`：發布篩選與排序。
- `src/lib/paths.ts`：GitHub Pages base 路徑；`src/lib/images.ts`：本地圖片資產解析。
- `src/components/`：網站 Header、植物清單、資訊卡、上下頁。
- `src/pages/`：三種路由；`src/styles/global.css`：UI token。
- `scripts/validate-data.ts`：JSON 與圖片完整性；`scripts/test-site.mjs`：靜態產物基本驗收。
- `docs/maintenance.md`：維護說明；`docs/add-plant-checklist.md`：新增植物清單；`docs/plant-template.json`：範本。

## 部署（尚未執行）

在 GitHub 專案設定中選擇 Pages → GitHub Actions。本專案附帶手動執行 `.github/workflows/deploy.yml`，需先取得專案負責人明確批准才能使用。建置時自動設定 `GITHUB_PAGES_SITE=https://<owner>.github.io`，`base` 仍固定 `/haomeili-plant-guide`。如為組織自訂網域，需另檢查設定。

## 測試聲明

若你取得這個檔案時未見本機測試紀錄，請勿假設 npm install / Astro build / GitHub Pages 部署已成功。要以真實命令輸出作為準據；本包不包含 `node_modules` 或預建置 `dist/`。
