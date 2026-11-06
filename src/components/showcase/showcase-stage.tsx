"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CopyButton } from "@/components/docs/copy-button";
import { registryUrl } from "@/lib/docs/site";
import { cn } from "@/lib/utils";
import type { ShowcaseItem } from "./data";
import { BeamAboutPreview, DropNavbarPreview, FlipWordsPreview } from "./previews";
import { useFit } from "./use-fit";
import "./showcase.css";

type Item = ShowcaseItem & { codeHtml: string };
type Mode = "preview" | "code";
type Device = "desktop" | "mobile";

const seg = "inline-flex rounded-lg border border-border bg-surface p-0.5";
const segBtn =
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-sm";

export function ShowcaseStage({ items }: { items: Item[] }) {
  const [cur, setCur] = useState(0);
  const [mode, setMode] = useState<Mode>("preview");
  const [device, setDevice] = useState<Device>("desktop");
  const [small, setSmall] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [beadTop, setBeadTop] = useState(14);

  const rootRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = items.length;
  const item = items[cur];
  const effectiveDevice: Device = small ? "mobile" : device;
  const running = inView && !reduced && mode === "preview";

  // Small screens always show the phone view. Reduced motion stops the rotation.
  useEffect(() => {
    const sm = window.matchMedia("(max-width: 1023px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setSmall(sm.matches);
      setReduced(rm.matches);
    };
    sync();
    sm.addEventListener("change", sync);
    rm.addEventListener("change", sync);
    return () => {
      sm.removeEventListener("change", sync);
      rm.removeEventListener("change", sync);
    };
  }, []);

  // Rotate only while the section is on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The bead of light glides to the active row.
  useLayoutEffect(() => {
    const row = rowRefs.current[cur];
    if (row) setBeadTop(row.offsetTop + 14);
  }, [cur, mode]);

  const pick = (i: number) => {
    setCur(i);
    setMode("preview");
  };
  const next = () => setCur((c) => (c + 1) % n);
  const command = `npx shadcn@latest add ${registryUrl(item.slug)}`;

  return (
    <div
      ref={rootRef}
      data-paused={paused}
      className="sc-root grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)]"
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
    >
      {/* Small screens: a row of chips. */}
      <div role="tablist" aria-label="Components" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
        {items.map((it, i) => (
          <button
            key={it.slug}
            role="tab"
            type="button"
            aria-selected={i === cur}
            onClick={() => pick(i)}
            className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-selected:border-foreground/30 aria-selected:bg-card aria-selected:text-foreground"
          >
            {it.title}
          </button>
        ))}
      </div>

      {/* Large screens: the list with its glowing rail. */}
      <div className="relative hidden flex-col pl-6 lg:flex lg:h-[28rem]">
        <span aria-hidden className="absolute top-1.5 bottom-16 left-[5px] w-px bg-border" />
        <span
          aria-hidden
          className="absolute left-0.5 h-[22px] w-[7px] rounded-md bg-brand shadow-[0_0_12px_2px_var(--brand)] transition-[top] duration-[600ms] ease-soft motion-reduce:transition-none"
          style={{ top: beadTop }}
        />
        <div role="tablist" aria-label="Components" aria-orientation="vertical" className="flex flex-col gap-0.5">
          {items.map((it, i) => {
            const active = i === cur;
            return (
              <button
                key={it.slug}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => pick(i)}
                className="group rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="flex items-baseline gap-2.5">
                  <span className={cn("font-mono text-[11px]", active ? "text-brand-ink" : "text-muted-foreground")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={cn("text-base font-semibold transition-colors", active ? "text-foreground" : "text-muted-foreground")}>
                    {it.title}
                  </span>
                  <span className="ml-auto font-mono text-[10px] tracking-wider text-muted-foreground">{it.tag}</span>
                </span>
                {active && (
                  <>
                    <span className="mt-1.5 block pl-6 text-[0.8125rem] leading-relaxed text-muted-foreground">{it.description}</span>
                    <span className="mt-2.5 block h-0.5 overflow-hidden rounded-full bg-border">
                      <i
                        className={cn("sc-prog block h-full w-0 bg-brand", running && "sc-prog-run")}
                        onAnimationEnd={next}
                      />
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Pinned to the bottom of the column, so it never moves when a row opens. */}
        <div className="mt-auto pt-4">
          <Link
            href="/docs"
            className="group inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            All components
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-300 ease-soft group-hover:translate-x-1 motion-reduce:transition-none">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </div>

      {/* The stage. */}
      <div className="relative flex h-[27rem] flex-col overflow-hidden rounded-md border border-border bg-card shadow-card lg:h-[28rem]">
        <div aria-hidden className="sc-grid absolute inset-0" />
        <i aria-hidden className="sc-corner left-2.5 top-2.5 border-t-[1.5px] border-l-[1.5px]" />
        <i aria-hidden className="sc-corner right-2.5 top-2.5 border-t-[1.5px] border-r-[1.5px]" />
        <i aria-hidden className="sc-corner bottom-14 left-2.5 border-b-[1.5px] border-l-[1.5px]" />
        <i aria-hidden className="sc-corner right-2.5 bottom-14 border-r-[1.5px] border-b-[1.5px]" />

        <div className="relative z-10 flex h-12 shrink-0 items-center justify-between gap-2 px-4">
          <span className="inline-flex min-w-0 items-center gap-2 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
            <span className="sc-live size-1.5 shrink-0 rounded-md bg-current" />
            LIVE <span className="truncate text-muted-foreground">· {item.slug}</span>
          </span>
          <div className="flex shrink-0 gap-2">
            <div className={cn(seg, "hidden lg:inline-flex")} role="group" aria-label="Device">
              <button type="button" aria-pressed={device === "desktop"} onClick={() => { setDevice("desktop"); setMode("preview"); }} className={segBtn}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>
                Desktop
              </button>
              <button type="button" aria-pressed={device === "mobile"} onClick={() => { setDevice("mobile"); setMode("preview"); }} className={segBtn}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M11 18.5h2" /></svg>
                Mobile
              </button>
            </div>
            <div className={seg} role="group" aria-label="View">
              <button type="button" aria-pressed={mode === "preview"} onClick={() => setMode("preview")} className={segBtn}>Preview</button>
              <button type="button" aria-pressed={mode === "code"} onClick={() => setMode("code")} className={segBtn}>Code</button>
            </div>
          </div>
        </div>

        <div className="relative z-10 min-h-0 flex-1">
          {mode === "code" ? (
            <div
              className="sc-code h-full overflow-auto px-5 py-3 text-xs leading-[1.85]"
              dangerouslySetInnerHTML={{ __html: item.codeHtml }}
            />
          ) : effectiveDevice === "mobile" ? (
            <PhoneFrame key={item.slug} slug={item.slug} title={item.title} />
          ) : (
            <div key={item.slug} className="h-full">
              {item.slug === "flip-words" && (
                <div className="grid h-full place-items-center">
                  <FlipWordsPreview />
                </div>
              )}
              {item.slug === "drop-navbar" && <DropNavbarPreview />}
              {item.slug === "beam-about" && <BeamAboutPreview />}
            </div>
          )}
        </div>

        <div className="relative z-10 flex h-12 shrink-0 items-center justify-between gap-3 border-t border-border bg-surface/80 px-4 backdrop-blur">
          <code className="min-w-0 truncate font-mono text-xs text-muted-foreground">
            <span className="text-brand-ink">$</span> <span className="text-foreground">{command}</span>
          </code>
          <div className="flex shrink-0 items-center gap-1.5">
            <CopyButton text={command} />
            <Link
              href={`/docs/components/${item.slug}`}
              className="inline-flex h-8 items-center rounded-md bg-foreground px-3 text-xs font-semibold text-background transition-colors hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The phone view. The component runs inside an iframe that is 375 x 640, so it sees a real phone-sized
 * screen and its own mobile layout switches on. The frame is then scaled down to fit the stage.
 */
function PhoneFrame({ slug, title }: { slug: string; title: string }) {
  const W = 375;
  const H = 640;
  const [ref, scale] = useFit(W, H, 14);

  return (
    <div ref={ref} className="grid h-full place-items-center">
      <div
        className="sc-phone relative overflow-hidden rounded-[1.6rem] border-[1.5px] border-foreground/25 bg-background"
        style={{ width: W * scale, height: H * scale }}
      >
        <iframe
          title={`${title} on a phone`}
          src={`/preview/${slug}`}
          loading="lazy"
          className="absolute top-0 left-0 border-0"
          style={{ width: W, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}
        />
      </div>
    </div>
  );
}