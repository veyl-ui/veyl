"use client";

import { useEffect, useRef } from "react";

/*
  A GitHub-style contribution graph that plays a little story, over and over:
    1. the graph sits still for a moment,
    2. a snake runs through it from left to right, column by column,
    3. every square it passes shrinks into a small, faint box,
    4. when the snake has left, the squares grow back from left to right with new shades.
  It is drawn on one <canvas>, so it stays smooth. Put it inside a `relative` parent: it fills the parent,
  and the parent's pointer movement lights up the squares near the mouse.
*/

const MAX_COLS = 53; // weeks
const ROWS = 7; // days
const SNAKE = 7; // squares in the snake
const SPEED = 26; // squares per second
const GUTTER = 34; // room for the Mon / Wed / Fri labels
const MIN_PITCH = 11;
const MAX_PITCH = 20;
const REST = { light: 0.26, dark: 0.4 }; // how strong the squares are when nothing touches them

// GitHub's own greens: from "no contributions" to "many".
const PALETTE = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};
const BRAND = "#f59e0b";
const LABEL = { light: "#6b6b66", dark: "#a3a3a3" };

const T_HOLD = 900;
const T_PAUSE = 700;
const T_REST = 1800;

type Levels = number[][];

function seeded(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random shades, 0 to 4, in busy and quiet stretches, a bit quieter at the weekend rows. */
function makeLevels(seed: number): Levels {
  const rand = seeded(seed);
  const out: Levels = [];
  for (let c = 0; c < MAX_COLS; c++) {
    const busy = 0.55 + 0.4 * Math.sin(c / 5 + seed) * Math.sin(c / 11);
    const col: number[] = [];
    for (let r = 0; r < ROWS; r++) {
      const x = (rand() * (r === 0 || r === 6 ? 1.5 : 1)) / (busy + 0.35);
      col.push(x < 0.5 ? 4 : x < 0.85 ? 3 : x < 1.2 ? 2 : x < 1.5 ? 1 : 0);
    }
    out.push(col);
  }
  return out;
}

const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : 1 - Math.pow(1 - x, 3));

