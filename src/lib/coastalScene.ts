import '../styles/coastal-scene.css';

export interface SceneFrame {
  wave: number;
  phase: 'approach' | 'opportunity' | 'success' | 'miss';
  target: number;
  lane: number;
  progress: number;
  resultMs: number;
  /** During a result this is the duration of the preceding opportunity. */
  phaseDurationMs: number;
  successFrom: number;
  paused: boolean;
  missedBy: 'early' | 'lane' | 'late' | null;
}

const laneNames = ['左線', '中線', '右線'];
const laneX = (lane: number) => (lane + 0.5) * 100 / 3;
const mix = (from: number, to: number, t: number) => from + (to - from) * t;
const unit = (n: number) => Math.min(1, Math.max(0, n));

function sprite(root: HTMLElement, part: string, drawing: string, viewBox = '0 0 100 100') {
  const node = document.createElement('div');
  node.className = 'scene-sprite';
  node.dataset.scenePart = part;
  node.innerHTML = `<svg viewBox="${viewBox}" focusable="false" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round">${drawing}</svg>`;
  root.append(node);
  return node;
}

function place(node: HTMLElement, x: number, y: number) {
  node.style.left = `${x}%`;
  node.style.top = `${y}%`;
}

// Branches and birds share an artboard. The branch and the bird's extended toes
// meet at (48, 67), including in a short landscape arena.
const perchArt = `
  <path d="M2 89Q24 77 46 68Q64 66 93 50M29 75q-5-9-16-13m47 3q5-11 17-19"
    fill="none" stroke="#5e5141" stroke-width="6"/>
  <path d="M2 87Q24 75 46 67Q66 64 93 49M29 74q-7-10-16-12m47 2q5-11 17-19"
    fill="none" stroke="#ccb384" stroke-width="3"/>
  <g fill="#71946d" stroke="#bbcd94" stroke-width="1.1">
    <path d="M19 66Q3 67 3 53q13 0 16 13Zm4 1Q13 56 20 47q10 8 3 20Z"/>
    <path d="M81 54q-1-13 9-18 4 10-9 18Zm2 1q11-10 16-5-4 7-16 5Z"/>
  </g>
  <g class="pod" stroke="#f1ce92" stroke-width="1.1">
    <path d="M72 60Q57 58 59 48q7 0 13 8-2-9 3-14 5 5 2 14 7-8 14-7-3 11-16 13Z" fill="#c48b51"/>
    <g stroke="#8f4337" stroke-width=".9" fill="#fb7153">
      <circle cx="67" cy="53" r="3"/><circle cx="73" cy="50" r="3.6"/>
      <circle cx="77" cy="54" r="3"/><circle cx="71" cy="56" r="2.6"/>
    </g>
  </g>`;

const birdArt = `
  <g class="bird-body">
    <path d="m38 49-28-9 8 10 18 9" fill="#82917c" stroke="#cfcd9f" stroke-width="1.8"/>
    <path d="M26 47q16 0 24-10 8-12 18-8 10 3 10 15-1 13-17 18-22 7-35-15Z"
      fill="#ddd8a9" stroke="#495f51" stroke-width="2.1"/>
    <path d="M50 38q8-12 18-9 9 4 9 12-13 4-23 1Z" fill="#849976"/>
    <path d="m76 40 10 3-10 4Z" fill="#e8bd72" stroke="#735e42"/>
    <circle cx="69" cy="37.5" r="2.6" fill="#263f37"/><circle cx="69.6" cy="36.7" r=".8" fill="#fff5d6"/>
    <g class="wing-fold"><path d="M27 48q14 2 30-9-4 14-22 18Z" fill="#7c8e74" stroke="#adb997" stroke-width="1.2"/><path d="m34 52 15-7m-13 9 10-5" fill="none" stroke="#cdd2ac"/></g>
    <g class="wing-beat"><path d="M54 45Q49 20 28 7l2 12-8-5 6 14-7-3q9 17 24 24Z" fill="#94a88a" stroke="#dce0b9" stroke-width="1.8"/><path d="m48 41-14-22m11 24-14-15" fill="none" stroke="#607e6c" stroke-width="1.8"/></g>
    <g class="toes" fill="none" stroke="#e6b67e" stroke-width="2.3"><path d="m47 58-3 9-5 2m5-2 5 1m6-11-2 9-4 2m4-2 5 1"/></g>
    <circle class="carried-seed" cx="84" cy="45" r="4.5" fill="#ff7250" stroke="#ffd6a1" stroke-width="1.4"/>
  </g>`;

