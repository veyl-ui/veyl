'use client';

import React, {useEffect, useRef} from 'react';
import {cn} from '@/lib/utils';
import {plateHz, noteHz, type ResonanceAudio} from './resonance-audio';

export type PlateState = 'idle' | 'error' | 'success';
export type PlateCaption = {title: string; hint: string};
export type PlateCaptions = Record<PlateState, PlateCaption>;

export const DEFAULT_CAPTIONS: PlateCaptions = {
  idle: {title: 'Every keystroke tunes the plate.', hint: 'type, or drag your cursor across it'},
  error: {title: 'Out of tune.', hint: 'the plate rejected that password'},
  success: {title: 'In tune. Welcome back.', hint: 'the plate has settled'},
};

export type ResonancePlateProps = {
  /** What the plate is doing. "error" shakes the sand, "success" settles it into a clean pattern. */
  state?: PlateState;
  /** A number that decides the pattern. The same number always gives the same pattern. Leave it out and the plate cycles through patterns by itself. */
  seed?: number;
  /** The sound engine. Leave it out for a silent plate. */
  audio?: ResonanceAudio | null;
  /** Whether the sound is on. Only used to show the button. */
  soundOn?: boolean;
  /** Called when the sound button is pressed. Leave it out to hide the button. */
  onToggleSound?: () => void;
  /** The text under the plate for each state. */
  captions?: Partial<PlateCaptions>;
  /** The small label at the top left. */
  label?: string;
  /** How many grains of sand. More looks richer but costs more on slow phones. */
  particles?: number;
  className?: string;
};

type Rgb = [number, number, number];
const COLORS: Record<PlateState, Rgb> = {
  idle: [255, 224, 170],
  error: [255, 104, 92],
  success: [140, 255, 196],
};
const MODES: [number, number][] = [[2, 3], [3, 5], [4, 7], [5, 8], [2, 7], [6, 9], [3, 8], [4, 9]];
const PI = Math.PI;

/** The height of a vibrating square plate at one spot. Sand collects where this is zero. */
function wave(x: number, y: number, n: number, m: number) {
  return Math.cos(n * PI * x) * Math.cos(m * PI * y) - Math.cos(m * PI * x) * Math.cos(n * PI * y);
}

type Sim = {setState: (s: PlateState) => void; setSeed: (n: number) => void};

