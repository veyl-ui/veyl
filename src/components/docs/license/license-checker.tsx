"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CHECKS, type Tone } from "@/lib/docs/license";
import "./license.css";

const mark: Record<Tone, string> = { yes: "✓", note: "!", no: "✕" };
const cls: Record<Tone, string> = { yes: "lc-yes", note: "lc-note", no: "lc-no" };

/** Pick what you want to do, and the verdict card answers. */
export function LicenseChecker() {
  const [i, setI] = useState(0);
  const c = CHECKS[i];

  return (
    <div className="mt-7 grid items-start gap-7 lg:grid-cols-[1fr_1.05fr]">
      <div role="group" aria-label="What do you want to do?" className="flex flex-wrap gap-2.5">
        {CHECKS.map((item, n) => (
          <button
            key={item.chip}
            type="button"
            aria-pressed={n === i}
            onClick={() => setI(n)}
            className={cn(
              "rounded-full border px-3.5 py-2 text-sm font-medium transition-[background-color,border-color,color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              n === i
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-surface text-foreground hover:border-brand/55",
            )}
          >
            {item.chip}
          </button>
        ))}
      </div>

      <div className={cn("lc-verdict relative min-h-[11.5rem] overflow-hidden rounded-2xl border border-border bg-surface p-6", cls[c.tone])}>
        <div key={i} className="lc-pop" aria-live="polite">
          <p className="mb-3.5 text-[13px] text-muted-foreground">Can I… {c.chip.charAt(0).toLowerCase() + c.chip.slice(1)}?</p>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--vbg)] text-lg font-bold text-[var(--vfg)]">{mark[c.tone]}</span>
            <span className="text-[26px] font-semibold tracking-tight text-[var(--vfg)]">{c.word}</span>
          </div>
          <p className="mt-4 leading-7 text-foreground/80">{c.text}</p>
        </div>
      </div>
    </div>
  );
}