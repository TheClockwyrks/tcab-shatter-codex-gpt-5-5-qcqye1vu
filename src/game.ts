import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  BINDINGS,
  BULLET_LIFE,
  BULLET_R,
  CORE_R,
  CUES,
  FACE_UP,
  EXTRA_LIFE_STEP,
  FIELD_H,
  FIELD_W,
  FIRE_INTERVAL_TICKS,
  GAMEOVER_ITEMS,
  HALO_R,
  HIT_FLASH_TIME,
  INVULN_TIME,
  MAX_BULLETS,
  MU,
  MUZZLE_SPEED,
  PAUSE_ITEMS,
  ROCK_CHILD,
  ROCK_HEALTH,
  ROCK_RADIUS,
  ROCK_SPEED_MAX,
  ROCK_SPEED_MIN,
  SAFE_X,
  SAFE_Y,
  SAUCER_AIM_ERROR,
  SAUCER_BULLET_LIFE,
  SAUCER_BULLET_R,
  SAUCER_BULLET_SPEED,
  SAUCER_FIRE_INTERVAL,
  SAUCER_FIRST_DELAY,
  SAUCER_GAP_MAX,
  SAUCER_GAP_MIN,
  SAUCER_LIFETIME,
  SAUCER_R,
  SAUCER_SPEED,
  SAUCER_WEAVE_INTERVAL,
  SAUCER_WEAVE_SPEED,
  SCORE_LARGE,
  SCORE_MEDIUM,
  SCORE_SAUCER,
  SCORE_SMALL,
  SHATTER_DEBUG_VERSION,
  SHIP_DRAG_HALFLIFE,
  SHIP_MAX,
  SHIP_R,
  SHIP_THRUST,
  SHIP_TURN,
  SOFTEN,
  SPLIT_KICK,
  STAR_X,
  STAR_Y,
  TAGLINE_TEXT,
  TICK_DT,
  TICK_HZ,
  TITLE_ITEMS,
  TITLE_TEXT,
  TORPEDO_CONE,
  TORPEDO_LIFE,
  TORPEDO_R,
  TORPEDO_RECHARGE,
  TORPEDO_SCATTER,
  TORPEDO_SPEED,
  TORPEDO_TURN,
  TRAIL_TICKS,
  WAVE_BANNER_TIME,
  WAVE_BASE_ROCKS,
  WAVE_MIN_SHIP_DIST,
  WAVE_MIN_STAR_DIST,
  WAVE_SPEED_CAP,
  WAVE_SPEED_STEP,
  type RockSize,
} from "./constants";

export type Screen = "title" | "howto" | "playing" | "paused" | "gameover";
export type SaucerEdge = "left" | "right";
export type FieldEdge = "top" | "bottom" | "left" | "right";

export interface ShipState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly angle: number;
  readonly thrusting: boolean;
  readonly invuln: number;
  readonly collision: boolean;
  readonly fireCooldown: number;
}

export interface BulletState {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly life: number;
}

export interface RockState {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly size: RockSize;
  readonly spin: number;
  readonly health: number;
  readonly flash: number;
}

export interface SaucerState {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly mind: boolean;
  readonly gun: boolean;
  readonly travel: boolean;
  readonly weave: 1 | -1;
  readonly fireClock: number;
  readonly weaveClock: number;
  readonly age: number;
}

export interface TorpedoState {
  readonly id: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly heading: number;
  readonly life: number;
  readonly homing: boolean;
}

export interface ShatterState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly score: number;
  readonly lives: number;
  readonly wave: number;
  readonly waveBanner: number;
  readonly ship: ShipState;
  readonly bullets: readonly BulletState[];
  readonly rocks: readonly RockState[];
  readonly saucer: SaucerState | null;
  readonly enemyBullets: readonly BulletState[];
  readonly torpedoes: readonly TorpedoState[];
  readonly torpedoCharge: number;
  readonly waveSpawning: boolean;
  readonly saucerSpawning: boolean;
  readonly saucerClock: number;
  readonly saucerDue: number;
  readonly nextSaucerEdge: SaucerEdge | null;
  readonly nextSaucerRow: number | null;
  readonly nextSaucerAim: number | null;
  readonly nextRockSpeed: number | null;
  readonly nextRecycleEdge: FieldEdge | null;
  readonly tickClock: number;
  readonly nextId: number;
  readonly simTime: number;
  readonly muted: boolean;
}

interface MenuRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface ShatterSnapshot {
  readonly version: 1;
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly score: number;
  readonly lives: number;
  readonly wave: number;
  readonly waveBanner: number;
  readonly muted: boolean;
  readonly waveSpawning: boolean;
  readonly saucerSpawning: boolean;
  readonly saucerClock: number;
  readonly saucerDue: number;
  readonly nextSaucerEdge: SaucerEdge | null;
  readonly nextSaucerRow: number | null;
  readonly nextSaucerAim: number | null;
  readonly nextRockSpeed: number | null;
  readonly nextRecycleEdge: FieldEdge | null;
  readonly ship: ShipState & { readonly speed: number };
  readonly bullets: readonly BulletState[];
  readonly rocks: readonly (Omit<RockState, "spin" | "flash"> & {
    readonly radius: number;
  })[];
  readonly saucer: SaucerState | null;
  readonly enemyBullets: readonly BulletState[];
  readonly torpedoes: readonly TorpedoState[];
  readonly torpedoCharge: number;
  readonly torpedoReady: boolean;
  readonly simTime: number;
}

export interface ShatterDebugApi {
  readonly version: 1;
  reset(state: DeepReadonly<ShatterState>): ShatterState;
  snapshot(state: DeepReadonly<ShatterState>): ShatterSnapshot;
  reconcile(state: DeepReadonly<ShatterState>): ShatterState;
  menuItemRect(
    state: DeepReadonly<ShatterState>,
    index: number,
  ): MenuRect | null;
  setScreen(state: DeepReadonly<ShatterState>, screen: Screen): ShatterState;
  setMenuIndex(state: DeepReadonly<ShatterState>, n: number): ShatterState;
  setScore(state: DeepReadonly<ShatterState>, n: number): ShatterState;
  setLives(state: DeepReadonly<ShatterState>, n: number): ShatterState;
  setWave(state: DeepReadonly<ShatterState>, n: number): ShatterState;
  setWaveBanner(
    state: DeepReadonly<ShatterState>,
    seconds: number,
  ): ShatterState;
  setWaveSpawning(
    state: DeepReadonly<ShatterState>,
    enabled: boolean,
  ): ShatterState;
  setSaucerSpawning(
    state: DeepReadonly<ShatterState>,
    enabled: boolean,
  ): ShatterState;
  setSaucerDue(
    state: DeepReadonly<ShatterState>,
    seconds: number,
  ): ShatterState;
  setShipPosition(
    state: DeepReadonly<ShatterState>,
    x: number,
    y: number,
  ): ShatterState;
  setShipVelocity(
    state: DeepReadonly<ShatterState>,
    vx: number,
    vy: number,
  ): ShatterState;
  setShipAngle(
    state: DeepReadonly<ShatterState>,
    radians: number,
  ): ShatterState;
  setShipInvuln(
    state: DeepReadonly<ShatterState>,
    seconds: number,
  ): ShatterState;
  setFireCooldown(
    state: DeepReadonly<ShatterState>,
    ticks: number,
  ): ShatterState;
  setShipCollision(
    state: DeepReadonly<ShatterState>,
    enabled: boolean,
  ): ShatterState;
  addBullet(
    state: DeepReadonly<ShatterState>,
    x: number,
    y: number,
    vx: number,
    vy: number,
  ): ShatterState;
  removeBullet(state: DeepReadonly<ShatterState>, id: number): ShatterState;
  clearBullets(state: DeepReadonly<ShatterState>): ShatterState;
  addEnemyBullet(
    state: DeepReadonly<ShatterState>,
    x: number,
    y: number,
    vx: number,
    vy: number,
  ): ShatterState;
  removeEnemyBullet(
    state: DeepReadonly<ShatterState>,
    id: number,
  ): ShatterState;
  clearEnemyBullets(state: DeepReadonly<ShatterState>): ShatterState;
  addRock(
    state: DeepReadonly<ShatterState>,
    size: RockSize,
    x: number,
    y: number,
  ): ShatterState;
  setRockVelocity(
    state: DeepReadonly<ShatterState>,
    id: number,
    vx: number,
    vy: number,
  ): ShatterState;
  setRockHealth(
    state: DeepReadonly<ShatterState>,
    id: number,
    hp: number,
  ): ShatterState;
  removeRock(state: DeepReadonly<ShatterState>, id: number): ShatterState;
  clearRocks(state: DeepReadonly<ShatterState>): ShatterState;
  addSaucer(
    state: DeepReadonly<ShatterState>,
    x: number,
    y: number,
  ): ShatterState;
  setSaucerVelocity(
    state: DeepReadonly<ShatterState>,
    vx: number,
    vy: number,
  ): ShatterState;
  setSaucerWeave(
    state: DeepReadonly<ShatterState>,
    direction: 1 | -1,
  ): ShatterState;
  removeSaucer(state: DeepReadonly<ShatterState>): ShatterState;
  setSaucerMind(
    state: DeepReadonly<ShatterState>,
    enabled: boolean,
  ): ShatterState;
  setSaucerGun(
    state: DeepReadonly<ShatterState>,
    enabled: boolean,
  ): ShatterState;
  setSaucerTravel(
    state: DeepReadonly<ShatterState>,
    enabled: boolean,
  ): ShatterState;
  setNextSaucerEdge(
    state: DeepReadonly<ShatterState>,
    edge: SaucerEdge,
  ): ShatterState;
  setNextSaucerRow(state: DeepReadonly<ShatterState>, y: number): ShatterState;
  setNextSaucerAim(
    state: DeepReadonly<ShatterState>,
    radians: number,
  ): ShatterState;
  setNextRockSpeed(
    state: DeepReadonly<ShatterState>,
    speed: number,
  ): ShatterState;
  setNextRecycleEdge(
    state: DeepReadonly<ShatterState>,
    edge: FieldEdge,
  ): ShatterState;
  setTorpedoCharge(
    state: DeepReadonly<ShatterState>,
    fraction: number,
  ): ShatterState;
  addTorpedo(
    state: DeepReadonly<ShatterState>,
    x: number,
    y: number,
    heading: number,
  ): ShatterState;
  setTorpedoHeading(
    state: DeepReadonly<ShatterState>,
    id: number,
    radians: number,
  ): ShatterState;
  setTorpedoHoming(
    state: DeepReadonly<ShatterState>,
    id: number,
    enabled: boolean,
  ): ShatterState;
  removeTorpedo(state: DeepReadonly<ShatterState>, id: number): ShatterState;
  clearTorpedoes(state: DeepReadonly<ShatterState>): ShatterState;
}

