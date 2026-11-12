"use client";

import { type CSSProperties, type ElementType, type ReactNode, type PointerEvent, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "./motion.css";

/** Fades a block up the first time it scrolls into view. Give each sibling a bigger `i` to make them arrive one after another. */
export function Rise({
  children,
  i = 0,
  soft = false,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  i?: number;
  /** No blur. Use it on big blocks. */
  soft?: boolean;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-in={shown} style={{ "--i": i } as CSSProperties} className={cn("tm-rise", soft && "tm-rise-soft", className)}>
      {children}
    </Tag>
  );
}

/** A card with a soft light that follows the pointer. Add `tilt` for a small lean toward the pointer. */
export function Glow({ children, className, tilt = false, style }: { children: ReactNode; className?: string; tilt?: boolean; style?: CSSProperties }) {
  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
    if (tilt) {
      el.style.setProperty("--rx", `${(x - 0.5) * 6}deg`);
      el.style.setProperty("--ry", `${(0.5 - y) * 5}deg`);
    }
  }
  return (
    <div onPointerMove={onMove} style={style} className={cn("tm-glow", tilt && "tm-tilt", className)}>
      {children}
    </div>
  );
}

/** A colour square and its value. Click to copy the value. */
export function SwatchCopy({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const isColour = /^(#|rgb)/.test(value);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setDone(false), 1200);
    } catch {
      /* clipboard blocked: the value is still on screen */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      title="Click to copy"
      aria-label={`Copy ${value}`}
      className="tm-swatch inline-flex items-center gap-2 whitespace-nowrap font-mono text-xs text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {isColour ? (
        <span aria-hidden="true" className="tm-sq size-4 shrink-0 rounded border border-black/15 dark:border-white/20" style={{ background: value }} />
      ) : null}
      {done ? (
        <span key="d" className="tm-pop text-emerald-600 dark:text-emerald-400">
          Copied
        </span>
      ) : (
        value
      )}
    </button>
  );
}

/** Troubleshooting items that open and close smoothly. */
export function FixList({ items }: { items: { q: string; a: ReactNode }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((f, n) => {
        const on = open === n;
        return (
          <Rise key={f.q} i={n}>
            <Glow className="rounded-xl border border-border bg-background">
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`fix-${n}`}
                onClick={() => setOpen(on ? null : n)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left font-medium text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-ink">{n + 1}</span>
                <span className="flex-1">{f.q}</span>
                <svg className="tm-plus shrink-0 text-muted-foreground" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
              <div id={`fix-${n}`} role="region" className="tm-acc" data-open={on}>
                <div>
                  <p className="px-4 pb-4 pl-[3.25rem] leading-7 text-muted-foreground">{f.a}</p>
                </div>
              </div>
            </Glow>
          </Rise>
        );
      })}
    </div>
  );
}

/** The header stage. The 3D grid leans a little toward your pointer, the words shift a few pixels the other way, and a soft light follows the pointer. */
export function HeroStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--px", `${x * 100}%`);
    el.style.setProperty("--py", `${y * 100}%`);
    el.style.setProperty("--tx", `${(x - 0.5) * 2}`);
    el.style.setProperty("--ty", `${(y - 0.5) * 2}`);
    el.dataset.on = "true";
  }
  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tx", "0");
    el.style.setProperty("--ty", "0");
    el.dataset.on = "false";
  }

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={className}>
      {children}
    </div>
  );
}