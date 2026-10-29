"use client";

import { Fragment, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Small animated panels for BentoCard, themed around a single-origin coffee
 * roastery. Each one is a quiet white panel with a single moving idea. They loop
 * on their own and hold still for people who prefer reduced motion.
 */

type SkeletonProps = { className?: string };

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function useAnimate() {
  return !useReducedMotion();
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * A value that runs 0 -> 1 and repeats. `hold` is the share of each loop spent
 * resting at 1. When motion is off it simply stays at 1.
 */
function useLoop(duration: number, enabled: boolean, hold = 0.15) {
  const [value, setValue] = useState(enabled ? 0 : 1);

  useEffect(() => {
    if (!enabled) {
      setValue(1);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const raw = ((now - start) % duration) / duration;
      setValue(Math.min(1, raw / (1 - hold)));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, enabled, hold]);

  return value;
}

/** A live dot: solid, with a ring that pulses outward. */
function LiveDot({ animate }: { animate: boolean }) {
  return (
    <span className="relative flex h-1.5 w-1.5">
      {animate ? (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-amber-500"
          animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      ) : null}
      <span className="relative h-1.5 w-1.5 rounded-full bg-amber-500" />
    </span>
  );
}

const panel = "rounded-md bg-white/95 p-4 text-neutral-900 shadow-lg";
const caption = "text-[10px] font-medium text-neutral-500";

/* ------------------------------------------------------------------ */
/* 1. OriginTrail: harvest -> process -> roast                         */
/* ------------------------------------------------------------------ */

const STEPS = [
  { label: "Harvest", value: "Mt. Elgon, 1,800 m" },
  { label: "Process", value: "Washed, sun-dried" },
  { label: "Roast", value: "Medium, batch 482" },
] as const;

export function OriginTrail({ className }: SkeletonProps) {
  const animate = useAnimate();
  // 0, 1, 2 = that step is in progress. 3 = every step is finished.
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!animate) {
      setActive(STEPS.length);
      return;
    }
    const id = window.setInterval(
      () => setActive((a) => (a + 1) % (STEPS.length + 1)),
      2200,
    );
    return () => window.clearInterval(id);
  }, [animate]);

  return (
    <div className={cn("flex h-[100px] w-full items-end", className)}>
      <div className={cn(panel, "w-full")}>
        <div className="flex items-start">
          {STEPS.map((step, i) => {
            const reached = i <= active;
            return (
              <Fragment key={step.label}>
                {i > 0 ? (
                  <div className="relative mx-2 mt-[5px] h-px flex-1 bg-neutral-200">
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 bg-amber-500"
                      initial={false}
                      animate={{ width: active >= i ? "100%" : "0%" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                ) : null}
                <div className="min-w-0 shrink-0">
                  <span
                    className={cn(
                      "block h-[11px] w-[11px] rounded-full border-2 transition-colors duration-300",
                      reached
                        ? "border-amber-500 bg-amber-500"
                        : "border-neutral-300 bg-white",
                    )}
                  />
                  <p
                    className={cn(
                      "mt-2 text-xs font-semibold transition-colors duration-300",
                      reached ? "text-neutral-900" : "text-neutral-400",
                    )}
                  >
                    {step.label}
                  </p>
                  <p className={cn(caption, "mt-0.5 whitespace-nowrap")}>{step.value}</p>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. RoastCurve: a live temperature curve for one batch               */
/* ------------------------------------------------------------------ */

const CHART_W = 300;
const CHART_H = 80;
const FIRST_CRACK = 0.72;

/** A believable bean-temperature curve: starts hot, dips, then climbs. */
function roastTemp(x: number) {
  return 90 + 125 * (1 - Math.exp(-2.2 * x)) + 110 * Math.exp(-14 * x);
}
const chartX = (x: number) => x * CHART_W;
const chartY = (t: number) =>
  CHART_H - 8 - ((t - 120) / (210 - 120)) * (CHART_H - 18);

function curvePath(upTo: number) {
  const steps = Math.max(2, Math.round(upTo * 80));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * upTo;
    d += `${i === 0 ? "M" : "L"}${chartX(x).toFixed(1)} ${chartY(roastTemp(x)).toFixed(1)} `;
  }
  return d;
}

export function RoastCurve({ className }: SkeletonProps) {
  const animate = useAnimate();
  const p = useLoop(9000, animate);
  const temp = Math.round(roastTemp(p));
  const headX = chartX(p);
  const headY = chartY(roastTemp(p));

  return (
    <div className={cn("flex h-full w-full items-end", className)}>
      <div className={cn(panel, "w-full")}>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-semibold tabular-nums">{temp}°C</p>
          <span className={cn(caption, "flex items-center gap-1.5")}>
            <LiveDot animate={animate} />
            Batch 482
          </span>
        </div>

        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          className="mt-2 w-full"
          aria-hidden="true"
        >
          <line
            x1="0"
            x2={CHART_W}
            y1={CHART_H - 1}
            y2={CHART_H - 1}
            stroke="currentColor"
            strokeOpacity="0.1"
          />
          {p >= FIRST_CRACK ? (
            <line
              x1={chartX(FIRST_CRACK)}
              x2={chartX(FIRST_CRACK)}
              y1="2"
              y2={CHART_H - 1}
              stroke="#f59e0b"
              strokeOpacity="0.45"
              strokeDasharray="3 3"
            />
          ) : null}
          <path
            d={curvePath(p)}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={headX} cy={headY} r="6" fill="#f59e0b" fillOpacity="0.25" />
          <circle cx={headX} cy={headY} r="3" fill="#f59e0b" />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. TastingNotes: a cupping score that fills in                      */
/* ------------------------------------------------------------------ */

const ATTRIBUTES = [
  { label: "Aroma", value: 8.5 },
  { label: "Acidity", value: 8.8 },
  { label: "Body", value: 8.0 },
] as const;

export function TastingNotes({ className }: SkeletonProps) {
  const animate = useAnimate();
  const p = useLoop(7500, animate, 0.2);
  const score = 86.5 * easeOut(clamp01(p / 0.6));

  return (
    <div className={cn("flex h-full w-full items-end", className)}>
      <div className={cn(panel, "w-full")}>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-semibold tabular-nums">{score.toFixed(1)}</p>
          <span className={caption}>Cupping score</span>
        </div>

        <div className="mt-3 space-y-2">
          {ATTRIBUTES.map((attr, i) => {
            const f = easeOut(clamp01((p - i * 0.08) / 0.4));
            return (
              <div key={attr.label} className="flex items-center gap-3 text-[11px]">
                <span className="w-12 shrink-0 text-neutral-500">{attr.label}</span>
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{ width: `${attr.value * 10 * f}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. FreshnessTracker: from the roaster to your door                  */
/* ------------------------------------------------------------------ */

const JOURNEY = [
  { label: "Roasted", text: "Roasted this morning" },
  { label: "Packed", text: "Sealed in a one-way valve bag" },
  { label: "Shipped", text: "On its way to your door" },
  { label: "Delivered", text: "Delivered, best within two weeks" },
] as const;

export function FreshnessTracker({ className }: SkeletonProps) {
  const animate = useAnimate();
  const p = useLoop(10000, animate);
  const current = Math.min(JOURNEY.length - 1, Math.floor(p * JOURNEY.length));

  return (
    <div className={cn("flex h-full w-full items-end", className)}>
      <div className={cn(panel, "w-full")}>
        <div className="relative px-1.5">
          <div className="absolute left-1.5 right-1.5 top-[5px] h-px bg-neutral-200" />
          <div
            className="absolute left-1.5 top-[5px] h-px bg-amber-500"
            style={{ width: `calc((100% - 0.75rem) * ${p})` }}
          />
          <div className="relative flex justify-between">
            {JOURNEY.map((stop, i) => {
              const reached = p >= i / (JOURNEY.length - 1) - 0.001;
              return (
                <div key={stop.label} className="flex flex-col items-center">
                  <span
                    className={cn(
                      "block h-[11px] w-[11px] rounded-full border-2 transition-colors duration-300",
                      reached
                        ? "border-amber-500 bg-amber-500"
                        : "border-neutral-300 bg-white",
                    )}
                  />
                  <span
                    className={cn(
                      "mt-2 text-[11px] transition-colors duration-300",
                      i === current
                        ? "font-semibold text-neutral-900"
                        : "text-neutral-400",
                    )}
                  >
                    {stop.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <motion.p
          key={current}
          className="mt-3 border-t border-neutral-100 pt-3 text-xs text-neutral-600"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {JOURNEY[current].text}
        </motion.p>
      </div>
    </div>
  );
}