export const BACKGROUND = "#060914";

const TWO_PI = Math.PI * 2;
const MENU_W = 360;
const MENU_H = 56;
const MENU_GAP = 14;
const BIG_DT = 0.25;

function finite(value: number, name: string): number {
  if (!Number.isFinite(value)) throw new Error(`invalid ${name}`);
  return value;
}

function whole(value: number, name: string): number {
  if (!Number.isInteger(finite(value, name)))
    throw new Error(`invalid ${name}`);
  return value;
}

function wrap(value: number, size: number): number {
  const result = value % size;
  return result < 0 ? result + size : result;
}

function wrapPos(x: number, y: number): { x: number; y: number } {
  return { x: wrap(x, FIELD_W), y: wrap(y, FIELD_H) };
}

function sep(ax: number, ay: number, bx: number, by: number): [number, number] {
  let dx = bx - ax;
  let dy = by - ay;
  if (dx >= FIELD_W / 2) dx -= FIELD_W;
  if (dx < -FIELD_W / 2) dx += FIELD_W;
  if (dy >= FIELD_H / 2) dy -= FIELD_H;
  if (dy < -FIELD_H / 2) dy += FIELD_H;
  return [dx, dy];
}

function distance(ax: number, ay: number, bx: number, by: number): number {
  const [dx, dy] = sep(ax, ay, bx, by);
  return Math.hypot(dx, dy);
}

function angleTo(ax: number, ay: number, bx: number, by: number): number {
  const [dx, dy] = sep(ax, ay, bx, by);
  return Math.atan2(dy, dx);
}

