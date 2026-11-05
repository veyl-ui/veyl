import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-[background-color,color,border-color,box-shadow] duration-300 ease-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const variants = {
  primary:
    "bg-foreground text-background shadow-[0_1px_2px_rgb(0_0_0/0.2),0_8px_14px_-6px_rgb(0_0_0/0.35)] hover:bg-foreground/85 hover:shadow-[0_1px_2px_rgb(0_0_0/0.2),0_10px_18px_-6px_rgb(0_0_0/0.4)]",
  secondary:
    "border border-border bg-background text-foreground shadow-[0_1px_2px_rgb(0_0_0/0.06),0_6px_12px_-6px_rgb(0_0_0/0.16)] hover:bg-accent hover:shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_14px_-6px_rgb(0_0_0/0.2)]",
  // For the always-dark hero stage.
  onDark: "bg-white text-neutral-950 shadow-[0_8px_14px_-6px_rgb(0_0_0/0.4)] hover:bg-white/85",
  onDarkGhost: "border border-white/25 text-white hover:bg-white/10",
  // For the always-bright sky hero.
  onSky: "bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800",
  onSkyGhost:
    "border border-slate-950/15 bg-white/60 text-slate-950 backdrop-blur-sm hover:bg-white/90",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
} as const;

/** A pill-shaped link that looks like a button. Handles inside and outside links. */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}