# Codex 接手指示

1. 先檢查目前工作目錄及 Git 狀態；不要覆蓋現有檔案。若已有同名檔案，先比較差異回報。
2. 本資料夾是 ChatGPT 離線生成的 Astro 版初稿，含資料驗證與示範圖片；不代表已通過 Astro 建置。
3. 如果已有舊版 `haomeili-data-design-v1.zip`，以本專案整合版本的檔案為主，但維持 `order`、`isDemo`、published/draft 既有契約。
4. 執行 `npm install`，提交新產生的 `package-lock.json`，再執行 `npm run verify`。
5. 若失敗，先釐清單一根因，最多進行必要、可解釋的修復，不要無限制重試。
6. 檢查包含 `getStaticPaths`、Image 的圖片最佳化、base URL、三個植物頁、draft 排除、JSON Zod 驗證與 404。
7. 針對新增 draft、重複 order、必填欄位空白、圖片不存在等進行負向測試，完成後恢復原 JSON。
8. 在 375/390/768/1280 寬度下實際檢查頁面與鍵盤操作；若無瀏覽器可用，明示未執行。
9. 除非使用者明確批准，禁止 git push、建立遠端 repo 或執行部署。
10. 回報僅包含重要修改、測試通過與失敗、未完成事項，不要全文輸出所有程式碼。
