'use client';

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useAnimationFrame, useReducedMotion} from 'motion/react';
import {cn} from '@/lib/utils';
import type {CloudLogo} from './logo-data';

/* ------------------------------------------------------------------ */
/* Sizes, in px, for a stage 680 wide. It scales down on small screens. */
/* ------------------------------------------------------------------ */
const STAGE_W = 680;
const STAGE_H = 310;
const TILE = 76; // width and height of one tile
const PITCH = 92; // distance from one tile to the next
const ROW_Y = 62; // centre of the first row
const ROW_GAP = 92; // distance between rows
const ARCH = 16; // how much the outer tiles of each row sag
const RADIUS = 150; // how far from the pointer a tile reacts
const PUSH = 15; // how far a tile moves away from the pointer
const SWELL = 0.3; // how much bigger the closest tile gets
const STAGGER = 55; // ms between tiles on the intro

type Tile = {
  logo: CloudLogo;
  bx: number;
  by: number;
  phase: number;
  delay: number;
  x: number;
  y: number;
  s: number;
  vx: number;
  vy: number;
  vs: number;
  o: number;
  c: number;
  started: boolean;
  dark: boolean;
};

export type LogoFieldProps = {
  logos: CloudLogo[];
  /** Text under the cloud while no logo is close to the pointer. */
  hint?: string;
  className?: string;
};

/** Split n logos into three rows, longer on the outside. Few logos stay on one row. */
function rowSizes(n: number): number[] {
  if (n <= 4) return [n];
  const outer = Math.ceil(n / 3);
  const middle = n - 2 * outer;
  return middle > 0 ? [outer, middle, outer] : [Math.ceil(n / 2), Math.floor(n / 2)];
}

/** Black and near-black brand colours would vanish in dark mode, so those logos use the text colour instead. */
function isDark(hex: string) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return r * 0.3 + g * 0.6 + b * 0.1 < 60;
}

function buildTiles(logos: CloudLogo[]): Tile[] {
  const rows = rowSizes(logos.length);
  const total = rows.length;
  const tiles: Tile[] = [];
  let k = 0;
  rows.forEach((n, r) => {
    for (let c = 0; c < n; c++) {
      const logo = logos[k];
      const bx = STAGE_W / 2 + (c - (n - 1) / 2) * PITCH;
      const u = (bx - STAGE_W / 2) / (STAGE_W / 2);
      const rowY = total === 1 ? STAGE_H / 2 : ROW_Y + r * ROW_GAP;
      tiles.push({
        logo,
        bx,
        by: rowY + u * u * ARCH,
        phase: k * 1.7,
        delay: k * STAGGER,
        x: 0,
        y: 0,
        s: 1,
        vx: 0,
        vy: 0,
        vs: 0,
        o: 1,
        c: 0,
        started: true,
        dark: isDark(logo.color),
      });
      k++;
    }
  });
  return tiles;
}

