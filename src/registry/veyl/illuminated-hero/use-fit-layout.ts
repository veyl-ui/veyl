"use client";

import { RefObject, useEffect, useState } from "react";

/**
 * The scene is designed on a 1732px-wide canvas. This hook:
 *  1. scales the headline and paragraph so each line is as wide as in the design
 *     (whatever font the browser ends up using),
 *  2. places every line on its exact baseline,
 *  3. reports `true` once fonts are loaded and the layout is final.
 */
const DESIGN_WIDTH = 1732;
const SIDE_BEARING = 0.06; // em, ink vs. box width

const widthOf = (el: Element) => el.getBoundingClientRect().width;

function fitLine(line: HTMLElement, unit: number, fontSize: number) {
  const text = line.querySelector<HTMLElement>(".vh-tx");
  if (!text) return;
  text.style.letterSpacing = "0px";
  const target = parseFloat(line.dataset.w ?? "0") * unit + fontSize * SIDE_BEARING;
  const perChar = (target - widthOf(text)) / (text.textContent?.length || 1);
  text.style.letterSpacing = `${perChar.toFixed(3)}px`;
}

function placeLine(frame: HTMLElement, line: HTMLElement, unit: number) {
  const probe = line.querySelector<HTMLElement>(".vh-pb");
  if (!probe) return;
  line.style.top = "0px";
  const current = probe.getBoundingClientRect().bottom - frame.getBoundingClientRect().top;
  line.style.top = `${(parseFloat(line.dataset.base ?? "0") * unit - current).toFixed(2)}px`;
}

export function useFitLayout(frameRef: RefObject<HTMLDivElement | null>): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const head = frame.querySelector<HTMLElement>(".vh-head");
    const sub = frame.querySelector<HTMLElement>(".vh-sub");
    if (!head || !sub) return;
    const headLines = Array.from(head.querySelectorAll<HTMLElement>(".vh-ln"));
    const subLines = Array.from(sub.querySelectorAll<HTMLElement>(".vh-ln"));

    const layout = () => {
      const U = frame.clientWidth / DESIGN_WIDTH;

      // headline: one font size, chosen so the third line is 1205px wide
      head.style.fontSize = `${86 * U}px`;
      const l3 = headLines[2].querySelector<HTMLElement>(".vh-tx")!;
      l3.style.letterSpacing = "-0.02em";
      const fs = 86 * U * ((1205 * U + 86 * U * SIDE_BEARING) / widthOf(l3));
      head.style.fontSize = `${fs}px`;
      headLines.forEach((l) => fitLine(l, U, fs));

      // paragraph: same idea, based on its first line (760px)
      sub.style.fontSize = `${28 * U}px`;
      const s1 = subLines[0].querySelector<HTMLElement>(".vh-tx")!;
      s1.style.letterSpacing = "0px";
      const sfs = 28 * U * ((760 * U + 28 * U * SIDE_BEARING) / widthOf(s1));
      sub.style.fontSize = `${sfs}px`;
      subLines.forEach((l) => fitLine(l, U, sfs));

      [...headLines, ...subLines].forEach((l) => placeLine(frame, l, U));
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
  }, [frameRef]);

  return ready;
}