"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";

/**
 * The 3D cube. Plain CSS 3D transforms plus one small animation loop, so there is no 3D library to install.
 *  - idle: it spins slowly, bobs, and its shadow breathes
 *  - pointer: it leans toward the cursor, and the faces float apart while you hover
 *  - click or tap: a quick spin and a pulse ring from the core
 */
export function GlassCube({ hint = "Move your mouse over it. Click it." }: { hint?: string | null }) {
  const zone = useRef<HTMLDivElement>(null);
  const cube = useRef<HTMLDivElement>(null);
  const shadow = useRef<HTMLDivElement>(null);
  const pulse = useRef<HTMLDivElement>(null);
  const motion = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, boost: 0 });

  useEffect(() => {
    const cubeEl = cube.current;
    const shadowEl = shadow.current;
    const zoneEl = zone.current;
    if (!cubeEl || !shadowEl || !zoneEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const m = motion.current;
    let spin = -30;
    let time = 0;
    let frame = 0;
    let visible = true;

    // Skip the work while the cube is off screen.
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(zoneEl);

    const loop = () => {
      frame = requestAnimationFrame(loop);
      if (!visible) return;
      time += 0.016;
      if (!reduced) {
        spin += 0.28 + m.boost;
        m.boost *= 0.94;
      }
      m.x += (m.targetX - m.x) * 0.08;
      m.y += (m.targetY - m.y) * 0.08;
      const bob = reduced ? 0 : Math.sin(time * 1.4);
      cubeEl.style.transform = `translateY(${bob * 7}px) rotateX(${-20 - m.y * 18}deg) rotateY(${spin + m.x * 28}deg)`;
      shadowEl.style.transform = `scale(${1 - bob * 0.06})`;
    };
    loop();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    motion.current.targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;
    motion.current.targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
  }

  function spread(on: boolean) {
    if (cube.current) cube.current.dataset.spread = String(on);
    if (!on) {
      motion.current.targetX = 0;
      motion.current.targetY = 0;
    }
  }

  function burst() {
    motion.current.boost = 9;
    const ring = pulse.current;
    if (!ring) return;
    ring.dataset.go = "false";
    void ring.offsetWidth; // restart the animation
    ring.dataset.go = "true";
  }

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      burst();
    }
  }

  return (
    <div
      ref={zone}
      className="gc-right"
      role="button"
      tabIndex={0}
      aria-label="Spin the cube"
      onPointerEnter={() => spread(true)}
      onPointerLeave={() => spread(false)}
      onPointerMove={onMove}
      onClick={burst}
      onKeyDown={onKey}
    >
      <div ref={shadow} className="gc-shadow" aria-hidden />
      <div className="gc-scene" aria-hidden>
        <div className="gc-ring">
          <div className="gc-orbit-dot" />
        </div>
        <div ref={pulse} className="gc-pulse" data-go="false" />
        <div ref={cube} className="gc-cube" data-spread="false">
          <div className="gc-core" />
          <div className="gc-face" style={{ transform: "rotateY(0deg) translateZ(var(--d))" }}>
            <span className="gc-mark">V</span>
          </div>
          <div className="gc-face" style={{ transform: "rotateY(90deg) translateZ(var(--d))" }}>
            <div className="gc-toggle" />
          </div>
          <div className="gc-face" style={{ transform: "rotateY(180deg) translateZ(var(--d))" }}>
            <div className="gc-bars"><i /><i /><i /></div>
          </div>
          <div className="gc-face" style={{ transform: "rotateY(-90deg) translateZ(var(--d))" }}>
            <div className="gc-plus" />
          </div>
          <div className="gc-face" style={{ transform: "rotateX(90deg) translateZ(var(--d))" }}>
            <div className="gc-dots"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
          </div>
          <div className="gc-face" style={{ transform: "rotateX(-90deg) translateZ(var(--d))" }} />
        </div>
      </div>
      {hint && <div className="gc-hint">{hint}</div>}
    </div>
  );
}