export function ContributionGraph({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let cols = MAX_COLS;
    let pitch = 0;
    let cell = 0;
    let gx = 0;
    let gy = 0;
    let path: [number, number][] = [];
    let order: number[][] = [];
    let months: [number, string][] = [];
    let total = 0;
    let tRun = 0;
    let tRegrow = 0;
    let cycle = 0;

    let cur = makeLevels(7);
    let nxt = makeLevels(Math.floor(Math.random() * 1e6) + 1);
    let lastCycle = 0;
    let mouse: { x: number; y: number } | null = null;
    let raf = 0;
    let visible = true;
    let start = performance.now();

    function layout() {
      if (!canvas || !host || !ctx) return;
      W = host.clientWidth;
      H = host.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(8, Math.min(MAX_COLS, Math.floor((W - GUTTER) / MIN_PITCH)));
      pitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, Math.floor((W - GUTTER) / cols)));
      cell = Math.round(pitch * 0.8);
      gx = Math.round((W - pitch * cols + GUTTER) / 2);
      gy = Math.round((H - pitch * ROWS) / 2);

      // The snake goes down column 0, up column 1, down column 2 and so on.
      path = [];
      order = Array.from({ length: cols }, () => Array<number>(ROWS).fill(0));
      for (let c = 0; c < cols; c++) {
        for (let i = 0; i < ROWS; i++) {
          const r = c % 2 ? ROWS - 1 - i : i;
          order[c][r] = path.length;
          path.push([c, r]);
        }
      }
      total = path.length;
      tRun = ((total + 2 * SNAKE) / SPEED) * 1000;
      tRegrow = cols * 38 + 450;
      cycle = T_HOLD + tRun + T_PAUSE + tRegrow + T_REST;

      // Month names above the weeks, counted back from today.
      months = [];
      const today = new Date();
      const first = new Date(today);
      first.setDate(today.getDate() - today.getDay() - (cols - 1) * 7);
      let lastMonth = -1;
      for (let c = 0; c < cols; c++) {
        const d = new Date(first);
        d.setDate(first.getDate() + c * 7);
        const m = d.getMonth();
        if (m !== lastMonth) {
          if (c < cols - 2) months.push([c, d.toLocaleString("en", { month: "short" })]);
          lastMonth = m;
        }
      }
    }

    function rr(x: number, y: number, w: number, h: number, r: number) {
      if (!ctx) return;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
    }

    function draw(now: number) {
      if (!ctx) return;
      const dark = document.documentElement.classList.contains("dark");
      const pal = PALETTE[dark ? "dark" : "light"];
      const rest = dark ? REST.dark : REST.light;
      const label = LABEL[dark ? "dark" : "light"];

      let tt = reduce ? 0 : now - start;
      const cyc = Math.floor(tt / cycle);
      tt -= cyc * cycle;
      while (lastCycle < cyc) {
        cur = nxt;
        nxt = makeLevels(Math.floor(Math.random() * 1e6) + 1);
        lastCycle++;
      }

      const head = tt < T_HOLD ? -Infinity : ((tt - T_HOLD) / 1000) * SPEED - SNAKE;
      const regrowStart = T_HOLD + tRun + T_PAUSE;

      ctx.clearRect(0, 0, W, H);

      // labels
      ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillStyle = label;
      ctx.globalAlpha = dark ? 0.55 : 0.4;
      for (const [c, name] of months) ctx.fillText(name, gx + c * pitch, gy - 14);
      for (const [name, r] of [["Mon", 1], ["Wed", 3], ["Fri", 5]] as const) {
        ctx.fillText(name, gx - GUTTER + 2, gy + r * pitch + cell / 2);
      }

      // squares
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < ROWS; r++) {
          const k = order[c][r];
          const eaten = (head - k) / SPEED; // seconds since the snake's head reached this square
          const regrow = tt - regrowStart - c * 38; // ms since this column started to grow back
          let s = 1;
          let a = 1;
          let shade = pal[cur[c][r]];

          if (eaten > 0 && regrow < 0) {
            const e = ease(eaten / 0.28);
            s = 1 - 0.58 * e; // shrink to a small box
            a = 1 - 0.72 * e; // and go faint
          } else if (eaten > 0) {
            const e = ease(regrow / 380);
            s = 0.42 + 0.58 * e + (e < 1 ? 0.12 * Math.sin(e * Math.PI) : 0); // grow back with a little overshoot
            a = 0.28 + 0.72 * e;
            shade = pal[nxt[c][r]];
          }

          const x = gx + c * pitch + (pitch - cell) / 2;
          const y = gy + r * pitch + (pitch - cell) / 2;

          let boost = 0;
          if (mouse) {
            const d = Math.hypot(x + cell / 2 - mouse.x, y + cell / 2 - mouse.y);
            boost = Math.max(0, 1 - d / 90);
            if (boost > 0) {
              s *= 1 + 0.35 * boost;
              if (boost > 0.5 && s > 0.7) {
                const lv = eaten > 0 && regrow >= 0 ? nxt[c][r] : cur[c][r];
                shade = pal[Math.min(4, lv + 1)];
              }
            }
          }

          const size = cell * s;
          const off = (cell - size) / 2;
          const base = a * rest;
          ctx.globalAlpha = base + (1 - base) * boost;
          ctx.fillStyle = shade;
          rr(x + off, y + off, size, size, Math.max(2, size * 0.22));
          ctx.fill();
        }
      }

      // the snake
      if (head > -Infinity) {
        for (let j = SNAKE - 1; j >= 0; j--) {
          const p = head - j * 0.95;
          if (p < -SNAKE - 1 || p > total + SNAKE) continue;
          let cx: number;
          let cy: number;
          if (p < 0) {
            cx = path[0][0] + p;
            cy = path[0][1];
          } else if (p > total - 1) {
            cx = path[total - 1][0] + (p - (total - 1));
            cy = path[total - 1][1];
          } else {
            const i0 = Math.floor(p);
            const i1 = Math.min(total - 1, i0 + 1);
            const f = p - i0;
            cx = path[i0][0] * (1 - f) + path[i1][0] * f;
            cy = path[i0][1] * (1 - f) + path[i1][1] * f;
          }
          const t = j / (SNAKE - 1);
          const size = cell * (j === 0 ? 1.12 : 1 - 0.22 * t);
          const off = (cell - size) / 2;
          ctx.globalAlpha = j === 0 ? 1 : 1 - 0.55 * t;
          ctx.fillStyle = j === 0 ? BRAND : dark ? "#fbbf24" : "#d97706";
          ctx.shadowColor = BRAND;
          ctx.shadowBlur = j === 0 ? 14 : 0;
          rr(gx + cx * pitch + (pitch - cell) / 2 + off, gy + cy * pitch + (pitch - cell) / 2 + off, size, size, Math.max(2, size * 0.3));
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // the "Less … More" legend
      const lx = gx + cols * pitch - 132;
      const ly = gy + ROWS * pitch + 16;
      ctx.globalAlpha = dark ? 0.55 : 0.4;
      ctx.fillStyle = label;
      ctx.fillText("Less", lx, ly);
      pal.forEach((color, i) => {
        ctx.fillStyle = color;
        rr(lx + 30 + i * 15, ly - 6, 11, 11, 2.5);
        ctx.fill();
      });
      ctx.fillStyle = label;
      ctx.fillText("More", lx + 30 + 5 * 15 + 3, ly);
      ctx.globalAlpha = 1;
    }

    function loop(now: number) {
      draw(now);
      raf = visible ? requestAnimationFrame(loop) : 0;
    }
    function play() {
      if (reduce || raf || !visible) return;
      raf = requestAnimationFrame(loop);
    }

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse" || !canvas) return;
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (reduce) draw(0);
    }
    function onLeave() {
      mouse = null;
      if (reduce) draw(0);
    }

    layout();
    draw(performance.now());
    play();

    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now());
    });
    ro.observe(host);

    // Stop drawing while the graph is off screen or the tab is hidden.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible) play();
    });
    io.observe(host);
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // With reduced motion there is no loop, so redraw when the theme changes.
    const mo = new MutationObserver(() => draw(0));
    if (reduce) mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    />
  );
}