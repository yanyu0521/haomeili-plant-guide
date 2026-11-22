import { laneNames, mountCoastalGame, type CoastalGameState } from './coastalGame';
import { renderFieldQuiz } from './fieldQuiz';
import type { gameStations } from './gameStations';

type Station = (typeof gameStations)[number] & {
  name: string; number: string; artUrl: string; detailUrl: string; mapUrl: string; stationUrl: string;
};

export function initForestGame() {
  const root = document.getElementById('forest-game');
  if (!root) return;
  const stations: Station[] = JSON.parse(document.getElementById('coastal-stations')!.textContent!);
  const el = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const lobby = el('[data-lobby]');
  const session = el('[data-session]');
  const panels = {
    brief: el('[data-brief]'), battle: el('[data-battle]'),
    quiz: el('[data-quiz]'), result: el('[data-result]'),
  };
  const quick = el<HTMLAnchorElement>('[data-quick]');
  const home = el<HTMLAnchorElement>('[data-home]');
  const skill = el<HTMLButtonElement>('[data-skill]');
  const pause = el<HTMLButtonElement>('[data-pause]');
  const resume = el<HTMLButtonElement>('[data-resume]');
  const hints = el<HTMLButtonElement>('[data-hints]');
  const retry = el<HTMLButtonElement>('[data-retry]');
  let fullHints = false;
  const speak = el<HTMLButtonElement>('[data-speak]');
  const storageKey = 'haomeili.coastal-game.completed.v1';
  const completed = new Set<string>();
  let station = stations[0];
  let round: ReturnType<typeof mountCoastalGame> | undefined;
  let voice: SpeechSynthesisUtterance | undefined;

  function loadProgress() {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (Array.isArray(saved)) {
        completed.clear();
        for (const s of stations) if (saved.includes(s.slug)) completed.add(s.slug);
      }
    } catch { /* Storage can be unavailable on a visitor's device. */ }
  }

  function updateProgress() {
    const next = stations.find((s) => !completed.has(s.slug));
    quick.href = (next ?? stations[0]).stationUrl;
    quick.querySelector('span')!.textContent = completed.size === 0 ? '開始守林' : next ? '繼續守林' : '再玩一次';
    el('[data-total]').textContent = `已完成 ${completed.size} / ${stations.length} 站`;
    for (const a of root!.querySelectorAll<HTMLAnchorElement>('[data-station-link]')) {
      a.querySelector<HTMLElement>('.fg-done-tag')!.hidden = !completed.has(a.dataset.stationLink!);
    }
  }

  function stopVoice() {
    if (voice) {
      voice.onend = voice.onerror = null;
      window.speechSynthesis.cancel();
      voice = undefined;
    }
    speak.querySelector('span')!.textContent = '聽這個特徵';
    el('[data-voice-status]').textContent = '';
  }

  function clearRound() { round?.destroy(); round = undefined; }

  function show(panel: keyof typeof panels, heading: string, focus = true) {
    lobby.hidden = true;
    session.hidden = false;
    for (const [id, element] of Object.entries(panels)) element.hidden = id !== panel;
    document.body.classList.toggle('coastal-game-playing', panel === 'battle');
    if (focus) {
      el(heading).focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  function setArt(selector: string) {
    const img = el<HTMLImageElement>(selector);
    img.src = station.artUrl;
    img.alt = station.alt;
  }

  function route(focus: boolean) {
    clearRound();
    stopVoice();
    const slug = new URL(location.href).searchParams.get('station');
    const selected = stations.find((s) => s.slug === slug);
    updateProgress();
    if (!selected) {
      document.body.classList.remove('coastal-game-playing');
      session.hidden = true;
      lobby.hidden = false;
      if (focus) {
        const link = Array.from(root!.querySelectorAll<HTMLAnchorElement>('[data-station-link]'))
          .find((a) => a.dataset.stationLink === station.slug);
        link?.focus();
      }
      return;
    }
    station = selected;
    if (history.state?.coastalResult === station.slug) {
      completed.add(station.slug);
      showResult(focus);
      return;
    }
    setArt('[data-brief-art]');
    el('[data-brief-id]').textContent = `第 ${station.number} 站 ・ ${station.name}`;
    el('[data-brief-title]').textContent = station.skill;
    el('[data-brief-mission]').textContent = station.mission;
    el('[data-brief-task]').textContent = station.task;
    show('brief', '[data-brief-title]', focus);
  }

  function go(url: string) {
    history.pushState(null, '', url);
    route(true);
  }
  for (const link of root.querySelectorAll<HTMLAnchorElement>('[data-quick],[data-station-link],[data-home]')) {
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      go(link.href);
    });
  }

  function updateRound(s: CoastalGameState) {
    el('[data-waves]').textContent = `守住 ${s.cleared} / 3 波`;
    const status = el('[data-status]');
    const position = el('[data-player-position]');
    const playerText = `目前位置：${laneNames[s.lane]}`;
    if (position.textContent !== playerText) position.textContent = playerText;
    el('[data-event-position]').textContent = `事件位置：${laneNames[s.eventLane]}`;
    if (status.textContent !== s.message) status.textContent = s.message;
    status.dataset.phase = s.phase;
    const playing = s.phase === 'approach' || s.phase === 'opportunity';
    const timebar = el<HTMLProgressElement>('[data-timebar]');
    timebar.hidden = !playing;
    timebar.max = Math.ceil(s.durationMs / 1000);
    timebar.value = s.seconds;
    const time = s.phase === 'approach' ? '觀察' : '可施放';
    el('[data-countdown]').textContent = playing ? `${time} ${s.seconds} 秒` : s.phase === 'success' ? '守護成功' : '未能守住';
    root!.querySelectorAll('.fg-pips i').forEach((pip, index) => pip.classList.toggle('is-full', index < s.cleared));
    const overlay = el('[data-pause-overlay]');
    const justPaused = s.paused && overlay.hidden;
    overlay.hidden = !s.paused;
    pause.disabled = s.paused;
    skill.disabled = !playing || s.paused;
    el<HTMLButtonElement>('[data-left]').disabled = !playing || s.paused;
    el<HTMLButtonElement>('[data-right]').disabled = !playing || s.paused;
    retry.hidden = s.phase !== 'miss';
    retry.disabled = s.paused;
    if (justPaused) resume.focus({ preventScroll: true });
  }
  function start() {
    clearRound();
    stopVoice();
    history.replaceState(null, '');
    el('[data-battle-id]').textContent = `第 ${station.number} 站 ・ ${station.name}`;
    el('[data-battle-title]').textContent = station.skill;
    skill.querySelector('strong')!.textContent = `發動${station.skill}`;
    show('battle', '[data-battle-title]');
    round = mountCoastalGame({ arena: el('[data-arena]'), station: station.slug, fullHints, onUpdate: updateRound, onComplete: quiz });
  }

  function quiz() {
    clearRound();
    el('[data-quiz-id]').textContent = `第 ${station.number} 站 ・ 植物辨識`;
    renderFieldQuiz(panels.quiz, station, finish);
    show('quiz', '[data-question]');
  }
  function nextStation() {
    const i = stations.indexOf(station);
    return [...stations.slice(i + 1), ...stations.slice(0, i)].find((s) => !completed.has(s.slug));
  }

  function finish() {
    loadProgress();
    completed.add(station.slug);
    try { localStorage.setItem(storageKey, JSON.stringify([...completed])); } catch { /* Keep in-memory progress. */ }
    history.replaceState({ coastalResult: station.slug }, '');
    showResult(true);
  }

  function showResult(focus: boolean) {
    updateProgress();
    setArt('[data-result-art]');
    el('[data-result-id]').textContent = `第 ${station.number} 站 ・ 守護成功`;
    el('[data-result-title]').textContent = `認出${station.name}了！`;
    el('[data-fact]').textContent = station.fact;
    el('[data-field-task]').textContent = station.fieldTask;
    const map = el<HTMLAnchorElement>('[data-map]');
    map.href = station.mapUrl;
    map.querySelector('span')!.textContent = `看地圖上的第 ${station.number} 站`;
    const audio = el<HTMLAnchorElement>('[data-audio]');
    audio.href = `${station.detailUrl}#audio-guide`;
    audio.querySelector('span')!.textContent = `聽${station.name}介紹`;
    speak.hidden = !('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window);
    const next = nextStation();
    el('[data-next] span').textContent = next ? `下一站・${next.name}` : '回到關卡總覽';
    el('[data-result-progress]').textContent = completed.size === stations.length
      ? '四站都完成了！到步道上找找這四種植物吧。' : `已完成 ${completed.size} / ${stations.length} 站`;
    show('result', '[data-result-title]', focus);
  }

  speak.addEventListener('click', () => {
    if (voice) { stopVoice(); return; }
    const line = new SpeechSynthesisUtterance(station.fact);
    line.lang = 'zh-TW';
    line.onend = () => { if (voice === line) stopVoice(); };
    line.onerror = () => {
      if (voice !== line) return;
      stopVoice();
      el('[data-voice-status]').textContent = '目前無法播放，可閱讀上方的辨識說明。';
    };
    voice = line;
    speak.querySelector('span')!.textContent = '停止播放';
    window.speechSynthesis.speak(line);
  });
  el('[data-start]').addEventListener('click', start);
  el('[data-replay]').addEventListener('click', start);
  el('[data-next]').addEventListener('click', () => go(nextStation()?.stationUrl ?? home.href));
  el('[data-left]').addEventListener('click', () => round?.move(-1));
  el('[data-right]').addEventListener('click', () => round?.move(1));
  skill.addEventListener('click', () => round?.activate());
  retry.addEventListener('click', () => {
    round?.retry();
    el('[data-battle-title]').focus({ preventScroll: true });
  });
  hints.addEventListener('click', () => {
    fullHints = !fullHints;
    hints.setAttribute('aria-pressed', String(fullHints));
    el('[data-hint-value]').textContent = fullHints ? '開' : '關';
    round?.setHints(fullHints);
  });
  pause.addEventListener('click', () => round?.pause());
  resume.addEventListener('click', () => { round?.resume(); el('[data-battle-title]').focus({ preventScroll: true }); });
  window.addEventListener('popstate', () => route(true));
  window.addEventListener('pagehide', () => { round?.pause(); stopVoice(); });
  window.addEventListener('pageshow', () => { loadProgress(); updateProgress(); });
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey || event.key === null) {
      loadProgress();
      updateProgress();
    }
  });
  loadProgress();
  document.body.classList.remove('coastal-game-playing');
  route(false);
}
