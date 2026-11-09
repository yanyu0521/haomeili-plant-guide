# 新增植物檢查表

- [ ] 經現場調查，確認該種植物確實存在於好美里防風林
- [ ] 取得植物中文名、學名、科別、別名及四項介紹文字的可信資料來源
- [ ] 準備一張有權使用的植物圖示 SVG，並在頁面標示來源；清楚說明圖示不是現場照片
- [ ] 使用小寫英文、數字與連字號設定唯一 `slug`
- [ ] 在 `src/data/plants.json` 增加一筆資料；`order` 設為唯一正整數
- [ ] 草稿先使用 `status: "draft"`，確認完成後才改 `published`
- [ ] `image.file` 只填檔名；植物圖示放 `public/plants/`
- [ ] 新增 `mapPosition`，依 963 × 638 參考底圖填入圖面座標
- [ ] 填入可信的 `sourceUrls`，方便讀者與維護者追溯物種介紹
- [ ] 清楚標示點位依參考地圖整理，並非 GPS 測量座標
- [ ] `npm run validate:data` 通過
- [ ] `npm run check`、`npm run build`、`npm run test:site` 通過
- [ ] 實際使用手機檢查連結、植物圖示、資料來源與上下頁順序
- [ ] 取得專案負責人的 GitHub 遠端操作批准後再部署
