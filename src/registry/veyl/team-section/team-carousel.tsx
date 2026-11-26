'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  motion,
  motionValue,
  useAnimationFrame,
  useReducedMotion,
  type MotionValue,
} from 'motion/react';
import {cn} from '@/lib/utils';
import type {TeamMember} from './team-data';

/* ------------------------------------------------------------------ */
/* Measured from the reference recording. All distances are in px.     */
/* ------------------------------------------------------------------ */
const CARD_W = 244; // card width
const PITCH = 284; // distance from one card to the next
const PIVOT_Y = 46; // where the string sits, from the top of the stage
const BASE_SAG = 22; // how far the string sags in the middle at rest
const DIP = 55; // how far the string is pushed down under the pointer
const DIP_SIGMA = 300; // how wide that push is
const HOVER_TILT = 18; // degrees of tilt next to the pointer
const TILT_PER_SPEED = 0.0024; // degrees of swing per px/s of travel
const FRICTION = 3.57; // after a flick, speed falls to 70% every 100ms
const DRIFT_EASE = 0.6; // seconds to ease the drift in and out
const INTRO_TILTS = [6.8, -1.5, 6, -2.3, 10, 3.5]; // cards start slightly swung, then settle

type CardMotion = {x: MotionValue<number>; y: MotionValue<number>; r: MotionValue<number>};

type Sim = {
  width: number;
  count: number;
  time: number;
  offset: number;
  inertia: number;
  drift: number;
  dragV: number;
  lastMove: number;
  dragging: boolean;
  hover: boolean;
  px: number;
  py: number;
  lastX: number;
  ready: boolean;
  th: number[];
  thv: number[];
  y: number[];
  yv: number[];
};

