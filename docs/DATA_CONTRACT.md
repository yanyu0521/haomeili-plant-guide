# 好美里防風林植物資料規格 v1.0

## 排序與發布

- `order` 為正整數，所有植物（包含 draft）不得重複。使用 10、20、30 ... 編號，方便插入植物。
- 列表依 `order` 數字由小至大，上一種／下一種只在 published 清單中找相鄰項目。
- `status` 為 `published` 或 `draft`。draft 不產生公開頁面、不出現在列表或上一種／下一種。
- `isDemo=true` 為示範資料，首頁及 `/plants/` 清單在植物名稱旁標註「（示範）」；植物詳情頁須標註「示範」，並顯示：此為示範資料，尚未確認為好美里現場植物。
- 上線真實植物前，先以現場照片及物種鑑定結果更新資料，再將 `isDemo=false`。

## 欄位約定

- 通用必填：`slug`、`order`、`status`、`isDemo`、`name`。
- published 必填：`scientificName`、`family`、`image`（包含 `file`、`alt`）、`appearance`、`habitat`、`ecologicalFunctions`、`windbreakRole`。
- 選填：`aliases`、`image.credit`、`sourceUrls`。別名空陣列不顯示資訊列；圖片來源 credit 可另行顯示在照片旁。
- draft 除通用必填外，其餘內容可先省略或留空白；留白文字會在驗證時轉為 undefined。
- 禁止未知欄位，避免拼字錯誤悄悄流入公開網站。
- `sourceUrls` 用於內容維護追溯，預設不需要在網站輸出。

## 圖片規則

- 資料中的 `image.file` **只寫檔名**，例如 `casuarina-equisetifolia.jpg`，不能使用 URL 或資料夾路徑。
- 真正檔案放在 `src/assets/plants/`，建議現場拍攝、授權或可合法使用的照片。
- 支援 jpg/jpeg/png/webp。建議 1200px 左右的足夠品質照片，部署前檢查檔案大小。
- Astro 使用 `import.meta.glob('/src/assets/plants/*.{jpg,jpeg,png,webp}')` 對應圖片，傳入 `<Image />` 做圖片最佳化。
- 僅將 published 所需圖片納入公開輸出；draft 專用資產不應因其他匯入、複製 public/ 或打包流程外洩。
- 此資料包**不含實際植物照片**。目前附有 3 張非植物實拍的版型測試佔位圖片，僅供驗證 Astro 圖片最佳化與頁面排版；正式內容須替換為經授權及確認的現場照片。

## 驗收案例（Codex 必須實際執行）

1. 正常三筆發布資料應依 10 → 20 → 30 顯示，前後導覽順序一致。
2. 新增 `draft`：不得產生對應靜態路由、清單連結或導覽連結。
3. `order` 或 `slug` 重複時驗證失敗。
4. published 必填欄位為空白時驗證失敗；draft 可暫存不完整欄位。
5. published 指向不存在的圖片時驗證失敗；頁面圖片有可讀 alt。
6. `aliases: []`、圖片 credit 等非必要空值不產生空白資訊卡。
7. `isDemo` true 在首頁清單與詳情頁都可見示範標記。
8. GitHub Pages 子路徑下所有圖片及植物連結正常。

## 執行方式

將 `src/`、`scripts/` 和 `docs/` 對應檔案放進 Astro 專案。安裝 `zod` 和開發依賴 `tsx`。package.json 添加 `"validate:data": "tsx scripts/validate-data.ts"`，於 build 前執行。另由 Astro 檢查確認 TS 與路由。
