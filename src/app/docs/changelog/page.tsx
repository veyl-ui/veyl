import type { Metadata } from "next";
import { ChangelogTimeline } from "@/components/docs/changelog/changelog-timeline";
import { DocsPage, Pager } from "@/components/docs/docs-ui";
import { HeroGrid } from "@/components/docs/hero-grid";
import { HeroStage } from "@/components/docs/theming/motion";
import { changelog, formatLong, getMonths } from "@/lib/docs/changelog";

export const metadata: Metadata = { title: "Changelog" };

export default function ChangelogPage() {
  const months = getMonths();
  const latest = [...changelog].sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <DocsPage tocFrom="xl" toc={months.map((m) => ({ id: `m-${m.id}`, title: m.label }))}>
      <HeroStage className="tm-hero tm-stage">
        <HeroGrid />

        <header className="tm-d1 pb-6 pt-8 sm:pt-12">
          <div className="tm-pop-in flex items-center gap-2.5 text-sm text-muted-foreground">
            Changelog
            <span className="rounded-sm bg-white px-1 py-0.5 text-[12px] font-medium text-neutral-700 shadow-sm ring-1 shadow-black/10 ring-black/5 dark:bg-neutral-900 dark:text-neutral-300 dark:shadow-black/50 dark:ring-white/5">
              {changelog.length} {changelog.length === 1 ? "update" : "updates"}
            </span>
          </div>
          <h1 className="tm-title mt-4 text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            What&apos;s new in Veyl.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground sm:text-xl sm:leading-9">
            Every release, fix and polish, newest first. Follow along as the library grows, one component at a time.
          </p>
          {latest ? (
            <p className="mt-6 flex items-center gap-2 text-[13px] text-muted-foreground">
              {/* <span aria-hidden="true" className="size-[7px] rounded-full bg-brand shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_22%,transparent)]" /> */}
              Last update <span className="font-semibold text-foreground">{formatLong(latest.date)}</span>
            </p>
          ) : null}
        </header>
      </HeroStage>

      {/* Below 1280px there is no list on the right, so the months are links here instead. */}
      <nav aria-label="Jump to month" className="mt-2 flex flex-wrap gap-2 xl:hidden">
        {months.map((m) => (
          <a
            key={m.id}
            href={`#m-${m.id}`}
            className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-brand/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {m.label}
            <span className="ml-1.5 text-xs opacity-70">{m.entries.length}</span>
          </a>
        ))}
      </nav>

      <ChangelogTimeline />
      <Pager href="/docs/changelog" />
    </DocsPage>
  );
}