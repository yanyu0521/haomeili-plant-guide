import { gameStations } from './gameStations';

type Lane = 0 | 1 | 2;
type Phase = 'ready' | 'warning' | 'success' | 'miss' | 'complete';

export interface CoastalGameState {
  phase: Phase;
  paused: boolean;
  wave: number;
  cleared: number;
  lane: Lane;
  targetLane: Lane;
  message: string;
  skill: string;
  skillReady: boolean;
  windowPassed: boolean;
  remainingMs: number;
  durationMs: number;
}

interface GameOptions {
  arena: HTMLElement;
  station: string;
  onUpdate: (state: CoastalGameState) => void;
  onComplete: () => void;
}

const laneNames = ['左線', '中線', '右線'] as const;

interface Challenge {
  lanes: [Lane, Lane, Lane];
  event: string;
  instruction: string;
  readyMessage: string;
  earlyMessage: string;
  lateMessage: string;
  timeoutMessage: string;
  windowStart: number;
  windowLength: number;
  success: string;
  encounterArt: string;
  skillArt: string;
}

// Each drawing is local game artwork. Shapes inherit the palette of the arena.
const challenges: Record<string, Challenge> = {
  'hibiscus-tiliaceus': {
    lanes: [2, 0, 1],
    event: '一陣強風逼近',
    instruction: '觀察迎風葉片；看到葉片抖動時，立刻展開風盾。',
    readyMessage: '陣風已吹到，現在展開黃槿的心葉風盾！',
    earlyMessage: '風還沒有吹到，等迎風葉片開始抖動再展盾。',
    lateMessage: '陣風已經吹過，等下一次葉片抖動時展盾。',
    timeoutMessage: '陣風已經吹過。等下一波葉片開始抖動時再展盾。',
    windowStart: 0.53, windowLength: 0.18,
    success: '風勢緩下來了！認一認黃槿心形葉背的灰白細毛。',
    encounterArt: `
      <g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round">
        <path d="M4 25h40c15 0 13-18 3-17-6 0-9 4-9 8"/>
        <path d="M14 34h45c16 0 19-20 6-21"/>
        <path d="M6 43h36c14 0 14 17 3 17-5 0-8-3-8-6"/>
      </g>
      <g fill="#b8d489"><path d="M65 48q9-5 13-1-5 8-13 1Z"/><path d="M6 16q5-8 12-6-2 8-12 6Z"/></g>`,
    skillArt: `
      <path d="M40 65C29 54 8 39 10 24 12 10 27 7 40 20 55 6 70 12 71 26 71 42 52 59 40 65Z" fill="#b9d7b1" stroke="#457e69" stroke-width="2.5"/>
      <g fill="none" stroke="#769987" stroke-width="2" stroke-linecap="round"><path d="M40 64V22m0 29-20-17m20 7L25 23m15 30 20-18m-20 5 15-16"/></g>`,
  },
  'casuarina-equisetifolia': {
    lanes: [0, 2, 1],
    event: '飛砂捲來了',
    instruction: '觀察飛砂方向，先到迎風線，在砂粒碰到樹列前布置林帶。',
    readyMessage: '飛砂進入迎風線，現在布置木麻黃林帶！',
    earlyMessage: '還沒看清飛砂方向，再觀察一下，找到迎風線後布置林帶。',
    lateMessage: '飛砂已經穿過樹列，下一波要提早布置林帶。',
    timeoutMessage: '飛砂已穿過樹列。下一波看準方向，提早布置林帶。',
    windowStart: 0.12, windowLength: 0.18,
    success: '穿過木麻黃林帶，砂粒慢下來了！留意綠色小枝上的節。',
    encounterArt: `
      <g fill="none" stroke="#ebe0bb" stroke-linecap="round">
        <path d="M7 22q16-8 36-3m-31 18q21-8 48-3m-39 18q14-5 32-3" stroke-width="2.6"/>
      </g>
      <g fill="#e9bc76"><circle cx="51" cy="18" r="3.5"/><circle cx="32" cy="27" r="2"/><circle cx="64" cy="28" r="3"/><circle cx="71" cy="40" r="4"/><circle cx="45" cy="42" r="2.2"/><circle cx="57" cy="51" r="3"/><circle cx="35" cy="60" r="2.5"/><circle cx="19" cy="46" r="2"/></g>`,
    skillArt: `
      <g stroke="#a5d9bb" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 66V24m0 4L7 43m9-17 8 16m-8-5L4 53m12-16 11 16"/>
        <path d="M40 66V8m0 5L29 31m11-18 11 18m-11-5L25 46m15-20 15 20m-15-6L22 58m18-18 18 18"/>
        <path d="M64 66V23m0 5-8 14m8-16 9 16m-9-5L52 54m12-17 12 16"/>
      </g>`,
  },
  'lumnitzera-racemosa': {
    lanes: [0, 1, 2],
    event: '潮水湧向泥岸',
    instruction: '觀察哪一線泥岸裂縫擴大，在水線抵達前穩住底泥。',
    readyMessage: '泥岸缺口正在擴大，現在用欖李根系穩住底泥！',
    earlyMessage: '泥岸還沒有出現擴大的缺口，等裂縫逼近水線再穩泥。',
    lateMessage: '水線已越過缺口。下一波在泥岸被沖開前穩泥。',
    timeoutMessage: '缺口被潮水沖開了。下一波留意裂縫，提早穩泥。',
    windowStart: 0.43, windowLength: 0.2,
    success: '底泥留下來了！欖李的根系有助穩固泥岸、緩衝潮水。',
    encounterArt: `
      <path d="M3 41c12-2 16-21 30-28 11-5 23-2 27 5-13-4-18 5-10 13 6 6 18 6 27 2v17H3Z" fill="#89cec8"/>
      <path d="M3 52q11-7 23 0t25 0 26-1M8 60q10-5 19 0t22 0 22-1" fill="none" stroke="#cdebe1" stroke-width="2.5" stroke-linecap="round"/>`,
    skillArt: `
      <g fill="none" stroke-linecap="round" stroke-width="3">
        <path d="M40 42V17m0 15 13-11m-13 3-11-8" stroke="#a2d398"/>
        <path d="M40 39q-4 13-16 20l-11 4m27-21q4 12 14 16l12 5M38 49l-1 14m8-15 2 13M25 59l-2 6" stroke="#dec098"/>
        <path d="M5 56q8-3 16 0m36-1q9-3 18 0" stroke="#84bdb0"/>
      </g>
      <g fill="#a5cc88"><path d="M32 19C17 19 17 7 23 8c8-1 11 5 9 11Z"/><path d="M40 19c-7-9-4-18 2-17 7 2 6 11-2 17Z"/><path d="M49 24c2-13 16-18 17-11 1 7-10 12-17 11Z"/></g>`,
  },
  'pittosporum-tobira': {
    lanes: [2, 1, 0],
    event: '小鳥飛過林間',
    instruction: '觀察鳥兒飛過三線，等牠停上枝頭後再送出紅籽。',
    readyMessage: '小鳥停上枝頭了，現在送出海桐花紅籽！',
    earlyMessage: '鳥兒還在飛，等牠停上枝頭再送出紅籽。',
    lateMessage: '鳥兒已經飛離枝頭。等牠下一次停棲時送籽。',
    timeoutMessage: '鳥兒飛離枝頭了。下一波等牠停下再送籽。',
    windowStart: 0.64, windowLength: 0.18,
    success: '小鳥取走了紅籽！海桐花的種子可以藉鳥類散布。',
    encounterArt: `
      <path d="m6 59 63-13" fill="none" stroke="#b59572" stroke-width="3" stroke-linecap="round"/>
      <path d="m39 49-2 6m10-9 1 6" fill="none" stroke="#e5bd81" stroke-width="2"/>
      <path d="M14 37 6 22l17 9c11 2 17-2 22-12 6-10 22-4 22 6 1 15-11 25-27 25-13 0-20-5-26-13Z" fill="#c8d9b4" stroke="#456c61" stroke-width="2"/>
      <path d="M19 33q16 5 31-6-8 19-31 6Z" fill="#708d77"/><path d="m66 23 10 4-10 3Z" fill="#dba452"/><circle cx="59" cy="24" r="2" fill="#283f3b"/>`,
    skillArt: `
      <path d="M38 23q-3-10 3-18" stroke="#b7ba79" fill="none" stroke-width="3"/>
      <path d="M39 26q-14-18-26-12-6 18 8 31l17-6q-4 13 4 22 15-9 13-22 14-3 14-20-18-2-30 7Z" fill="#e4b274" stroke="#af8058" stroke-width="2"/>
      <g fill="#d8624a" stroke="#944d42" stroke-width="1.6"><circle cx="31" cy="31" r="7"/><circle cx="43" cy="31" r="7"/><circle cx="37" cy="42" r="7"/><circle cx="56" cy="47" r="4.5"/><circle cx="66" cy="54" r="3"/></g>`,
  },
};

