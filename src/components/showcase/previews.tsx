"use client";

import { useEffect, useRef, useState } from "react";
import { VeylMark } from "@/components/brand/veyl-mark";
import { BeamAbout, BeamChecklist, BeamOrbit, BeamTyping } from "@/registry/veyl/beam-about";
import { DropNavbar } from "@/registry/veyl/drop-navbar";
import { FlipWords } from "@/registry/veyl/flip-words";
import { cn } from "@/lib/utils";
import { useFit } from "./use-fit";

/* ------------------------------------------------------------------ */
/* Flip Words                                                          */
/* ------------------------------------------------------------------ */

export function FlipWordsPreview() {
  return (
    <div className="px-6 text-center text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
      <span className="block sm:inline">Make it </span>
      <FlipWords words={["smooth", "alive", "fluid", "yours"]} duration={2800} className="px-0 text-brand-ink dark:text-brand-ink" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Drop Navbar                                                         */
/* ------------------------------------------------------------------ */

const links = [
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
];

function FakePage() {
  return (
    <div className="space-y-3 px-8 pt-10 pb-24">
      <div className="h-3 w-2/3 rounded-full bg-muted" />
      <div className="h-3 w-1/2 rounded-full bg-muted" />
      <div className="h-24 rounded-2xl bg-muted/70" />
      <div className="h-3 w-3/5 rounded-full bg-muted" />
      <div className="h-3 w-2/5 rounded-full bg-muted" />
      <div className="h-24 rounded-2xl bg-muted/70" />
      <div className="h-3 w-1/2 rounded-full bg-muted" />
    </div>
  );
}

function NavbarBar({ scrollContainer }: { scrollContainer?: React.RefObject<HTMLElement | null> }) {
  return (
    <DropNavbar
      scrollContainer={scrollContainer}
      className="[--dn-bg:var(--card)]"
      logo={
        <>
          <VeylMark animate={false} className="size-8" />
          <span className="text-lg font-bold tracking-tight">Veyl</span>
        </>
      }
      links={links}
      cta={{ label: "Get started", href: "#" }}
    />
  );
}

/**
 * Scrolls a target down and back up on its own, so the navbar can be seen dropping without anyone touching it.
 * It stops for good the moment the visitor scrolls, taps or clicks. Never runs for reduced motion.
 */
function useDemoScroll(getTarget: () => HTMLElement | Window | null, enabled: boolean, onUser: () => void) {
  useEffect(() => {
    if (!enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = getTarget();
    if (!target) return;
    let down = false;
    const move = () => {
      down = !down;
      target.scrollTo({ top: down ? 240 : 0, behavior: "smooth" });
    };
    const first = window.setTimeout(move, 1400);
    const timer = window.setInterval(move, 3200);
    const stop = () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
      onUser();
      events.forEach((e) => target.removeEventListener(e, stop));
    };
    const events = ["wheel", "touchstart", "pointerdown"] as const;
    events.forEach((e) => target.addEventListener(e, stop, { passive: true, once: true }));
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
      events.forEach((e) => target.removeEventListener(e, stop));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}

/**
 * "box": the navbar scrolls inside its own frame, for the desktop stage.
 * "page": the whole page scrolls, for the phone view (it runs inside an iframe).
 */
export function DropNavbarPreview({ mode = "box" }: { mode?: "box" | "page" }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [touched, setTouched] = useState(false);

  useDemoScroll(() => (mode === "page" ? window : scroller.current), true, () => setTouched(true));

  if (mode === "page") {
    return (
      <div className="min-h-[170vh]">
        <NavbarBar />
        <FakePage />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div ref={scroller} className="h-full overflow-y-auto">
        <NavbarBar scrollContainer={scroller} />
        <FakePage />
      </div>
      <span
        className={cn(
          "pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-[11px] text-muted-foreground backdrop-blur transition-opacity duration-500",
          touched && "opacity-0",
        )}
      >
        Scroll to try it
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Beam About                                                          */
/* ------------------------------------------------------------------ */

function AboutBody({ compact }: { compact?: boolean }) {
  return (
    <BeamAbout
      className={compact ? "px-5 py-8" : undefined}
      title="Animated components you copy and own"
      description="Ready-made React components with smooth motion built in."
      hint={false}
      steps={[
        { title: "Choose", description: "Finished sections that already move well.", visual: <BeamOrbit /> },
        {
          title: "Add",
          description: "One command. The files land in your project.",
          visual: <BeamTyping mono placeholder="Paste a command…" text="npx shadcn add flip-words" answer="3 files added" />,
        },
        {
          title: "Make it yours",
          description: "Edit the code to match your brand.",
          visual: <BeamChecklist title="Setting up" doneTitle="Ready to ship" items={["Matches your brand", "Dark mode included", "Edit any file"]} />,
        },
      ]}
    />
  );
}

/** Desktop stage: the full-size section, shown scaled down so the row layout fits. */
export function BeamAboutPreview({ mode = "box" }: { mode?: "box" | "page" }) {
  const [ref, scale] = useFit(1040, 520, 10);

  if (mode === "page") return <AboutBody compact />;

  return (
    <div ref={ref} className="grid h-full place-items-center overflow-hidden">
      <div style={{ width: 1040 * scale, height: 520 * scale }}>
        <div style={{ width: 1040, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <AboutBody />
        </div>
      </div>
    </div>
  );
}