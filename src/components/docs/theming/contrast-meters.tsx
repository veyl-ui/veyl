import { contrast, darkAccent, lightAccent, recipes } from "@/lib/docs/theme-colors";
import { Rise } from "./motion";

const MAX = 10;

function Group({ title, base, dark }: { title: string; base: string; dark: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">Line = 4.5 to 1</span>
      </div>
      <div className="mt-4 space-y-3">
        {recipes.map((r, i) => {
          const colour = dark ? darkAccent(r) : lightAccent(r);
          const ratio = contrast(colour, base);
          return (
            <div key={r.name} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3 text-[13px]">
              <span className="text-muted-foreground">{r.name}</span>
              <div className="tm-meter" style={{ "--i": i } as React.CSSProperties}>
                <span className="fill" style={{ "--w": `${Math.min(ratio / MAX, 1) * 100}%`, background: colour } as React.CSSProperties} />
                <span className="tick" style={{ left: `${(4.5 / MAX) * 100}%` }} />
              </div>
              <span className="text-right font-mono text-xs text-foreground">
                {ratio.toFixed(1)}
                <span className="tm-check ml-1 text-emerald-600 dark:text-emerald-400" style={{ "--i": i } as React.CSSProperties}>
                  ✓
                </span>
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="size-3 rounded border border-black/15 dark:border-white/20" style={{ background: base }} />
        Measured on {dark ? "near-black (#171717)" : "white (#ffffff)"}
      </div>
    </div>
  );
}

/** Every recipe colour, measured on its background. The bars fill when they scroll into view. */
export function ContrastMeters() {
  return (
    <Rise soft>
      <div className="grid gap-3 md:grid-cols-2">
        <Group title="Light mode" base="#ffffff" dark={false} />
        <Group title="Dark mode" base="#171717" dark />
      </div>
    </Rise>
  );
}