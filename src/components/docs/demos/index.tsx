import type { ReactNode } from "react";
import { BentoDemo } from "./bento-demo";
import { DropNavbarDemo } from "./drop-navbar-demo";
import { FlipWordsDemo } from "./flip-words-demo";
import { HeroDemo } from "./hero-demo";
import { BeamAboutDemo } from "./beam-about-demo";
import { FaqDemo } from "./faq-demo";
import { GlassCtaDemo } from "./glass-cta-demo";

/** One live demo per component slug. A new component needs an entry here. */
export const demos: Record<string, ReactNode> = {
  "illuminated-hero": <HeroDemo />,
  "flip-words": <FlipWordsDemo />,
  "bento-grid": <BentoDemo />,
  "drop-navbar": <DropNavbarDemo />,
  "beam-about": <BeamAboutDemo />,
  faq: <FaqDemo />,
  "glass-cta": <GlassCtaDemo />,
};