function normAngle(angle: number): number {
  let a = (angle + Math.PI) % TWO_PI;
  if (a < 0) a += TWO_PI;
  return a - Math.PI;
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

function speed(vx: number, vy: number): number {
  return Math.hypot(vx, vy);
}

function scoreFor(size: RockSize): number {
  if (size === "large") return SCORE_LARGE;
  if (size === "medium") return SCORE_MEDIUM;
  return SCORE_SMALL;
}

function newShip(invuln = 0): ShipState {
  return {
    x: SAFE_X,
    y: SAFE_Y,
    vx: 0,
    vy: 0,
    angle: FACE_UP,
    thrusting: false,
    invuln,
    collision: true,
    fireCooldown: 0,
  };
}

function baseState(muted = false): ShatterState {
  return {
    screen: "title",
    menuIndex: 0,
    score: 0,
    lives: 3,
    wave: 0,
    waveBanner: 0,
    ship: newShip(),
    bullets: [],
    rocks: [],
    saucer: null,
    enemyBullets: [],
    torpedoes: [],
    torpedoCharge: 1,
    waveSpawning: true,
    saucerSpawning: true,
    saucerClock: 0,
    saucerDue: SAUCER_FIRST_DELAY,
    nextSaucerEdge: null,
    nextSaucerRow: null,
    nextSaucerAim: null,
    nextRockSpeed: null,
    nextRecycleEdge: null,
    tickClock: 0,
    nextId: 1,
    simTime: 0,
    muted,
  };
}

function cloneState(state: DeepReadonly<ShatterState>): ShatterState {
  return {
    ...state,
    ship: { ...state.ship },
    bullets: state.bullets.map((b) => ({ ...b })),
    rocks: state.rocks.map((r) => ({ ...r })),
    saucer: state.saucer ? { ...state.saucer } : null,
    enemyBullets: state.enemyBullets.map((b) => ({ ...b })),
    torpedoes: state.torpedoes.map((t) => ({ ...t })),
  };
}

function consumeId(state: ShatterState): [ShatterState, number] {
  return [{ ...state, nextId: state.nextId + 1 }, state.nextId];
}

function addScore(
  state: ShatterState,
  amount: number,
): [ShatterState, boolean] {
  const oldBucket = Math.floor(state.score / EXTRA_LIFE_STEP);
  const nextScore = state.score + amount;
  const newBucket = Math.floor(nextScore / EXTRA_LIFE_STEP);
  const gained = Math.max(0, newBucket - oldBucket);
  return [
    { ...state, score: nextScore, lives: state.lives + gained },
    gained > 0,
  ];
}

function placeRock(
  state: ShatterState,
  size: RockSize,
  x: number,
  y: number,
  vx = 0,
  vy = 0,
  health = ROCK_HEALTH[size],
): ShatterState {
  const [withId, id] = consumeId(state);
  return {
    ...withId,
    rocks: [
      ...withId.rocks,
      {
        id,
        x: wrap(x, FIELD_W),
        y: wrap(y, FIELD_H),
        vx,
        vy,
        size,
        spin: rand(0, TWO_PI),
        health,
        flash: 0,
      },
    ],
  };
}

function baseRockSpeed(
  state: ShatterState,
  size: RockSize,
): [number, ShatterState] {
  if (state.nextRockSpeed !== null)
    return [state.nextRockSpeed, { ...state, nextRockSpeed: null }];
  return [rand(ROCK_SPEED_MIN[size], ROCK_SPEED_MAX[size]), state];
}

function spawnWave(state: ShatterState): ShatterState {
  let next = state;
  const wave = Math.max(1, next.wave);
  const mult = 1 + Math.min(WAVE_SPEED_CAP, WAVE_SPEED_STEP * (wave - 1));
  for (let i = 0; i < WAVE_BASE_ROCKS + wave; i += 1) {
    let x = rand(0, FIELD_W);
    let y = rand(0, FIELD_H);
    for (let tries = 0; tries < 500; tries += 1) {
      if (
        distance(x, y, next.ship.x, next.ship.y) >= WAVE_MIN_SHIP_DIST &&
        distance(x, y, STAR_X, STAR_Y) >= WAVE_MIN_STAR_DIST
      )
        break;
      x = rand(0, FIELD_W);
      y = rand(0, FIELD_H);
    }
    const [base, withSpeed] = baseRockSpeed(next, "large");
    next = withSpeed;
    const angle = rand(-Math.PI, Math.PI);
    next = placeRock(
      next,
      "large",
      x,
      y,
      Math.cos(angle) * base * mult,
      Math.sin(angle) * base * mult,
    );
  }
  return next;
}

function startNewGame(state: ShatterState): ShatterState {
  return spawnWave({ ...baseState(state.muted), screen: "playing", wave: 1 });
}

function menuItems(screen: Screen): readonly string[] {
  if (screen === "title") return TITLE_ITEMS;
  if (screen === "paused") return PAUSE_ITEMS;
  if (screen === "gameover") return GAMEOVER_ITEMS;
  return [];
}

function menuRect(screen: Screen, index: number): MenuRect | null {
  const items = menuItems(screen);
  if (index < 0 || index >= items.length) return null;
  const centerY = screen === "title" ? 398 : screen === "gameover" ? 458 : 372;
  const total = items.length * MENU_H + (items.length - 1) * MENU_GAP;
  return {
    x: FIELD_W / 2 - MENU_W / 2,
    y: centerY - total / 2 + index * (MENU_H + MENU_GAP),
    w: MENU_W,
    h: MENU_H,
  };
}

function hitMenu(screen: Screen, x: number, y: number): number | null {
  for (let i = 0; i < menuItems(screen).length; i += 1) {
    const r = menuRect(screen, i);
    if (r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return i;
  }
  return null;
}

function confirmMenu(state: ShatterState, index: number): ShatterState {
  if (state.screen === "title") {
    if (index === 0) return startNewGame(state);
    return { ...state, screen: "howto", menuIndex: 1 };
  }
  if (state.screen === "paused") {
    if (index === 0) return { ...state, screen: "playing", menuIndex: 0 };
    if (index === 1) return startNewGame(state);
    return { ...baseState(state.muted), menuIndex: 0 };
  }
  if (state.screen === "gameover") {
    if (index === 0) return startNewGame(state);
    return { ...baseState(state.muted), menuIndex: 0 };
  }
  return state;
}

function advanceMenu(
  state: ShatterState,
  api: UpdateApi,
): [ShatterState, boolean] {
  const items = menuItems(state.screen);
  if (items.length === 0) return [state, false];
  let next = state;
  if (api.input.pressed("up"))
    next = {
      ...next,
      menuIndex: (next.menuIndex + items.length - 1) % items.length,
    };
  if (api.input.pressed("down"))
    next = { ...next, menuIndex: (next.menuIndex + 1) % items.length };
  const pointer = api.input.pointer();
  const hovered = hitMenu(next.screen, pointer.x, pointer.y);
  if (hovered !== null) next = { ...next, menuIndex: hovered };

  const samples = api.input.pointerSamples().filter((sample) => sample.primary);
  const down = samples.find((sample) => sample.type === "down");
  const up = [...samples].reverse().find((sample) => sample.type === "up");
  if (api.input.pressed("confirm"))
    return [confirmMenu(next, next.menuIndex), true];
  if (down && up) {
    const pressed = hitMenu(next.screen, down.x, down.y);
    const released = hitMenu(next.screen, up.x, up.y);
    if (pressed !== null && pressed === released)
      return [confirmMenu({ ...next, menuIndex: pressed }, pressed), true];
  }
  return [next, false];
}

function gravity(
  vx: number,
  vy: number,
  x: number,
  y: number,
): [number, number] {
  const dx = STAR_X - x;
  const dy = STAR_Y - y;
  const d = Math.hypot(dx, dy);
  if (d === 0) return [vx, vy];
  const dEff = Math.max(d, SOFTEN);
  const mag = MU / (dEff * dEff);
  return [vx + (dx / d) * mag * TICK_DT, vy + (dy / d) * mag * TICK_DT];
}

function moveBullet(b: BulletState): BulletState | null {
  const [vx, vy] = gravity(b.vx, b.vy, b.x, b.y);
  const pos = wrapPos(b.x + vx * TICK_DT, b.y + vy * TICK_DT);
  const life = b.life - TICK_DT;
  return life <= 0 ? null : { ...b, ...pos, vx, vy, life };
}

function moveRock(r: RockState): RockState {
  const [vx, vy] = gravity(r.vx, r.vy, r.x, r.y);
  const pos = wrapPos(r.x + vx * TICK_DT, r.y + vy * TICK_DT);
  return {
    ...r,
    ...pos,
    vx,
    vy,
    spin: normAngle(r.spin + (r.id % 2 === 0 ? 0.55 : -0.42) * TICK_DT),
    flash: Math.max(0, r.flash - TICK_DT),
  };
}

function moveShip(ship: ShipState, api: UpdateApi): ShipState {
  let angle =
    ship.angle +
    (api.input.value("right") - api.input.value("left")) * SHIP_TURN * TICK_DT;
  angle = normAngle(angle);
  const thrusting = api.input.value("up") > 0;
  let vx = ship.vx;
  let vy = ship.vy;
  if (thrusting) {
    vx += Math.cos(angle) * SHIP_THRUST * TICK_DT;
    vy += Math.sin(angle) * SHIP_THRUST * TICK_DT;
  }
  const drag = 0.5 ** (TICK_DT / SHIP_DRAG_HALFLIFE);
  vx *= drag;
  vy *= drag;
  const spd = speed(vx, vy);
  if (spd > SHIP_MAX) {
    vx = (vx / spd) * SHIP_MAX;
    vy = (vy / spd) * SHIP_MAX;
  }
  const pos = wrapPos(ship.x + vx * TICK_DT, ship.y + vy * TICK_DT);
  const next = {
    ...ship,
    ...pos,
    vx,
    vy,
    angle,
    thrusting,
    invuln: Math.max(0, ship.invuln - TICK_DT),
    fireCooldown: Math.max(0, ship.fireCooldown - 1),
  };
  const dx = next.x - STAR_X;
  const dy = next.y - STAR_Y;
  const d = Math.hypot(dx, dy);
  if (d > CORE_R + SHIP_R || d === 0) return next;
  const nx = dx / d;
  const ny = dy / d;
  const into = next.vx * nx + next.vy * ny;
  return {
    ...next,
    x: STAR_X + nx * (CORE_R + SHIP_R),
    y: STAR_Y + ny * (CORE_R + SHIP_R),
    vx: into < 0 ? next.vx - into * nx : next.vx,
    vy: into < 0 ? next.vy - into * ny : next.vy,
  };
}

function moveTorpedo(
  t: TorpedoState,
  state: ShatterState,
): TorpedoState | null {
  let heading = t.heading;
  let homing = false;
  if (t.homing) {
    const candidates: { d: number; angle: number }[] = [];
    const consider = (x: number, y: number): void => {
      const a = angleTo(t.x, t.y, x, y);
      if (Math.abs(normAngle(a - heading)) > TORPEDO_CONE) return;
      const d = distance(t.x, t.y, x, y);
      candidates.push({ d, angle: a });
    };
    state.rocks.forEach((rock) => consider(rock.x, rock.y));
    if (state.saucer) consider(state.saucer.x, state.saucer.y);
    const target = candidates.reduce<{ d: number; angle: number } | null>(
      (best, item) => (best === null || item.d < best.d ? item : best),
      null,
    );
    if (target) {
      const turn = Math.max(
        -TORPEDO_TURN * TICK_DT,
        Math.min(TORPEDO_TURN * TICK_DT, normAngle(target.angle - heading)),
      );
      heading = normAngle(heading + turn);
      homing = true;
    }
  }
  const vx = Math.cos(heading) * TORPEDO_SPEED;
  const vy = Math.sin(heading) * TORPEDO_SPEED;
  const pos = wrapPos(t.x + vx * TICK_DT, t.y + vy * TICK_DT);
  const life = t.life - TICK_DT;
  return life <= 0 ? null : { ...t, ...pos, vx, vy, heading, life, homing };
}

function recycleRock(
  state: ShatterState,
  rock: RockState,
): [ShatterState, RockState] {
  const edge =
    state.nextRecycleEdge ??
    pick<FieldEdge>(["top", "bottom", "left", "right"]);
  let next: ShatterState = { ...state, nextRecycleEdge: null };
  const [base, withSpeed] = baseRockSpeed(next, rock.size);
  next = withSpeed;
  let x: number;
  let y: number;
  let a: number;
  if (edge === "top") {
    x = rand(0, FIELD_W);
    y = 0;
    a = rand(0.15 * Math.PI, 0.85 * Math.PI);
  } else if (edge === "bottom") {
    x = rand(0, FIELD_W);
    y = FIELD_H;
    a = rand(-0.85 * Math.PI, -0.15 * Math.PI);
  } else if (edge === "left") {
    x = 0;
    y = rand(0, FIELD_H);
    a = rand(-0.35 * Math.PI, 0.35 * Math.PI);
  } else {
    x = FIELD_W;
    y = rand(0, FIELD_H);
    a = rand(0.65 * Math.PI, 1.35 * Math.PI);
  }
  return [
    next,
    {
      ...rock,
      x: wrap(x, FIELD_W),
      y: wrap(y, FIELD_H),
      vx: Math.cos(a) * base,
      vy: Math.sin(a) * base,
    },
  ];
}

function destroyRock(
  state: ShatterState,
  rock: RockState,
  dirX: number,
  dirY: number,
  by: "bullet" | "torpedo",
): [ShatterState, boolean] {
  const scored = addScore(state, scoreFor(rock.size));
  let next = scored[0];
  const extra = scored[1];
  const child = ROCK_CHILD[rock.size];
  if (!child) return [next, extra];
  const mag = by === "bullet" ? SPLIT_KICK : TORPEDO_SCATTER;
  const len = Math.hypot(dirX, dirY) || 1;
  const ux = dirX / len;
  const uy = dirY / len;
  const kx = by === "bullet" ? -uy * mag : ux * mag;
  const ky = by === "bullet" ? ux * mag : uy * mag;
  next = placeRock(next, child, rock.x, rock.y, rock.vx + kx, rock.vy + ky);
  next = placeRock(next, child, rock.x, rock.y, rock.vx - kx, rock.vy - ky);
  return [next, extra];
}

function loseShip(state: ShatterState): ShatterState {
  const lives = state.lives - 1;
  if (lives <= 0)
    return {
      ...state,
      screen: "gameover",
      menuIndex: 0,
      lives: 0,
      ship: { ...state.ship, thrusting: false },
      torpedoes: [],
      torpedoCharge: 1,
    };
  return {
    ...state,
    lives,
    ship: newShip(INVULN_TIME),
    bullets: [],
    torpedoes: [],
    torpedoCharge: 1,
  };
}

function touches(
  ax: number,
  ay: number,
  ar: number,
  bx: number,
  by: number,
  br: number,
): boolean {
  return distance(ax, ay, bx, by) <= ar + br;
}

function resolveCollisions(
  state: ShatterState,
): [ShatterState, ReadonlySet<string>] {
  let next = state;
  const cues = new Set<string>();
  let bullets = next.bullets.filter(
    (b) => !touches(b.x, b.y, BULLET_R, STAR_X, STAR_Y, CORE_R),
  );
  const enemyBullets = next.enemyBullets.filter(
    (b) => !touches(b.x, b.y, SAUCER_BULLET_R, STAR_X, STAR_Y, CORE_R),
  );
  let torpedoes = next.torpedoes.filter(
    (t) => !touches(t.x, t.y, TORPEDO_R, STAR_X, STAR_Y, CORE_R),
  );
  let rocks = [...next.rocks];

  for (const rock of [...rocks]) {
    if (
      touches(rock.x, rock.y, ROCK_RADIUS[rock.size], STAR_X, STAR_Y, CORE_R)
    ) {
      const [withPose, recycled] = recycleRock(next, rock);
      next = withPose;
      rocks = rocks.map((r) => (r.id === rock.id ? recycled : r));
    }
  }

  for (const bullet of [...bullets]) {
    const rock = rocks.find((r) =>
      touches(bullet.x, bullet.y, BULLET_R, r.x, r.y, ROCK_RADIUS[r.size]),
    );
    if (!rock) continue;
    bullets = bullets.filter((b) => b.id !== bullet.id);
    rocks = rocks.filter((r) => r.id !== rock.id);
    if (rock.health > 1) {
      rocks.push({ ...rock, health: rock.health - 1, flash: HIT_FLASH_TIME });
    } else {
      const [destroyed, extra] = destroyRock(
        { ...next, rocks },
        rock,
        bullet.vx,
        bullet.vy,
        "bullet",
      );
      next = destroyed;
      rocks = [...next.rocks];
      cues.add(CUES.shatter);
      if (extra) cues.add(CUES.extraLife);
    }
  }

  for (const torpedo of [...torpedoes]) {
    const rock = rocks.find((r) =>
      touches(torpedo.x, torpedo.y, TORPEDO_R, r.x, r.y, ROCK_RADIUS[r.size]),
    );
    if (!rock) continue;
    torpedoes = torpedoes.filter((t) => t.id !== torpedo.id);
    rocks = rocks.filter((r) => r.id !== rock.id);
    const [destroyed, extra] = destroyRock(
      { ...next, rocks },
      rock,
      torpedo.vx,
      torpedo.vy,
      "torpedo",
    );
    next = destroyed;
    rocks = [...next.rocks];
    cues.add(CUES.shatter);
    if (extra) cues.add(CUES.extraLife);
  }

  if (next.saucer) {
    const hit = bullets.find((b) =>
      touches(b.x, b.y, BULLET_R, next.saucer!.x, next.saucer!.y, SAUCER_R),
    );
    const torpHit = torpedoes.find((t) =>
      touches(t.x, t.y, TORPEDO_R, next.saucer!.x, next.saucer!.y, SAUCER_R),
    );
    if (hit || torpHit) {
      if (hit) bullets = bullets.filter((b) => b.id !== hit.id);
      if (torpHit) torpedoes = torpedoes.filter((t) => t.id !== torpHit.id);
      const [scored, extra] = addScore(next, SCORE_SAUCER);
      next = { ...scored, saucer: null };
      if (extra) cues.add(CUES.extraLife);
      cues.add(CUES.shatter);
    }
  }

  next = { ...next, bullets, enemyBullets, torpedoes, rocks };
  if (
    next.screen === "playing" &&
    next.ship.collision &&
    next.ship.invuln <= 0
  ) {
    const shipRock = next.rocks.some((r) =>
      touches(next.ship.x, next.ship.y, SHIP_R, r.x, r.y, ROCK_RADIUS[r.size]),
    );
    const shipSaucer =
      next.saucer !== null &&
      touches(
        next.ship.x,
        next.ship.y,
        SHIP_R,
        next.saucer.x,
        next.saucer.y,
        SAUCER_R,
      );
    const shipBullet = next.enemyBullets.find((b) =>
      touches(next.ship.x, next.ship.y, SHIP_R, b.x, b.y, SAUCER_BULLET_R),
    );
    if (shipRock || shipSaucer || shipBullet) {
      if (shipBullet)
        next = {
          ...next,
          enemyBullets: next.enemyBullets.filter((b) => b.id !== shipBullet.id),
        };
      next = loseShip(next);
      cues.add(CUES.death);
    }
  }
  return [next, cues];
}

function spawnSaucer(state: ShatterState): [ShatterState, string] {
  const edge = state.nextSaucerEdge ?? pick<SaucerEdge>(["left", "right"]);
  const y = state.nextSaucerRow ?? rand(SAUCER_R, FIELD_H - SAUCER_R);
  const [withId, id] = consumeId({
    ...state,
    nextSaucerEdge: null,
    nextSaucerRow: null,
    saucerClock: 0,
  });
  return [
    {
      ...withId,
      saucer: {
        id,
        x: edge === "left" ? 0 : FIELD_W,
        y,
        vx: edge === "left" ? SAUCER_SPEED : -SAUCER_SPEED,
        vy: 0,
        mind: true,
        gun: true,
        travel: true,
        weave: Math.random() < 0.5 ? -1 : 1,
        fireClock: SAUCER_FIRE_INTERVAL,
        weaveClock: SAUCER_WEAVE_INTERVAL,
        age: 0,
      },
    },
    CUES.saucer,
  ];
}

function moveSaucer(state: ShatterState): [ShatterState, string | null] {
  if (!state.saucer) return [state, null];
  let saucer = state.saucer;
  let next = state;
  if (saucer.mind) {
    let weaveClock = saucer.weaveClock - TICK_DT;
    let vy = saucer.vy;
    if (weaveClock <= 0) {
      weaveClock += SAUCER_WEAVE_INTERVAL;
      const dir: 1 | -1 = vy === 0 ? saucer.weave : vy > 0 ? -1 : 1;
      vy = dir * SAUCER_WEAVE_SPEED;
    }
    if (
      distance(
        saucer.x + saucer.vx * TICK_DT,
        saucer.y + vy * TICK_DT,
        STAR_X,
        STAR_Y,
      ) <
      CORE_R + SAUCER_R + 10
    )
      vy = saucer.y < STAR_Y ? -SAUCER_WEAVE_SPEED : SAUCER_WEAVE_SPEED;
    saucer = { ...saucer, vy, weaveClock };
  }

  let enemyBullets = [...next.enemyBullets];
  if (saucer.gun) {
    let fireClock = saucer.fireClock - TICK_DT;
    if (fireClock <= 0) {
      fireClock += SAUCER_FIRE_INTERVAL;
      const aim =
        next.nextSaucerAim ?? rand(-SAUCER_AIM_ERROR, SAUCER_AIM_ERROR);
      next = { ...next, nextSaucerAim: null };
      const angle = angleTo(saucer.x, saucer.y, next.ship.x, next.ship.y) + aim;
      const [withId, id] = consumeId(next);
      next = withId;
      enemyBullets = [
        ...enemyBullets,
        {
          id,
          x: saucer.x,
          y: saucer.y,
          vx: saucer.vx + Math.cos(angle) * SAUCER_BULLET_SPEED,
          vy: saucer.vy + Math.sin(angle) * SAUCER_BULLET_SPEED,
          life: SAUCER_BULLET_LIFE,
        },
      ];
    }
    saucer = { ...saucer, fireClock };
  }

  if (saucer.travel) {
    const pos = wrapPos(
      saucer.x + saucer.vx * TICK_DT,
      saucer.y + saucer.vy * TICK_DT,
    );
    saucer = { ...saucer, ...pos };
  }
  saucer = { ...saucer, age: saucer.age + TICK_DT };
  if (saucer.age >= SAUCER_LIFETIME)
    return [
      {
        ...next,
        saucer: null,
        enemyBullets,
        saucerClock: 0,
        saucerDue: rand(SAUCER_GAP_MIN, SAUCER_GAP_MAX),
      },
      null,
    ];
  return [{ ...next, saucer, enemyBullets }, null];
}

function fireGun(state: ShatterState): [ShatterState, string | null] {
  if (state.bullets.length >= MAX_BULLETS || state.ship.fireCooldown > 0)
    return [state, null];
  const [withId, id] = consumeId(state);
  const x = state.ship.x + Math.cos(state.ship.angle) * SHIP_R;
  const y = state.ship.y + Math.sin(state.ship.angle) * SHIP_R;
  return [
    {
      ...withId,
      ship: { ...withId.ship, fireCooldown: FIRE_INTERVAL_TICKS },
      bullets: [
        ...withId.bullets,
        {
          id,
          x: wrap(x, FIELD_W),
          y: wrap(y, FIELD_H),
          vx: state.ship.vx + Math.cos(state.ship.angle) * MUZZLE_SPEED,
          vy: state.ship.vy + Math.sin(state.ship.angle) * MUZZLE_SPEED,
          life: BULLET_LIFE,
        },
      ],
    },
    CUES.fire,
  ];
}

function fireTorpedo(state: ShatterState): ShatterState {
  if (state.torpedoCharge < 1 || state.torpedoes.length > 0) return state;
  const [withId, id] = consumeId(state);
  const heading = state.ship.angle;
  return {
    ...withId,
    torpedoCharge: 0,
    torpedoes: [
      ...withId.torpedoes,
      {
        id,
        x: wrap(state.ship.x + Math.cos(heading) * SHIP_R, FIELD_W),
        y: wrap(state.ship.y + Math.sin(heading) * SHIP_R, FIELD_H),
        vx: Math.cos(heading) * TORPEDO_SPEED,
        vy: Math.sin(heading) * TORPEDO_SPEED,
        heading,
        life: TORPEDO_LIFE,
        homing: true,
      },
    ],
  };
}

function stepPlaying(
  state: ShatterState,
  api: UpdateApi,
): [ShatterState, ReadonlySet<string>] {
  let next = { ...state, simTime: state.simTime + TICK_DT };
  const cues = new Set<string>();
  next = { ...next, ship: moveShip(next.ship, api) };
  if (api.input.value("a") > 0) {
    const [fired, cue] = fireGun(next);
    next = fired;
    if (cue) cues.add(cue);
  }
  if (api.input.pressed("b")) next = fireTorpedo(next);
  if (next.ship.thrusting) cues.add(CUES.thrust);
  next = {
    ...next,
    torpedoCharge:
      next.torpedoes.length > 0
        ? next.torpedoCharge
        : Math.min(1, next.torpedoCharge + TICK_DT / TORPEDO_RECHARGE),
    bullets: next.bullets
      .map(moveBullet)
      .filter((b): b is BulletState => b !== null),
    enemyBullets: next.enemyBullets
      .map(moveBullet)
      .filter((b): b is BulletState => b !== null),
    rocks: next.rocks.map(moveRock),
  };
  next = {
    ...next,
    torpedoes: next.torpedoes
      .map((t) => moveTorpedo(t, next))
      .filter((t): t is TorpedoState => t !== null),
  };
  const [withSaucer, saucerCue] = moveSaucer(next);
  next = withSaucer;
  if (saucerCue) cues.add(saucerCue);
  if (!next.saucer && next.saucerSpawning) {
    next = { ...next, saucerClock: next.saucerClock + TICK_DT };
    if (next.saucerClock >= next.saucerDue) {
      const [spawned, cue] = spawnSaucer(next);
      next = spawned;
      cues.add(cue);
    }
  }
  if (next.waveBanner > 0) {
    const before = next.waveBanner;
    next = { ...next, waveBanner: Math.max(0, next.waveBanner - TICK_DT) };
    if (before > 0 && next.waveBanner === 0 && next.waveSpawning)
      next = spawnWave(next);
  }
  const rocksBefore = next.rocks.length;
  const [resolved, collisionCues] = resolveCollisions(next);
  next = resolved;
  collisionCues.forEach((cue) => cues.add(cue));
  if (
    next.screen === "playing" &&
    next.waveSpawning &&
    rocksBefore > 0 &&
    next.rocks.length === 0 &&
    next.waveBanner <= 0
  )
    next = { ...next, wave: next.wave + 1, waveBanner: WAVE_BANNER_TIME };
  return [next, cues];
}

function updateMute(state: ShatterState, api: UpdateApi): ShatterState {
  if (api.input.pressed("mute")) api.audio.setMuted(!api.audio.muted());
  return { ...state, muted: api.audio.muted() };
}

function updateFrame(
  state: DeepReadonly<ShatterState>,
  api: UpdateApi,
  dt: number,
): ShatterState {
  let next = updateMute(cloneState(state), api);
  if (next.screen === "playing" && api.input.pressed("pause"))
    return { ...next, screen: "paused", menuIndex: 0 };
  if (
    next.screen === "paused" &&
    (api.input.pressed("pause") || api.input.pressed("back"))
  )
    return { ...next, screen: "playing", menuIndex: 0 };
  if (
    next.screen === "howto" &&
    (api.input.pressed("confirm") || api.input.pressed("back"))
  )
    return { ...next, screen: "title", menuIndex: 1 };
  if (next.screen === "gameover" && api.input.pressed("back"))
    return { ...baseState(next.muted), menuIndex: 0 };

  const [menuState, confirmed] = advanceMenu(next, api);
  next = menuState;
  if (confirmed) return next;

  let clock = next.tickClock + Math.min(BIG_DT, Math.max(0, dt));
  while (clock >= TICK_DT) {
    clock -= TICK_DT;
    if (next.screen === "playing") {
      const [stepped, cues] = stepPlaying(next, api);
      next = stepped;
      cues.forEach((cue) => {
        if (cue === CUES.thrust) {
          if (!api.audio.looping(CUES.thrust)) api.audio.loop(CUES.thrust);
        } else {
          api.audio.play(cue);
        }
      });
    } else if (next.screen !== "paused") {
      next = { ...next, simTime: next.simTime + TICK_DT };
    }
  }
  if (next.screen !== "playing" || !next.ship.thrusting)
    api.audio.stop(CUES.thrust);
  return { ...next, tickClock: clock, muted: api.audio.muted() };
}

function snapshot(state: DeepReadonly<ShatterState>): ShatterSnapshot {
  return {
    version: SHATTER_DEBUG_VERSION,
    screen: state.screen,
    menuIndex: state.menuIndex,
    score: state.score,
    lives: state.lives,
    wave: state.wave,
    waveBanner: state.waveBanner,
    muted: state.muted,
    waveSpawning: state.waveSpawning,
    saucerSpawning: state.saucerSpawning,
    saucerClock: state.saucerClock,
    saucerDue: state.saucerDue,
    nextSaucerEdge: state.nextSaucerEdge,
    nextSaucerRow: state.nextSaucerRow,
    nextSaucerAim: state.nextSaucerAim,
    nextRockSpeed: state.nextRockSpeed,
    nextRecycleEdge: state.nextRecycleEdge,
    ship: { ...state.ship, speed: speed(state.ship.vx, state.ship.vy) },
    bullets: state.bullets.map((b) => ({ ...b })),
    rocks: state.rocks.map((r) => ({
      id: r.id,
      x: r.x,
      y: r.y,
      vx: r.vx,
      vy: r.vy,
      size: r.size,
      radius: ROCK_RADIUS[r.size],
      health: r.health,
    })),
    saucer: state.saucer ? { ...state.saucer } : null,
    enemyBullets: state.enemyBullets.map((b) => ({ ...b })),
    torpedoes: state.torpedoes.map((t) => ({ ...t })),
    torpedoCharge: state.torpedoCharge,
    torpedoReady: state.torpedoCharge === 1,
    simTime: state.simTime,
  };
}

function idIndex<T extends { readonly id: number }>(
  list: readonly T[],
  id: number,
  name: string,
): number {
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) throw new Error(`unknown ${name} id ${id}`);
  return index;
}

function buildDebug(): ShatterDebugApi {
  return {
    version: SHATTER_DEBUG_VERSION,
    reset: (state) => baseState(state.muted),
    snapshot,
    reconcile: cloneState,
    menuItemRect: (state, index) =>
      menuRect(state.screen, whole(index, "index")),
    setScreen: (state, screen) => ({ ...cloneState(state), screen }),
    setMenuIndex: (state, n) => ({
      ...cloneState(state),
      menuIndex: finite(n, "menuIndex"),
    }),
    setScore: (state, n) => ({
      ...cloneState(state),
      score: finite(n, "score"),
    }),
    setLives: (state, n) => ({
      ...cloneState(state),
      lives: finite(n, "lives"),
    }),
    setWave: (state, n) => ({ ...cloneState(state), wave: finite(n, "wave") }),
    setWaveBanner: (state, seconds) => ({
      ...cloneState(state),
      waveBanner: Math.max(0, finite(seconds, "seconds")),
    }),
    setWaveSpawning: (state, enabled) => ({
      ...cloneState(state),
      waveSpawning: enabled,
    }),
    setSaucerSpawning: (state, enabled) => ({
      ...cloneState(state),
      saucerSpawning: enabled,
    }),
    setSaucerDue: (state, seconds) => ({
      ...cloneState(state),
      saucerDue: finite(seconds, "seconds"),
    }),
    setShipPosition: (state, x, y) => ({
      ...cloneState(state),
      ship: { ...state.ship, x: finite(x, "x"), y: finite(y, "y") },
    }),
    setShipVelocity: (state, vx, vy) => ({
      ...cloneState(state),
      ship: { ...state.ship, vx: finite(vx, "vx"), vy: finite(vy, "vy") },
    }),
    setShipAngle: (state, radians) => ({
      ...cloneState(state),
      ship: { ...state.ship, angle: finite(radians, "radians") },
    }),
    setShipInvuln: (state, seconds) => ({
      ...cloneState(state),
      ship: { ...state.ship, invuln: finite(seconds, "seconds") },
    }),
    setFireCooldown: (state, ticks) => ({
      ...cloneState(state),
      ship: { ...state.ship, fireCooldown: whole(ticks, "ticks") },
    }),
    setShipCollision: (state, enabled) => ({
      ...cloneState(state),
      ship: { ...state.ship, collision: enabled },
    }),
    addBullet: (state, x, y, vx, vy) => {
      const [withId, id] = consumeId(cloneState(state));
      return {
        ...withId,
        bullets: [
          ...withId.bullets,
          {
            id,
            x: finite(x, "x"),
            y: finite(y, "y"),
            vx: finite(vx, "vx"),
            vy: finite(vy, "vy"),
            life: BULLET_LIFE,
          },
        ],
      };
    },
    removeBullet: (state, id) => {
      const s = cloneState(state);
      idIndex(s.bullets, id, "bullet");
      return { ...s, bullets: s.bullets.filter((b) => b.id !== id) };
    },
    clearBullets: (state) => ({ ...cloneState(state), bullets: [] }),
    addEnemyBullet: (state, x, y, vx, vy) => {
      const [withId, id] = consumeId(cloneState(state));
      return {
        ...withId,
        enemyBullets: [
          ...withId.enemyBullets,
          {
            id,
            x: finite(x, "x"),
            y: finite(y, "y"),
            vx: finite(vx, "vx"),
            vy: finite(vy, "vy"),
            life: SAUCER_BULLET_LIFE,
          },
        ],
      };
    },
    removeEnemyBullet: (state, id) => {
      const s = cloneState(state);
      idIndex(s.enemyBullets, id, "enemy bullet");
      return { ...s, enemyBullets: s.enemyBullets.filter((b) => b.id !== id) };
    },
    clearEnemyBullets: (state) => ({ ...cloneState(state), enemyBullets: [] }),
    addRock: (state, size, x, y) => {
      if (!["large", "medium", "small"].includes(size))
        throw new Error("invalid rock size");
      return placeRock(cloneState(state), size, finite(x, "x"), finite(y, "y"));
    },
    setRockVelocity: (state, id, vx, vy) => {
      const s = cloneState(state);
      idIndex(s.rocks, id, "rock");
      return {
        ...s,
        rocks: s.rocks.map((r) =>
          r.id === id
            ? { ...r, vx: finite(vx, "vx"), vy: finite(vy, "vy") }
            : r,
        ),
      };
    },
    setRockHealth: (state, id, hp) => {
      const s = cloneState(state);
      const rock = s.rocks[idIndex(s.rocks, id, "rock")]!;
      const health = whole(hp, "hp");
      if (health < 1 || health > ROCK_HEALTH[rock.size])
        throw new Error("invalid hp");
      return {
        ...s,
        rocks: s.rocks.map((r) => (r.id === id ? { ...r, health } : r)),
      };
    },
    removeRock: (state, id) => {
      const s = cloneState(state);
      idIndex(s.rocks, id, "rock");
      return { ...s, rocks: s.rocks.filter((r) => r.id !== id) };
    },
    clearRocks: (state) => ({ ...cloneState(state), rocks: [] }),
    addSaucer: (state, x, y) => {
      const [withId, id] = consumeId(cloneState(state));
      return {
        ...withId,
        saucer: {
          id,
          x: finite(x, "x"),
          y: finite(y, "y"),
          vx: SAUCER_SPEED,
          vy: 0,
          mind: true,
          gun: true,
          travel: true,
          weave: 1,
          fireClock: SAUCER_FIRE_INTERVAL,
          weaveClock: SAUCER_WEAVE_INTERVAL,
          age: 0,
        },
      };
    },
    setSaucerVelocity: (state, vx, vy) => {
      const s = cloneState(state);
      if (!s.saucer) throw new Error("no saucer");
      return {
        ...s,
        saucer: { ...s.saucer, vx: finite(vx, "vx"), vy: finite(vy, "vy") },
      };
    },
    setSaucerWeave: (state, direction) => {
      const s = cloneState(state);
      if (!s.saucer) throw new Error("no saucer");
      if (direction !== 1 && direction !== -1)
        throw new Error("invalid direction");
      return { ...s, saucer: { ...s.saucer, weave: direction } };
    },
    removeSaucer: (state) => ({ ...cloneState(state), saucer: null }),
    setSaucerMind: (state, enabled) => {
      const s = cloneState(state);
      if (!s.saucer) throw new Error("no saucer");
      return { ...s, saucer: { ...s.saucer, mind: enabled } };
    },
    setSaucerGun: (state, enabled) => {
      const s = cloneState(state);
      if (!s.saucer) throw new Error("no saucer");
      return { ...s, saucer: { ...s.saucer, gun: enabled } };
    },
    setSaucerTravel: (state, enabled) => {
      const s = cloneState(state);
      if (!s.saucer) throw new Error("no saucer");
      return { ...s, saucer: { ...s.saucer, travel: enabled } };
    },
    setNextSaucerEdge: (state, edge) => ({
      ...cloneState(state),
      nextSaucerEdge: edge,
    }),
    setNextSaucerRow: (state, y) => ({
      ...cloneState(state),
      nextSaucerRow: finite(y, "y"),
    }),
    setNextSaucerAim: (state, radians) => ({
      ...cloneState(state),
      nextSaucerAim: finite(radians, "radians"),
    }),
    setNextRockSpeed: (state, speedValue) => ({
      ...cloneState(state),
      nextRockSpeed: finite(speedValue, "speed"),
    }),
    setNextRecycleEdge: (state, edge) => ({
      ...cloneState(state),
      nextRecycleEdge: edge,
    }),
    setTorpedoCharge: (state, fraction) => ({
      ...cloneState(state),
      torpedoCharge: finite(fraction, "fraction"),
    }),
    addTorpedo: (state, x, y, heading) => {
      const [withId, id] = consumeId(cloneState(state));
      const h = finite(heading, "heading");
      return {
        ...withId,
        torpedoes: [
          ...withId.torpedoes,
          {
            id,
            x: finite(x, "x"),
            y: finite(y, "y"),
            vx: Math.cos(h) * TORPEDO_SPEED,
            vy: Math.sin(h) * TORPEDO_SPEED,
            heading: h,
            life: TORPEDO_LIFE,
            homing: true,
          },
        ],
      };
    },
    setTorpedoHeading: (state, id, radians) => {
      const s = cloneState(state);
      idIndex(s.torpedoes, id, "torpedo");
      const h = finite(radians, "radians");
      return {
        ...s,
        torpedoes: s.torpedoes.map((t) =>
          t.id === id
            ? {
                ...t,
                heading: h,
                vx: Math.cos(h) * TORPEDO_SPEED,
                vy: Math.sin(h) * TORPEDO_SPEED,
              }
            : t,
        ),
      };
    },
    setTorpedoHoming: (state, id, enabled) => {
      const s = cloneState(state);
      idIndex(s.torpedoes, id, "torpedo");
      return {
        ...s,
        torpedoes: s.torpedoes.map((t) =>
          t.id === id ? { ...t, homing: enabled } : t,
        ),
      };
    },
    removeTorpedo: (state, id) => {
      const s = cloneState(state);
      idIndex(s.torpedoes, id, "torpedo");
      return { ...s, torpedoes: s.torpedoes.filter((t) => t.id !== id) };
    },
    clearTorpedoes: (state) => ({ ...cloneState(state), torpedoes: [] }),
  };
}

function defineAudio(api: InitApi<ShatterState>): void {
  api.audio.define(CUES.fire, {
    wave: "square",
    freq: 820,
    freqTo: 420,
    gain: 0.12,
    durationMs: 60,
  });
  api.audio.define(CUES.shatter, {
    wave: "sawtooth",
    freq: 160,
    freqTo: 70,
    gain: 0.18,
    durationMs: 180,
  });
  api.audio.define(CUES.thrust, {
    wave: "sawtooth",
    freq: 85,
    gain: 0.07,
    durationMs: 100,
  });
  api.audio.define(CUES.saucer, {
    wave: "triangle",
    freq: 520,
    freqTo: 310,
    gain: 0.12,
    durationMs: 220,
  });
  api.audio.define(CUES.death, {
    wave: "sawtooth",
    freq: 110,
    freqTo: 35,
    gain: 0.2,
    durationMs: 320,
  });
  api.audio.define(CUES.extraLife, {
    wave: "triangle",
    freq: 520,
    freqTo: 880,
    gain: 0.15,
    durationMs: 240,
  });
}

function registerDiagnostics(api: InitApi<ShatterState>): void {
  api.diagnostics.register("screen", (s) => s.screen);
  api.diagnostics.register("score", (s) => s.score);
  api.diagnostics.register("lives", (s) => s.lives);
  api.diagnostics.register("wave", (s) => s.wave);
  api.diagnostics.register(
    "ship pos",
    (s) => `${s.ship.x.toFixed(1)}, ${s.ship.y.toFixed(1)}`,
  );
  api.diagnostics.register(
    "ship vel",
    (s) => `${s.ship.vx.toFixed(1)}, ${s.ship.vy.toFixed(1)}`,
  );
  api.diagnostics.register("ship speed", (s) => speed(s.ship.vx, s.ship.vy));
  api.diagnostics.register("ship face", (s) => s.ship.angle.toFixed(2));
  api.diagnostics.register("invuln", (s) => s.ship.invuln);
  api.diagnostics.register("bullets", (s) => s.bullets.length);
  api.diagnostics.register("rocks", (s) => s.rocks.length);
  api.diagnostics.register("saucer", (s) =>
    s.saucer ? `${s.saucer.x.toFixed(0)}, ${s.saucer.y.toFixed(0)}` : "none",
  );
  api.diagnostics.register("torpedo", (s) => s.torpedoCharge);
  api.diagnostics.register("torps", (s) => s.torpedoes.length);
  api.diagnostics.register("sim", (s) => s.simTime);
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  align: CanvasTextAlign = "left",
  color = "#e9f4ff",
): void {
  ctx.fillStyle = color;
  ctx.font = `700 ${size}px Inter, ui-sans-serif, system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

function drawWrapped(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  draw: (x: number, y: number) => void,
): void {
  void ctx;
  for (const ox of [-FIELD_W, 0, FIELD_W])
    for (const oy of [-FIELD_H, 0, FIELD_H]) {
      const px = x + ox;
      const py = y + oy;
      if (
        px >= -radius &&
        px <= FIELD_W + radius &&
        py >= -radius &&
        py <= FIELD_H + radius
      )
        draw(px, py);
    }
}

function renderField(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.save();
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "#1c2748";
  for (let i = 0; i < 90; i += 1)
    ctx.fillRect(
      (i * 233) % FIELD_W,
      (i * 137) % FIELD_H,
      i % 5 === 0 ? 2 : 1,
      i % 7 === 0 ? 2 : 1,
    );
  ctx.restore();
  const halo = ctx.createRadialGradient(
    STAR_X,
    STAR_Y,
    CORE_R,
    STAR_X,
    STAR_Y,
    HALO_R * 1.5,
  );
  halo.addColorStop(0, "rgba(127, 225, 255, 0.42)");
  halo.addColorStop(0.55, "rgba(72, 126, 255, 0.16)");
  halo.addColorStop(1, "rgba(72, 126, 255, 0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(STAR_X, STAR_Y, HALO_R * 1.5, 0, TWO_PI);
  ctx.fill();
  ctx.fillStyle = "#f7fbff";
  ctx.beginPath();
  ctx.arc(STAR_X, STAR_Y, CORE_R, 0, TWO_PI);
  ctx.fill();
  ctx.strokeStyle = "#7fe1ff";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function renderShip(
  ctx: CanvasRenderingContext2D,
  ship: DeepReadonly<ShipState>,
): void {
  if (ship.invuln > 0 && Math.floor(ship.invuln * 12) % 2 === 0)
    ctx.globalAlpha = 0.42;
  drawWrapped(ctx, ship.x, ship.y, 34, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ship.angle);
    if (ship.thrusting) {
      ctx.fillStyle = "#ffbf5b";
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-35, -7);
      ctx.lineTo(-29, 0);
      ctx.lineTo(-35, 7);
      ctx.fill();
    }
    ctx.fillStyle = "#dff9ff";
    ctx.strokeStyle = "#2ed3ff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-14, -13);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-14, 13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
  ctx.globalAlpha = 1;
}

function renderRock(
  ctx: CanvasRenderingContext2D,
  rock: DeepReadonly<RockState>,
): void {
  const r = ROCK_RADIUS[rock.size];
  const damage = 1 - rock.health / ROCK_HEALTH[rock.size];
  drawWrapped(ctx, rock.x, rock.y, r + 4, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rock.spin);
    ctx.fillStyle =
      rock.flash > 0 ? "#fff0b3" : damage > 0.5 ? "#a78086" : "#7986a3";
    ctx.strokeStyle = damage > 0 ? "#ffb86b" : "#c4d2ea";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const points = rock.size === "large" ? 13 : rock.size === "medium" ? 10 : 8;
    for (let i = 0; i < points; i += 1) {
      const a = (i / points) * TWO_PI;
      const rr = r * (0.76 + ((rock.id * 17 + i * 29) % 31) / 100);
      const px = Math.cos(a) * rr;
      const py = Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

function renderBullet(
  ctx: CanvasRenderingContext2D,
  b: DeepReadonly<BulletState>,
  enemy = false,
): void {
  const v = speed(b.vx, b.vy);
  const trail = (v * TRAIL_TICKS) / TICK_HZ;
  const a = Math.atan2(b.vy, b.vx);
  drawWrapped(ctx, b.x, b.y, trail + 8, (x, y) => {
    const grad = ctx.createLinearGradient(
      x,
      y,
      x - Math.cos(a) * trail,
      y - Math.sin(a) * trail,
    );
    grad.addColorStop(
      0,
      enemy ? "rgba(255, 103, 94, 0.85)" : "rgba(130, 236, 255, 0.9)",
    );
    grad.addColorStop(1, "rgba(130, 236, 255, 0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = enemy ? 4 : 5;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - Math.cos(a) * trail, y - Math.sin(a) * trail);
    ctx.stroke();
    ctx.fillStyle = enemy ? "#ff675e" : "#dffbff";
    ctx.beginPath();
    ctx.arc(x, y, enemy ? SAUCER_BULLET_R : BULLET_R, 0, TWO_PI);
    ctx.fill();
  });
}

function renderTorpedo(
  ctx: CanvasRenderingContext2D,
  t: DeepReadonly<TorpedoState>,
): void {
  drawWrapped(ctx, t.x, t.y, 18, (x, y) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t.heading);
    ctx.fillStyle = t.homing ? "#ffec8b" : "#c5c9d6";
    ctx.strokeStyle = "#ff9f45";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-8, -6);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-8, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  });
}

function renderSaucer(
  ctx: CanvasRenderingContext2D,
  s: DeepReadonly<SaucerState>,
): void {
  drawWrapped(ctx, s.x, s.y, 34, (x, y) => {
    ctx.fillStyle = "#ff8b7f";
    ctx.strokeStyle = "#ffd4cd";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y, 28, 9, 0, 0, TWO_PI);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#8cf2ff";
    ctx.beginPath();
    ctx.ellipse(x, y - 5, 13, 8, 0, Math.PI, TWO_PI);
    ctx.fill();
  });
}

function renderHud(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<ShatterState>,
): void {
  drawText(ctx, String(state.score).padStart(5, "0"), 34, 34, 30);
  for (let i = 0; i < Math.max(0, state.lives - 1); i += 1) {
    ctx.save();
    ctx.translate(44 + i * 30, 74);
    ctx.rotate(FACE_UP);
    ctx.fillStyle = "#dff9ff";
    ctx.beginPath();
    ctx.moveTo(11, 0);
    ctx.lineTo(-8, -7);
    ctx.lineTo(-5, 0);
    ctx.lineTo(-8, 7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.strokeStyle = "#71809e";
  ctx.strokeRect(34, 100, 84, 8);
  ctx.fillStyle = state.torpedoCharge >= 1 ? "#ffec8b" : "#68738f";
  ctx.fillRect(34, 100, 84 * Math.max(0, Math.min(1, state.torpedoCharge)), 8);
  drawText(
    ctx,
    "F",
    134,
    104,
    16,
    "left",
    state.torpedoCharge >= 1 ? "#ffec8b" : "#8791aa",
  );
  if (state.waveBanner > 0)
    drawText(
      ctx,
      `WAVE ${state.wave}`,
      FIELD_W / 2,
      FIELD_H / 2,
      74,
      "center",
      "#f5fbff",
    );
}

function renderMenu(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<ShatterState>,
): void {
  if (state.screen === "title") {
    drawText(ctx, TITLE_TEXT, FIELD_W / 2, 168, 92, "center", "#e8fbff");
    drawText(ctx, TAGLINE_TEXT, FIELD_W / 2, 242, 24, "center", "#7fe1ff");
  }
  if (state.screen === "howto") {
    drawText(ctx, "HOW TO PLAY", FIELD_W / 2, 88, 46, "center");
    [
      "Clear each wave by shooting every rock down through its fragments.",
      "The star bends bullets and rocks, but never the ship. Curve shots around it.",
      "Rocks swallowed by the core return from an edge with their armor intact.",
      "Large rocks take several hits and show damage. F launches the homing torpedo.",
      "ARROWS or WASD fly, SPACE fires, F torpedoes, ENTER confirms, ESC/P pause, M mutes.",
    ].forEach((line, i) =>
      drawText(ctx, line, FIELD_W / 2, 185 + i * 58, 25, "center", "#d9e5f5"),
    );
    drawText(
      ctx,
      "SPACE / ENTER / ESC",
      FIELD_W / 2,
      604,
      22,
      "center",
      "#7fe1ff",
    );
    return;
  }
  if (state.screen === "gameover") {
    drawText(ctx, "GAME OVER", FIELD_W / 2, 170, 68, "center");
    drawText(
      ctx,
      `SCORE ${state.score}   WAVE ${state.wave}`,
      FIELD_W / 2,
      252,
      30,
      "center",
      "#ffec8b",
    );
  }
  if (state.screen === "paused")
    drawText(ctx, "PAUSED", FIELD_W / 2, 196, 62, "center");
  menuItems(state.screen).forEach((item, i) => {
    const r = menuRect(state.screen, i);
    if (!r) return;
    const selected = i === state.menuIndex;
    ctx.fillStyle = selected
      ? "rgba(127, 225, 255, 0.18)"
      : "rgba(8, 14, 32, 0.72)";
    ctx.strokeStyle = selected ? "#7fe1ff" : "#40506f";
    ctx.lineWidth = selected ? 3 : 1.5;
    ctx.beginPath();
    ctx.roundRect(r.x, r.y, r.w, r.h, 6);
    ctx.fill();
    ctx.stroke();
    drawText(
      ctx,
      item,
      FIELD_W / 2,
      r.y + r.h / 2,
      24,
      "center",
      selected ? "#ffffff" : "#aebbd2",
    );
  });
}

export const game: Game<ShatterState, ShatterDebugApi> = {
  initialize(api: InitApi<ShatterState>): [ShatterState, ShatterDebugApi] {
    for (const action of ACTIONS) api.input.register(action, BINDINGS[action]);
    defineAudio(api);
    registerDiagnostics(api);
    return [baseState(false), buildDebug()];
  },

  update(
    state: DeepReadonly<ShatterState>,
    api: UpdateApi,
    dt: number,
  ): ShatterState {
    return updateFrame(state, api, dt);
  },

  render(state: DeepReadonly<ShatterState>, api: RenderApi): void {
    const { ctx } = api;
    renderField(ctx);
    if (
      state.screen === "playing" ||
      state.screen === "paused" ||
      state.screen === "gameover"
    ) {
      state.bullets.forEach((b) => renderBullet(ctx, b));
      state.enemyBullets.forEach((b) => renderBullet(ctx, b, true));
      state.torpedoes.forEach((t) => renderTorpedo(ctx, t));
      state.rocks.forEach((r) => renderRock(ctx, r));
      if (state.saucer) renderSaucer(ctx, state.saucer);
      if (state.lives > 0) renderShip(ctx, state.ship);
      renderHud(ctx, state);
    }
    if (state.screen !== "playing") renderMenu(ctx, state);
  },
};
