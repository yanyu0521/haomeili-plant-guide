# 新增植物檢查表

- [ ] 經現場調查，確認該種植物確實存在於好美里防風林
- [ ] 取得植物中文名、學名、科別、別名及四項介紹文字的可信資料來源
- [ ] 準備一張有權使用的現場照片（jpg/jpeg/png/webp）；拍攝方向、辨識重點清楚
- [ ] 使用小寫英文、數字與連字號設定唯一 `slug`
- [ ] 在 `src/data/plants.json` 增加一筆資料；`order` 設為唯一正整數
- [ ] 草稿先使用 `status: "draft"`，確認完成後才改 `published`
- [ ] `image.file` 只填檔名；正式發布照片放 `src/assets/plants/`
- [ ] 如果還沒有現場照片，先保留 draft，避免加入未授權或誤導的圖片
- [ ] 真正實地確認完成後才設為 `isDemo: false`
- [ ] `npm run validate:data` 通過
- [ ] `npm run check`、`npm run build`、`npm run test:site` 通過
- [ ] 實際使用手機檢查連結、照片、正確的植物資料與上下頁順序
- [ ] 取得專案負責人的 GitHub 遠端操作批准後再部署
