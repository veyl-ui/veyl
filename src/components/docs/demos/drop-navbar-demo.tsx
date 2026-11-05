"use client";

import { useRef } from "react";
import { VeylMark } from "@/components/brand/veyl-mark";
import { GithubIcon } from "../icons";
import { DropNavbar } from "@/registry/veyl/drop-navbar";

const links = [
  { label: "Features", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Docs", href: "#" },
];

/** The demo scrolls inside its own frame, so the navbar can be watched without leaving the page. */
export function DropNavbarDemo() {
  const scroller = useRef<HTMLDivElement>(null);

  return (
    <div ref={scroller} className="h-full overflow-y-auto bg-neutral-50 dark:bg-neutral-950">
      <DropNavbar
        scrollContainer={scroller}
        logo={
          <>
            <VeylMark animate={false} className="size-9" />
            <span className="text-lg font-bold tracking-tight">Acme</span>
          </>
        }
        links={links}
        actions={
          <a
            href="#"
            aria-label="GitHub"
            className="grid size-9 place-items-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
          >
            <GithubIcon />
          </a>
        }
        cta={{ label: "Get started", href: "#" }}
      />

      <div className="mx-auto max-w-3xl space-y-4 px-6 pb-24 pt-10">
        <p className="text-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Scroll this frame to see the navbar drop.
        </p>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-neutral-200/70 dark:bg-neutral-800/60" />
        ))}
      </div>
    </div>
  );
}
