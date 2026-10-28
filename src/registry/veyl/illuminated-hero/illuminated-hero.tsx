"use client";

import { useRef } from "react";
import { useFitLayout } from "./use-fit-layout";
import "./illuminated-hero.css";

/* Every line carries its design-width (data-w) and baseline (data-base), both in
   pixels of the original 1732 x 1304 design. useFitLayout reads them. */
export type IlluminatedHeroProps = {
  /** Colour theme of the glow. */
  className?: string;
};

export function IlluminatedHero({ className }: IlluminatedHeroProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const ready = useFitLayout(frameRef);

  return (
    <main className={`vh-stage${className ? " " + className : ""}`}>
      <div ref={frameRef} className={`vh-frame${ready ? " vh-ready" : ""}`}>
        <i className="vh-orb vh-orb-t" aria-hidden="true" />
        <i className="vh-orb vh-orb-b" aria-hidden="true" />

        <h1 className="vh-head">
          <span className="vh-ln vh-l1" data-w="462" data-base="596">
            <i className="vh-pb" />
            <span className="vh-tx">Introducing</span>
          </span>
          <span className="vh-ln vh-l2" data-w="904" data-base="682">
            <i className="vh-pb" />
            <span className="vh-tx" data-t="Illuminated Glow Text.">Illuminated Glow Text.</span>
          </span>
          <span className="vh-ln vh-l3" data-w="1205" data-base="768">
            <i className="vh-pb" />
            <span className="vh-tx">Highlight the main focus text.</span>
          </span>
        </h1>

        <p className="vh-sub">
          <span className="vh-ln" data-w="760" data-base="940">
            <i className="vh-pb" />
            <span className="vh-tx">Experience a new way to draw attention to key elements</span>
          </span>
          <span className="vh-ln" data-w="780" data-base="982.3">
            <i className="vh-pb" />
            <span className="vh-tx">
              with stunning <b>illuminated text.</b> Perfect for making a bold
            </span>
          </span>
          <span className="vh-ln" data-w="719" data-base="1024.6">
            <i className="vh-pb" />
            <span className="vh-tx">statement, this dynamic design ensures your content</span>
          </span>
          <span className="vh-ln" data-w="309" data-base="1067">
            <i className="vh-pb" />
            <span className="vh-tx">stands out effortlessly.</span>
          </span>
        </p>
      </div>
    </main>
  );
}