function birdLanePosition(wave: number, target: number, progress: number) {
  const start = wave === 1 ? 1 : (target === 2 ? 0 : 2);
  return mix(start, target, progress);
}

export function birdFlightLane(wave: number, target: number, progress: number) {
  return Math.round(birdLanePosition(wave, target, progress));
}

function birdScene(root: HTMLElement) {
  const branches = laneNames.map((_, lane) => {
    const branch = sprite(root, 'branch', perchArt);
    place(branch, laneX(lane), 49);
    return branch;
  });
  const bird = sprite(root, 'bird', birdArt);
  return (frame: SceneFrame, reduced: boolean) => {
    const { wave, phase, target } = frame;
    const pos = phase === 'miss' && frame.missedBy === 'early' ? frame.successFrom : frame.progress;
    const inFlight = phase === 'approach' || (phase === 'miss' && frame.missedBy === 'early');
    let x = laneX(target);
    let y = 49;
    if (inFlight) {
      const lane = reduced ? birdFlightLane(wave, target, pos) : birdLanePosition(wave, target, pos);
      x = laneX(lane);
      // Fly past the intermediate branch without settling on it.
      y = reduced ? 28 : mix(28, 49, pos) - 9 * Math.sin(Math.PI * pos);
    }

    let pose = inFlight ? 'flying' : 'perched';
    if (phase === 'success') {
      const lifting = unit((frame.resultMs - 370) / 750);
      pose = lifting > 0 || reduced ? 'carrying' : 'taking';
      if (reduced) y -= 8;
      else {
        x += (target === 2 ? -12 : 12) * lifting;
        y -= 25 * lifting;
      }
    } else if (phase === 'miss') {
      pose = 'departing';
      const departing = reduced ? 1 : unit(frame.resultMs / 650);
      y -= 19 * departing;
      x += (target === 2 ? -11 : 11) * departing;
    }
    bird.dataset.pose = pose;
    bird.style.setProperty('--wing-angle', reduced ? '0deg' : `${Math.sin(pos * 34) * 14}deg`);
    place(bird, x, y);
    branches.forEach((branch, index) => {
      branch.classList.toggle('seed-taken', phase === 'success' && index === target);
    });
  };
}

const plotArt = `
  <ellipse cx="50" cy="50" rx="46" ry="8" fill="#c5c5a0" fill-opacity=".2" stroke="#ece3b8" stroke-dasharray="4 4" stroke-width="1.5"/>
  <g stroke="#d7bd88" stroke-width="2.8"><path d="M7 50v-7m86 7v-7"/></g>`;
const treeArt = `
  <path d="M4 54q43-10 92-1" fill="none" stroke="#9fa97e" stroke-width="3"/>
  <g stroke="#435f4c" stroke-width="1.8" fill="#a9c393">
    <path d="m19 17-4 13 3-1-9 14 7-3-10 10 24-1-8-9 6 2-8-13 3 1Z"/>
    <path d="m52 8-6 20 4-3-13 16 8-3-14 13 36-1-12-13 8 3-11-16 5 3Z"/>
    <path d="m80 15-5 16 4-3-10 14 6-3-10 12 30-1-10-11 6 3-10-15 4 2Z"/>
  </g>
  <g fill="none" stroke="#eee3b5" stroke-width="1.5"><path d="M19 52V30m33 23V24m28 28V29"/></g>`;
const sandArt = `
  <g class="sand-trails" fill="none" stroke="#fff0c6" stroke-width="2.4">
    <path d="m33 18 8 12m-1-18 11 14m2-6 7 11m-35-3 8 12"/>
  </g>
  <g class="sand-grains" fill="#f9d399" stroke="#7d5f41" stroke-width="1">
    <circle cx="43" cy="34" r="3.1"/><circle cx="54" cy="29" r="2.3"/>
    <circle cx="32" cy="39" r="2.5"/><circle cx="62" cy="36" r="3.1"/>
    <circle cx="46" cy="42" r="2.4"/><circle cx="59" cy="44" r="2.8"/>
    <circle cx="50" cy="50" r="3.4"/><circle cx="37" cy="32" r="1.6"/>
  </g>`;

