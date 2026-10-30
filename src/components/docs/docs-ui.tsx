import Link from "next/link";
import type { ReactNode } from "react";
import { getNeighbours } from "@/lib/docs/nav";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

/* Small building blocks so every docs page reads the same way. */

export function PageTitle({ title, description }: { title: string; description: string }) {
  return (
    <header>
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl dark:text-neutral-50">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-400">
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
      <h2 className="border-b border-neutral-200 pb-2 text-xl font-semibold tracking-tight text-neutral-900 dark:border-neutral-800 dark:text-neutral-50">
        {title}
      </h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="leading-7 text-neutral-600 dark:text-neutral-400">{children}</p>;
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.85em] text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
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
        className="mt-0.5 grid h-7 w-7 place-items-center rounded-full border border-neutral-200 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
      >
        {number}
      </span>
      <div className="min-w-0 space-y-3">
        <h3 className="pt-0.5 font-medium text-neutral-900 dark:text-neutral-100">{title}</h3>
        {children}
      </div>
    </li>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm leading-6 text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
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
    <div className="overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
          <tr>
            <th className="w-40 px-4 py-2.5 font-medium">{head[0]}</th>
            <th className="px-4 py-2.5 font-medium">{head[1]}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {rows.map(([a, b], i) => (
            <tr key={i} className="align-top">
              <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{a}</td>
              <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">{b}</td>
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
            <p className="mb-3 font-medium text-neutral-900 dark:text-neutral-100">On this page</p>
            <ul className="space-y-2 border-l border-neutral-200 dark:border-neutral-800">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="-ml-px block border-l border-transparent pl-4 text-neutral-500 transition-colors hover:border-neutral-900 hover:text-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-100 dark:hover:text-neutral-100"
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
    "group flex flex-1 flex-col gap-1 rounded-md border border-neutral-200 px-4 py-3 text-sm transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-900/60 dark:focus-visible:outline-neutral-100";

  return (
    <nav aria-label="Pagination" className="mt-16 flex gap-3 border-t border-neutral-200 pt-8 dark:border-neutral-800">
      {prev ? (
        <Link href={prev.href} className={card}>
          <span className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            <ArrowLeftIcon width={14} height={14} /> Previous
          </span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{prev.title}</span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
      {next ? (
        <Link href={next.href} className={`${card} items-end text-right`}>
          <span className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
            Next <ArrowRightIcon width={14} height={14} />
          </span>
          <span className="font-medium text-neutral-900 dark:text-neutral-100">{next.title}</span>
        </Link>
      ) : (
        <span className="flex-1" />
      )}
    </nav>
  );
}
