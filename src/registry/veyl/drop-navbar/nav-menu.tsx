"use client";

import { type ComponentProps, type ElementType, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { DropNavbarMenu } from "./drop-navbar";

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** A link that uses your router for pages on your site, and a plain new-tab link for web addresses. */
export function MenuLink({
  Anchor,
  href,
  ...props
}: { Anchor: ElementType; href: string } & Omit<ComponentProps<"a">, "href">) {
  if (isExternal(href)) return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
  return <Anchor href={href} {...props} />;
}

const ROW = 2.75; // rem. Every row is this tall, which is how the highlight knows where to slide.

/**
 * A nav item that opens a panel. Hover (mouse), tap or Enter opens it. Escape, a click
 * outside, or tabbing away closes it. When items have a preview, the right side swaps as
 * you move over the list, and one highlight glides to the row you are on.
 */
export function NavMenu({
  label,
  menu,
  Anchor,
  triggerClass,
}: {
  label: string;
  menu: DropNavbarMenu;
  Anchor: ElementType;
  triggerClass: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pointer = useRef("keyboard");
  const timer = useRef(0);
  const id = useId();
  const hasPreview = menu.items.some((item) => item.preview);

  const openMenu = () => {
    window.clearTimeout(timer.current);
    if (!open) setActive(0);
    setOpen(true);
  };
  // A short delay lets the pointer cross from the label to the panel without it closing.
  const closeSoon = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 140);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="relative flex items-center self-stretch"
      onPointerEnter={(e) => e.pointerType === "mouse" && openMenu()}
      onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
      onBlur={(e) => {
        if (e.relatedTarget && !root.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onPointerDown={(e) => {
          pointer.current = e.pointerType;
        }}
        onClick={() => {
          // A mouse click keeps the menu open (hover already opened it). Touch and keyboard toggle.
          if (pointer.current === "mouse") openMenu();
          else setOpen((o) => !o);
          pointer.current = "keyboard";
        }}
        className={cn(
          triggerClass,
          "inline-flex items-center gap-1.5",
          open && "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50",
        )}
      >
        {label}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={cn("transition-transform duration-300 motion-reduce:transition-none", open && "rotate-180")}
        >
          <path d="M3 5l4 4 4-4" />
        </svg>
      </button>

      {/* The top padding is an invisible bridge, so the pointer never leaves the menu on its way down. */}
      <div
        id={id}
        inert={!open}
        className={cn(
          "absolute left-0 top-full z-10 origin-top-left pt-2 transition-[opacity,translate,scale,visibility] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible translate-y-1 scale-[0.98] opacity-0",
        )}
      >
        <div
          className={cn(
            "max-w-[calc(100vw-3rem)] rounded-2xl border border-neutral-200 bg-[var(--dn-bg)] p-2 dark:border-neutral-800",
            hasPreview ? "w-[34rem]" : "w-64",
          )}
        >
          <div className={cn("grid gap-2", hasPreview ? "grid-cols-[13.5rem_minmax(0,1fr)]" : "grid-cols-1")}>
            <ul className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-11 rounded-xl border border-neutral-200 bg-neutral-50 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:border-neutral-800 dark:bg-neutral-800/60"
                style={{ transform: `translateY(${active * ROW}rem)` }}
              />
              {menu.items.map((item, i) => (
                <li key={item.label}>
                  <MenuLink
                    Anchor={Anchor}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="relative flex h-11 items-center gap-2.5 rounded-xl px-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200"
                  >
                    {item.icon ? (
                      <span
                        className={cn(
                          "grid size-[1.125rem] place-items-center text-neutral-500 transition-colors duration-200 dark:text-neutral-400 [&>svg]:size-[1.125rem]",
                          active === i && "text-[var(--dn-accent)] dark:text-[var(--dn-accent)]",
                        )}
                      >
                        {item.icon}
                      </span>
                    ) : null}
                    {item.label}
                    {item.badge ? (
                      <span className="rounded-md bg-[color-mix(in_srgb,var(--dn-accent)_14%,transparent)] px-1.5 py-px text-[0.6875rem] font-medium text-[var(--dn-accent)]">
                        {item.badge}
                      </span>
                    ) : null}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className={cn(
                        "ml-auto text-neutral-400 transition-[opacity,translate] duration-200 motion-reduce:transition-none",
                        active === i ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0",
                      )}
                    >
                      <path d="M3 7h8M8 4l3 3-3 3" />
                    </svg>
                  </MenuLink>
                </li>
              ))}
            </ul>

            {hasPreview ? (
              <div className="grid rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/50">
                {menu.items.map((item, i) => (
                  <div
                    key={item.label}
                    aria-hidden={active !== i}
                    className={cn(
                      "[grid-area:1/1] transition-[opacity,translate] duration-300 motion-reduce:transition-none",
                      active === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0",
                    )}
                  >
                    {item.preview}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {menu.footer?.length ? (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-neutral-200 px-2.5 pb-1 pt-2.5 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              {menu.footerLabel ? (
                <span className="text-neutral-400 dark:text-neutral-500">{menu.footerLabel}</span>
              ) : null}
              {menu.footer.map((f) => (
                <MenuLink
                  key={f.label}
                  Anchor={Anchor}
                  href={f.href}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-neutral-900 dark:hover:text-neutral-50 [&>svg]:size-3.5"
                >
                  {f.icon}
                  {f.label}
                </MenuLink>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}