export type TeamCarouselProps = {
  members: TeamMember[];
  /** Slow drift to the left, in px per second. It pauses while the pointer is over the cards. 0 turns it off. */
  speed?: number;
  /** Let people drag the cards. */
  draggable?: boolean;
  className?: string;
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function TeamCarousel({
  members,
  speed = 33,
  draggable = true,
  className,
}: TeamCarouselProps) {
  const reduced = !!useReducedMotion();
  const n = Math.max(1, members.length);
  const stageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const motions = useRef<CardMotion[]>([]);
  // Enough cards to fill the stage, always a whole number of laps of the member list.
  const [count, setCount] = useState(n * Math.ceil(12 / n));

  const sim = useRef<Sim>({
    width: 0,
    count,
    time: 0,
    offset: -PITCH * 0.4,
    inertia: 0,
    drift: 0,
    dragV: 0,
    lastMove: 0,
    dragging: false,
    hover: false,
    px: 0,
    py: 0,
    lastX: 0,
    ready: false,
    th: [],
    thv: [],
    y: [],
    yv: [],
  });
  sim.current.count = count;

  const getMotion = (i: number): CardMotion => {
    if (!motions.current[i]) {
      motions.current[i] = {
        x: motionValue(i * PITCH - PITCH * 0.4),
        y: motionValue(PIVOT_Y + BASE_SAG),
        r: motionValue(0),
      };
    }
    return motions.current[i];
  };

  /* Measure the stage and work out how many cards it needs. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      sim.current.width = w;
      const need = Math.ceil((w + 2 * PITCH) / PITCH) + 1;
      setCount(n * Math.ceil(need / n));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [n]);

  /* One frame of the simulation: motion of the whole strip, then swing and sag of every card. */
  useAnimationFrame((_, delta) => {
    const s = sim.current;
    if (!s.width) return;
    const dt = Math.min(delta / 1000, 1 / 30);
    if (dt <= 0) return;
    s.time += dt;
    const W = s.width;
    const L = s.count * PITCH;

    // Speed of the strip (px per second).
    let v: number;
    if (s.dragging) {
      if (s.time - s.lastMove > 0.05) s.dragV *= Math.exp(-dt / 0.05);
      v = s.dragV;
    } else {
      s.inertia *= Math.exp(-FRICTION * dt);
      if (Math.abs(s.inertia) < 0.5) s.inertia = 0;
      const target = s.hover || reduced ? 0 : -speed;
      s.drift += (target - s.drift) * (1 - Math.exp(-dt / DRIFT_EASE));
      v = s.inertia + s.drift;
      s.offset += v * dt;
    }

    const points: [number, number][] = [];
    for (let i = 0; i < s.count; i++) {
      if (!s.ready) {
        s.th[i] = 0;
        s.thv[i] = 0;
        s.y[i] = BASE_SAG;
        s.yv[i] = 0;
      }
      const sx = ((((i * PITCH + s.offset) % L) + L) % L) - PITCH;
      const cx = sx + CARD_W / 2;

      // Where this card's string point wants to be: a gentle sag, pushed down under the pointer.
      const u = (cx - W / 2) / (W / 2 + PITCH);
      let yTarget = BASE_SAG * Math.max(0, 1 - u * u);
      let tiltHover = 0;
      if (s.hover && !reduced) {
        const dx = s.px - cx;
        const w = Math.exp(-((dx / DIP_SIGMA) ** 2));
        const rel = s.py - PIVOT_Y;
        const g = clamp(1 - (rel - 100) / 140, 0.2, 1);
        yTarget += DIP * w * g;
        tiltHover = HOVER_TILT * (dx / DIP_SIGMA) * w * g;
      }

      // Springs. Every card has its own stiffness, so they never swing in step.
      const wy = 6.7;
      s.yv[i] += (wy * wy * (yTarget - s.y[i]) - 2 * 0.8 * wy * s.yv[i]) * dt;
      s.y[i] += s.yv[i] * dt;

      const wt = 5.4 * (1 + 0.16 * Math.sin(i * 1.9 + 0.6));
      const tiltTarget = reduced ? 0 : clamp(TILT_PER_SPEED * v, -14, 14) + tiltHover;
      s.thv[i] += (wt * wt * (tiltTarget - s.th[i]) - 2 * 0.42 * wt * s.thv[i]) * dt;
      s.th[i] += s.thv[i] * dt;

      const intro = reduced ? 0 : INTRO_TILTS[i % INTRO_TILTS.length] * Math.exp(-s.time / 2.2);
      const m = getMotion(i);
      m.x.set(sx);
      m.y.set(PIVOT_Y + s.y[i]);
      m.r.set(s.th[i] + intro);
      points.push([cx, PIVOT_Y + s.y[i]]);
    }
    s.ready = true;

    // The string runs through every pin, and carries on past both ends.
    points.sort((a, b) => a[0] - b[0]);
    if (pathRef.current && points.length > 1) {
      const first = points[0];
      const second = points[1];
      const last = points[points.length - 1];
      const prev = points[points.length - 2];
      const slope = (a: [number, number], b: [number, number]) => (b[1] - a[1]) / (b[0] - a[0] || 1);
      const left: [number, number] = [-120, first[1] - slope(first, second) * (first[0] + 120)];
      const right: [number, number] = [W + 120, last[1] + slope(prev, last) * (W + 120 - last[0])];
      const d = [left, ...points, right]
        .map((p, k) => `${k ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
        .join(' ');
      pathRef.current.setAttribute('d', d);
    }
  });

  /* Pointer: hover pushes the string down, dragging moves the strip, letting go keeps it gliding. */
  const place = useCallback((e: React.PointerEvent) => {
    const r = stageRef.current?.getBoundingClientRect();
    if (!r) return;
    sim.current.px = e.clientX - r.left;
    sim.current.py = e.clientY - r.top;
  }, []);

  const onPointerEnter = (e: React.PointerEvent) => {
    place(e);
    sim.current.hover = true;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    place(e);
    const s = sim.current;
    if (!s.dragging) {
      s.hover = true;
      return;
    }
    const dt = Math.max(0.001, s.time - s.lastMove);
    const dx = e.clientX - s.lastX;
    s.lastX = e.clientX;
    s.offset += dx;
    const inst = dx / Math.max(dt, 1 / 120);
    s.dragV = s.dragV * 0.6 + inst * 0.4;
    s.lastMove = s.time;
  };
  const onPointerLeave = () => {
    if (!sim.current.dragging) sim.current.hover = false;
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (!draggable || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const s = sim.current;
    place(e);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    s.dragging = true;
    s.hover = true;
    s.lastX = e.clientX;
    s.dragV = 0;
    s.inertia = 0;
    s.lastMove = s.time;
  };
  const endDrag = (e: React.PointerEvent) => {
    const s = sim.current;
    if (!s.dragging) return;
    s.dragging = false;
    // A flick keeps its speed. A drag that stopped before letting go does not.
    s.inertia = s.time - s.lastMove < 0.08 ? clamp(s.dragV, -4000, 4000) : 0;
    if (e.pointerType !== 'mouse') s.hover = false;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') sim.current.inertia += 900;
    else if (e.key === 'ArrowLeft') sim.current.inertia -= 900;
  };

  return (
    <div
      ref={stageRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Team members"
      tabIndex={0}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className={cn(
        'relative h-[560px] w-full select-none overflow-hidden outline-none [touch-action:pan-y]',
        '[mask-image:linear-gradient(to_right,transparent,#000_9%,#000_91%,transparent)]',
        draggable && 'cursor-grab active:cursor-grabbing',
        'focus-visible:ring-2 focus-visible:ring-zinc-400/60 dark:focus-visible:ring-white/30 focus-visible:ring-inset',
        className
      )}
    >
      {/* The string */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <path
          ref={pathRef}
          fill="none"
          strokeWidth={1}
          strokeLinejoin="round"
          className="stroke-zinc-300/80 dark:stroke-[#262a4a]"
        />
      </svg>

      {Array.from({length: count}, (_, i) => {
        const member = members[i % n];
        const m = getMotion(i);
        return (
          <motion.div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${member.name}, ${member.role}`}
            aria-hidden={i >= n ? true : undefined}
            style={{x: m.x, y: m.y, rotate: m.r, transformOrigin: '50% 0'}}
            className="absolute left-0 top-0 will-change-transform"
          >
            {/* Pin */}
            <span
              aria-hidden="true"
              className="absolute -top-1 left-1/2 z-10 h-[22px] w-[22px] -translate-x-1/2 rounded-[7px] bg-[#0b0b14] shadow-[0_1px_2px_rgba(0,0,0,0.25)] dark:bg-[#f4f4f6] dark:shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
            >
              <span className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-[62%] rounded-full bg-white dark:bg-[#0b0b14]" />
            </span>

            {/* Card */}
            <div
              style={{width: CARD_W}}
              className="mt-[3px] rounded-[20px] border border-zinc-200 bg-white p-[9px] shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/[0.1] dark:bg-[#04040e] dark:shadow-none"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[14px] bg-zinc-100 dark:bg-zinc-900">
                {member.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.image}
                    alt={member.name}
                    draggable={false}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300 text-3xl font-semibold text-zinc-500 dark:from-zinc-800 dark:to-zinc-900 dark:text-zinc-500">
                    {initials(member.name)}
                  </div>
                )}
              </div>
              <div className="px-2 pb-3.5 pt-3 text-center">
                <div className="text-[16px] font-medium leading-5 tracking-[-0.01em] text-zinc-950 dark:text-white">
                  {member.name}
                </div>
                <div className="mt-1 text-[14px] leading-5 text-zinc-500 dark:text-zinc-400">
                  {member.role}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}