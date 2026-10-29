"use client";

import { type CSSProperties, type ReactNode, useRef } from "react";
import { useFitLayout } from "./use-fit-layout";
import "./illuminated-hero.css";

/* The default text was tuned on a 1732 x 1304 canvas. Each default line carries the
   width it had in the design (data-w) so the default looks exactly like the original.
   Your own text skips this and simply keeps its natural width. */
const DEFAULT_HEADLINE = [
  "Introducing",
  "Illuminated Glow Text.",
  "Highlight the main focus text.",
] as const;
const HEADLINE_WIDTHS = [462, 904, 1205] as const;

const DEFAULT_DESCRIPTION: ReactNode[] = [
  "Experience a new way to draw attention to key elements",
  <>
    with stunning <b>illuminated text.</b> Perfect for making a bold
  </>,
  "statement, this dynamic design ensures your content",
  "stands out effortlessly.",
];
const DESCRIPTION_WIDTHS = [760, 780, 719, 309] as const;

export type IlluminatedHeroProps = {
  /** Three lines: a quiet intro, the glowing line, and a closing line. */
  headline?: readonly [string, string, string];
  /** Paragraph lines under the headline. Each entry is one line, and may contain <b>. */
  description?: readonly ReactNode[];
  /** Which heading element to render. Use "h1" only once per page. */
  headingLevel?: "h1" | "h2" | "h3";
  className?: string;
  style?: CSSProperties;
};

export function IlluminatedHero({
  headline,
  description,
  headingLevel = "h1",
  className,
  style,
}: IlluminatedHeroProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  const headlineLines = headline ?? DEFAULT_HEADLINE;
  const descriptionLines = description ?? DEFAULT_DESCRIPTION;
  const tunedHeadline = headline === undefined;
  const tunedDescription = description === undefined;

  // Redo the layout whenever the text changes.
  const contentKey = `${headlineLines.join("|")}#${descriptionLines.length}`;
  const ready = useFitLayout(frameRef, contentKey);

  const Heading = headingLevel;
  const glowLine = headlineLines[1];

  return (
    <section
      className={`vh-stage${className ? ` ${className}` : ""}`}
      style={style}
    >
      <div ref={frameRef} className={`vh-frame${ready ? " vh-ready" : ""}`}>
        <i className="vh-orb vh-orb-t" aria-hidden="true" />
        <i className="vh-orb vh-orb-b" aria-hidden="true" />

        <Heading className="vh-head">
          {headlineLines.map((text, i) => (
            <span
              key={i}
              className={`vh-ln vh-l${i + 1}`}
              data-w={tunedHeadline ? HEADLINE_WIDTHS[i] : undefined}
              data-ref={tunedHeadline && i === 2 ? "" : undefined}
            >
              <i className="vh-pb" />
              <span className="vh-tx" data-t={i === 1 ? glowLine : undefined}>
                {text}
              </span>
            </span>
          ))}
        </Heading>

        <p className="vh-sub">
          {descriptionLines.map((line, i) => (
            <span
              key={i}
              className="vh-ln"
              data-w={tunedDescription ? DESCRIPTION_WIDTHS[i] : undefined}
              data-ref={tunedDescription && i === 0 ? "" : undefined}
            >
              <i className="vh-pb" />
              <span className="vh-tx">{line}</span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}