const rowY = 54;
const sandStart = (wave: number) => wave === 3 ? 39 : 25;
function sandTravel(wave: number, opportunity: number) {
  const p = unit(opportunity);
  return mix(sandStart(wave), rowY, .45 * p + .55 * p * p);
}

function sandScene(root: HTMLElement) {
  laneNames.forEach((_, lane) => place(sprite(root, 'plot', plotArt), laneX(lane), rowY));
  const row = sprite(root, 'row', treeArt);
  const sand = sprite(root, 'sand', sandArt);
  return (frame: SceneFrame, reduced: boolean) => {
    const { phase, wave, target } = frame;
    const start = sandStart(wave);
    const direction = wave === 2 ? -1 : 1;
    let y = start;
    if (phase === 'approach') y = reduced ? start - 7 : mix(start - 11, start, frame.progress);
    if (phase === 'opportunity') y = sandTravel(wave, reduced ? .5 : frame.progress);
    if (phase === 'miss') {
      const from = frame.missedBy === 'early'
        ? mix(start - 11, start, frame.successFrom) : sandTravel(wave, frame.successFrom);
      y = reduced ? 70 : mix(from, 76, unit(frame.resultMs / 1050));
    }
    if (phase === 'success') {
      // Keep the incoming trajectory until it physically reaches the planted row.
      const crossMs = (1 - frame.successFrom) * frame.phaseDurationMs;
      const beyondMs = Math.max(0, frame.resultMs - crossMs);
      const arrivalSpeed = (rowY - start) * 1.55 / frame.phaseDurationMs;
      const coastMs = 155;
      // At impact speed is continuous, then settles at 19% of arrival speed.
      const drift = arrivalSpeed * (.19 * beyondMs + .81 * coastMs * (1 - Math.exp(-beyondMs / coastMs)));
      y = sandTravel(wave, frame.successFrom + frame.resultMs / frame.phaseDurationMs) + drift;
      if (reduced) y = rowY + 7;
    }
    const x = laneX(target) - direction * (rowY - y) * .28;
    sand.dataset.side = direction > 0 ? 'from-left' : 'from-right';
    sand.dataset.pose = phase === 'approach' ? 'forming' : phase === 'success' && y >= rowY ? 'sheltered' : 'blowing';
    place(sand, x, y);
    place(row, laneX(target), rowY);
    row.hidden = phase !== 'success';
  };
}

const bankArt = `
  <g class="tidal-water">
    <path d="M3 64q13-7 25-3t23 0 23-1 23 2v12q-16 4-32 1T32 76Q14 78 3 72Z" fill="#649f9b"/>
    <g class="ripples" fill="none" stroke="#d6eee3" stroke-width="2.2" stroke-dasharray="12 6">
      <path d="M4 67q10-6 21-1t24 0 24-1 23 1m-85 6q10-4 22-1t21 0 21-1"/>
    </g>
  </g>
  <path d="M3 54Q11 46 25 46l14-5 11 3 15-4 18 5 14 4v10l-9 5-19-1-12 2-18-3-15 2-13-4-8 1Z"
    fill="#b48b68" stroke="#e8c99c" stroke-width="1.7"/>
  <path d="m4 54 13-1 11-3 10 2 13-2m9-2 10-2 11 4 14 1" fill="none" stroke="#6e6351" stroke-width="1.5"/>
  <path d="m8 52 6-3 9 .2m48-3 10 2m-53 9 4 1m41 1 5-1" fill="none" stroke="#edc5a0" stroke-width="1.1"/>
  <g class="notch">
    <path d="m48 43 6 5-4 5 6 5 5 8-22 1 8-11-4-4 6-4Z" fill="#486e69"/>
    <path d="m48 43 6 5-4 5 6 5 5 8" fill="none" stroke="#f2d5ac" stroke-width="1.6"/>
  </g>
  <g class="mud-crumbs" fill="#d4ad7d" stroke="#68594b" stroke-width="1.2"><path d="m45 59 6 1 2 4-6 2-4-2Z"/><path d="m52 65 4 .5 1 3-3 1-2-2Z"/><circle cx="42" cy="68" r="1.9"/></g>
  <g class="mud-roots">
    <g fill="none" stroke="#624b39" stroke-width="4"><path d="M51 48 35 58l-12 4m27-13 11 10 11 4M49 50l-1 12"/></g>
    <g fill="none" stroke="#f4d7a3" stroke-width="2"><path d="M51 48 35 58l-12 4m27-13 11 10 11 4M49 50l-1 12m-14-5-2 5m28-4 1 4M50 48V34"/></g>
    <path d="M50 41q-14 0-17-11 12-4 17 11Zm0-2q0-15 13-17 4 10-13 17Z" fill="#9fbf8a" stroke="#d2d5a7" stroke-width="1.5"/>
  </g>`;

