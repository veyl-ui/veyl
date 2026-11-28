import type { ReactNode } from "react";
import { BentoDemo } from "./bento-demo";
import { DropNavbarDemo } from "./drop-navbar-demo";
import { FlipWordsDemo } from "./flip-words-demo";
import { HeroDemo } from "./hero-demo";
import { BeamAboutDemo } from "./beam-about-demo";
import { FaqDemo } from "./faq-demo";
import { GlassCtaDemo } from "./glass-cta-demo";
import { SpotlightFooterDemo } from "./spotlight-footer-demo";
import { IsometricCardsDemo } from "./isometric-cards-demo";
import { TestimonialBentoDemo } from "./testimonial-bento-demo";
import { WorkflowCanvasDemo } from "./workflow-canvas-demo";
import { PricingSectionDemo } from "./pricing-section-demo";
import { FeaturesSectionDemo } from "./features-section-demo";
import { TeamSectionDemo } from "./team-section-demo";
import { LogoCloudDemo } from "./logo-cloud-demo";
import { LoginPageDemo } from "./login-page-demo";

/** One live demo per component slug. A new component needs an entry here. */
export const demos: Record<string, ReactNode> = {
  "illuminated-hero": <HeroDemo />,
  "flip-words": <FlipWordsDemo />,
  "bento-grid": <BentoDemo />,
  "drop-navbar": <DropNavbarDemo />,
  "beam-about": <BeamAboutDemo />,
  faq: <FaqDemo />,
  "glass-cta": <GlassCtaDemo />,
  "spotlight-footer": <SpotlightFooterDemo />,
  "isometric-cards": <IsometricCardsDemo />,
  "testimonial-bento": <TestimonialBentoDemo />,
  "workflow-canvas": <WorkflowCanvasDemo />,
  "pricing-section": <PricingSectionDemo />,
  "features-section": <FeaturesSectionDemo />,
  "team-section": <TeamSectionDemo />,
  "logo-cloud": <LogoCloudDemo />,
  "login-page": <LoginPageDemo />,
};
