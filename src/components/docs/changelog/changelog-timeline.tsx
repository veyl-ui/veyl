import { Fragment, type ReactNode } from "react";
import { Rise } from "@/components/docs/theming/motion";
import { cn } from "@/lib/utils";
import { formatDay, formatYear, getMonths, type ChangeTag } from "@/lib/docs/changelog";
import { ChangelogImage } from "./changelog-image";
import "./changelog.css";

const tagStyle: Record<ChangeTag, string> = {
  Added: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Improved: "bg-brand-soft text-brand-ink",
  Fixed: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  Docs: "bg-muted text-foreground",
};

/** Turns `backticks` into inline code. */
function rich(text: string): ReactNode {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code key={i} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
        {part.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function ChangelogTimeline() {
  const months = getMonths();
  let first = true;

  return (
    <div>
      {months.map((month) => (
        <section key={month.id} id={`m-${month.id}`} className="scroll-mt-24">
          <div className="mb-8 mt-16 flex items-center gap-4 text-sm text-muted-foreground first:mt-12">
            <h2 className="font-semibold text-foreground">{month.label}</h2>
            <span aria-hidden="true" className="h-px flex-1 bg-border" />
            <span>
              {month.entries.length} {month.entries.length === 1 ? "update" : "updates"}
            </span>
          </div>

          <ol className="relative">
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-[5px] top-2 w-px bg-gradient-to-b from-border from-90% to-transparent"
            />
            {month.entries.map((entry) => {
              const live = first;
              first = false;
              return (
                <li key={entry.date + entry.title} className="relative mb-16 grid gap-2 sm:grid-cols-[8rem_1fr]">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-0 top-1.5 size-[11px] rounded-full border-2 border-brand bg-background",
                      live && "cl-dot-live",
                    )}
                  />
                  <time dateTime={entry.date} className="pl-7 pt-0.5 text-sm leading-snug text-muted-foreground sm:pl-7">
                    <span className="font-bold">{formatDay(entry.date)}</span>
                    <br />
                    {formatYear(entry.date)}
                  </time>

                  <Rise soft className="min-w-0 pl-7 sm:pl-0">
                    <h3 className="mb-3.5 flex flex-wrap items-center gap-2.5 text-xl font-semibold tracking-tight text-foreground">
                      {entry.title}
                      {entry.tag ? (
                        <span className={cn("rounded-sm bg-white px-1 py-0.5 text-[12px] font-medium text-neutral-700 shadow-sm ring-1 shadow-black/10 ring-black/5 dark:bg-neutral-900 dark:text-neutral-300 dark:shadow-black/50 dark:ring-white/5", tagStyle[entry.tag])}>
                          {entry.tag}
                        </span>
                      ) : null}
                    </h3>
                    <ChangelogImage images={entry.images} alt={entry.imageAlt ?? entry.title} />
                    <p className="mt-5 leading-7 text-muted-foreground">{rich(entry.description)}</p>
                    <ul className="mt-3 space-y-1.5">
                      {entry.points.map((point) => (
                        <li key={point} className="relative pl-5 leading-7 text-foreground">
                          <span aria-hidden="true" className="absolute left-0.5 top-[0.8em] size-1.5 rounded-full bg-brand" />
                          {rich(point)}
                        </li>
                      ))}
                    </ul>
                    {entry.conclusion ? <p className="mt-4 font-medium text-foreground">{entry.conclusion}</p> : null}
                  </Rise>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}