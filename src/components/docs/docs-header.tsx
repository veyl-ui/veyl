import Link from "next/link";
import { componentDocs } from "@/lib/docs/components";
import { GithubIcon } from "./icons";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

const linkClass =
  "rounded-md px-2.5 py-1.5 text-neutral-500 transition-colors hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 dark:focus-visible:outline-neutral-100";

export function DocsHeader() {
  const firstComponent = componentDocs[0];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/85 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
      <div className="mx-auto flex h-14 w-full max-w-[88rem] items-center gap-4 px-4 md:px-6">
        <MobileNav />

        <Link
          href="/docs"
          className="flex items-center gap-2 rounded-md font-semibold tracking-tight text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-100 dark:focus-visible:outline-neutral-100"
        >
          <span
            aria-hidden="true"
            className="grid h-6 w-6 place-items-center rounded-md bg-neutral-900 text-xs font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            v
          </span>
          Veyl
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 text-sm md:flex">
          <Link href="/docs" className={linkClass}>
            Docs
          </Link>
          {firstComponent ? (
            <Link href={`/docs/components/${firstComponent.slug}`} className={linkClass}>
              Components
            </Link>
          ) : null}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <a
            href="https://github.com/veyl-ui/veyl"
            target="_blank"
            rel="noreferrer"
            aria-label="Veyl on GitHub"
            className="grid h-9 w-9 place-items-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100 dark:focus-visible:outline-neutral-100"
          >
            <GithubIcon />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
