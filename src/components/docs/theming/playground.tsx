"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { contrast, darkAccent, lightAccent, recipes, type Theme } from "@/lib/docs/theme-colors";
import { Faq } from "@/registry/veyl/faq";
import { GlassBackdrop, GlassCta } from "@/registry/veyl/glass-cta";
import { SpotlightFooter } from "@/registry/veyl/spotlight-footer";
import { CopyButton } from "../copy-button";
import { MoonIcon, SunIcon } from "../icons";
import "./playground.css";

const START: Theme = { hue: 32, sat: 85 };

const faqItems = [
  { question: "Can I change the colours?", answer: "Yes. Every colour is a variable, so you change one value and the component follows." },
  { question: "Does dark mode work?", answer: "It does. Each component has a set of values for light and another for dark." },
];

/** What each part of a preview is called in CSS. Shown when Inspect is on. */
const INSPECT: [selector: string, label: string][] = [
  [".fq-eyebrow", "--fq-accent-ink"],
  [".fq-number", "--fq-muted  (open: --fq-accent-ink)"],
  [".fq-answer", "--fq-muted"],
  [".fq-card[data-open='true']", "--fq-accent  (the ring)"],
  [".fq-card", "--fq-card  ·  --fq-border"],
  [".gc-eyebrow", "--gc-accent-ink"],
  [".gc-right", "--gc-accent  (the cube, glow and icons)"],
  [".gc-title", "--gc-ink"],
  [".gc-desc", "--gc-muted"],
  [".gc-btn", "--gc-button  ·  --gc-button-ink"],
  [".sf-wm-wrap", "--sf-accent  (the spotlight)  ·  --sf-word"],
  [".sf-col h3", "--sf-ink"],
  [".sf-col a", "--sf-muted  (hover: --sf-accent-ink)"],
  [".sf-socials a", "--sf-muted  ·  --sf-line"],
  [".sf-tagline", "--sf-muted"],
  [".sf-bar", "--sf-line"],
];

type Preview = "faq" | "cta" | "footer";
const previews: { id: Preview; label: string }[] = [
  { id: "faq", label: "FAQ" },
  { id: "cta", label: "Glass CTA" },
  { id: "footer", label: "Spotlight Footer" },
];

function snippets(light: string, dark: string) {
  return [
    {
      id: "component",
      label: "One component",
      lang: "tsx",
      where: "Open the file where you use <Faq />, and add the className to it. Do the same for any other component you want to change.",
      code: `<Faq
  className="[--fq-accent:${light}] [--fq-accent-ink:${light}]
    dark:[--fq-accent:${dark}] dark:[--fq-accent-ink:${dark}]"
  items={items}
/>`,
    },
    {
      id: "section",
      label: "One section",
      lang: "css",
      where: "Put the CSS in your global stylesheet (for example src/app/globals.css). Then give the section's wrapper the class pricing-theme.",
      code: `/* <div className="pricing-theme"> ...components... </div> */
.pricing-theme .fq-root { --fq-accent: ${light}; --fq-accent-ink: ${light}; }
.pricing-theme .gc-root,
.pricing-theme .gc-backdrop { --gc-accent: ${light}; }
.pricing-theme .gc-root { --gc-accent-ink: ${light}; }
.pricing-theme .sf-root { --sf-accent: ${light}; --sf-accent-ink: ${light}; }

.dark .pricing-theme .fq-root { --fq-accent: ${dark}; --fq-accent-ink: ${dark}; }
.dark .pricing-theme .gc-root,
.dark .pricing-theme .gc-backdrop { --gc-accent: ${dark}; }
.dark .pricing-theme .gc-root { --gc-accent-ink: ${dark}; }
.dark .pricing-theme .sf-root { --sf-accent: ${dark}; --sf-accent-ink: ${dark}; }`,
    },
    {
      id: "everywhere",
      label: "Everywhere",
      lang: "css",
      where: "Paste this at the bottom of your global stylesheet (for example src/app/globals.css), outside any @layer. Every Veyl component on your site picks it up.",
      code: `.fq-root { --fq-accent: ${light}; --fq-accent-ink: ${light}; }
.gc-root, .gc-backdrop { --gc-accent: ${light}; }
.gc-root { --gc-accent-ink: ${light}; }
.sf-root { --sf-accent: ${light}; --sf-accent-ink: ${light}; }
.ba-root { --ba-accent: ${light}; }

.dark .fq-root { --fq-accent: ${dark}; --fq-accent-ink: ${dark}; }
.dark .gc-root, .dark .gc-backdrop { --gc-accent: ${dark}; }
.dark .gc-root { --gc-accent-ink: ${dark}; }
.dark .sf-root { --sf-accent: ${dark}; --sf-accent-ink: ${dark}; }
.dark .ba-root { --ba-accent: ${dark}; }`,
    },
  ];
}

