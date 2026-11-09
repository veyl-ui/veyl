"use client";

import { type ElementType, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { DropNavbarCta, DropNavbarLink } from "./drop-navbar";
import { MenuLink } from "./nav-menu";

const rowClass =
  "rounded-xl px-4 py-3 text-base font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50";

/** The menu button and dropdown for small screens. Wide screens show the links inline instead. */
export function MobileMenu({
  links,
  cta,
  Anchor,
}: {
  links: DropNavbarLink[];
  cta?: DropNavbarCta;
  Anchor: ElementType;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (links.length === 0 && !cta) return null;

  return (
    <div className="ml-1 md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="grid size-10 place-items-center rounded-xl text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />}
        </svg>
      </button>

      {open ? (
        <nav
          aria-label="Mobile"
          className="absolute inset-x-0 top-full mt-2 rounded-3xl border border-neutral-200 bg-[var(--dn-bg)] p-3 dark:border-neutral-800"
        >
          <ul className="flex flex-col">
            {links.map((l) =>
              l.menu ? (
                <li key={l.label}>
                  <p className="px-4 pb-1 pt-3 text-xs font-medium text-neutral-400 dark:text-neutral-500">{l.label}</p>
                  <ul>
                    {l.menu.items.map((item) => (
                      <li key={item.label}>
                        <MenuLink
                          Anchor={Anchor}
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(rowClass, "flex items-center gap-3")}
                        >
                          {item.icon ? <span className="grid size-[1.125rem] place-items-center [&>svg]:size-[1.125rem]">{item.icon}</span> : null}
                          {item.label}
                          {item.badge ? (
                            <span className="rounded-md bg-[color-mix(in_srgb,var(--dn-accent)_14%,transparent)] px-1.5 py-px text-[0.6875rem] font-medium text-[var(--dn-accent)]">
                              {item.badge}
                            </span>
                          ) : null}
                        </MenuLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={l.label}>
                  <Anchor href={l.href} onClick={() => setOpen(false)} className={cn(rowClass, "block")}>
                    {l.label}
                  </Anchor>
                </li>
              ),
            )}
          </ul>
          {cta ? (
            <Anchor
              href={cta.href}
              onClick={() => setOpen(false)}
              className="mt-2 flex h-11 items-center justify-center rounded-xl bg-neutral-900 text-[0.95rem] font-semibold text-white transition-colors hover:bg-neutral-900/85 sm:hidden dark:bg-white dark:text-neutral-900 dark:hover:bg-white/85"
            >
              {cta.label}
            </Anchor>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}