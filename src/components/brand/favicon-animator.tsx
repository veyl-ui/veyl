"use client";

import { useEffect } from "react";

/**
 * Makes the browser-tab icon shimmer.
 *
 * Browsers disagree on whether they animate an SVG icon, so this component draws the
 * frames itself on a small canvas and swaps them into the page's icon link. Every few
 * seconds the mark plays one quick sweep, then rests on the still icon. It pauses in a
 * background tab and does nothing for people who prefer reduced motion.
 *
 * The drawing matches src/app/icon.svg and brand/veyl-mark.tsx.
 */

const SIZE = 64;
const SWEEP_MS = 1400; // how long one sweep lasts
const EVERY_MS = 9000; // pause between sweeps
const FRAME_MS = 80; // about 12 frames a second is plenty for a tab icon
const FIRST_DELAY_MS = 1800;

function tilePath(ctx: CanvasRenderingContext2D) {
  const r = 15;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(SIZE, 0, SIZE, SIZE, r);
  ctx.arcTo(SIZE, SIZE, 0, SIZE, r);
  ctx.arcTo(0, SIZE, 0, 0, r);
  ctx.arcTo(0, 0, SIZE, 0, r);
  ctx.closePath();
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Draws one frame. `progress` runs 0 to 1 across the sweep. Returns a PNG data URL. */
function drawFrame(main: HTMLCanvasElement, layer: HTMLCanvasElement, progress: number) {
  const c = main.getContext("2d");
  const l = layer.getContext("2d");
  if (!c || !l) return null;

  c.clearRect(0, 0, SIZE, SIZE);
  c.fillStyle = "#0a0a0a";
  tilePath(c);
  c.fill();

  const glow = c.createRadialGradient(32, 46, 0, 32, 46, 22);
  glow.addColorStop(0, "rgba(245,158,11,0.45)");
  glow.addColorStop(1, "rgba(245,158,11,0)");
  c.fillStyle = glow;
  c.beginPath();
  c.arc(32, 46, 22, 0, Math.PI * 2);
  c.fill();

  // The V is drawn on its own layer, so the light band can be clipped to the V.
  l.clearRect(0, 0, SIZE, SIZE);
  const fill = l.createLinearGradient(0, 0, SIZE, SIZE);
  fill.addColorStop(0, "#f7d9b8");
  fill.addColorStop(1, "#e8a057");
  l.strokeStyle = fill;
  l.lineWidth = 7;
  l.lineCap = "round";
  l.lineJoin = "round";
  l.beginPath();
  l.moveTo(19, 20);
  l.lineTo(32, 45);
  l.lineTo(45, 20);
  l.stroke();

  l.save();
  l.globalCompositeOperation = "source-atop";
  l.transform(1, 0, -Math.tan((20 * Math.PI) / 180), 1, 0, 0); // same lean as the SVG
  const x = -26 + ease(progress) * 100;
  const band = l.createLinearGradient(x, 0, x + 24, 0);
  band.addColorStop(0, "rgba(255,255,255,0)");
  band.addColorStop(0.5, "rgba(255,255,255,0.95)");
  band.addColorStop(1, "rgba(255,255,255,0)");
  l.fillStyle = band;
  l.fillRect(x, 0, 24, SIZE);
  l.restore();

  c.drawImage(layer, 0, 0);
  return main.toDataURL("image/png");
}

export function FaviconAnimator() {
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;

    const main = document.createElement("canvas");
    const layer = document.createElement("canvas");
    main.width = layer.width = SIZE;
    main.height = layer.height = SIZE;

    // Change only the attributes of one existing icon link. The link stays where it is,
    // so nothing the framework manages is added or removed.
    const link =
      document.querySelector<HTMLLinkElement>('link[rel~="icon"][type="image/svg+xml"]') ??
      document.querySelector<HTMLLinkElement>('link[rel~="icon"]');
    if (!link) return;

    const original = { href: link.getAttribute("href"), type: link.getAttribute("type") };
    let frameTimer: number | undefined;
    let nextTimer: number | undefined;

    const restore = () => {
      if (original.href) link.setAttribute("href", original.href);
      if (original.type) link.setAttribute("type", original.type);
    };

    const play = () => {
      if (document.hidden) {
        nextTimer = window.setTimeout(play, 2000); // wait for the tab to come back
        return;
      }
      const start = performance.now();
      frameTimer = window.setInterval(() => {
        const progress = Math.min(1, (performance.now() - start) / SWEEP_MS);
        const url = drawFrame(main, layer, progress);
        if (url) {
          link.setAttribute("type", "image/png");
          link.setAttribute("href", url);
        }
        if (progress >= 1) {
          window.clearInterval(frameTimer);
          restore();
          nextTimer = window.setTimeout(play, EVERY_MS);
        }
      }, FRAME_MS);
    };

    nextTimer = window.setTimeout(play, FIRST_DELAY_MS);

    return () => {
      window.clearInterval(frameTimer);
      window.clearTimeout(nextTimer);
      restore();
    };
  }, []);

  return null;
}