export default function LogoField({logos, hint = 'Move your cursor through the cloud', className}: LogoFieldProps) {
  const reduced = !!useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const tileEls = useRef<(HTMLDivElement | null)[]>([]);
  const colorEls = useRef<(HTMLDivElement | null)[]>([]);
  const capRef = useRef<HTMLSpanElement>(null);
  const tiles = useRef<Tile[]>([]);
  const pointer = useRef<{x: number; y: number} | null>(null);
  const clock = useRef({start: 0, ready: false});
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);

  /** Put every tile in its scattered start place, so the intro can bring them home. */
  const scatter = useCallback(() => {
    tiles.current.forEach((t) => {
      if (reduced) {
        t.x = 0;
        t.y = 0;
        t.s = 1;
        t.o = 1;
        t.started = true;
      } else {
        t.x = (Math.random() - 0.5) * 260;
        t.y = (Math.random() - 0.5) * 200 + 40;
        t.s = 0.35;
        t.o = 0;
        t.started = false;
      }
      t.vx = t.vy = t.vs = 0;
      t.c = 0;
    });
    clock.current.start = performance.now();
    clock.current.ready = true;
  }, [reduced]);

  // Rebuild the layout when the list of logos changes.
  const layout = useMemo(() => buildTiles(logos), [logos]);
  useEffect(() => {
    tiles.current = buildTiles(logos);
    scatter();
  }, [logos, scatter]);

  // Shrink the stage on narrow screens.
  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const measure = () => {
      const k = Math.min(1, el.clientWidth / STAGE_W);
      scaleRef.current = k;
      setScale(k);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((now, delta) => {
    if (!clock.current.ready) return;
    const dt = Math.min(0.033, delta / 1000);
    if (dt <= 0) return;
    const elapsed = performance.now() - clock.current.start;
    const p = pointer.current;
    const ft = now / 1000;
    let best: Tile | null = null;
    let bestF = 0;

    tiles.current.forEach((t, i) => {
      if (!t.started && elapsed > t.delay) t.started = true;

      let f = 0;
      let px = 0;
      let py = 0;
      if (p && t.started) {
        const dx = t.bx - p.x;
        const dy = t.by - p.y;
        const d = Math.hypot(dx, dy);
        f = Math.max(0, 1 - d / RADIUS);
        f = f * f * (3 - 2 * f); // smoothstep
        if (!reduced && d > 1) {
          px = (dx / d) * f * PUSH;
          py = (dy / d) * f * PUSH;
        }
      }

      if (t.started && !reduced) {
        // Slow float, a different rhythm for every tile, plus the push and swell from the pointer.
        const ix = Math.cos(ft * 0.7 + t.phase * 1.3) * 3.2;
        const iy = Math.sin(ft * 0.9 + t.phase) * 4.2;
        const tx = ix + px;
        const ty = iy + py;
        const ts = 1 + SWELL * f;
        t.vx += ((tx - t.x) * 150 - t.vx * 15) * dt;
        t.vy += ((ty - t.y) * 150 - t.vy * 15) * dt;
        t.vs += ((ts - t.s) * 220 - t.vs * 17) * dt;
        t.x += t.vx * dt;
        t.y += t.vy * dt;
        t.s += t.vs * dt;
        t.o += (1 - t.o) * Math.min(1, dt * 7);
      }

      // Grey turns into the brand colour as the pointer comes close.
      t.c += (Math.min(1, f * 1.7) - t.c) * Math.min(1, dt * 10);

      const el = tileEls.current[i];
      const col = colorEls.current[i];
      if (el) {
        el.style.transform = `translate3d(${(t.bx + t.x).toFixed(2)}px,${(t.by + t.y).toFixed(2)}px,0) scale(${Math.max(0.01, t.s).toFixed(3)})`;
        el.style.opacity = t.o.toFixed(2);
        el.style.zIndex = f > 0.5 ? '2' : '1';
        el.dataset.near = f > 0.55 ? 'true' : 'false';
      }
      if (col) col.style.opacity = t.c.toFixed(2);
      if (f > bestF) {
        bestF = f;
        best = t;
      }
    });

    if (capRef.current) {
      const text = best && bestF > 0.6 ? (best as Tile).logo.name : hint;
      if (capRef.current.textContent !== text) capRef.current.textContent = text;
    }
  });

  const onMove = (e: React.PointerEvent) => {
    const r = outerRef.current?.getBoundingClientRect();
    if (!r) return;
    const k = scaleRef.current || 1;
    pointer.current = {x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k};
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        ref={outerRef}
        role="list"
        aria-label="Logos"
        onPointerMove={onMove}
        onPointerLeave={() => {
          pointer.current = null;
        }}
        style={{height: STAGE_H * scale}}
        className="relative mx-auto w-full max-w-[680px] [touch-action:pan-y]"
      >
        <div
          style={{width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, transformOrigin: '0 0'}}
          className="absolute left-0 top-0"
        >
          {layout.map((t, i) => (
            <div
              key={t.logo.name}
              ref={(el) => {
                tileEls.current[i] = el;
              }}
              role="listitem"
              aria-label={t.logo.name}
              data-near="false"
              style={{
                left: -TILE / 2,
                top: -TILE / 2,
                width: TILE,
                height: TILE,
                transform: `translate3d(${t.bx}px,${t.by}px,0)`,
                opacity: 0,
              }}
              className="absolute rounded-2xl border border-zinc-200 bg-white will-change-transform data-[near=true]:border-zinc-300 dark:border-white/[0.1] dark:bg-[#0c0c10] dark:data-[near=true]:border-white/25"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="absolute inset-[23px] h-[30px] w-[30px] fill-zinc-400 dark:fill-zinc-500"
              >
                <path d={t.logo.path} />
              </svg>
              <div
                ref={(el) => {
                  colorEls.current[i] = el;
                }}
                aria-hidden="true"
                style={{opacity: 0}}
                className="absolute inset-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  className={cn(
                    'absolute inset-[23px] h-[30px] w-[30px]',
                    t.dark && 'fill-zinc-950 dark:fill-white'
                  )}
                  style={t.dark ? undefined : {fill: t.logo.color}}
                >
                  <path d={t.logo.path} />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-2 flex max-w-[680px] items-center justify-between gap-3 text-[13px] text-zinc-500 dark:text-zinc-400">
        <span ref={capRef} aria-live="off" className="min-h-5">
          {hint}
        </span>
        {!reduced ? (
          <button
            type="button"
            onClick={scatter}
            className="rounded-md border border-zinc-200 px-2 py-0.5 text-[12px] text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/10"
          >
            Replay intro
          </button>
        ) : null}
      </div>
    </div>
  );
}