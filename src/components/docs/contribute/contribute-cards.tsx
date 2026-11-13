import type { ReactNode, SVGProps } from "react";
import { Glow, Rise } from "@/components/docs/theming/motion";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const BugIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...stroke} {...p}>
    <path d="M8 2l1.9 1.9M16 2l-1.9 1.9M9 7.1V6a3 3 0 0 1 6 0v1.1" />
    <path d="M12 20a6 6 0 0 1-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3a6 6 0 0 1-6 6zM12 20v-9M6.5 13H2M17.5 13H22M6 8.5 3.5 7M18 8.5 20.5 7M6.5 18 3.5 19.5M17.5 18l3 1.5" />
  </svg>
);
const BulbIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...stroke} {...p}>
    <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V18h6v-1.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" />
  </svg>
);
const PuzzleIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...stroke} {...p}>
    <path d="M19.4 11H18V8a2 2 0 0 0-2-2h-3V4.6a2.6 2.6 0 0 0-5.2 0V6H5a2 2 0 0 0-2 2v3h1.4a2.6 2.6 0 0 1 0 5.2H3V19a2 2 0 0 0 2 2h3v-1.4a2.6 2.6 0 0 1 5.2 0V21H16a2 2 0 0 0 2-2v-3h1.4a2.6 2.6 0 0 0 0-5z" />
  </svg>
);

const ways: { icon: ReactNode; title: string; text: string }[] = [
  { icon: <BugIcon />, title: "Report a bug", text: "Something looks off or breaks? Open an issue with a screenshot and the steps to see it." },
  { icon: <BulbIcon />, title: "Suggest an idea", text: "A component you wish existed, or a better way to theme one. Ideas are welcome." },
  { icon: <PuzzleIcon />, title: "Build a component", text: "Add a new block to the library by following the folder layout further down." },
];

/** Three ways to help. The cards arrive one after another and light up under the pointer. */
export function WaysToContribute() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {ways.map((w, i) => (
        <Rise key={w.title} i={i} className="min-w-0">
          <Glow className="h-full rounded-xl border border-border bg-surface p-5">
            <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand-ink">{w.icon}</span>
            <h3 className="mt-3 font-medium text-foreground">{w.title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{w.text}</p>
          </Glow>
        </Rise>
      ))}
    </div>
  );
}

/** A checklist of things to tick. It is only a reminder, nothing is saved. */
export function Checklist({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 leading-7 text-foreground">
          <span aria-hidden="true" className="mt-[0.45rem] grid size-[1.05rem] shrink-0 place-items-center rounded border border-border bg-surface text-brand-ink">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 5 5 9-10" />
            </svg>
          </span>
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}