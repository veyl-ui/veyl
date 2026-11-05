"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { BeamStepContext } from "./beam-step";
import "./beam-about.css";

export type BeamAboutStep = {
  title: string;
  description: string;
  /** The small scene inside the tile. Use BeamOrbit, BeamTyping, BeamChecklist, or your own. */
  visual?: ReactNode;
};

export type BeamAboutProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  /** Two to four steps work best. */
  steps: BeamAboutStep[];
  /** Buttons or links shown under the cards. */
  actions?: ReactNode;
  /** A small line under the tiles that explains hover and click. Pass false to hide it. */
  hint?: ReactNode | false;
  className?: string;
};

/* How long each moment lasts, in milliseconds. */
const CARD_MS = 2800; // a tile plays its scene
const BEAM_MS = 1100; // the beam crosses a gap
const FADE_MS = 800; // everything fades out
const REST_MS = 1000; // a pause before it starts again (the banner light flows here)

export function BeamAbout({
  eyebrow,
  title,
  description,
  steps,
  actions,
  hint = "Hover to pause. Click a tile to replay it.",
  className,
}: BeamAboutProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);
  /** Where we are in the story. -1 means nothing is playing. */
  const [pos, setPos] = useState(-1);
  /** True while the visitor hovers or focuses the tiles. The story waits. */
  const [paused, setPaused] = useState(false);
  /** The tile being replayed after a click. -1 is the one-beat reset between replays. */
  const [solo, setSolo] = useState<number | null>(null);

  const posRef = useRef(-1);
  const soloRef = useRef<number | null>(null);
  const hoverRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  soloRef.current = solo;

  const n = steps.length;
  const interactive = !reduced && n >= 2;

  // Only play while the section is on screen, and never for reduced motion.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);

    const el = rootRef.current;
    if (!el) return () => media.removeEventListener("change", onChange);
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => {
      media.removeEventListener("change", onChange);
      io.disconnect();
    };
  }, []);

  // The timeline. Positions go: card 0, gap 0, card 1, gap 1, ... last card, fade, rest.
  useEffect(() => {
    if (!inView || reduced || n < 2) {
      posRef.current = -1;
      setPos(-1);
      return;
    }
    if (paused) return; // waits here, and carries on from the same spot afterwards
    const fadeAt = 2 * n - 1;
    const restAt = 2 * n;
    let p = Math.max(posRef.current, 0);
    let timer: ReturnType<typeof setTimeout>;
    const duration = (i: number) => (i < fadeAt ? (i % 2 === 0 ? CARD_MS : BEAM_MS) : i === fadeAt ? FADE_MS : REST_MS);
    const step = () => {
      posRef.current = p;
      setPos(p);
      timer = setTimeout(() => {
        p = (p + 1) % (restAt + 1);
        step();
      }, duration(p));
    };
    step();
    return () => clearTimeout(timer);
  }, [inView, reduced, n, paused]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /** Stop any replay and let the story start again from the first tile. */
  const release = () => {
    clearTimers();
    if (soloRef.current !== null) posRef.current = -1;
    setSolo(null);
    setPaused(false);
  };

  /** Clicking a tile plays just that scene again. */
  const replay = (k: number) => {
    if (!interactive) return;
    clearTimers();
    setPaused(true);
    setSolo(-1); // one beat with nothing lit, so the scene starts from its idle state
    timers.current.push(setTimeout(() => setSolo(k), 90));
    // With a mouse, the replay holds until the pointer leaves. Otherwise it lets go by itself.
    timers.current.push(
      setTimeout(() => {
        if (!hoverRef.current) release();
      }, 90 + CARD_MS + 900),
    );
  };

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hoverRef.current = true;
    setPaused(true);
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hoverRef.current = false;
    release();
  };
  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) release();
  };
  const onKey = (e: KeyboardEvent, k: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      replay(k);
    }
  };
  /** The soft spotlight follows the cursor. Written straight to the element, so nothing re-renders. */
  const spot = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const fadeAt = 2 * n - 1;
  const soloing = solo !== null;
  // The banner light flows twice in a row: once at the end of the rest, once as the story begins.
  const flowing = !soloing && (pos === 0 || pos === 2 * n);

  return (
    <section ref={rootRef} className={cn("ba-root w-full", className)}>
      <div className="mx-auto mb-12 max-w-xl text-center">
        {eyebrow && (
          <p className="mb-3 text-sm font-medium">
            <span key={flowing ? pos : "idle"} className="ba-eyebrow" data-play={flowing}>
              {eyebrow}
            </span>
          </p>
        )}
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-50">{title}</h2>
        {description && (
          <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">{description}</p>
        )}
      </div>

      <div
        className="flex flex-col items-stretch lg:flex-row"
        onPointerEnter={interactive ? onEnter : undefined}
        onPointerLeave={interactive ? onLeave : undefined}
        onFocus={interactive ? () => setPaused(true) : undefined}
        onBlur={interactive ? onBlur : undefined}
      >
        {steps.map((step, k) => {
          const lit = soloing ? solo === k : pos === 2 * k || pos === 2 * k + 1;
          const shimmer = soloing ? solo === k : pos === 2 * k;
          const reached = reduced || (soloing ? solo === k : pos >= 2 * k && pos < fadeAt);
          const lineFull = reduced || (soloing ? solo === k : pos >= 2 * k); // the progress line has started filling
          const lineLive = !reduced && reached;
          const trailFull = !soloing && pos >= 2 * k + 1; // the beam has reached the next card
          const trailLive = trailFull && pos < fadeAt;
          const beamHere = !soloing && pos === 2 * k + 1;
          const fillMs = k < n - 1 ? CARD_MS + BEAM_MS : CARD_MS;
          return (
            <Fragment key={step.title}>
              <article className="min-w-0 flex-1">
                <div
                  className="ba-stage"
                  data-lit={lit}
                  data-interactive={interactive}
                  role={interactive ? "button" : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  aria-label={interactive ? `Replay: ${step.title}` : undefined}
                  onClick={interactive ? () => replay(k) : undefined}
                  onKeyDown={interactive ? (e) => onKey(e, k) : undefined}
                  onPointerMove={spot}
                >
                  {shimmer && <span className="ba-shimmer" aria-hidden />}
                  <BeamStepContext.Provider value={{ reached, reduced }}>{step.visual}</BeamStepContext.Provider>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="ba-num text-xs font-medium tabular-nums" data-on={reached}>
                    {String(k + 1).padStart(2, "0")}
                  </span>
                  <span className="ba-prog" aria-hidden>
                    <i data-full={lineFull} data-live={lineLive} style={{ ["--ba-prog-ms" as string]: `${fillMs}ms` }} />
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-neutral-900 dark:text-neutral-50">{step.title}</h3>
                <p className="mt-1 max-w-sm text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {step.description}
                </p>
              </article>
              {k < n - 1 && (
                <div className="ba-gap" aria-hidden>
                  <span className="ba-trail" data-full={trailFull} data-live={trailLive} />
                  {beamHere && <span className="ba-bead" />}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      {hint !== false && interactive && (
        <p className="mt-8 hidden text-center text-xs text-neutral-500 lg:block dark:text-neutral-500">{hint}</p>
      )}
      {actions && <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>}
    </section>
  );
}