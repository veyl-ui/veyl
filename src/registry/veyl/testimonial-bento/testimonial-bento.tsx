"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./testimonial-bento.css";

export type BentoTestimonial = {
  quote: string;
  name: string;
  role?: string;
  /** A picture. Without one, or if it fails to load, the person's initial is shown. */
  avatar?: string;
  /** Shown as "4.9 ★ Rating". Defaults to 4.9. */
  rating?: number;
};

export type TestimonialBentoProps = {
  /** A heading above the boxes. Left out, no heading is shown. */
  title?: ReactNode;
  /** A line under the heading. */
  description?: ReactNode;
  /** Five or more. With more than five, the boxes swap them in and out. Around 12 to 15 works well. */
  testimonials: BentoTestimonial[];
  /** Average time in milliseconds between changes in one box. Default 9000. */
  interval?: number;
  /** Change the quotes by itself. Default true. */
  autoplay?: boolean;
  /** Show the "4.9 ★ Rating" line. Default true. */
  showRating?: boolean;
  /** Follow the site's dark mode (the default), or force one look for this block. */
  theme?: "light" | "dark";
  className?: string;
};

const BOXES = 5;
/** The first pass: the black box, then the last, then one from the middle, then the rest. */
const FIRST_PASS = [0, 4, 2, 1, 3];
/** Each box runs at its own speed, so they never fall into step. */
const SPEED = [1.02, 0.92, 1.1, 0.96, 1.04];
const MIN_GAP = 2200;
const FIRST_AT = 1600;
const FIRST_STEP = 2300;

const hue = (s: string) => [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 360, 11);

function Star() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.5 6 20.9l1.3-6.7-5-4.7 6.8-.8L12 2.5z" />
    </svg>
  );
}

function Face({ t }: { t: BentoTestimonial }) {
  const [bad, setBad] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  /* A picture can fail before React has attached its error handler, so check once it is mounted */
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setBad(true);
  }, []);
  const h = hue(t.name);
  return (
    <span
      className="tbn-av"
      aria-hidden="true"
      style={{ background: `linear-gradient(135deg, hsl(${h} 50% 58%), hsl(${(h + 40) % 360} 46% 40%))` }}
    >
      {t.name.trim()[0]?.toUpperCase()}
      {t.avatar && !bad && (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={img} src={t.avatar} alt="" loading="lazy" onError={() => setBad(true)} />
      )}
    </span>
  );
}

function Layer({ t, out, showRating }: { t: BentoTestimonial; out: boolean; showRating: boolean }) {
  return (
    <figure className={cn("tbn-layer", out ? "is-out" : "is-in")} aria-hidden={out || undefined}>
      <div className="tbn-top">
        <Face t={t} />
        {showRating && (
          <span className="tbn-rate">
            <b>{(t.rating ?? 4.9).toFixed(1)}</b>
            <Star />
            <span>Rating</span>
          </span>
        )}
      </div>
      <blockquote className="tbn-quote">
        {`"${t.quote}"`.split(" ").map((w, i) => (
          <span key={i}>
            <span className="tbn-w" style={{ "--i": i } as React.CSSProperties}>
              {w}
            </span>{" "}
          </span>
        ))}
      </blockquote>
      <figcaption className="tbn-foot">
        <span className="tbn-name">{t.name}</span>
        {t.role && <span className="tbn-role">{t.role}</span>}
      </figcaption>
    </figure>
  );
}

/** One box. When its testimonial changes, the old one lifts away and the new one flows in. */
function Cell({ t, showRating, onHover }: { t: BentoTestimonial; showRating: boolean; onHover: (on: boolean) => void }) {
  const [layers, setLayers] = useState([{ k: 0, t, out: false }]);
  const last = useRef(t);
  const count = useRef(0);

  useEffect(() => {
    if (last.current === t) return;
    last.current = t;
    count.current += 1;
    const k = count.current;
    setLayers((l) => [...l.map((x) => ({ ...x, out: true })), { k, t, out: false }]);
    const id = window.setTimeout(() => setLayers((l) => l.filter((x) => !x.out)), 800);
    return () => window.clearTimeout(id);
  }, [t]);

  return (
    <div className="tbn-card" onPointerEnter={() => onHover(true)} onPointerLeave={() => onHover(false)}>
      {layers.map((l) => (
        <Layer key={l.k} t={l.t} out={l.out} showRating={showRating} />
      ))}
    </div>
  );
}

export function TestimonialBento({
  title, 
  description,
  testimonials,
  interval = 9000,
  autoplay = true,
  showRating = true,
  theme,
  className,
}: TestimonialBentoProps) {
  const n = testimonials.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(() => Array.from({ length: Math.min(BOXES, n) }, (_, i) => i));
  const shownRef = useRef(shown);
  const cursor = useRef(BOXES);
  const hover = useRef<boolean[]>([]);
  const lastSwap = useRef(0);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(root);
    const vis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", vis);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mo = () => setReduced(mq.matches);
    mo();
    mq.addEventListener("change", mo);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
      mq.removeEventListener("change", mo);
    };
  }, []);

  const playing = autoplay && !reduced && inView && visible && n > BOXES;

  useEffect(() => {
    if (!playing) return;
    const timers = new Set<number>();
    let dead = false;
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (!dead) fn();
      }, ms);
      timers.add(id);
    };

    /* The next testimonial nobody is showing right now */
    const pick = () => {
      let i: number;
      do {
        i = cursor.current++ % n;
      } while (shownRef.current.includes(i));
      return i;
    };
    const swap = (box: number) => {
      const next = [...shownRef.current];
      next[box] = pick();
      shownRef.current = next;
      lastSwap.current = performance.now();
      setShown(next);
    };
    /* Change one box, unless it is being hovered or another box changed a moment ago */
    const change = (box: number, then: () => void) => {
      if (hover.current[box]) return later(() => change(box, then), 700);
      if (performance.now() - lastSwap.current < MIN_GAP) return later(() => change(box, then), 500 + Math.random() * 500);
      swap(box);
      then();
    };
    const loop = (box: number) => {
      const wait = interval * SPEED[box];
      later(() => change(box, () => loop(box)), wait + Math.random() * interval * 0.3);
    };

    FIRST_PASS.forEach((box, k) => {
      later(() => change(box, () => loop(box)), FIRST_AT + k * FIRST_STEP);
    });

    return () => {
      dead = true;
      timers.forEach(clearTimeout);
    };
  }, [playing, n, interval]);

  return (
    <div ref={rootRef} className={cn("tbn", className)} data-theme={theme}>
      {(title || description) && (
        <header className="tbn-head">
          {title && <h2 className="tbn-title">{title}</h2>}
          {description && <p className="tbn-desc">{description}</p>}
        </header>
      )}
      <div className="tbn-grid">
        {shown.map((idx, box) => (
          <Cell
            key={box}
            t={testimonials[idx]}
            showRating={showRating}
            onHover={(on) => {
              hover.current[box] = on;
            }}
          />
        ))}
      </div>
      {/* Screen readers get every testimonial at once, not whichever is on screen */}
      <ul className="tbn-sr">
        {testimonials.map((t, i) => (
          <li key={i}>
            {t.quote} {t.name}
            {t.role ? `, ${t.role}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}