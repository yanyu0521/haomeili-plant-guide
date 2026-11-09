# 好美里防風林植物資料規格

## 發布與排序

- `order` 是正整數，所有植物不得重複；名錄、地圖點位及上一種／下一種依 `order` 升冪排列。
- `status` 為 `published` 或 `draft`。草稿不產生公開頁面，也不出現在名錄、地圖或前後頁導覽。
- `isDemo` 保留為既有相容欄位；目前收錄的 15 筆資料皆為 `false`，專案內沒有示範植物紀錄。
- 「木麻黃（長枝）」依參考地圖僅確認至木麻黃屬，學名使用 `Casuarina sp.`，不得將外觀標籤當作種級鑑定。

## 必填欄位

- 通用：`slug`、`order`、`status`、`isDemo`、`name`。
- published：`scientificName`、`family`、`image.file`、`image.alt`、`mapPosition`、`appearance`、`habitat`、`ecologicalFunctions`、`windbreakRole`。
- 選填：`aliases`、`image.credit`、`sourceUrls`。
- `sourceUrls` 需為有效網址，並在植物介紹頁以「資料來源」呈現。
- `mapPosition` 使用參考底圖的 SVG 座標，原始畫布為 963 × 638；這是圖面位置，不是 GPS 經緯度。

## 植物圖示與地圖

- `image.file` 僅填小寫英數與連字號的 SVG 檔名，例如 `hibiscus-tiliaceus.svg`。
- 植物圖示放在 `public/plants/`，每個 published 植物使用一張來源地圖的圖示。
- 圖示是參考地圖上的向量插圖，不是現場植物照片；`image.alt` 與 `image.credit` 必須據實描述。
- 地圖底圖放在 `public/images/forest-map.svg`，互動標記由 `mapPosition` 生成。
- 若加入新點位，先確認來源地圖上的位置與圖示，再更新植物資料、SVG 圖示、來源網址和頁面文字。

## 內容與查證

- 四段文字需分別說明外觀、生長環境、生態功能及防風林角色，避免將一般物種特性寫成特定個體的現場觀察。
- 外來入侵種需清楚說明生態影響，不得將其描述為新植防風林的建議樹種。
- 點位文字應指出依參考地圖整理，不得稱為 GPS 實測位置。
- `sourceUrls` 保留各物種公開資料來源，供讀者追溯。
