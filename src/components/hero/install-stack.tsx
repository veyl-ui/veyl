"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Glyph, type GlyphName } from "./orbit-glyphs";

/** A little stack of "added to your project" cards. Every few seconds a new one drops in on top. */
const items: { id: string; name: string; kind: string; files: number; glyph: GlyphName; tint: string }[] = [
  { id: "drop-navbar", name: "Drop Navbar", kind: "Block", files: 4, glyph: "navbar", tint: "bg-blue-500/10" },
  { id: "flip-words", name: "Flip Words", kind: "Component", files: 3, glyph: "sparkles", tint: "bg-amber-500/10" },
  { id: "bento-grid", name: "Bento Grid", kind: "Block", files: 3, glyph: "bento", tint: "bg-teal-500/10" },
  { id: "illuminated-hero", name: "Illuminated Hero", kind: "Block", files: 4, glyph: "play", tint: "bg-orange-500/10" },
];

const GAP = 62; // how far each card sits below the one in front
const SLOTS = 3;

export function InstallStack() {
  const reduce = useReducedMotion();
  const [head, setHead] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setHead((h) => h + 1);
    }, 3400);
    return () => window.clearInterval(timer);
  }, [reduce]);

  // slot 0 is the front card, the newest
  const visible = Array.from({ length: SLOTS }, (_, slot) => {
    const index = (((head - slot) % items.length) + items.length) % items.length;
    return { item: items[index], slot };
  });

  return (
    <div className="relative mx-auto mt-14 h-[13.5rem] w-full max-w-[24rem]" role="img" aria-label="Components being added to a project">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-24 -inset-y-10 -z-10 [background:radial-gradient(closest-side,oklch(0.762_0.124_64/0.3),oklch(0.78_0.1_240/0.12)_60%,transparent)]"
      />
      <AnimatePresence initial={false}>
        {visible.map(({ item, slot }) => (
          <motion.div
            key={item.id}
            initial={reduce ? false : { opacity: 0, y: -26, scale: 1.04 }}
            animate={{ opacity: 1 - slot * 0.3, y: slot * GAP, scale: 1 - slot * 0.065 }}
            exit={reduce ? undefined : { opacity: 0, y: SLOTS * GAP, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 210, damping: 26 }}
            style={{ zIndex: 10 - slot, transformOrigin: "top center" }}
            className="absolute inset-x-0 top-0 flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-card"
          >
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${item.tint}`}>
              <Glyph name={item.glyph} size={22} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm leading-5">
                <span className="font-semibold text-foreground">{item.name}</span>
                <span className="text-muted-foreground"> added to your project</span>
              </span>
              <span className="block text-xs leading-5 text-muted-foreground">
                {item.kind} · {item.files} files · just now
              </span>
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}