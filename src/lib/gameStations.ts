import { sitePath } from './paths';

export const gameStations = [
  {
    slug: 'hibiscus-tiliaceus', art: 'hibiscus', skill: '心葉風盾',
    mission: '迎向海風，展開黃槿的心葉風盾。',
    task: '先認風從哪一線來；等葉片開始抖動、陣風抵達時展盾。',
    question: '翻開黃槿的心形葉，葉背上有什麼？',
    choices: ['亮紅色種子', '灰白色細毛', '鱗片狀小葉'], answer: 1,
    hint: '看葉脈兩側，那一層淡色絨毛是它的特徵。',
    fact: '黃槿的心形葉背密生灰白色細毛。黃槿耐海風與鹽霧，是海岸防風林的一員。',
    alt: '黃槿心形葉翻過來，露出淡色葉背。',
  },
  {
    slug: 'casuarina-equisetifolia', art: 'casuarina', skill: '林帶減風',
    mission: '讓飛砂穿過木麻黃林帶，慢下來。',
    task: '觀察飛砂方向，讓守林人先到迎風線，在砂粒碰到樹列前布置林帶。',
    question: '木麻黃真正的葉子，長在哪裡？',
    choices: ['細枝平滑的中段', '整條下垂的長枝', '枝節上的一圈小齒'], answer: 2,
    hint: '沿著細長的綠枝，找找兩節交接處凸起的一圈小齒。',
    fact: '木麻黃的綠色小枝一節接一節，鱗片狀的小葉就長在節上。成排的木麻黃能減弱海風與飛砂。',
    alt: '放大的木麻黃綠色小枝，中段可見枝節與一圈細小的齒。',
  },
  {
    slug: 'lumnitzera-racemosa', art: 'lumnitzera', skill: '根系穩泥',
    mission: '潮水來了，讓欖李的根系穩住泥岸。',
    task: '觀察哪一線泥岸裂縫開始擴大，在水線抵達缺口前穩住底泥。',
    question: '看枝端的厚葉，欖李的葉片哪一端較寬？',
    choices: ['靠近葉尖的一端', '靠近葉柄的一端', '兩端一樣寬'], answer: 0,
    hint: '從葉柄沿著葉緣往外看，輪廓會先向外展開。',
    fact: '欖李的厚葉聚在枝端，靠葉尖的一端較寬。它生長在潮間帶，根系能穩固底泥、減慢水流。',
    alt: '泥岸上的欖李枝條，厚葉聚在枝端，下方可見根系。',
  },
  {
    slug: 'pittosporum-tobira', art: 'pittosporum', skill: '紅籽接力',
    mission: '跟著鳥的方向，送出海桐花的紅籽。',
    task: '觀察鳥兒飛過跑道，等牠停上枝頭時再送出紅籽。',
    question: '海桐花的果實裂開後，鳥會帶走什麼？',
    choices: ['白色花瓣', '帶黏質的紅色種子', '厚實的綠葉'], answer: 1,
    hint: '看裂開的果殼裡面，紅色的小顆粒吸引鳥來取食。',
    fact: '海桐花成熟的果實會裂開，露出帶黏質的紅色種子。鳥類取食後，能幫助種子散布。',
    alt: '海桐花裂開的果實和附近的鳥。',
  },
];

export function gameStationPath(slug: string): string | undefined {
  if (gameStations.some((station) => station.slug === slug)) {
    return sitePath(`game/?station=${encodeURIComponent(slug)}`);
  }
}
