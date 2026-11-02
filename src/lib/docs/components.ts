/**
 * The docs for every Veyl component live here, as typed data.
 * To document a new component: add an entry below, add a demo in
 * src/components/docs/demos/index.tsx, and the site does the rest
 * (sidebar, page, source code, props table, previous/next links).
 *
 * Source code on each page is read from the real files in src/registry/veyl/<slug>/
 * at build time, so the code you see on the page is always the code that ships.
 */

export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export type PropGroup = { title: string; rows: PropRow[] };

export type SetupStep = {
  title: string;
  description?: string;
  lang: "tsx" | "ts" | "css" | "bash";
  code: string;
};

export type ComponentDoc = {
  slug: string;
  title: string;
  /** One sentence. Shown on the index and under the page title. */
  description: string;
  kind: "Block" | "Component";
  /** Height of the preview frame, in pixels. */
  previewHeight: number;
  /** Centre the demo in the frame (for small things like a headline). */
  centered: boolean;
  /** Files inside src/registry/veyl/<slug>/ shown on the Code tab. */
  files: string[];
  /** npm packages the component needs. */
  dependencies: string[];
  setup: SetupStep[];
  usage: string;
  props: PropGroup[];
  requirements: { need: string; detail: string }[];
  notes: string[];
};

export const componentDocs: ComponentDoc[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "illuminated-hero",
    title: "Illuminated Hero",
    description:
      "A dark hero section with two glowing circles and a headline whose middle line glows, with a band of light flowing through it.",
    kind: "Block",
    previewHeight: 460,
    centered: false,
    files: [
      "illuminated-hero.tsx",
      "illuminated-hero.css",
      "use-fit-layout.ts",
      "index.ts",
    ],
    dependencies: [],
    setup: [
      {
        title: "Load the font",
        description:
          "The hero is designed for Instrument Sans. Load it with next/font and hand it over through the --vh-font variable. Without it, the hero falls back to your system font.",
        lang: "tsx",
        code: `import { Instrument_Sans } from "next/font/google";

const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--vh-font",
  display: "swap",
});

// Put sans.variable on any parent of the hero:
// <div className={\`\${sans.variable} h-svh\`}> ... </div>`,
      },
    ],
    usage: `import { IlluminatedHero } from "@/components/veyl/illuminated-hero";

export default function Page() {
  return (
    <div className="h-svh">
      <IlluminatedHero
        headline={["Meet Veyl", "Quietly Alive Interfaces.", "Beautifully built."]}
        description={["Components that feel considered,", "motion that never shouts."]}
      />
    </div>
  );
}`,
    props: [
      {
        title: "IlluminatedHero",
        rows: [
          {
            name: "headline",
            type: "[string, string, string]",
            default: "Introducing / Illuminated Glow Text. / Highlight the main focus text.",
            description: "Three lines: a quiet intro, the glowing line, and a closing line.",
          },
          {
            name: "description",
            type: "ReactNode[]",
            default: "Four default lines",
            description:
              "The paragraph under the headline. Each entry is one line and may contain <b>.",
          },
          {
            name: "headingLevel",
            type: '"h1" | "h2" | "h3"',
            default: '"h1"',
            description: "Which heading element to render. Use h1 only once per page.",
          },
          {
            name: "className",
            type: "string",
            description: "Extra classes on the section.",
          },
          {
            name: "style",
            type: "CSSProperties",
            description:
              "Inline styles. Use this to set a height, because inline styles always win.",
          },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "None. It uses only React and its own CSS file." },
      {
        need: "Parent height",
        detail:
          "The hero fills its parent. Give the parent a height, such as h-svh or a fixed height. Without one it collapses to 20rem.",
      },
      { need: "Font", detail: "Instrument Sans (500, 600, 700) through the --vh-font variable." },
      {
        need: "Browsers",
        detail: "CSS container queries: Chrome 105+, Safari 16+, Firefox 110+.",
      },
    ],
    notes: [
      "With no props, the text is stretched to the original design widths, so it looks exactly like the original.",
      "With your own text, each line keeps its natural width and the widest line sets the font size. Keep lines short, because a line never wraps.",
      "The hero never touches html, body or :root, and every class starts with vh-, so it cannot collide with your styles.",
      "With reduce motion turned on, the circles and the flowing light stay still.",
      "The colours are CSS variables at the top of illuminated-hero.css (--rim, --g-mid, --t3a and so on) if you want to change them.",
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "flip-words",
    title: "Flip Words",
    description:
      "A word that turns letter by letter through 360 degrees, then gives way to the next word, which turns in the same way.",
    kind: "Component",
    previewHeight: 300,
    centered: true,
    files: ["flip-words.tsx", "flip-words.css", "index.ts"],
    dependencies: ["motion", "clsx", "tailwind-merge"],
    setup: [],
    usage: `import { FlipWords } from "@/components/veyl/flip-words";

export default function Page() {
  const words = ["modern", "better", "cute", "beautiful"];

  return (
    <div className="text-4xl text-neutral-600 dark:text-neutral-400">
      Build <FlipWords words={words} /> websites
    </div>
  );
}`,
    props: [
      {
        title: "FlipWords",
        rows: [
          {
            name: "words",
            type: "string[]",
            description: "The words to cycle through, in order. Repeated words are fine.",
          },
          {
            name: "duration",
            type: "number",
            default: "3000",
            description: "How long each word stays on screen, in milliseconds.",
          },
          {
            name: "className",
            type: "string",
            description: "Style the animated word: colour, size, weight.",
          },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "motion, clsx and tailwind-merge." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      {
        need: "Styles",
        detail:
          "flip-words.css is imported by the component. It sets the font and the 3D perspective on .flip-words-container.",
      },
      {
        need: "Font",
        detail:
          "Manrope, loaded by an @import at the top of flip-words.css. For production, next/font is faster.",
      },
      { need: "Tailwind", detail: "v4, with the neutral colours and the class-based dark variant." },
    ],
    notes: [
      "FlipWords renders a div, so do not put it inside a <p>. React would warn about invalid nesting and the page can fail to hydrate. Use a div or a heading instead.",
      "The turn happens on the X axis, so the word needs room to rotate. Avoid overflow: hidden on a parent.",
      "Define the words list outside the component, or memoise it, so it is not a new array on every render.",
      "With a single word, nothing cycles, since there is nothing to change to.",
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "bento-grid",
    title: "Bento Grid",
    description:
      "A five-column, two-row grid of photo cards, each holding a small animated panel. The demo is themed around a coffee roastery.",
    kind: "Block",
    previewHeight: 640,
    centered: false,
    files: ["bento-grid.tsx", "skeletons.tsx", "index.ts"],
    dependencies: ["motion", "clsx", "tailwind-merge"],
    setup: [
      {
        title: "Load the font",
        description:
          "The cards use Manrope, read from the --font-manrope variable. Without it they fall back to your system font.",
        lang: "tsx",
        code: `import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

// Put manrope.variable on a parent:
// <main className={manrope.variable}> ... </main>`,
      },
      {
        title: "Allow your photo host",
        description:
          "BentoCard uses next/image. If your photos come from another site, allow its host. Photos in your public folder need no setup.",
        lang: "ts",
        code: `// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;`,
      },
    ],
    usage: `import { BentoCard, BentoGrid, RoastCurve } from "@/components/veyl/bento-grid";

export default function Page() {
  return (
    <div className="h-[640px]">
      <BentoGrid className="h-full">
        <BentoCard
          title="Roasted with precision"
          description="Each batch follows its own curve."
          image={{ src: "/coffee/roaster.jpg" }}
          className="md:col-span-3"
        >
          <RoastCurve />
        </BentoCard>
      </BentoGrid>
    </div>
  );
}`,
    props: [
      {
        title: "BentoGrid",
        rows: [
          {
            name: "className",
            type: "string",
            description: "Size it, for example h-full w-full. The two rows split its height evenly.",
          },
        ],
      },
      {
        title: "BentoCard",
        rows: [
          { name: "title", type: "string", description: "The card heading." },
          { name: "description", type: "string", description: "One short line under the heading." },
          {
            name: "image",
            type: "{ src: string; alt?: string }",
            description: "The photo that fills the card. Leave alt empty for decorative photos.",
          },
          {
            name: "align",
            type: '"top" | "bottom"',
            default: '"top"',
            description: "Where the text sits. The content fills the rest of the card.",
          },
          {
            name: "className",
            type: "string",
            description: "Grid placement, such as md:col-span-3.",
          },
          {
            name: "children",
            type: "ReactNode",
            description: "A skeleton or any content for the lower part of the card.",
          },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "motion, clsx and tailwind-merge." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      { need: "Framework", detail: "Next.js, because BentoCard uses next/image." },
      {
        need: "Tailwind",
        detail:
          "v4 with the default palette (neutral, amber, white, black). If you replace the default colours, those classes will not apply.",
      },
      { need: "Parent height", detail: "Give the parent a height. On screens below md it becomes one column of 16rem cards." },
    ],
    notes: [
      "OriginTrail, RoastCurve, TastingNotes and FreshnessTracker are example panels. They are plain components, so replace them with your own content for a different theme.",
      "With reduce motion turned on, every loop stops and the panels show their finished state.",
      "Photos in the demo are from Unsplash, free to use: Michael Starkie, Zoshua Colah, Hannah Busing and pouchdirect Australia.",
    ],
  },
];

export function getDoc(slug: string) {
  return componentDocs.find((doc) => doc.slug === slug);
}
