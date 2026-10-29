import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* BentoGrid                                                           */
/* ------------------------------------------------------------------ */

export type BentoGridProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A five-column, two-row grid that fills whatever box you put it in.
 * Give each card a span with `className`, e.g. "md:col-span-3".
 * On small screens it becomes one column.
 */
export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 auto-rows-[16rem] gap-2 md:grid-cols-5 md:grid-rows-2 md:auto-rows-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* BentoCard                                                           */
/* ------------------------------------------------------------------ */

export type BentoCardImage = {
  /** Image URL. Remote hosts must be allowed in next.config.ts. */
  src: string;
  /** Leave empty when the photo is purely decorative. */
  alt?: string;
};

export type BentoCardProps = {
  title: string;
  description?: string;
  /** The photo that fills the card. */
  image: BentoCardImage;
  /** Where the text sits. The content fills the rest of the card. */
  align?: "top" | "bottom";
  /** Panels and animated content that sit on top of the photo. */
  children?: ReactNode;
  /** Use this for grid placement, e.g. "md:col-span-3". */
  className?: string;
};

export function BentoCard({
  title,
  description,
  image,
  align = "top",
  children,
  className,
}: BentoCardProps) {
  return (
    <article
      className={cn(
        // The font comes from --font-manrope (set it with next/font) and falls back gracefully.
        "relative isolate overflow-hidden rounded-md bg-neutral-900 text-white [font-family:var(--font-manrope),ui-sans-serif,system-ui,sans-serif]",
        className,
      )}
    >
      <Image
        src={image.src}
        alt={image.alt ?? ""}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />

      {/* Keeps the text readable whatever the photo looks like */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0",
          align === "top"
            ? "bg-gradient-to-b from-black/70 via-black/20 to-transparent"
            : "bg-gradient-to-t from-black/70 via-black/20 to-transparent",
        )}
      />

      <div
        className={cn(
          "relative z-10 flex h-full flex-col gap-1 p-5",
          align === "bottom" && "flex-col-reverse",
        )}
      >
        <div>
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          {description ? (
            <p className="mt-1 max-w-[26ch] text-xs leading-relaxed text-white/90">
              {description}
            </p>
          ) : null}
        </div>
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
    </article>
  );
}