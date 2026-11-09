"use client";

import { useEffect, useRef } from "react";

/**
 * The huge, cropped word at the bottom of the footer. It sits there faint, and an amber light
 * follows your pointer across the letters. When nobody is pointing at it, the light sweeps
 * slowly back and forth by itself (it holds still for people who prefer reduced motion).
 */
export function SpotlightWordmark({ text }: { text: string }) {
  const zone = useRef<HTMLDivElement>(null);
  const lit = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const zoneEl = zone.current;
    const litEl = lit.current;
    if (!zoneEl || !litEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hovering = false;
    let visible = true;
    let time = 0;
    let frame = 0;

    const moveTo = (x: number, y: number) => {
      litEl.style.setProperty("--sf-x", `${x}px`);
      litEl.style.setProperty("--sf-y", `${y}px`);
    };
    const hide = () => moveTo(-400, -400);

    const onMove = (e: PointerEvent) => {
      const r = zoneEl.getBoundingClientRect();
      hovering = true;
      moveTo(e.clientX - r.left, e.clientY - r.top);
    };
    const onLeave = () => {
      hovering = false;
      if (reduced) hide();
    };

    zoneEl.addEventListener("pointermove", onMove);
    zoneEl.addEventListener("pointerleave", onLeave);

    // Don't animate while the footer is off screen.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(zoneEl);

    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (reduced || hovering || !visible) return;
      time += 0.012;
      const r = zoneEl.getBoundingClientRect();
      moveTo(r.width * (0.5 + 0.42 * Math.sin(time)), r.height * 0.5);
    };
    hide();
    loop();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      zoneEl.removeEventListener("pointermove", onMove);
      zoneEl.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="sf-wm-wrap" aria-hidden>
      <div ref={zone} className="sf-wm">
        <span className="sf-wm-base">{text}</span>
        <span ref={lit} className="sf-wm-lit">
          {text}
        </span>
      </div>
    </div>
  );
}