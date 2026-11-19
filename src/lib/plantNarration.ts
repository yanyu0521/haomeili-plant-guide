import type { PublishedPlant } from './plantSchema';

const stationNarrations: Partial<Record<string, string>> = {
  'hibiscus-tiliaceus': '先找近圓形或心形的葉子，看看葉背有沒有灰白細毛。黃槿開花時，黃色花朵的中央常帶暗紫紅色。它耐海風，也能幫忙固定沙地。',
  'casuarina-equisetifolia': '看看木麻黃細長的綠枝，是不是一節一節的？真正的葉子縮成了枝節上的小鱗片。成排的木麻黃可以擋海風，也能減少吹進內陸的飛砂。',
  'lumnitzera-racemosa': '往枝梢看，欖李厚厚的葉子常聚在頂端，開花時會看到白色小花。泥面上有時還能找到像膝蓋一樣彎起的根。這些根能幫欖李在泥地裡換氣。',
  'pittosporum-tobira': '海桐花的葉子厚厚亮亮，常聚在枝梢。開花時可以找一簇簇白色小花。果實熟了會裂開，露出紅色的種子。',
  'pongamia-pinnata': '先看水黃皮的葉子，小葉沿著葉軸成對排列，最末端還有一片。花季可以找一串串淡紫或粉紅的花。成熟的莢果能漂在水上，隨水流移動。',
  'leucaena-leucocephala': '銀合歡的葉子像一層層小羽毛，開花時會有白色的小花球。它在開闊處長得很快，容易和原生植物搶空間，所以需要管理。',
  'dactyloctenium-aegyptium': '往腳邊找，看看草莖頂端有沒有像爪子一樣張開的花穗，這是龍爪茅的線索。它貼著地面長，能遮住裸露的土，讓表土比較不容易被風吹走。',
  'rhizophora-stylosa': '先看根，找從枝幹伸進泥裡、像拱門一樣的支柱根。這是紅海欖很醒目的特徵。根除了能固定泥灘，還留下小魚和螃蟹可以躲藏的空間。',
  'heliotropium-foertherianum': '看看枝梢那一團銀白色的葉子，白水木的葉面覆著細毛。開花時，白色小花會排成彎彎的一串，像蠍尾。它耐鹽也耐風，能在海邊形成低矮的灌木層。',
  'crinum-asiaticum': '先找從地面成叢伸出的長帶狀葉，開花時再看文殊蘭細長的白色花瓣。這片葉叢能幫忙覆蓋海邊的沙地。文殊蘭的鱗莖有毒，請不要食用。',
  'avicennia-marina': '往海茄冬周圍的泥面看，那些像鉛筆一樣直立的小根，是它的呼吸根。泥裡的氧氣少，這些露出泥面的根能幫它換氣。',
  'terminalia-catappa': '抬頭看看欖仁樹的枝條，一層一層往外伸，整棵樹像一把大傘。落葉前，葉片常會變成黃、橘或紅色。它的果實可以漂浮，跟著海水到別的地方。',
  'thespesia-populnea': '先看心形葉子前端拉出的長尖，也可以留意杯狀花萼平平的邊緣。這兩處都是辨認截萼黃槿的線索。它的花會從黃色慢慢轉紅。',
  'casuarina-long-branch': '找找這個點位細長、向下垂的小枝，有節的小枝是木麻黃屬的線索。地圖上的「長枝」是在描述外觀，目前只辨認到木麻黃屬，種名還待確認。',
  'melaleuca-leucadendra': '先看白千層灰白的樹皮，常會一層層地剝落。開花時往枝梢看，可以找到像瓶刷的白色花序。這些小花也會吸引昆蟲來訪。',
};

export function plantNarration(plant: PublishedPlant) {
  return stationNarrations[plant.slug] ?? `${plant.name}。${plant.fieldCue}`;
}
