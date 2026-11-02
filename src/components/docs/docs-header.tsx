import Link from "next/link";
import { VeylMark } from "@/components/brand/veyl-mark";
import { componentDocs } from "@/lib/docs/components";
import { GithubIcon } from "./icons";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

const linkClass =
  "rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function DocsHeader() {
  const firstComponent = componentDocs[0];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[88rem] items-center gap-4 px-4 md:px-6">
        <MobileNav />

        <Link
          href="/docs"
          className="flex items-center gap-2 rounded-md font-semibold tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <VeylMark animate={false} className="h-6 w-6" />
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
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <GithubIcon />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