function mudScene(root: HTMLElement) {
  const banks = laneNames.map((_, lane) => {
    const bank = sprite(root, 'shore', bankArt);
    place(bank, laneX(lane), 47);
    return bank;
  });
  return (frame: SceneFrame, reduced: boolean) => {
    const { phase, progress, target } = frame;
    const opportunity = phase === 'success' ? frame.successFrom : progress;
    const crack = phase === 'miss' ? 1.1 : phase === 'approach' ? .09 : .4 + .6 * (reduced ? .55 : opportunity);
    banks.forEach((bank, lane) => {
      const eroding = lane === target;
      bank.dataset.scenePart = eroding ? 'bank' : 'shore';
      bank.classList.toggle('with-water', eroding || (frame.wave === 3 && lane === (target + 1) % 3));
      if (eroding) {
        bank.style.setProperty('--crack-width', String(crack));
        const drift = phase === 'success' || reduced ? .5 : (opportunity * 3) % 1;
        bank.style.setProperty('--mud-dx', `${drift * 8}px`);
        bank.style.setProperty('--mud-dy', `${drift * 12}px`);
      }
    });
    const ripple = phase === 'success' || phase === 'miss' ? frame.resultMs / 52 : progress * frame.phaseDurationMs / 52;
    root.style.setProperty('--ripple-shift', String(reduced ? 0 : -ripple));
  };
}

const saplingArt = `
  <ellipse cx="51" cy="79" rx="21" ry="3" fill="#473e2f" opacity=".65"/>
  <g class="sapling-crown">
    <g stroke="#a78a59" fill="none" stroke-width="3.5"><path d="M51 79Q43 59 50 39q1-9 5-16m-7 34-15-8m16-2 14-9"/></g>
    <g stroke="#d0d9a7" stroke-width="1.4">
      <path d="M37 53q-12-2-19-16-1-7 6-7 5 0 7 4 2-6 7-3 10 4-1 22Z" fill="#789b71"/>
      <path class="signal-leaf" d="M52 40Q38 29 40 19q2-7 9-4l5 6q5-8 12-4 9 7-14 23Z" fill="#92ae76"/>
      <path d="M61 44q-4-11 2-16 5-4 9 1 5-4 8-1 7 9-19 16Z" fill="#88ab7b"/>
    </g>
    <g fill="none" stroke="#d4d8a7" stroke-width="1.2"><path d="m36 52-9-14m26 1 1-15m9 18 10-8"/></g>
    <g class="leaf-turn" fill="none" stroke="#fcf4db" stroke-width="2.2"><path d="m29 22 3-6m-2 12-6 3m40-20 6 2"/></g>
  </g>
  <g class="heart-shield">
    <path d="M35 72C24 64 5 52 6 40c1-9 10-14 17-11l8 5q8-10 17-5c16 9-3 34-13 43Z" fill="#a7d5b6" stroke="#deedd5" stroke-width="2.5"/>
    <path d="m35 69-4-31m3 21-13-8m12-2 8-9" fill="none" stroke="#53836e" stroke-width="2"/>
  </g>`;
const breezeArt = `
  <g fill="none" stroke="#ece8c9" stroke-width="3.5">
    <path d="M6 52h55q17-1 13-14-3-6-10-2"/><path d="M13 61h34q10 0 10 8 0 6-7 5"/>
    <path d="M23 43h23q12 0 11-10"/>
  </g>
  <g fill="#cbdca2"><path d="M78 47q9-6 15-3-5 9-15 3Zm-68-8q4-9 10-9-1 8-10 9Z"/></g>`;

