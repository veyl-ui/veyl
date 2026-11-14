import type { Metadata } from "next";
import { CopyLicenseButton } from "@/components/docs/license/copy-license";
import { LicenseChecker } from "@/components/docs/license/license-checker";
import { LicensePaper } from "@/components/docs/license/license-paper";
import { DocsPage, Pager } from "@/components/docs/docs-ui";
import { Rise } from "@/components/docs/theming/motion";
import { BUILT_ON, CLAUSES, REPO } from "@/lib/docs/license";

export const metadata: Metadata = { title: "License" };

const heading = "text-3xl font-semibold tracking-tight text-foreground";

export default function LicensePage() {
  return (
    <DocsPage
      toc={[
        { id: "can-i", title: "Can I…?" },
        { id: "clauses", title: "Read it, line by line" },
        { id: "built-on", title: "Built on other work" },
      ]}
    >
      <header className="grid items-center gap-12 py-8 sm:py-12 xl:grid-cols-[1.1fr_1fr] xl:gap-10">
        <div>
          <p className="flex items-center gap-2.5 text-sm text-muted-foreground">
            License
            <span className="rounded-sm bg-white px-3 py-1 text-[12px] font-medium text-neutral-700 shadow-sm ring-1 shadow-black/10 ring-black/5 dark:bg-neutral-900 dark:text-neutral-300 dark:shadow-black/50 dark:ring-white/5">MIT</span>
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.04] tracking-tight text-foreground xl:text-[3.25rem]">
            Free to use.
            <br />
            Free to change.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-foreground/80">
            Veyl is open source under the MIT license. Use it in personal and commercial projects, and keep the copyright
            notice with the code.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <CopyLicenseButton className="rounded-lg border border-foreground bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0" />
            <a
              href={`${REPO}/blob/main/LICENSE`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-[transform,border-color] hover:-translate-y-0.5 hover:border-brand/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              View on GitHub
            </a>
          </div>
        </div>
        <LicensePaper />
      </header>

      <section id="can-i" className="mt-16 scroll-mt-24">
        <h2 className={heading}>Can I…?</h2>
        <p className="mt-2.5 max-w-lg leading-7 text-muted-foreground">Pick what you want to do. The answer is the same for everyone.</p>
        <LicenseChecker />
      </section>

      <section id="clauses" className="mt-20 scroll-mt-24">
        <h2 className={heading}>Read it, line by line</h2>
        <p className="mt-2.5 max-w-lg leading-7 text-muted-foreground">
          The whole license is four short paragraphs. Here is each one next to what it means.
        </p>
        <ol className="mt-8 border-t border-border">
          {CLAUSES.map((c, n) => (
            <li
              key={c.title}
              className="group relative grid gap-3.5 border-b border-border py-6 pl-[18px] transition-colors duration-300 before:absolute before:inset-y-6 before:left-0 before:w-[3px] before:rounded before:bg-border before:transition-colors before:duration-300 hover:before:bg-brand md:grid-cols-[1.25fr_1fr] md:gap-8 hover:bg-gradient-to-r hover:from-brand/[0.06] hover:to-transparent hover:to-70%"
            >
              <p className="whitespace-pre-line font-mono text-[12.5px] leading-[1.85] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                {c.text}
              </p>
              <div className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-ink">{n + 1}</span>
                <div>
                  <h3 className="mb-1 font-medium text-foreground">{c.title}</h3>
                  <p className="leading-7 text-muted-foreground">{c.note}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <CopyLicenseButton className="mt-5 inline-flex items-center gap-2 rounded-[10px] border border-border bg-surface px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          Copy the full text
        </CopyLicenseButton>
      </section>

      <section id="built-on" className="mt-20 scroll-mt-24">
        <h2 className={heading}>Built on other people&apos;s work</h2>
        <p className="mt-2.5 max-w-lg leading-7 text-muted-foreground">Each of these keeps its own license.</p>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {BUILT_ON.map((b, i) => (
            <li key={b.name}>
              <Rise i={i} className="min-w-0">
                <span className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-brand/55 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <b className="text-sm font-semibold text-foreground">{b.name}</b>
                  <i className="rounded-full bg-brand-soft px-2 py-0.5 text-[11.5px] font-medium not-italic text-brand-ink">{b.license}</i>
                </span>
              </Rise>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-muted-foreground">
        <span>Not sure if your use is fine?</span>
        <a
          href={`${REPO}/issues/new`}
          target="_blank"
          rel="noreferrer"
          className="border-b border-border font-medium text-foreground transition-colors hover:border-brand"
        >
          Open an issue and ask →
        </a>
      </div>

      <Pager href="/docs/license" />
    </DocsPage>
  );
}