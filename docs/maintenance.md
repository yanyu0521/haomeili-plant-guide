# 好美里防風林植物導覽維護手冊

## 網站資料

所有植物集中在 `src/data/plants.json`。已發布資料依 `order` 產生首頁名錄、`/plants/` 名錄、`/map/` 地圖及個別植物頁。新增點位時須補齊植物資料、參考來源與地圖圖示。

## 更新植物資料

1. 設定唯一的小寫英文 `slug` 與唯一正整數 `order`。
2. 植物中文名、學名、科別與描述應連到可信的植物資料來源。
3. `mapPosition` 使用參考底圖 963 × 638 畫布上的 `{ "x": 230, "y": 147 }` 格式。它表示圖面相對位置，不是 GPS 座標。
4. 將圖示 SVG 放入 `public/plants/`，填寫 `image.file` 與描述性 `image.alt`。圖示來源需在 `image.credit` 註明。
5. 填寫外觀、環境、生態功能、防風林角色及 `sourceUrls`；來源網址會顯示在植物介紹頁。
6. 執行 `npm run validate:data`、`npm run check` 與 `npm run build`，再檢查地圖標記、植物頁和手機版名錄。

## 地圖與圖示來源

目前底圖及 15 個植物圖示取自 [1920 保安林・植物紀錄地圖](https://ieason0911.github.io/haomei-1920-forest-map/)。修改或新增地圖圖像時，保留來源說明。來源圖示是向量插圖，不是現場植物照片。

「木麻黃（長枝）」依來源地圖的標籤只記錄到 `Casuarina sp.`。若日後取得鑑定結果，更新學名、描述與來源，勿僅依枝條外觀推定種名。

## 遠端操作與部署

GitHub Pages workflow 僅允許手動啟動。除非專案負責人明確批准，勿推送變更或執行部署。

## 常用指令

```bash
npm install
npm run dev
npm run validate:data
npm run check
npm run build
npm run test:site
```