const rangerArt = `
  <ellipse cx="40" cy="65" rx="19" ry="4" fill="#0e2822" opacity=".45"/>
  <path d="m31 47-2 16h8l4-14 2 14h8l-2-18Z" fill="#394d46" stroke="#182e29" stroke-width="2"/>
  <path d="m28 60-3 5h11l1-5m6 0v5h12l-5-5" fill="#e5c597"/>
  <path d="m26 29-7 16 6 3 7-12m17-6 9 13-4 5-11-12" fill="#c4ad80" stroke="#344a39" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M28 27q12-5 22 0l2 23q-13 5-25 0Z" fill="#acc4a6" stroke="#374c3e" stroke-width="2.5"/>
  <path d="m30 28 6 19m12-20-6 20" stroke="#466552" stroke-width="3"/>
  <rect x="32" y="33" width="15" height="17" rx="4" fill="#799979" stroke="#3e604e" stroke-width="2"/>
  <path d="M33 39h13" fill="none" stroke="#d6cca1" stroke-width="2"/>
  <path d="M31 21q0 10 9 11 9-1 9-11Z" fill="#bb936e" stroke="#4d533e" stroke-width="2"/>
  <path d="m30 18 3-10q5-3 9-1 7-2 9 11" fill="#dfc698" stroke="#5c634b" stroke-width="2"/>
  <path d="M23 19q16-7 34-1l3 3q-19 6-39 0Z" fill="#eddbac" stroke="#626b50" stroke-width="2"/>
`;

