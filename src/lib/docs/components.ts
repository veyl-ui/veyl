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
  /* ------------------------------------------------------------------ */
  {
    slug: "drop-navbar",
    title: "Drop Navbar",
    description:
      "A navbar that hangs from the top edge of the page, then folds its corners away and drops into a floating pill as you scroll.",
    kind: "Block",
    previewHeight: 460,
    centered: false,
    files: ["drop-navbar.tsx", "mobile-menu.tsx", "use-scrolled.ts", "index.ts"],
    dependencies: ["clsx", "tailwind-merge"],
    setup: [],
    usage: `import Link from "next/link";
import { DropNavbar } from "@/components/veyl/drop-navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DropNavbar
        linkComponent={Link}
        logo={<span className="text-xl font-bold">Acme</span>}
        links={[
          { label: "Features", href: "/features" },
          { label: "Pricing", href: "/pricing" },
        ]}
        cta={{ label: "Get started", href: "/signup" }}
      />
      {children}
    </>
  );
}`,
    props: [
      {
        title: "DropNavbar",
        rows: [
          { name: "logo", type: "ReactNode", description: "Your logo and name, shown on the left. It links to logoHref." },
          { name: "logoHref", type: "string", default: '"/"', description: "Where the logo links to." },
          { name: "links", type: "{ label: string; href: string }[]", default: "[]", description: "Text links beside the logo. On small screens they move into a menu." },
          { name: "actions", type: "ReactNode", description: "Small things before the button, such as icon buttons or a theme toggle. A thin divider follows them." },
          { name: "cta", type: "{ label: string; href: string }", description: "The main button on the right. Its arrow slides forward on hover." },
          { name: "linkComponent", type: "ElementType", default: '"a"', description: "Your router's link, such as Next's Link. Plain <a> tags are used if you leave it out." },
          { name: "scrollContainer", type: "RefObject<HTMLElement | null>", description: "A scrolling element to watch instead of the page. Handy for demos inside a frame." },
          { name: "scrolledAt", type: "number", default: "32", description: "How far to scroll, in pixels, before the bar turns into a floating pill." },
          { name: "className", type: "string", description: "Extra classes on the outer header. Use it to change position or the --dn-bg colour." },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "clsx and tailwind-merge. No animation library is needed, the motion is plain CSS." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      { need: "Tailwind", detail: "v4, with the neutral colours and the class-based dark variant." },
      { need: "Fonts", detail: "None. The navbar uses the font of your page." },
    ],
    notes: [
      "The bar is white, or near-black inside a .dark parent. To pick another colour, set --dn-bg: className=\"[--dn-bg:#fff7ed]\". The flared corners follow it.",
      "It is sticky by default, so it stays at the top of the page while you scroll. Put it at the top of your layout, outside any element with overflow: hidden.",
      "The motion switches off for people who prefer reduced motion. The bar still changes shape, it just does not animate.",
      "Keep the logo short. The bar is built for a logo, three or four links, a couple of icons and one button.",
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: "beam-about",
    title: "Beam About",
    description:
      "An about section of two to four cards. A beam of light leaves the first card, crosses to the next, and each card shimmers as the beam arrives.",
    kind: "Block",
    previewHeight: 560,
    centered: false,
    files: ["beam-about.tsx", "beam-visuals.tsx", "beam-step.ts", "beam-about.css", "index.ts"],
    dependencies: ["clsx", "tailwind-merge"],
    setup: [],
    usage: `import { BeamAbout, BeamChecklist, BeamOrbit, BeamTyping } from "@/components/veyl/beam-about";

export default function About() {
  return (
    <BeamAbout
      eyebrow="About us"
      title="What we do, in three steps"
      description="A short line about your product."
      steps={[
        { title: "Choose", description: "One plain sentence.", visual: <BeamOrbit /> },
        { title: "Add", description: "The simple way.", visual: <BeamTyping placeholder="Paste a command…" text="npx add thing" answer="Done" /> },
        { title: "Enjoy", description: "What the visitor gains.", visual: <BeamChecklist title="Working" doneTitle="Ready" items={["One", "Two", "Three"]} /> },
      ]}
    />
  );
}`,
    props: [
      {
        title: "BeamAbout",
        rows: [
          { name: "title", type: "string", description: "The main heading." },
          { name: "eyebrow", type: "string", description: "A small line above the heading." },
          { name: "description", type: "ReactNode", description: "A short intro under the heading." },
          { name: "steps", type: "{ title; description; visual? }[]", description: "The columns, in order. Two to four work best. visual is the small scene inside the tile." },
          { name: "actions", type: "ReactNode", description: "Buttons or links shown under the columns." },
          { name: "className", type: "string", description: "Extra classes on the section. Use it to change the --ba-accent colour." },
          { name: "hint", type: "ReactNode | false", default: '"Hover to pause. Click a tile to replay it."', description: "A small line under the tiles that explains hover and click. Pass false to hide it." },
        ],
      },
      {
        title: "BeamOrbit",
        rows: [
          { name: "radiusX", type: "number", default: "104", description: "How far the chips spread sideways, in pixels." },
          { name: "radiusY", type: "number", default: "66", description: "How far the chips spread up and down, in pixels." },
        ],
      },
      {
        title: "BeamTyping",
        rows: [
          { name: "placeholder", type: "string", description: "Shown before the beam arrives." },
          { name: "text", type: "string", description: "The line that gets typed." },
          { name: "answer", type: "string", description: "A small chip that appears after the send button is pressed." },
          { name: "mono", type: "boolean", default: "false", description: "Types in a monospace font. Good for commands." },
        ],
      },
      {
        title: "BeamChecklist",
        rows: [
          { name: "title", type: "string", description: "The heading while the rows are ticking." },
          { name: "doneTitle", type: "string", description: "The heading once every row is ticked." },
          { name: "items", type: "string[]", description: "The rows. Three fit the tile best." },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "clsx and tailwind-merge. No animation library is needed, the motion is plain CSS." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      { need: "Tailwind", detail: "v4, with the neutral colours and the class-based dark variant." },
      { need: "Fonts", detail: "None. The section uses the font of your page." },
    ],
    notes: [
      "The beam only plays while the section is on screen, so it costs nothing when nobody is looking at it.",
      "To change the glow colour, set --ba-accent: className=\"[--ba-accent:#16a34a]\". The beam, borders and ticks follow it.",
      "To build your own scene, put any component in visual and call useBeamStep(). It returns { reached, reduced }: start your animation when reached turns true, and reset when it turns false.",
      "On small screens the tiles stack and the beam travels downward. People who prefer reduced motion see every scene in its finished state, with no animation.",
      "Hovering the tiles pauses the story, and the scene that is playing finishes first. Clicking a tile plays just that scene again, and the story restarts from the first tile when the pointer leaves. On touch screens a tapped scene plays once and the story carries on by itself.",
      "Tiles are keyboard friendly: Tab to one and press Enter or Space to replay it.",
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: "faq",
    title: "FAQ",
    description:
      "Questions and answers in cards that open one at a time, grouped by category, with a plus that turns into a cross.",
    kind: "Block",
    previewHeight: 640,
    centered: false,
    files: ["faq.tsx", "faq.css", "index.ts"],
    dependencies: ["clsx", "tailwind-merge"],
    setup: [],
    usage: `import { Faq } from "@/components/veyl/faq";

const items = [
  {
    category: "Getting started",
    question: "Is this a package I install?",
    answer: "No. One command adds the files to your project.",
  },
  {
    category: "Getting started",
    question: "What do I need to use it?",
    answer: "A React project with Tailwind CSS.",
  },
];

export default function Page() {
  return (
    <Faq
      items={items}
      eyebrow="FAQ"
      title="Questions? We've got answers."
      description="Everything you need to know."
    />
  );
}`,
    props: [
      {
        title: "Faq",
        rows: [
          { name: "items", type: "FaqItem[]", description: "The questions. Each has a question, an answer and an optional category." },
          { name: "eyebrow", type: "string", description: "Small label above the title, with a light that flows across it. Leave out to hide it." },
          { name: "title", type: "ReactNode", description: "The heading. Leave out to hide the whole header." },
          { name: "description", type: "ReactNode", description: "A line under the title." },
          { name: "defaultOpen", type: "number | null", default: "0", description: "Which question starts open. Use null to start with all closed." },
          { name: "numbered", type: "boolean", default: "true", description: "Show 01, 02, 03 before each question." },
          { name: "className", type: "string", description: "Style the wrapper, or override the --fq-* colour variables." },
        ],
      },
      {
        title: "FaqItem",
        rows: [
          { name: "question", type: "string", description: "The text on the card." },
          { name: "answer", type: "ReactNode", description: "The answer. Can include links or other markup." },
          { name: "category", type: "string", description: "Items with the same category sit under one title with a question count." },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "clsx and tailwind-merge. No animation library." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      {
        need: "Styles",
        detail:
          "faq.css is imported by the component. Colours are --fq-accent, --fq-accent-ink, --fq-card, --fq-border, --fq-border-hover, --fq-ink and --fq-muted.",
      },
      { need: "Tailwind", detail: "v4, with the class-based dark variant." },
    ],
    notes: [
      "Only one question is open at a time. Clicking the open one closes it.",
      "Closed answers are inert, so links inside them are skipped when tabbing.",
      "The open and close animation uses grid rows, so answers of any height work without measuring.",
      "With reduced motion on, the label stops flowing and the cards open instantly.",
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: "glass-cta",
    title: "Glass CTA",
    description:
      "A closing call to action: words and buttons on the left, an interactive 3D cube on the right. Frosted glass in light mode, a solid panel in dark mode.",
    kind: "Block",
    previewHeight: 520,
    centered: false,
    files: ["glass-cta.tsx", "glass-cube.tsx", "glass-backdrop.tsx", "glass-cta.css", "index.ts"],
    dependencies: ["clsx", "tailwind-merge"],
    setup: [],
    usage: `import { GlassBackdrop, GlassCta } from "@/components/veyl/glass-cta";

export default function Page() {
  return (
    <div className="relative mx-auto max-w-4xl">
      <GlassBackdrop />
      <GlassCta
        eyebrow="Get started"
        title="Make your next page feel alive"
        description="Copy a component, make it yours, and ship something people remember."
        primary={{ label: "Get started", href: "/docs" }}
        secondary={{ label: "Browse components", href: "/components" }}
        command="npx shadcn@latest add your-component"
      />
    </div>
  );
}`,
    props: [
      {
        title: "GlassCta",
        rows: [
          { name: "title", type: "ReactNode", description: "The headline." },
          { name: "eyebrow", type: "string", description: "Small label above the headline, with a light that flows across it." },
          { name: "description", type: "ReactNode", description: "A line or two under the headline." },
          { name: "primary", type: "{ label: ReactNode; href: string }", description: "The filled button." },
          { name: "secondary", type: "{ label: ReactNode; href: string }", description: "The outlined button." },
          { name: "command", type: "string", description: "A command shown in a box with a Copy button." },
          { name: "linkComponent", type: "ElementType", default: '"a"', description: "Your router's link, for example next/link, so buttons navigate without a page reload." },
          { name: "hint", type: "string | null", default: '"Move your mouse over it. Click it."', description: "The small line under the cube. Use null to hide it." },
          { name: "className", type: "string", description: "Style the panel, or override the --gc-* colour variables." },
        ],
      },
      {
        title: "GlassBackdrop",
        rows: [
          { name: "(no props)", type: "", description: "Soft light behind the panel, so the glass has something to frost. Place it first inside a relative wrapper that also holds the GlassCta." },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "clsx and tailwind-merge. The 3D is plain CSS, so there is no 3D library." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      {
        need: "Styles",
        detail:
          "glass-cta.css is imported by the component. Colours are --gc-ink, --gc-muted, --gc-accent-ink, --gc-button and --gc-button-ink.",
      },
      { need: "Tailwind", detail: "v4, with the class-based dark variant." },
    ],
    notes: [
      "The frosted-glass look needs something colourful behind the panel. Put GlassBackdrop next to it, or place the panel over your own gradient or image.",
      "In dark mode the panel is solid and the backdrop turns into a faint amber glow.",
      "The cube leans toward the pointer, spreads its faces while hovered, and spins with a pulse on click or tap. It also responds to Enter and Space.",
      "It stops animating while off screen. With reduced motion on, the cube stays still and the small animations on its faces are switched off.",
      "On narrow screens the cube moves above the words.",
    ],
  },
];

export function getDoc(slug: string) {
  return componentDocs.find((doc) => doc.slug === slug);
}
