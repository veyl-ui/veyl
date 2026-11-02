import Link from "next/link";
import type { ReactNode } from "react";
import { getNeighbours } from "@/lib/docs/nav";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

/* Small building blocks so every docs page reads the same way. */

export function PageTitle({ title, description }: { title: string; description: string }) {
  return (
    <header>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
        {description}
      </p>
    </header>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-14 scroll-mt-24">
      <h2 className="border-b border-border pb-2 text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="leading-7 text-muted-foreground">{children}</p>;
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
      {children}
    </code>
  );
}

/** A numbered list of steps. Use it only when the order matters. */
export function Steps({ children }: { children: ReactNode }) {
  return <ol className="space-y-8">{children}</ol>;
}

export function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="grid grid-cols-[1.75rem_1fr] gap-x-4">
      <span
        aria-hidden="true"
        className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-ink"
      >
        {number}
      </span>
      <div className="min-w-0 space-y-3">
        <h3 className="pt-0.5 font-medium text-foreground">{title}</h3>
        {children}
      </div>
    </li>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-surface px-4 py-3 text-sm leading-6 text-muted-foreground">
      {children}
    </div>
  );
}

export function SimpleTable({
  head,
  rows,
}: {
  head: [string, string];
  rows: [ReactNode, ReactNode][];
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead className="border-b border-border bg-surface text-muted-foreground">
          <tr>
            <th className="w-40 px-4 py-2.5 font-medium">{head[0]}</th>
            <th className="px-4 py-2.5 font-medium">{head[1]}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map(([a, b], i) => (
            <tr key={i} className="align-top">
              <td className="px-4 py-3 font-medium text-foreground">{a}</td>
              <td className="px-4 py-3 text-muted-foreground">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A docs page with an "On this page" list on wide screens. */
export function DocsPage({
  children,
  toc,
}: {
  children: ReactNode;
  toc: { id: string; title: string }[];
}) {
  return (
    <div className="flex gap-12">
      <article className="min-w-0 max-w-4xl flex-1">{children}</article>
      {toc.length > 0 ? (
        <aside className="hidden w-48 shrink-0 2xl:block">
          <nav aria-label="On this page" className="sticky top-24 text-sm">
            <p className="mb-3 font-medium text-foreground">On this page</p>
            <ul className="space-y-2 border-l border-border">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="-ml-px block border-l border-transparent pl-4 text-muted-foreground transition-colors hover:border-brand hover:text-foreground"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      ) : null}
    </div>
  );
}

/** Previous and next page links. */
export function Pager({ href }: { href: string }) {
  const { prev, next } = getNeighbours(href);
  const card =
    "group flex flex-1 flex-col gap-1 rounded-md border border-border px-4 py-3 text-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <nav aria-label="Pagination" className="mt-16 flex gap-3 border-t border-border pt-8">
      {prev ? (
        <Link href={prev.href} className={card}>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <ArrowLeftIcon width={14} height={14} /> Previous
          </span>
          <span className="font-medium text-foreground">{prev.title}</span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
      {next ? (
        <Link href={next.href} className={`${card} items-end text-right`}>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            Next <ArrowRightIcon width={14} height={14} />
          </span>
          <span className="font-medium text-foreground">{next.title}</span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}
