const sourceTitles: Record<string, string> = {
  'nativetree.forest.gov.tw': '臺灣原生樹木資料庫',
  'hctbg.tfri.gov.tw': '林業試驗所恆春熱帶植物園',
  'cptfri.tfri.gov.tw': '林業試驗所植物園',
  'taitung.forest.gov.tw': '林業保育署臺東分署',
  'theme.forest.gov.tw': '林業保育署森林育樂場域',
  'www.forest.gov.tw': '林業保育署',
  'www.wra.gov.tw': '經濟部水利署',
  'www.tjnp.gov.tw': '台江國家公園',
  'www.marine.gov.tw': '海洋國家公園管理處',
  'www.oca.gov.tw': '海洋保育署',
  'www.taiwan.nps.gov.tw': '臺灣國家公園網站',
  'kmweb.moa.gov.tw': '農業知識入口網',
  'public.acri.gov.tw': '農業部農業試驗所',
  'www.ntsec.gov.tw': '國立臺灣科學教育館',
  'www.stsp.gov.tw': '南部科學園區管理局',
  'ari.kinmen.gov.tw': '金門縣農業試驗所',
  'www.agriculture.taichung.gov.tw': '臺中市政府農業局',
  'www.ktnp.gov.tw': '墾丁國家公園管理處',
};

export function sourceLabel(url: string): string {
  const host = new URL(url).hostname;
  return sourceTitles[host] ?? host;
}