function makeArt(className: string, shapes: string) {
  const element = document.createElement('div');
  element.className = className;
  element.setAttribute('aria-hidden', 'true');
  element.innerHTML = `<svg viewBox="0 0 80 72" width="80" height="72" aria-hidden="true" focusable="false">${shapes}</svg>`;
  return element;
}

/** Owns one round and its timers; call destroy before switching station or leaving play. */
export function mountCoastalGame({ arena, station, onUpdate, onComplete }: GameOptions) {
  const challenge = challenges[station];
  const plant = gameStations.find((entry) => entry.slug === station);
  if (!challenge || !plant) throw new Error(`Unknown game station: ${station}`);

  const listeners = new AbortController();
  const { signal } = listeners;
  const track = document.createElement('div');
  track.className = 'coast-lanes';
  track.setAttribute('aria-hidden', 'true');
  const lanes = laneNames.map((name, index) => {
    const lane = document.createElement('div');
    lane.className = 'coast-lane';
    lane.dataset.lane = String(index);
    const label = document.createElement('span');
    label.className = 'coast-lane-label';
    label.textContent = name;
    lane.append(label);
    track.append(lane);
    return lane;
  });
  const event = makeArt('coast-event', challenge.encounterArt);
  const player = makeArt('coast-player', rangerArt);
  const effect = makeArt('coast-effect', challenge.skillArt);
  arena.append(track, event, player, effect);
  arena.dataset.station = station;
  if (station === 'pittosporum-tobira') arena.style.setProperty('--event-start-lane', '1');

  const state: CoastalGameState = {
    phase: 'ready', paused: false, wave: 1, cleared: 0,
    lane: 1, targetLane: challenge.lanes[0], message: '', skill: plant.skill,
    skillReady: false, windowPassed: false, remainingMs: 0, durationMs: 0,
  };
  let retries = 0;
  let timer: number | undefined;
  let deadline = 0;
  let remaining = 0;
  let openingTimer: number | undefined;
  let closingTimer: number | undefined;
  let openingAt = 0;
  let closingAt = 0;
  let openingRemaining = 0;
  let closingRemaining = 0;
  let clockTimer: number | undefined;
  let pending: (() => void) | undefined;

  function render() {
    arena.dataset.phase = state.phase;
    arena.dataset.paused = String(state.paused);
    arena.dataset.ready = String(state.skillReady);
    arena.style.setProperty('--lane', String(state.lane));
    arena.style.setProperty('--target', String(state.targetLane));
    lanes.forEach((lane, index) => {
      lane.classList.toggle('is-current', index === state.lane);
      lane.classList.toggle('is-target', index === state.targetLane);
    });
    onUpdate({ ...state, remainingMs: state.phase === 'warning' && !state.paused ? Math.max(0, deadline - performance.now()) : state.remainingMs });
  }

  function clearOpportunityTimers() {
    window.clearTimeout(openingTimer);
    window.clearTimeout(closingTimer);
    window.clearInterval(clockTimer);
    openingTimer = undefined;
    closingTimer = undefined;
    clockTimer = undefined;
  }

  function updateClock() {
    if (state.phase !== 'warning' || state.paused) return;
    state.remainingMs = Math.max(0, deadline - performance.now());
    onUpdate({ ...state });
  }

  function arm() {
    if (!pending || state.paused || signal.aborted) return;
    deadline = performance.now() + remaining;
    timer = window.setTimeout(() => {
      timer = undefined;
      const action = pending;
      pending = undefined;
      action?.();
    }, remaining);
    if (state.phase !== 'warning') return;

    if (!state.skillReady) {
      openingAt = performance.now() + openingRemaining;
      openingTimer = window.setTimeout(() => {
        openingTimer = undefined;
        openingRemaining = 0;
        state.skillReady = true;
        state.message = `${laneNames[state.targetLane]}，${challenge.readyMessage}`;
        render();
      }, openingRemaining);
    }
    if (!state.windowPassed) {
      closingAt = performance.now() + closingRemaining;
      closingTimer = window.setTimeout(() => {
        closingTimer = undefined;
        closingRemaining = 0;
        state.skillReady = false;
        state.windowPassed = true;
        state.message = challenge.lateMessage;
        render();
      }, closingRemaining);
    }
    updateClock();
    clockTimer = window.setInterval(updateClock, 250);
  }

  function after(ms: number, action: () => void) {
    window.clearTimeout(timer);
    clearOpportunityTimers();
    remaining = ms;
    pending = action;
    arm();
  }

  function warn() {
    state.phase = 'warning';
    state.wave = state.cleared + 1;
    state.targetLane = challenge.lanes[state.cleared];
    if (station === 'pittosporum-tobira') {
      arena.style.setProperty('--event-start-lane', String((state.targetLane + 1) % 3));
    }
    state.windowPassed = false;
    state.skillReady = false;
    state.message = `${challenge.event}。觀察事件落在哪一線，再移到該線；${challenge.instruction}${state.cleared === 0 ? ' 第一波會示範提示時機，目標線轉綠時出招。' : ''}`;
    const duration = 15000 - state.cleared * 2200 + Math.min(retries, 4) * 1800;
    state.durationMs = duration;
    state.remainingMs = duration;
    arena.style.setProperty('--wave-ms', `${duration}ms`);
    arena.style.removeProperty('--event-start-top');
    arena.dataset.ready = 'false';
    openingRemaining = duration * challenge.windowStart;
    const practiceWindow = challenge.windowLength * (state.cleared === 0 ? 1.35 : 1);
    closingRemaining = Math.min(duration - 500, openingRemaining + duration * practiceWindow);
    after(duration, () => miss(challenge.timeoutMessage));
    render();
  }

  function miss(reason: string) {
    retries += 1;
    state.skillReady = false;
    state.remainingMs = 0;
    state.phase = 'miss';
    state.message = `${reason}。再試一次，目標是${laneNames[state.targetLane]}。`;
    after(1750, warn);
    render();
  }

  function chooseLane(index: number) {
    if (state.paused || signal.aborted || state.phase === 'complete') return;
    const next = Math.max(0, Math.min(2, index)) as Lane;
    if (next === state.lane) return;
    state.lane = next;
    render();
  }

  function move(direction: -1 | 1) { chooseLane(state.lane + direction); }

  function activate() {
    if (state.paused || signal.aborted || state.phase !== 'warning') return;
    if (state.lane !== state.targetLane) {
      miss(`你在${laneNames[state.lane]}，目標在${laneNames[state.targetLane]}`);
      return;
    }
    if (!state.skillReady) {
      miss(state.windowPassed ? challenge.lateMessage : challenge.earlyMessage);
      return;
    }
    const arenaBounds = arena.getBoundingClientRect();
    const eventBounds = event.getBoundingClientRect();
    // These event sprites are centered on their CSS top anchor with translateY(-50%),
    // so use the center point and the arena's padding box to preserve the current position.
    const arenaHeight = arena.clientHeight;
    const arenaTop = arenaBounds.top + arena.clientTop;
    const startTop = arenaHeight > 0
      ? (eventBounds.top + eventBounds.height / 2 - arenaTop) / arenaHeight * 100
      : 36;
    arena.style.setProperty('--event-start-top', `${startTop}%`);
    retries = 0;
    clearOpportunityTimers();
    state.phase = 'success';
    state.skillReady = false;
    state.remainingMs = 0;
    state.cleared += 1;
    state.message = challenge.success;
    after(1700, () => {
      if (state.cleared < challenge.lanes.length) {
        warn();
        return;
      }
      state.phase = 'complete';
      state.message = '三波挑戰完成！來認認植物特徵。';
      render();
      if (!signal.aborted) onComplete();
    });
    render();
  }

  function pause() {
    if (state.paused || signal.aborted || state.phase === 'complete') return;
    state.paused = true;
    if (timer !== undefined) remaining = Math.max(0, deadline - performance.now());
    window.clearTimeout(timer);
    timer = undefined;
    if (openingTimer !== undefined) openingRemaining = Math.max(0, openingAt - performance.now());
    if (closingTimer !== undefined) closingRemaining = Math.max(0, closingAt - performance.now());
    clearOpportunityTimers();
    render();
  }

  function resume() {
    if (!state.paused || signal.aborted || document.hidden) return;
    state.paused = false;
    arm();
    render();
  }

  const keyboard = (e: KeyboardEvent) => {
    if (state.paused || e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;
    const target = e.target instanceof Element ? e.target : null;
    if (target?.closest('input,textarea,select,[contenteditable="true"],[role="dialog"],dialog')) return;
    switch (e.key.toLowerCase()) {
      case 'arrowleft': case 'a': e.preventDefault(); if (!e.repeat) move(-1); break;
      case 'arrowright': case 'd': e.preventDefault(); if (!e.repeat) move(1); break;
      case 'f':
        e.preventDefault();
        if (!e.repeat) activate();
    }
  };
  window.addEventListener('keydown', keyboard, { signal });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); }, { signal });

  let pointer: { id: number; x: number; y: number } | undefined;
  arena.addEventListener('pointerdown', (e) => {
    if (!e.isPrimary || e.button !== 0 || state.paused) return;
    pointer = { id: e.pointerId, x: e.clientX, y: e.clientY };
    arena.setPointerCapture(e.pointerId);
  }, { signal });
  arena.addEventListener('pointercancel', () => { pointer = undefined; }, { signal });
  arena.addEventListener('pointerup', (e) => {
    if (!pointer || pointer.id !== e.pointerId) return;
    const dx = e.clientX - pointer.x;
    const dy = e.clientY - pointer.y;
    pointer = undefined;
    if (Math.abs(dy) > 16 && Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) >= 22) {
      move(dx > 0 ? 1 : -1);
    } else {
      const bounds = arena.getBoundingClientRect();
      if (bounds.width > 0) chooseLane(Math.floor((e.clientX - bounds.left) / bounds.width * 3));
    }
  }, { signal });

  function destroy() {
    listeners.abort();
    window.clearTimeout(timer);
    clearOpportunityTimers();
    pending = undefined;
    track.remove();
    event.remove();
    player.remove();
    effect.remove();
    delete arena.dataset.phase;
    delete arena.dataset.paused;
    delete arena.dataset.station;
    delete arena.dataset.ready;
    for (const property of ['--lane', '--target', '--wave-ms', '--event-start-top', '--event-start-lane']) arena.style.removeProperty(property);
  }

  warn();
  if (document.hidden) pause();
  return { move, activate, pause, resume, destroy };
}
