import { sitePath } from './paths';

export const gameStations = [
  {
    slug: 'hibiscus-tiliaceus', art: 'hibiscus', skill: '心葉風盾',
    mission: '趕到迎風處，替身後的樹苗擋下一陣風。',
    task: '先到右線守住樹苗，葉片一抖就展盾。',
    question: '同一片黃槿心形葉翻了面，哪一面有灰白細毛？',
    choices: ['顏色淡，葉脈旁有細細的星狀紋', '顏色深，平整的葉面上可見葉脈'], answer: 0,
    hint: '看看葉脈之間的放大圓窗，哪一面有許多細小的放射狀線條？',
    fact: '心葉風盾是遊戲裡保護樹苗的招式。現地辨認黃槿，可以找心形葉背的灰白細毛。黃槿耐風、耐鹽，常與其他海岸樹種一同形成防風林。',
    fieldTask: '到黃槿點位，從下方觀察一片低處的心形葉，找找葉背的灰白細毛。',
    alt: '黃槿心形葉翻過來，露出淡色葉背。',
  },
  {
    slug: 'casuarina-equisetifolia', art: 'casuarina', skill: '林帶減風',
    mission: '讓樹列後方的飛砂慢下來。',
    task: '看砂團往哪段林帶吹，在飛砂到達布置線前種下樹列。',
    question: '沿著這根木麻黃綠枝找找，哪一段看得到鱗片狀的小葉？',
    choices: ['兩節交接處翹起一圈小齒', '枝條中段只有平行的直紋'], answer: 0,
    hint: '把兩張特寫的邊緣比一比，哪裡有一圈朝外的小尖角？',
    fact: '木麻黃的綠色小枝一節接一節，鱗片狀的小葉就長在節上。成排的木麻黃能減弱海風與飛砂。',
    fieldTask: '到地圖上的木麻黃點位，沿著一條綠枝找找，哪裡有一圈小齒？',
    alt: '放大的木麻黃綠色小枝，中段可見枝節與一圈細小的齒。',
  },
  {
    slug: 'lumnitzera-racemosa', art: 'lumnitzera', skill: '根系穩泥',
    mission: '潮水繼續流，讓根系把底泥留在岸邊。',
    task: '找出開始掉泥的岸線，趁缺口還沒被沖開時讓根系抓住底泥。',
    question: '比較同一片欖李厚葉的兩端，哪個標記量到較寬的位置？',
    choices: ['靠葉柄處，兩側葉緣才剛分開', '靠葉尖處，兩側葉緣已向外展開'], answer: 1,
    hint: '找出連著小枝的葉柄，再比一比兩張圖裡白色橫標的長度。',
    fact: '欖李的厚葉聚在枝端，靠葉尖的一端較寬。它生長在潮間帶，根系能穩固底泥、減慢水流。',
    fieldTask: '到欖李點位，找到枝條末端的一片厚葉，順著葉柄往葉尖看看哪裡最寬。',
    alt: '泥岸上的欖李枝條，厚葉聚在枝端，下方可見根系。',
  },
  {
    slug: 'pittosporum-tobira', art: 'pittosporum', skill: '紅籽接力',
    mission: '讓鳥把種子帶到下一段海岸林。',
    task: '跟著鳥換線，等牠雙腳落在枝頭，再送出紅籽。',
    question: '哪一顆海桐花果實已露出鳥可以取食的種子？',
    choices: ['外殼圓整，縱向細縫仍合著', '果殼向外翻開，中間擠著小圓粒'], answer: 1,
    hint: '看看果殼的邊緣。有沒有一個開口，讓鳥喙碰得到裡面？',
    fact: '海桐花成熟的果實會裂開，露出帶黏質的紅色種子。鳥類取食後，能幫助種子散布。',
    fieldTask: '到海桐花點位看看枝端。遇到結果時，找找哪些果殼已經張開。',
    alt: '海桐花裂開的果實和附近的鳥。',
  },
];

export function gameStationPath(slug: string): string | undefined {
  if (gameStations.some((station) => station.slug === slug)) {
    return sitePath(`game/?station=${encodeURIComponent(slug)}`);
  }
}
