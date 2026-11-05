"use client";

import type { ElementType, ReactNode, RefObject } from "react";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./mobile-menu";
import { useScrolled } from "./use-scrolled";

export type DropNavbarLink = { label: string; href: string };
export type DropNavbarCta = { label: string; href: string };

export type DropNavbarProps = {
  /** Your logo and name. Shown on the left. */
  logo: ReactNode;
  /** Where the logo links to. */
  logoHref?: string;
  /** Text links shown beside the logo. They move into a menu on small screens. */
  links?: DropNavbarLink[];
  /** Small things before the button: icon buttons, a theme toggle. A divider follows them. */
  actions?: ReactNode;
  /** The main button on the right. */
  cta?: DropNavbarCta;
  /** Your router's link, such as Next's Link. Plain <a> tags are used if you leave this out. */
  linkComponent?: ElementType;
  /** A scrolling element to watch instead of the page. Useful for demos inside a frame. */
  scrollContainer?: RefObject<HTMLElement | null>;
  /** How far to scroll, in pixels, before the bar turns into a floating pill. */
  scrolledAt?: number;
  className?: string;
};

/**
 * A tab that hangs from the top edge of the page. At the top its corners flare outward
 * (the "ears"). Once you scroll, the ears fold away, all four corners round off, and the
 * bar floats a little way down from the top as a pill. A soft shadow follows the shape.
 *
 * Colours: the bar is white, or near-black inside a `.dark` parent. To change it, set
 * --dn-bg on the component, for example className="[--dn-bg:#fff7ed]".
 */
const EAR = "1.5rem"; // size of the flare; also the side padding of the wrapper

/*
 * Motion: like a drop of water leaving a leaf. The ears pinch in first (the neck thins),
 * then the bar lets go, falls, overshoots a hair and settles.
 * Tailwind only sees class names written out in full, so the curves are spelled out below:
 *   settle = cubic-bezier(0.5,0,0.25,1.3), glide = cubic-bezier(0.22,1,0.36,1)
 */
const ear =
  "pointer-events-none absolute top-0 size-6 [transition:scale_650ms_cubic-bezier(0.22,1,0.36,1),opacity_450ms_ease] motion-reduce:[transition:none]";

const shadowAtTop =
  "drop-shadow(0 1px 1px rgb(0 0 0 / 0.04)) drop-shadow(0 8px 14px rgb(0 0 0 / 0.06))";
const shadowFloating =
  "drop-shadow(0 1px 2px rgb(0 0 0 / 0.06)) drop-shadow(0 12px 22px rgb(0 0 0 / 0.1))";

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50";

export function DropNavbar({
  logo,
  logoHref = "/",
  links = [],
  actions,
  cta,
  linkComponent,
  scrollContainer,
  scrolledAt = 32,
  className,
}: DropNavbarProps) {
  const scrolled = useScrolled(scrollContainer, scrolledAt);
  const Anchor = (linkComponent ?? "a") as ElementType;

  return (
    <header
      className={cn(
        "pointer-events-none sticky top-0 z-50 flex justify-center px-6 [--dn-bg:#ffffff] dark:[--dn-bg:#171717]",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-auto relative w-full [transition:translate_900ms_cubic-bezier(0.5,0,0.25,1.3),max-width_900ms_cubic-bezier(0.22,1,0.36,1),filter_800ms_ease] motion-reduce:[transition:none]",
          scrolled ? "max-w-[50rem] translate-y-3" : "max-w-[56rem] translate-y-0",
        )}
        style={{ filter: scrolled ? shadowFloating : shadowAtTop }}
      >
        {/* The ears: the bar's colour fills the corner, with a quarter circle cut out of it. */}
        <span
          aria-hidden="true"
          className={cn(ear, "right-full origin-top-right", scrolled && "scale-0 opacity-0")}
          style={{ backgroundImage: `radial-gradient(circle at 0 100%, transparent ${EAR}, var(--dn-bg) calc(${EAR} + 0.5px))` }}
        />
        <span
          aria-hidden="true"
          className={cn(ear, "left-full origin-top-left", scrolled && "scale-0 opacity-0")}
          style={{ backgroundImage: `radial-gradient(circle at 100% 100%, transparent ${EAR}, var(--dn-bg) calc(${EAR} + 0.5px))` }}
        />

        <div
          className={cn(
            "flex h-[3.5rem] items-center gap-2 rounded-b-[1.75rem] bg-[var(--dn-bg)] pl-5 pr-3.5 text-neutral-900 [transition:border-radius_850ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:[transition:none] sm:pl-6 dark:text-neutral-50",
            scrolled ? "rounded-t-[1.75rem]" : "rounded-t-none",
          )}
        >
          <Anchor href={logoHref} className="flex items-center gap-3 rounded-xl">
            {logo}
          </Anchor>

          {links.length > 0 ? (
            <nav aria-label="Main" className="ml-8 hidden items-center gap-1 md:flex">
              {links.map((l) => (
                <Anchor key={l.label} href={l.href} className={linkClass}>
                  {l.label}
                </Anchor>
              ))}
            </nav>
          ) : null}

          <div className="ml-auto flex items-center">
            {actions}

            {cta ? (
              <>
                {actions ? (
                  <span aria-hidden="true" className="mx-3 hidden h-6 w-px bg-neutral-200 sm:block dark:bg-neutral-800" />
                ) : null}
                <Anchor
                  href={cta.href}
                  className="group hidden h-9 items-center gap-2 rounded-md bg-neutral-900 px-5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-neutral-900/85 sm:inline-flex dark:bg-white dark:text-neutral-900 dark:hover:bg-white/85"
                >
                  {cta.label}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-reduce:transition-none"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Anchor>
              </>
            ) : null}

            <MobileMenu links={links} cta={cta} Anchor={Anchor} />
          </div>
        </div>
      </div>
    </header>
  );
}
