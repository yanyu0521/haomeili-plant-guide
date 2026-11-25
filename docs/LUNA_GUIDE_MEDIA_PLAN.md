# 好美里植物導覽更新｜GPT‑6 Luna 執行計畫與結果

本文件先供 GPT‑6 Luna 執行，之後已依使用者指示在現有 Astro 專案完成實作。目標是讓遊客在步道上先用插圖認出特徵，再一鍵切到照片，對照眼前的植物。網站共有 15 個導覽點；每站現在都有原創植物圖版、附來源的 CC0 實拍參考照，以及響應式尺寸。

## 一、遊客會看到什麼

| 位置 | 畫面與操作 |
| --- | --- |
| 首頁「步道前 3 站」 | 標題下方放一組「植物插圖／實拍照片」，一按切換三張卡片。縮圖取最容易辨認的局部，整張卡維持可點。 |
| 植物名錄 | 名錄上方放同一組切換鈕，一次切換 15 站。站號、辨識句、詳情與地圖捷徑保持可見。 |
| 植物詳情 | 植物名和辨識句下方是切換鈕、整幅大圖及圖說。手機讓圖版獨占一列，桌機可放在文字旁。提供「看大圖」連到目前模式的高解析檔，讓遊客能放大看葉毛、節齒或樹皮。 |
| 地圖 | 完整地圖、詳情內的小地圖、首頁地圖封面均沿用原圖。原來的點位、植物 SVG、搜尋與定位照常運作。遊戲素材沿用現況。 |

首次開啟以插圖為預設。選了照片，進另一站、由名錄開詳情、重新整理或返回時都沿用選擇。切換只動導覽圖片、圖說、來源和大圖連結，語音繼續播放，捲動位置與鍵盤焦點留在原處。名錄按鈕放在清單外，避免遊客想換圖卻點進植物頁。

## 二、插圖製作規格

風格基準是使用者提供的手繪植物圖。同一工作區已留存[本機參考圖](../.impeccable/references/botanical-ink-reference.png)，供 Luna 製圖時查看。此檔由 Git 忽略，另開工作機時可隨交接附上原圖。網站使用新構圖與原創線稿。

- **一站一版。** 用暖象牙白紙底與近黑墨線。主枝、植株或根群占畫面約六成，旁邊安排二至三個有資料依據的局部。利用外輪廓、細線排線、點描三層筆觸交代葉脈、葉背茸毛、樹皮或枝節。留白讓小圖與主體容易區分，紙紋在手機上應比最細的植物線條淡。
- **細節服務辨識。** 每張主圖先回答該站的「現場先看哪裡」。花、果、枝葉如來自不同物候，做成分開的觀察小圖。對沒有可靠資料的器官就省略。圖說放在網頁文字層，方便放大與朗讀。參考圖上的植物排列、筆跡及署名都不帶入成品。
- **兩個觀看距離。** 已完成 15 張橫式 4:3 圖版原稿，並輸出 480、960、1440 像素寬 WebP；名錄依版面載入小尺寸，詳情與大圖連結使用較高解析度。照片保留原始比例，另產生相同三種寬度。
- **先做兩張校樣。** 先完成黃槿與木麻黃，同時在 390 像素寬手機看兩張整版與名錄縮圖。黃槿的葉背和花心要能分辨，木麻黃要看得出綠枝分節及節上的小齒。依此調整線寬與留白，再套用到其餘 13 站。

**給繪圖工具的指令範本**

> 為好美里海岸植物導覽繪製一張橫式 4:3 植物觀察圖版。主題是【中文名、學名與鑑定層級】。主圖清楚呈現【生長型態或第一辨識特徵】，旁邊獨立放大【局部 A】與【局部 B】。用近黑墨水描繪在暖象牙白纖維紙上，主輪廓清楚，細線順著葉脈與枝條方向走，點描只呈現真實質地。依提供的植物學資料核對器官的形狀、相對大小及著生位置。用留白區隔，不加字、不加簽名。每一版採適合該物種的原創構圖。

## 三、15 站繪圖清單與實拍來源

下表的照片均來自臺灣的 iNaturalist 觀察，上傳者為「葉子（leaf0605）」。已按每個照片 ID 核對官方紀錄的 `photos[].license_code = cc0`。前 14 張為研究級觀察，第 15 張特選可辨認紙狀樹皮的栽培個體。最右欄可打開該張照片及其觀察資料，地點照公開紀錄精度列示。繪圖時另讀 `src/data/plants.json` 中該站的 `fieldCue`、`appearance` 及所附植物學來源，補足實拍角度看不到的構造。