function windScene(root: HTMLElement) {
  const seedlings = laneNames.map((_, lane) => {
    const seedling = sprite(root, 'plant', saplingArt);
    place(seedling, laneX(lane), 53);
    return seedling;
  });
  const wind = sprite(root, 'wind', breezeArt);
  return (frame: SceneFrame, reduced: boolean) => {
    const { phase, target } = frame;
    const approaching = phase === 'approach';
    const incoming = approaching && !reduced ? frame.progress : 1;
    const windX = laneX(target) - 5 - (1 - incoming) * (frame.wave === 2 ? -10 : 10);
    place(wind, windX, 27 + incoming * 9);
    let bend = 0;
    if (phase === 'opportunity') bend = reduced ? 21 : 19 + 6 * Math.sin(frame.progress * 52);
    if (phase === 'success') bend = reduced ? 0 : 20 * (1 - unit(frame.resultMs / 350));
    if (phase === 'miss') bend = 33;
    for (const [lane, seedling] of seedlings.entries()) {
      seedling.dataset.scenePart = lane === target ? 'seedling' : 'plant';
      seedling.style.setProperty('--bend', `${lane === target ? bend : 0}deg`);
    }
  };
}

const rangerArt = `
  <ellipse cx="40" cy="65" rx="19" ry="4" fill="#0e2822" opacity=".45"/>
  <path d="m31 47-2 16h8l4-14 2 14h8l-2-18Z" fill="#394d46" stroke="#182e29" stroke-width="2"/>
  <path d="m28 60-3 5h11l1-5m6 0v5h12l-5-5" fill="#e5c597"/>
  <path d="m26 29-7 16 6 3 7-12m17-6 9 13-4 5-11-12" fill="#c4ad80" stroke="#344a39" stroke-width="2.5"/>
  <path d="M28 27q12-5 22 0l2 23q-13 5-25 0Z" fill="#acc4a6" stroke="#374c3e" stroke-width="2.5"/>
  <path d="m30 28 6 19m12-20-6 20" stroke="#466552" stroke-width="3"/>
  <rect x="32" y="33" width="15" height="17" rx="4" fill="#799979" stroke="#3e604e" stroke-width="2"/>
  <path d="m33 39h13" fill="none" stroke="#d6cca1" stroke-width="2"/>
  <path d="m31 21q0 10 9 11 9-1 9-11Z" fill="#bb936e" stroke="#4d533e" stroke-width="2"/>
  <path d="m30 18 3-10q5-3 9-1 7-2 9 11" fill="#dfc698" stroke="#5c634b" stroke-width="2"/>
  <path d="m23 19q16-7 34-1l3 3q-19 6-39 0Z" fill="#eddbac" stroke="#626b50" stroke-width="2"/>`;

const scenes: Record<string, (root: HTMLElement) => (frame: SceneFrame, reduced: boolean) => void> = {
  'pittosporum-tobira': birdScene,
  'casuarina-equisetifolia': sandScene,
  'lumnitzera-racemosa': mudScene,
  'hibiscus-tiliaceus': windScene,
};

export function createCoastalScene(arena: HTMLElement, station: string) {
  const root = document.createElement('div');
  root.className = 'coast-scene';
  root.setAttribute('aria-hidden', 'true');
  const track = document.createElement('div');
  track.className = 'coast-lanes';
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
  root.append(track);
  arena.append(root);
  const paint = scenes[station](root);
  const ranger = sprite(root, 'ranger', rangerArt, '0 0 80 72');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

  function draw(frame: SceneFrame) {
    root.dataset.phase = frame.phase;
    lanes.forEach((lane, index) => {
      lane.classList.toggle('is-current', index === frame.lane);
      lane.classList.toggle('is-target', index === frame.target &&
        (arena.dataset.guided === 'true' || frame.phase === 'success' || frame.phase === 'miss'));
    });
    place(ranger, laneX(frame.lane), 83);
    paint(frame, motionPreference.matches);
  }

  return { draw, destroy: () => root.remove() };
}
