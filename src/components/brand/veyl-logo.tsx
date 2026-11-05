"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion, type Transition, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import "./veyl-logo.css";

/**
 * The Veyl logo: a V built from two soft bars of warm light. Where they meet they melt into
 * each other like drops of liquid.
 *
 *   rest      the two bars lean into a V and breathe slowly
 *   hover     they slide together and melt into one soft square
 *   leave     they spring apart, the bridge stretches and snaps, then they join back into the V
 *
 * Use this for the website and docs. The browser-tab icon keeps its own file (see icon.svg).
 * Hover is read from the whole logo (mark and name), so put it inside the link you want to react.
 */
type Phase = "rest" | "merged" | "release";

const spring: Transition = { type: "spring", stiffness: 240, damping: 20, mass: 0.8 };
const pop: Transition = { duration: 0.8, times: [0, 0.38, 1], ease: ["easeOut", "easeInOut"] };

/** Each bar is 15 x 34, drawn around its own centre. Left and right are mirror images. */
const bar = (side: -1 | 1): Variants => ({
  rest: { x: side * 8, rotate: side * 28, scaleX: 1, scaleY: 1, transition: spring },
  merged: { x: side * 3.5, rotate: 0, scaleX: 1.15, scaleY: 0.8, transition: spring },
  release: {
    x: [side * 3.5, side * 18, side * 8],
    rotate: [0, side * 40, side * 28],
    scaleX: [1.15, 1, 1],
    scaleY: [0.8, 1, 1],
    transition: pop,
  },
});

const leftBar = bar(-1);
const rightBar = bar(1);

export function VeylLogo({
  className,
  markClassName,
  wordmarkClassName,
  wordmark = true,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  /** Show the name "Veyl" beside the mark. */
  wordmark?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("rest");

  const enter = () => !reduce && setPhase("merged");
  const leave = () => !reduce && setPhase((p) => (p === "merged" ? "release" : p));

  return (
    <span
      onPointerEnter={enter}
      onPointerLeave={leave}
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <svg
        viewBox="0 0 64 64"
        role="img"
        aria-label="Veyl"
        className={cn(
          "size-9 shrink-0 overflow-visible [filter:drop-shadow(0_2px_4px_rgb(255_120_30/0.28))] dark:[filter:drop-shadow(0_0_6px_rgb(255_140_50/0.5))]",
          markClassName,
        )}
      >
        <defs>
          {/* the "melting" effect: blur the bars together, then sharpen the edge again */}
          <filter id={`${uid}goo`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" />
          </filter>
          <linearGradient id={`${uid}fill`} x1="14" y1="10" x2="50" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffd0a0" />
            <stop offset="0.5" stopColor="#ffa458" />
            <stop offset="1" stopColor="#ff7a2f" />
          </linearGradient>
          <mask id={`${uid}mask`} maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">
            <g filter={`url(#${uid}goo)`} transform="translate(32 31)" fill="#fff">
              <motion.g
                variants={leftBar}
                initial={false}
                animate={phase}
                onAnimationComplete={(def) => def === "release" && setPhase("rest")}
              >
                <g className="vl-breathe-a">
                  <rect x="-7.5" y="-17" width="15" height="34" rx="7.5" />
                </g>
              </motion.g>
              <motion.g variants={rightBar} initial={false} animate={phase}>
                <g className="vl-breathe-b">
                  <rect x="-7.5" y="-17" width="15" height="34" rx="7.5" />
                </g>
              </motion.g>
            </g>
          </mask>
        </defs>
        <rect width="64" height="64" fill={`url(#${uid}fill)`} mask={`url(#${uid}mask)`} />
      </svg>

      {wordmark ? (
        <span className={cn("text-xl font-bold tracking-tight", wordmarkClassName)}>Veyl</span>
      ) : null}
    </span>
  );
}