export default function ResonancePlate({
  state = 'idle',
  seed,
  audio = null,
  soundOn = false,
  onToggleSound,
  captions,
  label = 'Resonance · sign-in',
  particles = 7000,
  className,
}: ResonancePlateProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef<HTMLSpanElement>(null);
  const hzRef = useRef<HTMLSpanElement>(null);
  const simRef = useRef<Sim | null>(null);
  const audioRef = useRef<ResonanceAudio | null>(audio);
  audioRef.current = audio;

  const text = {...DEFAULT_CAPTIONS, ...captions}[state];

  // The simulation. It lives in one effect and talks to the screen through the canvas, so React never re-renders per frame.
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!stage || !canvas || !ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const N = particles;
    const px = new Float32Array(N);
    const py = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      px[i] = Math.random();
      py[i] = Math.random();
    }

    const cur = {n: 3, m: 5};
    const tgt = {n: 3, m: 5};
    const col: Rgb = [...COLORS.idle];
    let colT: Rgb = COLORS.idle;
    let mode = 'idle' as PlateState;
    let modeIdx = 1;
    let modeAt = 0;
    let lastInput = -1e9;
    let agit = 0.6;
    let lastSeed: number | undefined;
    let frames = 0;
    let W = 0;
    let H = 0;
    let S = 0;
    let ox = 0;
    let oy = 0;
    const ptr = {x: 0, y: 0, on: false, acc: 0, lx: 0, ly: 0};

    const setTarget = (n: number, m: number) => {
      tgt.n = n;
      tgt.m = m;
      audioRef.current?.setPlateHz(plateHz(n, m));
    };
    const seedTarget = (h: number) => {
      const n = 2 + (h % 6);
      setTarget(n, n + 1 + ((h >>> 4) % 5));
    };

    let raf = 0;
    let running = false;
    let visible = true;
    let settle = 0;
    let last = performance.now();

    const resize = () => {
      const r = stage.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width;
      H = r.height;
      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));
      S = Math.min(W, H) * 0.74;
      ox = (W - S) / 2;
      oy = (H - S) / 2 - 14;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#07070b';
      ctx.fillRect(0, 0, W, H);
      kick();
    };

    const frame = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;

      if (!reduced && mode === 'idle' && t - lastInput > 7000 && t - modeAt > 9000) {
        modeIdx = (modeIdx + 1) % MODES.length;
        setTarget(MODES[modeIdx][0], MODES[modeIdx][1]);
        modeAt = t;
      }

      const k = Math.min(1, dt * 1.5);
      cur.n += (tgt.n - cur.n) * k;
      cur.m += (tgt.m - cur.m) * k;
      const base = mode === 'error' ? 5 : mode === 'success' ? 0.12 : 0.6;
      agit += (base - agit) * Math.min(1, dt * (mode === 'error' ? 6 : 1.4));

      const n = cur.n;
      const m = cur.m;
      const jitter = 0.0005 + 0.004 * agit;
      const pull = 0.00005;
      const e = 0.0015;
      const pOn = ptr.on;
      for (let i = 0; i < N; i++) {
        let x = px[i];
        let y = py[i];
        const f = wave(x, y, n, m);
        const fx = (wave(x + e, y, n, m) - f) / e;
        const fy = (wave(x, y + e, n, m) - f) / e;
        const j = jitter * (0.25 + (f < 0 ? -f : f));
        // Slide downhill towards the places where the plate stands still.
        x -= pull * f * fx;
        y -= pull * f * fy;
        if (pOn) {
          const dx = x - ptr.x;
          const dy = y - ptr.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 0.014) {
            const s = (1 - d2 / 0.014) * 0.014;
            x += (Math.random() - 0.5) * s * 2;
            y += (Math.random() - 0.5) * s * 2;
          }
        }
        x += (Math.random() - 0.5) * 2 * j;
        y += (Math.random() - 0.5) * 2 * j;
        if (x < 0) x = -x;
        else if (x > 1) x = 2 - x;
        if (y < 0) y = -y;
        else if (y > 1) y = 2 - y;
        px[i] = x;
        py[i] = y;
      }

      const c = Math.min(1, dt * 2.2);
      col[0] += (colT[0] - col[0]) * c;
      col[1] += (colT[1] - col[1]) * c;
      col[2] += (colT[2] - col[2]) * c;

      // Fade the last frame a little, so the sand leaves faint trails, then draw the grains.
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(7,7,11,.3)';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},.55)`;
      for (let i = 0; i < N; i++) ctx.fillRect(ox + px[i] * S - 0.8, oy + py[i] * S - 0.8, 1.6, 1.6);
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255,255,255,.09)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(ox - 12, oy - 12, S + 24, S + 24, 4);
      else ctx.rect(ox - 12, oy - 12, S + 24, S + 24);
      ctx.stroke();

      if (++frames % 6 === 0) {
        if (modeRef.current) modeRef.current.textContent = `mode ${cur.n.toFixed(1)} · ${cur.m.toFixed(1)}`;
        if (hzRef.current) hzRef.current.textContent = `${Math.round(plateHz(tgt.n, tgt.m))} Hz`;
      }

      if (reduced && settle-- <= 0) {
        running = false;
        return;
      }
      if (visible) raf = requestAnimationFrame(frame);
      else running = false;
    };

    function start() {
      if (running || !visible) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    // Wake the loop up. With reduced motion it only runs for a moment, long enough for the sand to settle.
    function kick() {
      settle = 160;
      start();
    }

    simRef.current = {
      setState(s) {
        mode = s;
        colT = COLORS[s];
        if (s === 'error') setTarget(9, 14);
        else if (s === 'success') setTarget(4, 7);
        else if (lastSeed !== undefined) seedTarget(lastSeed);
        kick();
      },
      setSeed(h) {
        lastSeed = h;
        lastInput = performance.now();
        modeAt = lastInput;
        if (mode === 'idle') seedTarget(h);
        agit = Math.min(agit + 1.2, 4);
        kick();
      },
    };

    // Stroke the plate with the cursor: the sand scatters, and every so often a note plays.
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      ptr.x = (x - ox) / S;
      ptr.y = (y - oy) / S;
      ptr.on = true;
      ptr.acc += Math.hypot(x - ptr.lx, y - ptr.ly);
      ptr.lx = x;
      ptr.ly = y;
      if (ptr.acc > 150) {
        ptr.acc = 0;
        audioRef.current?.pluck(noteHz(5 + Math.max(0, Math.min(9, Math.floor(ptr.x * 10)))), 0.1, 1.6);
      }
      lastInput = performance.now();
      kick();
    };
    const onLeave = () => {
      ptr.on = false;
    };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);

    // Pause the work while the plate is off screen.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(stage);
    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      running = false;
      simRef.current = null;
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
      io.disconnect();
      ro.disconnect();
    };
  }, [particles]);

  useEffect(() => {
    simRef.current?.setState(state);
  }, [state]);

  useEffect(() => {
    if (seed !== undefined) simRef.current?.setSeed(seed);
  }, [seed]);

  return (
    <div ref={stageRef} className={cn('lp-stage', className)}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="lp-hud lp-hud-top">
        <span>{label}</span>
      </div>
      {onToggleSound ? (
        <button type="button" className="lp-snd" data-on={soundOn} aria-pressed={soundOn} onClick={onToggleSound}>
          <span className="lp-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>{soundOn ? 'Sound on' : 'Sound off'}</span>
        </button>
      ) : null}
      <div className="lp-cap" aria-live="polite">
        <b>{text.title}</b>
        <span>{text.hint}</span>
      </div>
      <div className="lp-hud lp-hud-bot" aria-hidden="true">
        <span ref={modeRef}>mode 3.0 · 5.0</span>
        <span ref={hzRef}>0 Hz</span>
      </div>
    </div>
  );
}