import { birdFlightLane, createCoastalScene, type SceneFrame } from './coastalScene';

export const laneNames = ['左線', '中線', '右線'];
type Phase = SceneFrame['phase'];
type Wave = readonly [target: number, approachMs: number, opportunityMs: number];

interface Encounter {
  waves: [Wave, Wave, Wave];
  approaching: string;
  opportunity: string;
  action: string;
  early: string;
  wrongLane: string;
  late: string;
  effect: string;
}

// Each wave changes the direction, distance or arrival rhythm that the visitor observes.
const encounters: Record<string, Encounter> = {
  'pittosporum-tobira': {
    waves: [[2, 4100, 5400], [0, 3400, 4300], [2, 4700, 3800]],
    approaching: '鳥仍在飛，留意牠的雙腳。', opportunity: '鳥已收翅，雙腳停在枝上。',
    action: '送出紅籽', early: '鳥還在飛，等雙腳落在枝上。',
    wrongLane: '這根枝上沒有鳥，找找收起雙翅的那一隻。', late: '鳥已離枝，這次沒接到種子。',
    effect: '鳥從裂果取走紅籽，帶著種子飛遠了。',
  },
  'casuarina-equisetifolia': {
    waves: [[0, 1400, 4700], [2, 1200, 4200], [1, 1050, 3000]],
    approaching: '風剛起，留意飛砂的來向。', opportunity: '飛砂朝布置線逼近。',
    action: '布置林帶', early: '風剛起，等看清砂團在哪一線再布置。',
    wrongLane: '這裡沒有飛砂，跟著砂團找到前方的布置線。', late: '砂已越過布置線，這次來不及擋住它。',
    effect: '飛砂穿過木麻黃樹列後慢下來，林帶削弱了風力。',
  },
  'lumnitzera-racemosa': {
    waves: [[0, 2300, 5200], [2, 2500, 4200], [1, 3000, 3900]],
    approaching: '潮水抵岸，留意水紋旁的泥塊。', opportunity: '缺口在擴大，泥塊正往下掉。',
    action: '穩住底泥', early: '水紋才剛出現，等泥岸開始掉泥。',
    wrongLane: '這裡只有水紋，留意哪一段泥岸正在掉泥。', late: '缺口被水沖開，一塊底泥流走了。',
    effect: '根系扣住泥塊。水繼續流，這段泥岸留下來了。',
  },
  'hibiscus-tiliaceus': {
    waves: [[2, 2800, 5400], [0, 2600, 4200], [1, 4300, 3650]],
    approaching: '風正靠近，葉片還沒翻動。', opportunity: '陣風抵達，迎風的葉片翻動了。',
    action: '展開風盾', early: '葉片還沒翻動，等陣風抵達再展盾。',
    wrongLane: '這一線的葉片沒有翻動，到迎風的樹苗前展盾。', late: '陣風掃過，樹苗被吹彎了。',
    effect: '風盾接住陣風，後方的樹苗慢慢挺直。',
  },
};

export interface CoastalGameState {
  wave: number;
  cleared: number;
  phase: Phase;
  lane: number;
  eventLane: number;
  guided: boolean;
  paused: boolean;
  message: string;
  seconds: number;
  durationMs: number;
}

interface GameOptions {
  arena: HTMLElement;
  station: string;
  fullHints: boolean;
  onUpdate(state: CoastalGameState): void;
  onComplete(): void;
}

