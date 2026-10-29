"use client";

import { type RefObject, useEffect, useState } from "react";

/**
 * The scene is designed on a 1732px-wide canvas. This hook:
 *  1. picks one font size per group (headline, paragraph) from a reference line,
 *  2. optionally stretches each line to its designed width (lines with data-w),
 *  3. places every line on its exact baseline,
 *  4. reports `true` once fonts are loaded and the layout is final.
 *
 * Lines marked with `data-w` are "tuned": they come from the original design and
 * are stretched to match it. Lines without it (your own text) keep their natural
 * width, and the widest line sets the font size.
 */
const DESIGN_WIDTH = 1732;
const SIDE_BEARING = 0.06; // em, ink vs. box width

type Group = {
  /** Font size on the design canvas, in design pixels. */
  size: number;
  /** Width the reference line should reach when the text is custom. */
  fallbackTarget: number;
  /** Letter spacing applied before measuring. */
  tracking: string;
  /** Baseline of the first line, and the distance between lines, in design pixels. */
  firstBaseline: number;
  step: number;
  /** Custom text may grow the font by at most this factor (keeps short text sane). */
  maxGrow: number;
};

const HEAD: Group = {
  size: 86,
  fallbackTarget: 1205,
  tracking: "-0.02em",
  firstBaseline: 596,
  step: 86,
  maxGrow: 1.2,
};
const SUB: Group = {
  size: 28,
  fallbackTarget: 780,
  tracking: "0px",
  firstBaseline: 940,
  step: 42.3,
  maxGrow: 1.2,
};

const widthOf = (el: Element) => el.getBoundingClientRect().width;
const textOf = (line: HTMLElement) => line.querySelector<HTMLElement>(".vh-tx");

function fitLine(line: HTMLElement, unit: number, fontSize: number) {
  const text = textOf(line);
  if (!text || !line.dataset.w) return;
  text.style.letterSpacing = "0px";
  const target = parseFloat(line.dataset.w) * unit + fontSize * SIDE_BEARING;
  const perChar = (target - widthOf(text)) / (text.textContent?.length || 1);
  text.style.letterSpacing = `${perChar.toFixed(3)}px`;
}

function placeLine(
  frame: HTMLElement,
  line: HTMLElement,
  baseline: number,
  unit: number,
) {
  const probe = line.querySelector<HTMLElement>(".vh-pb");
  if (!probe) return;
  line.style.top = "0px";
  const current = probe.getBoundingClientRect().bottom - frame.getBoundingClientRect().top;
  line.style.top = `${(baseline * unit - current).toFixed(2)}px`;
}

/** Sets the font size of one group and fits its lines. Returns nothing; works on the DOM. */
function layoutGroup(
  frame: HTMLElement,
  group: HTMLElement,
  lines: HTMLElement[],
  cfg: Group,
  unit: number,
) {
  const base = cfg.size * unit;
  group.style.fontSize = `${base}px`;
  lines.forEach((l) => {
    const t = textOf(l);
    if (t) t.style.letterSpacing = cfg.tracking;
  });

  // Reference line: the one marked data-ref (tuned text), else the widest line.
  const marked = lines.findIndex((l) => l.dataset.ref !== undefined);
  let refIndex = marked;
  let target = cfg.fallbackTarget;
  if (marked >= 0) {
    target = parseFloat(lines[marked].dataset.w ?? String(cfg.fallbackTarget));
  } else {
    let widest = 0;
    lines.forEach((l, i) => {
      const t = textOf(l);
      const w = t ? widthOf(t) : 0;
      if (w > widest) {
        widest = w;
        refIndex = i;
      }
    });
  }

  const refText = textOf(lines[Math.max(0, refIndex)]);
  if (!refText) return;
  const measured = widthOf(refText) || 1;
  let fs = base * ((target * unit + base * SIDE_BEARING) / measured);
  if (marked < 0) fs = Math.min(fs, base * cfg.maxGrow);
  group.style.fontSize = `${fs}px`;

  lines.forEach((l) => fitLine(l, unit, fs));
  lines.forEach((l, i) => placeLine(frame, l, cfg.firstBaseline + i * cfg.step, unit));
}

/**
 * @param frameRef  the scene element (the 1732 x 1304 frame)
 * @param contentKey change this whenever the text changes so the layout is redone
 */
export function useFitLayout(
  frameRef: RefObject<HTMLDivElement | null>,
  contentKey: string,
): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const head = frame.querySelector<HTMLElement>(".vh-head");
    const sub = frame.querySelector<HTMLElement>(".vh-sub");
    if (!head || !sub) return;
    const headLines = Array.from(head.querySelectorAll<HTMLElement>(".vh-ln"));
    const subLines = Array.from(sub.querySelectorAll<HTMLElement>(".vh-ln"));
    if (headLines.length === 0 || subLines.length === 0) return;

    const layout = () => {
      const unit = frame.clientWidth / DESIGN_WIDTH;
      layoutGroup(frame, head, headLines, HEAD, unit);
      layoutGroup(frame, sub, subLines, SUB, unit);
    };

    let alive = true;
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(layout);
    };
    const reveal = () => {
      if (!alive) return;
      layout();
      setReady(true);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(frame);
    layout();
    document.fonts.ready.then(reveal);
    const fallback = window.setTimeout(reveal, 1500);

    return () => {
      alive = false;
      window.clearTimeout(fallback);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [frameRef, contentKey]);

  return ready;
}