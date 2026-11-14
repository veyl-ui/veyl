"use client";

import { useId, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./isometric-cards.css";

export type IsometricFace = "left" | "top" | "right";

export type IsometricCard = {
  /** Which face of the block slides away when the card is hovered. */
  face: IsometricFace;
  title: string;
  description: ReactNode;
  /** Up to three short labels. They are drawn out from the block in this order: top, right, left. */
  callouts?: [string?, string?, string?];
};

export type IsometricCardsProps = {
  cards: IsometricCard[];
  heading?: ReactNode;
  subheading?: ReactNode;
  /** Follow the site's dark mode (the default), or force one look for this block. */
  theme?: "light" | "dark";
  className?: string;
};

/* ---- the block, drawn once in a 300 x 220 box ---- */
const W = 40; // half the width of a face
const H = 23.1; // how far a face's edge drops over that width
const B = 46; // height of the block

type Pt = [number, number];
const TOP: Pt[] = [[0, -B - H], [W, -B], [0, -B + H], [-W, -B]];
const LEFT: Pt[] = [[-W, -B], [0, -B + H], [0, H], [-W, 0]];
const RIGHT: Pt[] = [[0, -B + H], [W, -B], [W, 0], [0, H]];

/** A polygon path with softly rounded corners. */
function rounded(pts: Pt[], r: number) {
  const n = pts.length;
  const f = (v: number) => +v.toFixed(2);
  let d = "";
  for (let i = 0; i < n; i++) {
    const p = pts[(i + n - 1) % n];
    const c = pts[i];
    const q = pts[(i + 1) % n];
    const a = Math.hypot(p[0] - c[0], p[1] - c[1]);
    const b = Math.hypot(q[0] - c[0], q[1] - c[1]);
    const ka = Math.min(r, a / 2) / a;
    const kb = Math.min(r, b / 2) / b;
    d += `${i ? "L" : "M"}${f(c[0] + (p[0] - c[0]) * ka)} ${f(c[1] + (p[1] - c[1]) * ka)}Q${c[0]} ${c[1]} ${f(c[0] + (q[0] - c[0]) * kb)} ${f(c[1] + (q[1] - c[1]) * kb)}`;
  }
  return d + "Z";
}

/** The same polygon, scaled towards its middle. Used for the hole in the lid. */
function shrink(pts: Pt[], k: number): Pt[] {
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return pts.map(([x, y]) => [cx + (x - cx) * k, cy + (y - cy) * k]);
}

const LEFT_D = rounded(LEFT, 3.4);
const RIGHT_D = rounded(RIGHT, 3.4);
const TOP_D = rounded(TOP, 3.4);
const HOLE_D = rounded(shrink(TOP, 0.5), 5);

/** The dashed lines on the side faces. */
const T = [0.27, 0.51, 0.76];
const LEFT_LINES = T.map((t) => ({ x: -W + W * t, y1: -B + H * t + B * 0.1, y2: H * t - B * 0.07 }));
const RIGHT_LINES = T.map((t) => ({ x: W * t, y1: -B + H - H * t + B * 0.1, y2: H - H * t - B * 0.07 }));

/** Where each callout line starts, bends and ends. */
const CALLOUTS = [
  { face: "top", dot: [146, 78], d: "M146 78L112 44H100", tx: 96, ty: 47.5, a: "end" },
  { face: "right", dot: [170, 106], d: "M170 106L200 86H212", tx: 217, ty: 89.5, a: "start" },
  { face: "left", dot: [130, 112], d: "M130 112L94 150H80", tx: 76, ty: 153.5, a: "end" },
] as const;

function Block({ face, callouts }: { face: IsometricFace; callouts?: IsometricCard["callouts"] }) {
  return (
    <svg className="iso-svg" viewBox="0 0 300 220" aria-hidden="true">
      <g className="iso-scene">
        <g transform="translate(150 124)">
          <g className="iso-fl">
            <path className="iso-bx" d={LEFT_D} />
            {LEFT_LINES.map((l, i) => (
              <line key={i} className="iso-dl" x1={l.x} y1={l.y1} x2={l.x} y2={l.y2} />
            ))}
          </g>
          <g className="iso-fr">
            <path className="iso-bx" d={RIGHT_D} />
            {RIGHT_LINES.map((l, i) => (
              <line key={i} className="iso-dl" x1={l.x} y1={l.y1} x2={l.x} y2={l.y2} />
            ))}
          </g>
          <g className="iso-ft">
            <path className="iso-bx" d={TOP_D} />
            <path className="iso-bx iso-hole" d={HOLE_D} />
          </g>
        </g>
        {callouts &&
          CALLOUTS.map(
            (c, i) =>
              callouts[i] && (
                <g
                  key={i}
                  className={cn("iso-co", `iso-co-${c.face}`, c.face === face && "iso-hl")}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <path d={c.d} pathLength={1} />
                  <circle cx={c.dot[0]} cy={c.dot[1]} r="2.4" />
                  <text x={c.tx} y={c.ty} textAnchor={c.a}>
                    {callouts[i]}
                  </text>
                </g>
              ),
          )}
      </g>
    </svg>
  );
}

/**
 * Cards that each show a small isometric block. Hover a card (or tap it on a touch screen) and one face of the
 * block slides away while labelled lines draw out from it.
 */
export function IsometricCards({ cards, heading, subheading, theme, className }: IsometricCardsProps) {
  const [on, setOn] = useState(-1);
  const id = useId();

  function lean(e: PointerEvent<HTMLElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    e.currentTarget.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  }

  return (
    <section className={cn("iso-root", className)} data-theme={theme} aria-labelledby={heading ? `${id}-h` : undefined}>
      {(heading || subheading) && (
        <header className="iso-head">
          {heading && <h2 id={`${id}-h`}>{heading}</h2>}
          {subheading && <p>{subheading}</p>}
        </header>
      )}
      <div className="iso-grid">
        {cards.map((card, i) => (
          <article
            key={card.title}
            tabIndex={0}
            className={cn("iso-card", `iso-v-${card.face}`, on === i && "iso-on")}
            onPointerMove={lean}
            onPointerLeave={(e) => {
              e.currentTarget.style.setProperty("--px", "0");
              e.currentTarget.style.setProperty("--py", "0");
            }}
            onPointerUp={(e) => {
              if (e.pointerType === "touch") setOn(on === i ? -1 : i);
            }}
          >
            <div className="iso-ill">
              <Block face={card.face} callouts={card.callouts} />
            </div>
            <div className="iso-tx">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}