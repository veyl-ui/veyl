import { Glow, Rise } from "./motion";

/** One variable changes through six colours, and a small interface follows. Pauses on hover. */
export function WhatDemo() {
  const chips: [string, string][] = [
    ["--fq-accent", "The ring around an open FAQ question"],
    ["--sf-accent", "The glow on the footer's big word"],
    ["--gc-button", "The main button of the Glass CTA"],
    ["--dn-accent", "The highlight in the navbar dropdown"],
  ];
  return (
    <div className="space-y-4">
      <Rise soft>
        <div className="tm-demo tm-cycle grid gap-5 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[1fr_1.2fr] sm:p-5">
          <div className="flex flex-col justify-center gap-2">
            <p className="font-mono text-[13px] text-foreground">
              .faq {"{"}
              <br />
              &nbsp;&nbsp;--accent: <span className="tm-dot" />;
              <br />
              {"}"}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">Change this one value. Everything on the right follows. Hover to pause.</p>
          </div>
          <div className="grid gap-3 rounded-lg border border-border bg-background p-4">
            <div className="tm-ring rounded-lg px-3 py-2 text-sm text-foreground">Can I change the colours?</div>
            <div className="flex items-center gap-3">
              <span className="tm-btn rounded-md px-3 py-1.5 text-[13px] font-medium">Get started</span>
              <span className="tm-switch relative inline-block h-5 w-9 rounded-full" aria-hidden="true" />
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <span className="tm-bar block h-full rounded-full" />
              </span>
            </div>
          </div>
        </div>
      </Rise>
      <div className="grid gap-3 sm:grid-cols-2">
        {chips.map(([name, text], i) => (
          <Rise key={name} i={i}>
            <Glow className="tm-chip flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm">
              <span aria-hidden="true" className="tm-chipdot size-2 shrink-0 rounded-full bg-brand" style={{ animationDelay: `${i * 0.4}s` }} />
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{name}</code>
              <span aria-hidden="true" className="tm-arrow text-muted-foreground">→</span>
              <span className="text-muted-foreground">{text}</span>
            </Glow>
          </Rise>
        ))}
      </div>
    </div>
  );
}