| 站／植物 | 圖版主體與放大細節 | 實拍內容與拍攝地 | 來源 |
| --- | --- | --- | --- |
| 01 黃槿 | 心形葉枝作主圖，翻葉展示葉背星狀毛，另畫展開的花與深色花心 | 黃花與深紅花心，臺北 | [照片](https://www.inaturalist.org/photos/141617374) · [紀錄](https://api.inaturalist.org/v1/observations/86009125) |
| 02 木麻黃 | 一束細長綠枝，放大一節看鱗片狀小齒，旁置木質果序 | 綠枝與不同成熟度的果序，苗栗縣 | [照片](https://www.inaturalist.org/photos/171413807) · [紀錄](https://api.inaturalist.org/v1/observations/102529404) |
| 03 欖李 | 枝端厚葉叢，單葉放大呈現上寬下窄的倒卵形，另畫白色小花 | 厚葉與白花，臺灣 | [照片](https://www.inaturalist.org/photos/329442192) · [紀錄](https://api.inaturalist.org/v1/observations/188258474) |
| 04 海桐花 | 枝端厚葉與花序，分開描繪單花、開裂蒴果與種子 | 枝端厚葉與白至淡黃色花序，臺北 | [照片](https://www.inaturalist.org/photos/190242000) · [紀錄](https://api.inaturalist.org/v1/observations/112625057) |
| 05 水黃皮 | 一片完整奇數羽狀複葉，保留末端小葉，另附蝶形花與扁莢 | 粉紫色蝶形花，臺北 | [照片](https://www.inaturalist.org/photos/55362991) · [紀錄](https://api.inaturalist.org/v1/observations/35131565) |
| 06 銀合歡 | 攤開二回羽狀複葉，讓兩層分枝清楚可數，另畫球形花序與長莢 | 白色球形花序，臺南市安定區 | [照片](https://www.inaturalist.org/photos/67287591) · [紀錄](https://api.inaturalist.org/v1/observations/42379392) |
| 07 龍爪茅 | 完整低矮草株與斜升草莖，頂端畫放射狀指穗，另取一穗放大 | 成叢放射狀指穗，臺中市 | [照片](https://www.inaturalist.org/photos/49378012) · [紀錄](https://api.inaturalist.org/v1/observations/31544286) |
| 08 紅海欖 | 以枝幹連至泥面的拱形支柱根為主，另畫對生葉與細長胎生苗 | 林緣支柱根群，臺灣 | [照片](https://www.inaturalist.org/photos/457170915) · [紀錄](https://api.inaturalist.org/v1/observations/255143638) |
| 09 白水木 | 枝端厚葉簇，放大銀白細毛，另畫彎曲的蠍尾狀花序 | 枝端密集葉簇，屏東縣 | [照片](https://www.inaturalist.org/photos/104296530) · [紀錄](https://api.inaturalist.org/v1/observations/64833495) |
| 10 文殊蘭 | 從基部叢生的帶狀葉配粗花莖，側繪單花細長花被 | 白花與帶狀葉，桃園市大園區 | [照片](https://www.inaturalist.org/photos/329110753) · [紀錄](https://api.inaturalist.org/v1/observations/188099954) |
| 11 海茄冬 | 泥面伸出的鉛筆狀呼吸根群作主視覺，配對生葉枝及葉背局部 | 樹冠與泥面呼吸根，臺南市 | [照片](https://www.inaturalist.org/photos/103008921) · [紀錄](https://api.inaturalist.org/v1/observations/64106364) |
| 12 欖仁樹 | 用樹形表達水平輪生的層狀側枝，另畫大倒卵形葉及扁橢圓果 | 整樹與分枝，高雄市 | [照片](https://www.inaturalist.org/photos/28893011) · [紀錄](https://api.inaturalist.org/v1/observations/18858803) |
| 13 截萼黃槿 | 畫出長尖葉端，花側面放大杯狀花萼的平截邊緣，與第 01 站對讀 | 淡黃色花、暗色花心及圓果，臺東縣 | [照片](https://www.inaturalist.org/photos/234895802) · [紀錄](https://api.inaturalist.org/v1/observations/137524041) |
| 14 木麻黃（長枝） | 依地圖紀錄畫下垂枝姿，局部只表達木麻黃屬可確認的有節小枝、鞘齒 | 同屬參考：木麻黃 *Casuarina equisetifolia* 的下垂綠枝，新北市石門區老梅 | [照片](https://www.inaturalist.org/photos/461841030) · [紀錄](https://api.inaturalist.org/v1/observations/257452875) |
| 15 白千層 | 讓薄層剝落的樹皮占主圖一半，旁配狹長葉與瓶刷狀花序 | 紙狀剝落樹皮，高雄市栽培個體 | [照片](https://www.inaturalist.org/photos/65718296) · [紀錄](https://api.inaturalist.org/v1/observations/41425948) |

**兩筆要特殊處理。** 第 09 站白水木的照片紀錄採用 *Heliotropium arboreum*，網站採用的 *H. foertherianum* 為同物異名。第 14 站依使用者決定採同屬參考照，圖說寫「同屬參考照｜木麻黃（Casuarina equisetifolia），攝於新北市石門區老梅。此導覽點僅確認為木麻黃屬（Casuarina sp.）。」詳情頁在照片下直接顯示，名錄照片模式也要在該列看得到物種與地點。[Kew 白水木學名對照](https://powo.science.kew.org/taxon/60430567-2)

**照片匯入方式。** 此次以單張明示 CC0 或有可核實公眾領域依據為「無版權」的採用標準。逐張打開照片頁，核對物種、畫面、原始地點和權利標示；下載來源提供的尺寸，製成站內檔。保存上傳者或攝影者、作品頁、觀察頁、原始照片 ID、授權聲明連結與核對日期。公開圖說用「物種參考照｜攝於……」並附來源，插圖則標示實際製作方式。若照片失效，依相同標準補同一物種，無法核實就明列缺圖。[iNaturalist 單張照片說明](https://help.inaturalist.org/en/support/solutions/articles/151000233085-how-to-download-a-photo-from-inaturalist) · [CC0 聲明](https://creativecommons.org/publicdomain/zero/1.0/deed.zh-hant) · [公眾領域標章](https://creativecommons.org/publicdomain/mark/1.0/deed.zh-hant)

## 四、實作內容

1. `src/data/plant-media.json` 管理 15 站的插圖替代文字與辨識圖說、照片物種、公開地點、攝影者、照片 ID、觀察紀錄 ID 及 CC0 授權。`src/lib/plantMedia.ts` 負責資料驗證與路徑查詢；`scripts/validate-data.ts` 確認每個已發布點位有完整媒體尺寸。
2. `src/components/GuideMediaToggle.astro` 提供原生單選切換，並以瀏覽器儲存記住模式；`src/components/GuideMediaImage.astro` 提供響應式圖片與替代文字。首頁精選、植物名錄和詳情頁都使用同一套媒體資料；照片失效時退回同站插圖。
3. `src/components/AudioGuide.astro` 換站時同步更新詳情頁圖片、圖說、來源和大圖連結，保留目前的模式偏好。首頁與名錄各站可見照片圖說。
4. `scripts/import-guide-media.mjs` 依 iNaturalist 官方紀錄再次核對照片 ID、CC0 授權、攝影者及物種後下載並輸出 WebP。原創圖版由 AI 生成並已在網站標示為插圖；地圖及原始 `src/data/plants.json` 圖示資料維持獨立。
5. 更新 `PRODUCT.md`、`README.md`、`docs/DATA_CONTRACT.md`、`docs/maintenance.md` 與 `docs/UI_UX_SPEC.md`，記錄媒體欄位、授權例外和維護流程。

## 五、完成狀態與檢視範圍

- **資料與媒體：** 15 張植物圖版、15 張 CC0 參考照片；照片與插圖各 45 個 480／960／1440 像素寬 WebP。匯入器及資料驗證通過。第 14 站依使用者決定採同屬參考照，照片說明明列物種和拍攝地；第 15 站明列為栽培個體及非研究級紀錄。
- **工程檢查：** `npm run validate:data`、`npm run check` 與 `npm run build` 通過；Astro check 回報 0 errors、0 warnings，建置輸出 19 個靜態路由。Impeccable UI detector 結果為空；`sharp` 已列為直接開發依賴。
- **瀏覽器檢視：** 390 CSS 像素寬手機檢視中，名錄切到照片後開啟詳情，偏好保持；語音選站後，標題、照片、圖說與大圖來源會同步更新。第 14 站同屬說明與地圖頁 15 個點位也已確認。
- **地圖保護：** `public/plants/*.svg`、`public/images/forest-map.svg`、`assets/plates/map-art.png` 以及 `src/data/plants.json` 均未修改；互動地圖可正常顯示點位。
- **尚未逐項檢視：** 320 像素窄螢幕、桌機截圖、模擬照片 404／弱網／停用儲存，以及每個點位圖版細節的植物學審稿。本次也未執行 `npm run test:site`。