export function mountCoastalGame({ arena, station, fullHints, onUpdate, onComplete }: GameOptions) {
  const encounter = encounters[station];
  if (!encounter) throw new Error('未定義的守林關卡');
  const scene = createCoastalScene(arena, station);
  const listeners = new AbortController();
  const { signal } = listeners;
  let wave = 1;
  let lane = 1;
  let phase: Phase = 'approach';
  let elapsed = 0;
  let retries = 0;
  let paused = false;
  let lastTick = performance.now();
  let animation = 0;
  let successFrom = 0;
  let missedBy: SceneFrame['missedBy'] = null;
  let lastUI = '';
  const isBird = station === 'pittosporum-tobira';
  const isSand = station === 'casuarina-equisetifolia';

  const waveData = () => encounter.waves[wave - 1];
  const windowMs = () => waveData()[2] + Math.min(3, retries) * 850;
  function duration() {
    switch (phase) {
      case 'approach': return waveData()[1];
      case 'opportunity': return windowMs();
      case 'success': return isSand ? (1 - successFrom) * windowMs() + 1600 : 1600;
      case 'miss': return 1400; // Play the consequence once; stay here until the visitor retries.
    }
  }

  function describe(eventLane: number, guided: boolean) {
    const target = laneNames[waveData()[0]];
    switch (phase) {
      case 'approach':
        if (isBird) return guided ? `鳥飛過${laneNames[eventLane]}。到${target}等牠落腳。`
          : `鳥飛過${laneNames[eventLane]}，雙翅仍張開。`;
        if (wave === 1 && station === 'hibiscus-tiliaceus') return '先到右線，葉片一抖就展盾。';
        return encounter.approaching + (guided ? `先到${target}觀察。` : '');
      case 'opportunity':
        return `${laneNames[eventLane]}：${encounter.opportunity}` + (guided ? `現在${encounter.action}！` : '');
      case 'success': return encounter.effect;
      case 'miss':
        if (missedBy === 'early') return encounter.early;
        if (missedBy === 'lane') return encounter.wrongLane;
        return encounter.late;
    }
  }

  function paint() {
    const [target] = waveData();
    const span = duration();
    const progress = Math.min(1, elapsed / span);
    const eventLane = isBird && phase === 'approach' ? birdFlightLane(wave, target, progress) : target;
    const guided = fullHints || wave === 1;
    Object.assign(arena.dataset, { phase, lane, target, wave, guided, paused, ready: guided && phase === 'opportunity' });
    scene.draw({ wave, phase, target, lane, progress, resultMs: elapsed, successFrom, paused, missedBy,
      phaseDurationMs: phase === 'approach' ? span : windowMs() });
    const seconds = Math.max(0, Math.ceil((span - elapsed) / 1000));
    const signature = [phase, wave, lane, eventLane, guided, seconds, paused].join('/');
    if (signature === lastUI) return;
    lastUI = signature;
    onUpdate({ phase, wave, cleared: wave - (phase === 'success' ? 0 : 1), lane, eventLane, guided, paused,
      seconds, durationMs: span, message: describe(eventLane, guided) });
  }

  function enter(next: Phase) {
    phase = next;
    elapsed = 0;
  }

  // Input acts on the last presented frame. An invisible deadline cannot reject a still-perched bird.
  function tick(now: number) {
    if (paused || signal.aborted) return;
    elapsed += Math.max(0, now - lastTick);
    lastTick = now;
    if (elapsed >= duration()) {
      if (phase === 'approach') enter('opportunity');
      else if (phase === 'opportunity') {
        missedBy = 'late';
        successFrom = 1;
        enter('miss');
      } else if (phase === 'success') {
        if (wave === encounter.waves.length) { onComplete(); return; }
        wave++;
        retries = 0;
        resetAttempt();
      }
    }
    paint();
    if (phase !== 'miss' || elapsed < duration()) animation = requestAnimationFrame(tick);
  }

  function resetAttempt() {
    successFrom = 0;
    missedBy = null;
    enter('approach');
  }

  function chooseLane(index: number) {
    if (paused || (phase !== 'approach' && phase !== 'opportunity')) return;
    lane = Math.max(0, Math.min(2, index));
    paint();
  }

  function move(direction: -1 | 1) { chooseLane(lane + direction); }

  function activate() {
    if (paused || (phase !== 'approach' && phase !== 'opportunity')) return;
    successFrom = Math.min(1, elapsed / duration());
    missedBy = phase === 'approach' ? 'early' : lane !== waveData()[0] ? 'lane' : null;
    enter(missedBy ? 'miss' : 'success');
    lastTick = performance.now();
    paint();
  }

  function retry() {
    if (paused || phase !== 'miss') return;
    cancelAnimationFrame(animation);
    retries++;
    resetAttempt();
    lastTick = performance.now();
    paint();
    animation = requestAnimationFrame(tick);
  }

  function pause() {
    if (paused || signal.aborted) return;
    paused = true;
    cancelAnimationFrame(animation);
    paint();
  }
  function resume() {
    if (!paused || document.hidden || signal.aborted) return;
    paused = false;
    lastTick = performance.now();
    paint();
    animation = requestAnimationFrame(tick);
  }

  window.addEventListener('keydown', (e) => {
    if (paused || e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey || e.isComposing) return;
    if (e.target instanceof Element && e.target.closest('input,textarea,select,[contenteditable="true"],dialog')) return;
    switch (e.key.toLowerCase()) {
      case 'arrowleft': case 'a': e.preventDefault(); if (!e.repeat) move(-1); break;
      case 'arrowright': case 'd': e.preventDefault(); if (!e.repeat) move(1); break;
      case 'f': e.preventDefault(); if (!e.repeat) activate(); break;
    }
  }, { signal });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); }, { signal });

  let pointer: { id: number; x: number; y: number } | undefined;
  arena.addEventListener('pointerdown', (e) => {
    if (paused || !e.isPrimary || e.button !== 0) return;
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
    if (Math.abs(dx) >= 22) move(dx > 0 ? 1 : -1);
    else {
      const bounds = arena.getBoundingClientRect();
      if (bounds.width) chooseLane(Math.floor((e.clientX - bounds.left) / bounds.width * 3));
    }
  }, { signal });

  paint();
  animation = requestAnimationFrame(tick);
  if (document.hidden) pause();
  return {
    move, activate, retry, pause, resume,
    setHints(value: boolean) { fullHints = value; paint(); },
    destroy() {
      listeners.abort();
      cancelAnimationFrame(animation);
      scene.destroy();
      for (const key of ['phase','lane','target','wave','guided','paused','ready']) delete arena.dataset[key];
    },
  };
}
