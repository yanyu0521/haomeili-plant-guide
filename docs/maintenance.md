# 好美里防風林植物數位導覽網站：繁體中文維護手冊

## 本站如何運作

所有植物集中寫在 `src/data/plants.json`。網站會在建置時驗證 JSON，僅把 `status: "published"` 的植物依 `order` 數字升冪排序，產生首頁、`/plants/` 以及個別植物頁。

## 新增植物

1. 開啟 `src/data/plants.json`，參照 `docs/plant-template.json`，增加一個 JSON 物件。逗號、雙引號必須正確。
2. `slug` 必須為唯一的英文小寫英數／連字號，例如 `sample-plant`，生成網址為 `/haomeili-plant-guide/plants/sample-plant/`。
3. `order` 必須為不重複正整數，例如放在 10 與 20 之間可使用 15；上一種／下一種順序也會跟著變。
4. 尚在編輯時使用 `status: "draft"`。草稿不會有公開頁面，也不會顯示在清單。
5. 完成物種確認與內容校稿後，準備一張你有權使用的真實植物照片；檔案放入 `src/assets/plants/`，僅填檔名到 `image.file`，並寫具有描述性的 `image.alt`。
6. 設定 `status: "published"`，依序執行 `npm run validate:data`、`npm run check`、`npm run build`、`npm run test:site`。
7. 用手機實際點選完整清單、植物照片、上下頁及網址。

## 草稿及圖片隱私規則

**不要把草稿專用圖片放進 `src/assets/plants/`**。驗證器要求此資料夾裡每一張圖片都被 published 植物引用；否則中止建置。草稿照片建議暫時存放在專案外未公開位置，等發布時才加入，這可以降低意外部署草稿圖的風險。

## 修改植物資料

直接編輯該植物的 JSON 文字內容。`aliases` 可以省略或使用 `[]`；圖片 credit 可省略；空白選填欄位不渲染。別刪掉必要欄位。`sourceUrls` 用來保留資料來源，不會出現在頁面。

## 示範資料與假圖

現在的三筆為 **isDemo: true** 的功能示範，不表示已確認好美里有這些植物。專案包含三張英文註記的純色版型測試圖片（非照片）。它們只為測試 Astro 圖片最佳化流程；**正式對外宣傳或現場貼 QR Code 前，必須替換為現場照片、更新 alt 和 credit，並完成物種鑑定。**

## 本地啟動與檢查

需要 Node.js 22.16 以上；建議 Node.js 24。

```bash
npm install
npm run dev
npm run verify
```

開發中的基本網站路徑是 `http://localhost:4321/haomeili-plant-guide/`。

## GitHub Pages（需明確取得同意）

1. 儲存庫名稱必須是 `haomeili-plant-guide`，並將這份專案放在儲存庫根目錄。
2. 若尚無 `package-lock.json`，在首次成功 `npm install` 後一併加入版本控制。
3. 在 GitHub 儲存庫 **Settings → Pages** 將 Build and deployment 的 Source 改為 **GitHub Actions**。
4. 此專案的 workflow 僅允許手動 `workflow_dispatch` 執行，避免尚未批准就自動發布。
5. 負責人批准後，GitHub Actions → Deploy Astro to GitHub Pages → Run workflow。
6. 正式網址為 `https://<你的帳號>.github.io/haomeili-plant-guide/`，確認首頁、植物列表、照片與 QR Code 個別網址。

## 404

不建立自訂 404.html，也不改寫所有未知網址。不存在的植物 slug 沒有生成頁面，交由 GitHub Pages 預設 404。

## 失敗怎麼辦

- `validate:data` 報錯：看指定的 JSON 欄位或缺少的圖片；先修正資料，不要直接跳過驗證。
- `astro check` 報錯：檢查元件 props、型別與 Astro 語法。
- `astro build` 報錯：檢查已安裝套件、圖片路徑與 getStaticPaths。
- `test:site` 報錯：依錯誤訊息定位輸出 HTML、base、圖片資產或導覽連結，避免無限制重試。
