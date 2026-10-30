import type { ReactNode } from "react";
import { BentoDemo } from "./bento-demo";
import { FlipWordsDemo } from "./flip-words-demo";
import { HeroDemo } from "./hero-demo";

/** One live demo per component slug. A new component needs an entry here. */
export const demos: Record<string, ReactNode> = {
  "illuminated-hero": <HeroDemo />,
  "flip-words": <FlipWordsDemo />,
  "bento-grid": <BentoDemo />,
};