function Block({ n, title, hint, children }: { n: number; title: string; hint: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[1.75rem_1fr] gap-x-4 border-t border-border p-4 first:border-t-0 sm:p-5">
      <span aria-hidden="true" className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-ink">
        {n}
      </span>
      <div className="min-w-0">
        <h3 className="pt-0.5 font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{hint}</p>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

const pill =
  "inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-[13px] text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function ThemePlayground() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<Theme>(START);
  const [preview, setPreview] = useState<Preview>("faq");
  const [tab, setTab] = useState(0);
  const [inspect, setInspect] = useState(false);
  const tip = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const light = lightAccent(theme);
  const dark = darkAccent(theme);
  const accent = isDark ? dark : light;
  const ratio = contrast(accent, isDark ? "#171717" : "#ffffff");
  const good = ratio >= 4.5;
  const code = snippets(light, dark)[tab];

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = tip.current;
    const box = stage.current;
    if (!el || !box) return;
    if (!inspect) return void (el.style.opacity = "0");
    const target = e.target as Element;
    const hit = INSPECT.find(([selector]) => target.closest(selector));
    if (!hit) return void (el.style.opacity = "0");
    const rect = box.getBoundingClientRect();
    el.textContent = hit[1];
    el.style.left = `${Math.min(e.clientX - rect.left + 14, rect.width - 220)}px`;
    el.style.top = `${e.clientY - rect.top + 16}px`;
    el.style.opacity = "1";
  }

  return (
    <div
      className="overflow-hidden rounded-xl border border-border bg-surface"
      style={{ "--tp-ac": accent } as CSSProperties}
    >
      {/* Step 1 */}
      <Block n={1} title="Pick a colour" hint="Tap a ready-made colour, drag the slider to mix your own, or press Surprise me.">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <div className="flex gap-2" role="group" aria-label="Ready-made colours">
            {recipes.map((r) => {
              const on = r.hue === theme.hue && r.sat === theme.sat;
              return (
                <button
                  key={r.name}
                  type="button"
                  aria-label={r.name}
                  aria-pressed={on}
                  title={r.name}
                  onClick={() => setThemeState({ hue: r.hue, sat: r.sat })}
                  className={cn(
                    "size-7 rounded-full border border-black/10 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    on && "ring-2 ring-foreground ring-offset-2 ring-offset-surface",
                  )}
                  style={{ background: lightAccent(r) }}
                />
              );
            })}
          </div>
          <label className="flex min-w-[11rem] flex-1 items-center gap-3 text-[13px] text-muted-foreground">
            Hue
            <input
              type="range"
              min={0}
              max={360}
              value={theme.hue}
              onChange={(e) => setThemeState((t) => ({ hue: +e.target.value, sat: t.sat === 0 ? 80 : t.sat }))}
              className="flex-1 accent-[var(--tp-ac)]"
            />
            <span className="w-8 text-right font-mono text-xs text-foreground">{theme.hue}</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className={pill}
              onClick={() => setThemeState({ hue: Math.floor(Math.random() * 360), sat: 75 + Math.floor(Math.random() * 15) })}
            >
              <svg className="tp-dice" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
                <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
                <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
              </svg>
              Surprise me
            </button>
            <button type="button" className={pill} onClick={() => (setThemeState(START), setInspect(false))}>
              Reset
            </button>
          </div>
        </div>
      </Block>

      {/* Step 2 */}
      <Block
        n={2}
        title="Check how it looks"
        hint="Pick a component, then flip between light and dark. Turn on Inspect and hover any part to see the variable that controls it."
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="flex gap-1 rounded-full border border-border bg-background p-0.5" role="group" aria-label="Component to preview">
            {previews.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={preview === p.id}
                onClick={() => setPreview(p.id)}
                className={cn(
                  "h-7 rounded-full px-3 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  preview === p.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button type="button" className={pill} onClick={() => setTheme(isDark ? "light" : "dark")} aria-label={isDark ? "Switch the page to light mode" : "Switch the page to dark mode"}>
            {isDark ? <MoonIcon width={15} height={15} /> : <SunIcon width={15} height={15} />}
            {isDark ? "Dark" : "Light"}
          </button>
          <button type="button" className={cn(pill, inspect && "border-foreground bg-foreground text-background hover:bg-foreground/90")} aria-pressed={inspect} onClick={() => setInspect((v) => !v)}>
            Inspect variables
          </button>
          <span
            className={cn(
              "ml-auto inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px]",
              good ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/15 text-amber-800 dark:text-amber-300",
            )}
            role="status"
          >
            {good ? "✓" : "!"} Contrast {ratio.toFixed(1)}:1 {good ? "is readable" : "is low for text"}
          </span>
        </div>

        <div
          ref={stage}
          onPointerMove={onMove}
          onPointerLeave={() => tip.current && (tip.current.style.opacity = "0")}
          className={cn("tp-stage relative rounded-lg border border-border bg-background", inspect && "tp-ins")}
        >
          <div className="pointer-events-none absolute z-10 whitespace-pre rounded-md bg-foreground px-2 py-1 font-mono text-[11px] text-background opacity-0 transition-opacity" ref={tip} />
          <div key={preview} className="tp-fade">
            {preview === "faq" && (
              <div className="mx-auto max-w-xl px-4 py-8">
                <Faq items={faqItems} eyebrow="Theming" />
              </div>
            )}
            {preview === "cta" && (
              <div className="px-3 py-6 sm:px-6">
                <div className="relative">
                  <GlassBackdrop />
                  <GlassCta
                    eyebrow="Get started"
                    title="Make it yours"
                    description="Change one colour and watch every part follow."
                    primary={{ label: "Get started", href: "#" }}
                    secondary={{ label: "Browse", href: "#" }}
                    command="npx shadcn@latest add glass-cta"
                  />
                </div>
              </div>
            )}
            {preview === "footer" && (
              <SpotlightFooter
                brand={<span className="text-lg font-medium">Acme</span>}
                tagline="Tools that help small teams ship faster."
                columns={[
                  { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }] },
                  { title: "Company", links: [{ label: "About", href: "#" }, { label: "Contact", href: "#" }] },
                ]}
                copyright="© 2026 Acme"
                wordmark="Acme"
              />
            )}
          </div>
        </div>
      </Block>

      {/* Step 3 */}
      <Block n={3} title="Copy the code" hint="Choose where you want the colour to apply. The code already has your light and dark values.">
        <div className="mb-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Where to apply the colour">
          {snippets(light, dark).map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={tab === i}
              onClick={() => setTab(i)}
              className={cn(
                "h-8 rounded-full border px-3 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                tab === i ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <pre className="overflow-x-auto rounded-md border border-border bg-background p-4 pr-12 font-mono text-[13px] leading-7 text-foreground">
            <code>{code.code}</code>
          </pre>
          <CopyButton text={code.code} className="absolute right-2.5 top-2.5" />
        </div>
      </Block>

      {/* Step 4 */}
      <Block n={4} title="Paste it" hint={code.where}>
        <p className="rounded-md border border-border bg-background px-4 py-3 text-sm leading-6 text-muted-foreground">
          Save the file and refresh. Not seeing a change? Jump to{" "}
          <a href="#fix" className="font-medium text-foreground underline underline-offset-4 hover:text-brand-ink">
            If something looks wrong
          </a>
          .
        </p>
      </Block>
    </div>
  );
}