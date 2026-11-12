/* The colour variables of every Veyl component, written out for the Theming page. Keep this in step with each component's CSS file. */

export type ThemeVar = { name: string; controls: string; light: string; dark: string };
export type ThemeTable = {
  slug: string;
  title: string;
  /** How to reach the component in CSS. */
  root: string;
  note?: string;
  vars: ThemeVar[];
};

export const themeTables: ThemeTable[] = [
  {
    slug: "faq",
    title: "FAQ",
    root: ".fq-root",
    vars: [
      { name: "--fq-accent", controls: "The ring around an open question, the bar before each category", light: "#f59e0b", dark: "#f59e0b" },
      { name: "--fq-accent-ink", controls: "The shimmering eyebrow, the number and the icon of an open question", light: "#b45309", dark: "#fbbf24" },
      { name: "--fq-card", controls: "The background of each question", light: "#ffffff", dark: "#171717" },
      { name: "--fq-border", controls: "The outline of each question", light: "rgb(0 0 0 / 0.1)", dark: "rgb(255 255 255 / 0.12)" },
      { name: "--fq-border-hover", controls: "The outline while you hover", light: "rgb(0 0 0 / 0.25)", dark: "rgb(255 255 255 / 0.28)" },
      { name: "--fq-ink", controls: "The question text", light: "#171717", dark: "#fafafa" },
      { name: "--fq-muted", controls: "Answers, numbers and the plus icon", light: "#737373", dark: "#a3a3a3" },
    ],
  },
  {
    slug: "glass-cta",
    title: "Glass CTA",
    root: ".gc-root",
    vars: [
      { name: "--gc-accent", controls: "The cube, its glow and orbit, the icons on its faces, and the soft light behind the panel", light: "#f59e0b", dark: "#f59e0b" },
      { name: "--gc-ink", controls: "The title and the secondary button text", light: "#171717", dark: "#fafafa" },
      { name: "--gc-muted", controls: "The description and the hint under the cube", light: "#6b6b66", dark: "#a3a3a3" },
      { name: "--gc-accent-ink", controls: "The shimmering eyebrow", light: "#b45309", dark: "#fbbf24" },
      { name: "--gc-button", controls: "The main button's background", light: "#171717", dark: "#fafafa" },
      { name: "--gc-button-ink", controls: "The main button's text", light: "#ffffff", dark: "#171717" },
    ],
  },
  {
    slug: "spotlight-footer",
    title: "Spotlight Footer",
    root: ".sf-root",
    vars: [
      { name: "--sf-bg", controls: "The footer background", light: "transparent", dark: "transparent" },
      { name: "--sf-ink", controls: "Column titles and the main text", light: "#171717", dark: "#fafafa" },
      { name: "--sf-muted", controls: "Links, the tagline and the copyright", light: "#6b6b66", dark: "#a3a3a3" },
      { name: "--sf-line", controls: "Dividers and the social icon outlines", light: "rgb(0 0 0 / 0.1)", dark: "rgb(255 255 255 / 0.12)" },
      { name: "--sf-word", controls: "The big wordmark before the light reaches it", light: "rgb(0 0 0 / 0.1)", dark: "rgb(255 255 255 / 0.12)" },
      { name: "--sf-accent", controls: "The top line and the spotlight on the wordmark", light: "#f59e0b", dark: "#f59e0b" },
      { name: "--sf-accent-ink", controls: "Link hover colour", light: "#b45309", dark: "#fbbf24" },
    ],
  },
  {
    slug: "beam-about",
    title: "Beam About",
    root: ".ba-root",
    vars: [
      { name: "--ba-accent", controls: "The beam, the active number and the progress bar", light: "#2563eb", dark: "#60a5fa" },
      { name: "--ba-card", controls: "The card background", light: "#ffffff", dark: "#262626" },
      { name: "--ba-stage", controls: "The background of the visual area", light: "#f4f4f4", dark: "#1a1a1a" },
      { name: "--ba-border", controls: "The outline of the visual area", light: "rgb(0 0 0 / 0.1)", dark: "rgb(255 255 255 / 0.12)" },
      { name: "--ba-line", controls: "The progress track and dividers", light: "rgb(0 0 0 / 0.12)", dark: "rgb(255 255 255 / 0.16)" },
      { name: "--ba-muted", controls: "Inactive numbers", light: "#a3a3a3", dark: "#737373" },
      { name: "--ba-ink", controls: "Text", light: "#171717", dark: "#fafafa" },
      { name: "--ba-stage-h", controls: "The height of the visual area", light: "12.5rem", dark: "12.5rem" },
    ],
  },
  {
    slug: "drop-navbar",
    title: "Drop Navbar",
    root: "the component's className",
    note: "The navbar has no class of its own, so set these on its className, for example className=\"[--dn-accent:#e11d48]\".",
    vars: [
      { name: "--dn-bg", controls: "The bar and the dropdown panel", light: "#ffffff", dark: "#171717" },
      { name: "--dn-accent", controls: "The highlighted icon and the badge in the dropdown", light: "#d97706", dark: "#fbbf24" },
    ],
  },
  {
    slug: "illuminated-hero",
    title: "Illuminated Hero",
    root: "the component's className",
    note: "The glow around the headline uses three colours, from the hot centre to the soft edge. Pass className=\"my-hero\" and write .vh-stage.my-hero { --g-core: ...; } in your global CSS.",
    vars: [
      { name: "--g-core", controls: "The hot centre of the glow", light: "rgb(255 214 160)", dark: "rgb(255 214 160)" },
      { name: "--g-mid", controls: "The middle of the glow", light: "rgb(255 168 100)", dark: "rgb(255 168 100)" },
      { name: "--g-far", controls: "The soft outer edge of the glow", light: "rgb(255 145 78)", dark: "rgb(255 145 78)" },
    ],
  },
];