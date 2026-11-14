"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { COPYRIGHT, GRANT, NOTICE, WARRANTY, type Seg } from "@/lib/docs/license";
import { CopyLicenseButton } from "./copy-license";
import "./license.css";

const TILT = "perspective(900px) rotateY(-9deg) rotateX(5deg) rotate(1.5deg)";
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Where the small paper sits compared with the big one: how far to move and how much to shrink. */
function pose(from: DOMRect, to: DOMRect) {
  return {
    x: from.left + from.width / 2 - (to.left + to.width / 2),
    y: from.top + from.height / 2 - (to.top + to.height / 2),
    s: from.width / to.width,
  };
}

/** Paragraph text with the highlighted phrases. `start` is how many phrases came before, so each gets its own turn. */
function Words({ segs, start = 0 }: { segs: Seg[]; start?: number }) {
  let n = start;
  return (
    <>
      {segs.map((seg, i) => {
        if (typeof seg === "string") return seg;
        const k = n++;
        return (
          <span key={i} className="lc-mk" style={{ "--d": `${k * 1.7}s`, "--d2": `${0.5 + k * 0.6}s` } as CSSProperties}>
            {seg.mark}
          </span>
        );
      })}
    </>
  );
}

const SealRing = ({ id }: { id: string }) => (
  <svg viewBox="0 0 100 100" aria-hidden="true">
    <defs>
      <path id={id} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
    </defs>
    <circle cx="50" cy="50" r="47" fill="var(--lc-paper)" stroke="var(--brand)" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="30" fill="none" stroke="var(--brand)" strokeWidth="1" strokeDasharray="2 3" />
    <text fontSize="8.6" fontWeight="600" fill="var(--brand-ink)">
      <textPath href={`#${id}`} textLength="236" lengthAdjust="spacing">
        OPEN SOURCE · MIT LICENSE ·{" "}
      </textPath>
    </text>
  </svg>
);

/**
 * The tilted paper in the page header. Click it and it lifts, flattens and opens to full size in the middle of the screen,
 * with the whole licence ready to read. Esc, the close button or a click outside puts it back.
 */
export function LicensePaper() {
  const stage = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const big = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const [open, setOpen] = useState(false); // the box is on screen
  const [shown, setShown] = useState(false); // the backdrop is in
  const [read, setRead] = useState(false); // the highlighter and the seal play

  useLayoutEffect(() => {
    if (!open) return;
    const el = big.current;
    const src = paper.current;
    if (!el || !src) return;

    document.body.style.overflow = "hidden";
    const f = pose(src.getBoundingClientRect(), el.getBoundingClientRect());
    src.style.visibility = "hidden";

    if (!reduced()) {
      el.animate(
        [
          { transform: `translate(${f.x}px, ${f.y}px) scale(${f.s}) ${TILT}`, opacity: 0.9, offset: 0 },
          { transform: `translate(${f.x * 0.55}px, ${f.y * 0.55 - 34}px) scale(${f.s + (1 - f.s) * 0.4}) perspective(900px) rotateY(-5deg) rotateX(2deg) rotate(0.8deg)`, offset: 0.35 },
          { transform: "translate(0, 0) scale(1.015)", offset: 0.8 },
          { transform: "translate(0, 0) scale(1)", opacity: 1, offset: 1 },
        ],
        { duration: 900, easing: EASE, fill: "both" },
      );
    }
    const frame = requestAnimationFrame(() => setShown(true));
    const timer = window.setTimeout(() => setRead(true), reduced() ? 0 : 520);
    el.querySelector<HTMLElement>("[data-close]")?.focus({ preventScroll: true });

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      src.style.visibility = "";
    };
  }, [open]);

  const close = useCallback(() => {
    const el = big.current;
    const src = paper.current;
    if (!el || !src || closing.current) return;
    closing.current = true;
    setRead(false);
    setShown(false);
    const done = () => {
      setOpen(false);
      closing.current = false;
      stage.current?.focus({ preventScroll: true });
    };
    if (reduced()) return done();
    const f = pose(src.getBoundingClientRect(), el.getBoundingClientRect());
    const a = el.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${f.x}px, ${f.y}px) scale(${f.s}) ${TILT}`, opacity: 0.9 },
      ],
      { duration: 520, easing: "cubic-bezier(0.5, 0, 0.2, 1)", fill: "forwards" },
    );
    a.onfinish = done;
  }, []);

  // Esc closes, and Tab stays inside the box.
  useEffect(() => {
    if (!open) return;
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !big.current) return;
      const items = [...big.current.querySelectorAll<HTMLElement>("button")];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  return (
    <>
      <div
        ref={stage}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label="Open the full MIT license"
        onClick={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="lc-stage mx-auto w-full max-w-md xl:max-w-none"
      >
        <div ref={paper} className="lc-paper">
          <h4 className="font-mono text-[13px] font-semibold uppercase leading-none tracking-wider text-foreground">MIT License</h4>
          <p className="mb-4 mt-2 font-mono text-xs text-muted-foreground">{COPYRIGHT}</p>
          <p className="font-mono text-[11.5px] leading-[1.95] text-muted-foreground">
            <Words segs={GRANT} />
          </p>
          <p className="mt-2.5 font-mono text-[11.5px] leading-[1.95] text-muted-foreground">
            <Words segs={NOTICE} start={2} />
          </p>
          <div className="lc-seal" aria-hidden="true">
            <SealRing id="lc-ring" />
            <b className="absolute inset-0 grid place-items-center text-[22px] font-bold tracking-tight text-brand-ink">MIT</b>
          </div>
        </div>
        <span className="lc-hint" aria-hidden="true">
          <i />
          Click to open
        </span>
      </div>

      {open
        ? createPortal(
            <div className="lc-ov" data-show={shown} data-read={read} role="dialog" aria-modal="true" aria-label="MIT license">
              <div className="lc-bk" onClick={close} />
              <div ref={big} className="lc-big">
                <button
                  type="button"
                  data-close
                  onClick={close}
                  aria-label="Close"
                  className="sticky top-0 float-right -mr-5 -mt-4 grid size-8 place-items-center rounded-full border border-border bg-background text-sm text-foreground transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  ✕
                </button>
                <h4 className="font-mono text-[15px] font-semibold uppercase leading-none tracking-wider text-foreground">MIT License</h4>
                <p className="mb-5 mt-2.5 font-mono text-[13px] text-muted-foreground">{COPYRIGHT}</p>
                <p className="mb-4 font-mono text-[13.5px] leading-[1.95] text-muted-foreground">
                  <Words segs={GRANT} />
                </p>
                <p className="mb-4 font-mono text-[13.5px] leading-[1.95] text-muted-foreground">
                  <Words segs={NOTICE} start={2} />
                </p>
                <p className="mb-4 font-mono text-[13.5px] leading-[1.95] text-muted-foreground">{WARRANTY}</p>
                <div className="mt-2 flex items-center gap-3 border-t border-dashed border-[var(--lc-edge)] pt-4">
                  <CopyLicenseButton className="rounded-lg border border-foreground bg-foreground px-4 py-2 text-sm font-medium text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" />
                  <span className="text-[12.5px] text-muted-foreground">Esc to close</span>
                </div>
                <div className="lc-bigseal" aria-hidden="true">
                  <SealRing id="lc-ring-big" />
                  <b className="absolute inset-0 grid place-items-center text-[19px] font-bold text-brand-ink">MIT</b>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}