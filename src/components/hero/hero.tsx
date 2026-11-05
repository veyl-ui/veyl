import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRightIcon } from "@/components/docs/icons";
import { ButtonLink } from "@/components/shared/button-link";
import "./hero.css";
import { FlipLine } from "./flip-line";
import { HeroOrbits } from "./hero-orbits";
import { InstallStack } from "./install-stack";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const stack = ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Motion"];

/**
 * The landing hero: a headline in the middle of slowly turning rings, a stack of
 * "added to your project" cards under it, and the tools Veyl is built for along the bottom.
 * It follows the site theme, so it works in light and dark mode.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-border">
      <div className="mx-auto w-full max-w-page px-4 pb-16 pt-16 text-center sm:px-6 sm:pt-20">
        <div className="relative">
          <HeroOrbits />

          <div className="relative z-10">
            <Link
              href="/docs/components/drop-navbar"
              style={delay(0)}
              className="hero-rise group inline-flex items-center gap-2 rounded-full border border-border bg-card/80 py-1 pl-1 pr-3 text-sm font-medium shadow-sm backdrop-blur transition-colors hover:bg-accent"
            >
              <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-bold text-brand-ink">New</span>
              Drop Navbar is here
              <ArrowRightIcon className="text-muted-foreground transition-transform duration-300 ease-soft group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </Link>

            <h1
              id="hero-title"
              className="mt-6 text-[clamp(2.1rem,5.6vw,4.6rem)] font-bold leading-[1.04] tracking-tight"
            >
              <span className="hero-rise block" style={delay(100)}>
                Animated components
              </span>
              <span className="hero-rise block" style={delay(220)}>
                <FlipLine />
              </span>
            </h1>

            <p
              className="hero-rise mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground"
              style={delay(360)}
            >
              <span className="sm:block">Copy-paste React components for Next.js and Tailwind.</span>{" "}
              <span className="sm:block">Make them yours, then ship.</span>
            </p>

            <div className="hero-rise mt-8 flex flex-wrap items-center justify-center gap-3" style={delay(480)}>
              <ButtonLink href="/docs/components/drop-navbar" className="group">
                Browse components
                <ArrowRightIcon className="transition-transform duration-300 ease-soft group-hover:translate-x-1 motion-reduce:transition-none" />
              </ButtonLink>
              <ButtonLink href="/docs/installation" variant="secondary">
                Get started
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="hero-rise relative z-10" style={delay(640)}>
          <InstallStack />
        </div>

        <div className="hero-rise relative z-10 mt-16" style={delay(780)}>
          <p className="text-sm text-muted-foreground">Made for the stack you already use</p>
          <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-lg font-semibold tracking-tight text-muted-foreground/70">
            {stack.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}