import type { CSSProperties } from "react";
import { Glyph, type GlyphName, glyphColor } from "./orbit-glyphs";

/**
 * Thin rings around the headline, with small bubbles riding on them. Every ring turns very
 * slowly, and each bubble turns the other way so it always stays upright. Behind each bubble
 * trails a short glowing line in the same colour as its icon. It is decoration only, so it is
 * hidden from screen readers and ignores the pointer.
 */
type Bubble = { angle: number; glyph: GlyphName; size?: number };
type Ring = { radius: number; seconds: number; reverse?: boolean; bubbles?: Bubble[] };

const rings: Ring[] = [
  { radius: 380, seconds: 190, bubbles: [{ angle: -115, glyph: "toggle", size: 60 }, { angle: 112, glyph: "code", size: 58 }] },
  { radius: 480, seconds: 240, reverse: true, bubbles: [{ angle: -62, glyph: "navbar", size: 68 }, { angle: 62, glyph: "sparkles", size: 68 }] },
  { radius: 580, seconds: 300, bubbles: [{ angle: -84, glyph: "cursor", size: 62 }, { angle: 88, glyph: "bento", size: 62 }] },
  { radius: 690, seconds: 360, reverse: true, bubbles: [{ angle: -100, glyph: "layers", size: 64 }, { angle: 105, glyph: "play", size: 64 }] },
  { radius: 810, seconds: 420 },
];

const TRAIL_DEGREES = 38; // how long each glowing trail is
const TRAIL_STEPS = 10; // it is drawn in steps that fade out, which gives the tail

/** The faded trail behind one bubble, as a stack of short arcs. */
function Trail({ ring, bubble }: { ring: Ring; bubble: Bubble }) {
  const r = ring.radius - 1;
  const circumference = 2 * Math.PI * r;
  const size = bubble.size ?? 60;
  const start = ((size / 2 + 5) / r) * (180 / Math.PI); // begin just outside the bubble
  const behind = ring.reverse ? 1 : -1; // the ring turns one way, so "behind" is the other
  const color = glyphColor[bubble.glyph];

  return (
    <>
      {Array.from({ length: TRAIL_STEPS }, (_, k) => {
        const from = start + (k / TRAIL_STEPS) * TRAIL_DEGREES;
        const to = start + ((k + 1) / TRAIL_STEPS) * TRAIL_DEGREES;
        const a0 = behind === 1 ? bubble.angle + from : bubble.angle - to;
        const length = ((to - from) * Math.PI * r) / 180;
        const fade = Math.pow(1 - k / TRAIL_STEPS, 1.5);
        return (
          <circle
            key={k}
            cx={ring.radius}
            cy={ring.radius}
            r={r}
            stroke={color}
            strokeOpacity={0.85 * fade}
            strokeWidth="2"
            strokeDasharray={`${length} ${circumference}`}
            transform={`rotate(${a0 - 90} ${ring.radius} ${ring.radius})`}
          />
        );
      })}
    </>
  );
}

export function HeroOrbits() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-0">
      {rings.map((ring) => {
        const d = ring.radius * 2;
        const style = {
          left: -ring.radius,
          top: -ring.radius,
          width: d,
          height: d,
          "--dur": `${ring.seconds}s`,
          "--dir": ring.reverse ? "reverse" : "normal",
        } as CSSProperties;

        return (
          <div key={ring.radius} className="orbit-spin absolute" style={style}>
            <svg viewBox={`0 0 ${d} ${d}`} className="absolute inset-0 size-full" fill="none">
              <circle cx={ring.radius} cy={ring.radius} r={ring.radius - 1} className="stroke-foreground/[0.08]" strokeWidth="1" />
              {ring.bubbles?.map((b) => <Trail key={b.glyph} ring={ring} bubble={b} />)}
            </svg>

            {ring.bubbles?.map((b) => {
              const size = b.size ?? 60;
              return (
                <div
                  key={b.glyph}
                  className="absolute left-1/2 top-1/2 max-lg:hidden"
                  style={{ transform: `rotate(${b.angle}deg)` }}
                >
                  <div className="absolute" style={{ top: -ring.radius - size / 2, left: -size / 2, width: size, height: size }}>
                    <div
                      className="orbit-upright grid size-full place-items-center rounded-full border border-border bg-card shadow-card"
                      style={{ "--a": `${-b.angle}deg` } as CSSProperties}
                    >
                      <Glyph name={b.glyph} size={Math.round(size * 0.44)} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}