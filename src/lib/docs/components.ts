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
    files: ["drop-navbar.tsx", "nav-menu.tsx", "mobile-menu.tsx", "use-scrolled.ts", "index.ts"],
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
          { name: "links", type: "DropNavbarLink[]", default: "[]", description: "Links beside the logo. Give a link an href for a plain link, or a menu to open a dropdown. On small screens they move into a menu." },
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
      "A link with a menu opens a dropdown on hover, tap or Enter. Each menu item can have an icon, a badge and a preview that shows on the right while the row is highlighted. Leave out every preview for a plain list. The highlight colour is --dn-accent.",
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
  /* ------------------------------------------------------------------ */
  {
    slug: "spotlight-footer",
    title: "Spotlight Footer",
    description:
      "A footer with link columns, a brand block, a copyright row and a huge cropped wordmark that lights up amber under your pointer.",
    kind: "Block",
    previewHeight: 560,
    centered: false,
    files: ["spotlight-footer.tsx", "spotlight-wordmark.tsx", "spotlight-footer.css", "index.ts"],
    dependencies: ["clsx", "tailwind-merge"],
    setup: [],
    usage: `import { SpotlightFooter } from "@/components/veyl/spotlight-footer";

export default function Footer() {
  return (
    <SpotlightFooter
      brand={<span className="text-lg font-medium">Acme</span>}
      tagline="Tools that help small teams ship faster."
      columns={[
        {
          title: "Product",
          links: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About", href: "/about" },
            { label: "Contact", href: "/contact" },
          ],
        },
      ]}
      socials={[{ label: "GitHub", href: "https://github.com/acme", icon: <GithubIcon /> }]}
      copyright="© 2026 Acme. All rights reserved."
      wordmark="Acme"
    />
  );
}`,
    props: [
      {
        title: "SpotlightFooter",
        rows: [
          { name: "columns", type: "FooterColumn[]", description: "The link columns. Each has a title and a list of { label, href } links." },
          { name: "brand", type: "ReactNode", description: "Your logo and name, shown at the top of the brand block." },
          { name: "tagline", type: "ReactNode", description: "A short line under the logo." },
          { name: "socials", type: "FooterSocial[]", description: "Icon links. Each has a label, an href and an icon (any element, such as an inline SVG)." },
          { name: "copyright", type: "ReactNode", description: "The line in the middle of the bottom row." },
          { name: "wordmark", type: "string", description: "The huge cropped word at the bottom. Leave out to hide it." },
          { name: "end", type: "ReactNode", description: "Sits at the right of the copyright row. A theme switch is a good fit." },
          { name: "linkComponent", type: "ElementType", default: '"a"', description: "Your router's link, for example next/link. Web addresses always use a plain link that opens in a new tab." },
          { name: "className", type: "string", description: "Style the footer, or override the --sf-* colour variables." },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "clsx and tailwind-merge. No animation library." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      {
        need: "Styles",
        detail:
          "spotlight-footer.css is imported by the component. Colours are --sf-bg, --sf-ink, --sf-muted, --sf-line, --sf-word, --sf-accent and --sf-accent-ink.",
      },
      { need: "Tailwind", detail: "v4, with the class-based dark variant." },
    ],
    notes: [
      "The footer itself is a server component. Only the wordmark runs in the browser.",
      "The wordmark scales with the width of the footer, so it fills the page on any screen.",
      "When nobody is pointing at the wordmark, the light sweeps across it slowly by itself. It stops while off screen, and holds still with reduced motion.",
      "On narrow screens the brand block moves above the link columns.",
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: "isometric-cards",
    title: "Isometric Cards",
    description:
      "Feature cards that each show a small isometric block. Hover one and a face of the block slides away while labelled lines draw out from it.",
    kind: "Block",
    previewHeight: 660,
    centered: false,
    files: ["isometric-cards.tsx", "isometric-cards.css", "index.ts"],
    dependencies: ["clsx", "tailwind-merge"],
    setup: [],
    usage: `import { IsometricCards } from "@/components/veyl/isometric-cards";

const cards = [
  {
    face: "left",
    title: "Modular by design",
    callouts: ["Tokens", "Tests", "Docs"],
    description: "Every block ships with its own tokens, tests, and docs.",
  },
  {
    face: "top",
    title: "Open the lid on performance",
    callouts: ["Zero runtime", "Tree-shaking", "Typed API"],
    description: "Zero-runtime styles keep your bundle small.",
  },
  {
    face: "right",
    title: "Themes that travel",
    callouts: ["One token file", "Web + native", "Dark mode"],
    description: "One token file re-skins every block.",
  },
] as const;

export default function Page() {
  return (
    <IsometricCards
      cards={[...cards]}
      heading="Build with blocks, not boilerplate"
      subheading="Hover each card to see inside."
    />
  );
}`,
    props: [
      {
        title: "IsometricCards",
        rows: [
          { name: "cards", type: "IsometricCard[]", description: "The cards. Each has a face, a title, a description and optional callouts." },
          { name: "heading", type: "ReactNode", description: "The title above the cards. Leave out to hide the header." },
          { name: "subheading", type: "ReactNode", description: "A line under the heading." },
          { name: "theme", type: '"light" | "dark"', description: "Force one look for this block. By default it follows the site's dark mode." },
          { name: "className", type: "string", description: "Style the wrapper, or override the --iso-* colour variables." },
        ],
      },
      {
        title: "IsometricCard",
        rows: [
          { name: "face", type: '"left" | "top" | "right"', description: "Which face of the block slides away on hover." },
          { name: "title", type: "string", description: "The card's title." },
          { name: "description", type: "ReactNode", description: "The text under the title." },
          { name: "callouts", type: "[string?, string?, string?]", description: "Up to three labels, drawn out in the order top, right, left. The label on the sliding face is brighter." },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "clsx and tailwind-merge. No animation library." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      {
        need: "Styles",
        detail:
          "isometric-cards.css is imported by the component. Colours are --iso-ink, --iso-muted, --iso-card, --iso-panel, --iso-border, --iso-accent, --iso-left, --iso-right, --iso-top, --iso-hole and --iso-edge.",
      },
      { need: "Tailwind", detail: "v4, with the class-based dark variant." },
    ],
    notes: [
      "On a touch screen, tap a card to open it and tap again to close it.",
      "The block leans slightly toward the pointer. Cards are focusable, so the same animation plays for keyboard users.",
      "The labels are decorative: the title and description carry the meaning for screen readers.",
      "With reduced motion on, the block no longer leans and the faces change instantly.",
    ],
  },
  {
    slug: "testimonial-bento",
    title: "Testimonial Bento",
    description:
      "A bento grid of five testimonial cards whose quotes keep changing. The black card changes first, then the others, each on its own beat, with the words flowing in.",
    kind: "Block",
    previewHeight: 800,
    centered: false,
    files: ["testimonial-bento.tsx", "testimonial-bento.css", "index.ts"],
    dependencies: ["clsx", "tailwind-merge"],
    setup: [],
    usage: `import { TestimonialBento } from "@/components/veyl/testimonial-bento";

const testimonials = [
  {
    name: "Maya Chen",
    role: "Frontend Lead at Northwind",
    quote: "The animations feel hand-built, not templated.",
    avatar: "/people/maya.jpg",
    rating: 5.0,
  },
  // five or more. Around 12 to 15 works well
];

export default function Page() {
  return (
    <TestimonialBento
      title="Loved by people who ship"
      description="Developers and designers use Veyl to build pages that feel hand-made."
      testimonials={testimonials}
    />
  );
}`,
    props: [
      {
        title: "TestimonialBento",
        rows: [
          { name: "title", type: "ReactNode", description: "A heading above the boxes. Left out, no heading is shown." },
          { name: "description", type: "ReactNode", description: "A line under the heading." },
          { name: "testimonials", type: "BentoTestimonial[]", description: "Five or more. With more than five, the boxes swap them in and out. Around 12 to 15 works well." },
          { name: "interval", type: "number", default: "9000", description: "Average time in milliseconds between changes in one box. Each box runs at its own speed." },
          { name: "autoplay", type: "boolean", default: "true", description: "Change the quotes by itself." },
          { name: "showRating", type: "boolean", default: "true", description: 'Show the "4.9 ★ Rating" line.' },
          { name: "theme", type: '"light" | "dark"', description: "Force one look for this block. By default it follows the site's dark mode." },
          { name: "className", type: "string", description: "Style the wrapper, or override the --tbn-* colour variables." },
        ],
      },
      {
        title: "BentoTestimonial",
        rows: [
          { name: "quote", type: "string", description: "What they said. Keep it under about 90 characters so it fits the small cards." },
          { name: "name", type: "string", description: "Their name." },
          { name: "role", type: "string", description: "Their job and company." },
          { name: "avatar", type: "string", description: "A picture. Without one, or if it fails to load, their initial is shown." },
          { name: "rating", type: "number", default: "4.9", description: 'The number in the "4.9 ★ Rating" line.' },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "clsx and tailwind-merge. No animation library." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      {
        need: "Styles",
        detail:
          "testimonial-bento.css is imported by the component. Colours are --tbn-card, --tbn-hero (the black card), --tbn-quote, --tbn-name, --tbn-muted, --tbn-rate and --tbn-star.",
      },
      { need: "Tailwind", detail: "v4, with the class-based dark variant." },
    ],
    notes: [
      "The first time through, the black box changes first, then the last box, then one from the middle, then the other two. After that each box changes on its own beat, and never two at once.",
      "A testimonial is never shown in two boxes at the same time.",
      "Hover a box to pause it. Nothing changes while the block is off screen or the tab is hidden.",
      "The block scales as one piece. Below 780px wide it becomes two columns, and below 600px one.",
      "Screen readers get every testimonial in a hidden list, so none are missed while they rotate.",
      "With reduced motion on, the first five stay still.",
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: "workflow-canvas",
    title: "Workflow Canvas",
    description:
      "A canvas where the visitor builds a workflow by dragging wires between boxes. Each stretch of wire has its own colour, a beaded light runs along it, and the box it reaches glows and shimmers in the same colour. Boxes can be moved around.",
    kind: "Block",
    previewHeight: 760,
    centered: false,
    files: ["workflow-canvas.tsx", "workflow-canvas.css", "index.ts"],
    dependencies: ["clsx", "tailwind-merge"],
    setup: [],
    usage: `import { WorkflowCanvas, type FlowNode, type FlowEdge, type FlowStep } from "@/components/veyl/workflow-canvas";

// Keep these outside the component so they keep the same identity between renders.
const nodes: FlowNode[] = [
  { id: "trig", label: "New signup", x: 60, y: 200, icon: "webhook" },
  { id: "look", label: "Find the account", x: 190, y: 108, icon: "db" },
  { id: "mail", label: "Send welcome email", x: 330, y: 200, icon: "mail", hidden: true },
];

const edges: FlowEdge[] = [
  { from: "trig", to: "look", color: "#e9b95e" },
  { from: "look", to: "mail", color: "#5b9cff" },
];

const steps: FlowStep[] = [
  // the visitor drags from "New signup" to "Find the account"
  { type: "connect", from: "trig", to: "look" },
  // then clicks +, and "Send welcome email" appears
  { type: "reveal", nodes: ["mail"], at: { x: 270, y: 200 } },
  // then drags the last wire
  { type: "connect", from: "look", to: "mail" },
];

export default function Page() {
  return (
    <WorkflowCanvas
      title="Every step, in plain sight"
      description="Drag from one step to the next."
      nodes={nodes}
      edges={edges}
      steps={steps}
    />
  );
}`,
    props: [
      {
        title: "WorkflowCanvas",
        rows: [
          { name: "title", type: "ReactNode", description: "A heading above the canvas. Left out, no heading is shown." },
          { name: "description", type: "ReactNode", description: "A line under the heading." },
          { name: "nodes", type: "FlowNode[]", description: "The boxes, with where each one starts." },
          { name: "edges", type: "FlowEdge[]", description: "Every wire that can exist, and its colour." },
          { name: "steps", type: "FlowStep[]", description: "The order things happen in. Left out, every wire is already drawn and the boxes can only be moved." },
          { name: "width", type: "number", default: "1160", description: "Canvas width in canvas units. Everything scales to fit." },
          { name: "height", type: "number", default: "440", description: "Canvas height in canvas units." },
          { name: "colors", type: "string[]", description: "Colours that wires without their own colour take turns through." },
          { name: "demo", type: "boolean", default: "true", description: "After about four idle seconds, a cursor shows how to make the next step." },
          { name: "loop", type: "boolean", default: "true", description: "Start over after the last step." },
          { name: "minScale", type: "number", default: "0.55", description: "The canvas never scales below this. It scrolls sideways instead." },
          { name: "theme", type: '"light" | "dark"', description: "Force one look for this block. By default it follows the site's dark mode." },
          { name: "className", type: "string", description: "Style the wrapper, or override the --wfc-* colour variables." },
        ],
      },
      {
        title: "FlowNode",
        rows: [
          { name: "id", type: "string", description: "A unique name, used by edges and steps." },
          { name: "label", type: "string", description: "The name shown under the box." },
          { name: "x, y", type: "number", description: "Where the centre of the box starts, in canvas units." },
          { name: "icon", type: "FlowIconName | ReactNode", description: "One of the built-in icon names (webhook, db, bot, braces, chat, spark, book, globe, users, split, mail, bell, bolt), or your own element." },
          { name: "kind", type: '"step" | "agent" | "tool"', default: '"step"', description: "A small square, a wide box that carries its label, or a round box that hangs under an agent." },
          { name: "width", type: "number", description: "Box width. 54 by default, or 138 for an agent." },
          { name: "tint", type: "string", description: "The icon colour." },
          { name: "hidden", type: "boolean", description: "Start hidden. A reveal step shows it." },
        ],
      },
      {
        title: "FlowEdge",
        rows: [
          { name: "from, to", type: "string", description: "The ids of the two boxes." },
          { name: "color", type: "string", description: "The colour of this wire, its beads' glow, and the glow of the box it reaches." },
        ],
      },
      {
        title: "FlowStep",
        rows: [
          { name: "type: \"connect\"", type: "{ from, to, then? }", description: "The visitor drags a wire from one box to another. The wires in then draw themselves afterwards." },
          { name: "type: \"reveal\"", type: "{ nodes, at }", description: "A + button appears at the position at. Clicking it brings in the listed boxes." },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "clsx and tailwind-merge. No animation library." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      {
        need: "Styles",
        detail:
          "workflow-canvas.css is imported by the component. Colours are --wfc-canvas, --wfc-dot, --wfc-tile, --wfc-ink, --wfc-label, --wfc-muted, --wfc-port and --wfc-ring.",
      },
      { need: "Tailwind", detail: "v4, with the class-based dark variant." },
    ],
    notes: [
      "The visitor makes the first connection; the wires after it draw themselves up to a checkpoint, where the visitor makes the next one. Dropping a wire on the wrong box shakes it and snaps back.",
      "Every box can be dragged around the canvas, and its wires follow.",
      "A wire's colour is also the colour its boxes glow, with a shimmer that runs across them.",
      "After about four idle seconds a cursor shows how to make the next step. Touching the canvas stops it.",
      "Keyboard and screen reader users get a button for each connect step, and the + is a real button.",
      "Below minScale the canvas scrolls sideways. With reduced motion on, everything is already connected and the boxes can still be moved.",
      "Pass nodes, edges and steps from outside the component, or memoize them, so the story doesn't restart on every render.",
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: "pricing-section",
    title: "Pricing Section",
    description:
      "A full pricing page on an architectural sheet: crosshair corners, hairline grid, blue light pulses running along the side lines, an annual-discount toggle, product tabs, three plan cards and a plan modal.",
    kind: "Block",
    previewHeight: 900,
    centered: false,
    files: ["pricing-section.tsx", "hero-decorations.tsx", "crosshair-mark.tsx", "plan-modal.tsx", "pricing-data.ts", "index.ts"],
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    setup: [],
    usage: `import { PricingSection, type SuiteInfo } from "@/components/veyl/pricing-section";

const suites: Record<string, SuiteInfo> = {
  Studio: {
    id: "Studio",
    label: "Studio",
    subtitle: "Everything for creators",
    tiers: [
      { id: "free", name: "Free", badgeTone: "cool", monthlyPrice: 0, description: "Get started.", ctaLabel: "Get Started Free", ctaType: "free", features: ["One thing", "Another thing"] },
      { id: "pro", name: "Pro", badgeTone: "neutral", monthlyPrice: 29, description: "For professionals.", ctaLabel: "Upgrade to Pro", ctaType: "upgrade", featured: true, features: ["Everything in Free", "More"] },
      { id: "biz", name: "Business", badgeTone: "sky", monthlyPrice: 69, description: "For teams.", ctaLabel: "Contact Sales", ctaType: "sales", features: ["Everything in Pro", "Team tools"] },
    ],
  },
  // more suites become more tabs
};

export default function Page() {
  return (
    <PricingSection
      suites={suites}
      title="Choose Pricing Plan"
      description="Pick the plan that fits."
    />
  );
}`,
    props: [
      {
        title: "PricingSection",
        rows: [
          { name: "suites", type: "Record<string, SuiteInfo>", description: "One entry per tab, each with three plans. Defaults to a sample set." },
          { name: "title", type: "string", default: '"Choose Pricing Plan"', description: "The big heading." },
          { name: "description", type: "string", description: "The line under the heading." },
          { name: "discount", type: "number", default: "0.4", description: "The annual discount, from 0 to 1. At 0 the discount button is hidden." },
          { name: "className", type: "string", description: "Style the outer wrapper." },
        ],
      },
      {
        title: "PricingTier",
        rows: [
          { name: "id, name", type: "string", description: "A unique id and the plan's name." },
          { name: "badgeTone", type: '"cool" | "neutral" | "sky"', description: "The tint of the name badge." },
          { name: "monthlyPrice", type: "number", description: "Price per month. 0 shows $0 and no annual saving." },
          { name: "description", type: "string", description: "One or two lines under the price." },
          { name: "ctaLabel", type: "string", description: "The button text." },
          { name: "ctaType", type: '"free" | "upgrade" | "sales"', description: "Decides the modal: a sales inquiry asks for a company name, the others do not." },
          { name: "featured", type: "boolean", description: "The middle card: a dark button and a soft blue shade rising from the bottom." },
          { name: "features", type: "string[]", description: "The checklist." },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "motion and lucide-react, plus clsx and tailwind-merge." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      { need: "Fonts", detail: "Uses your font-sans and font-serif. The original pairs Nunito with Source Serif 4." },
      { need: "Tailwind", detail: "v4, with the class-based dark variant. The block is styled with Tailwind classes and needs no CSS file." },
    ],
    notes: [
      "Three plans per tab is what the grid is built for.",
      "The blue light pulses along the side lines are plain SVG paths animated with motion. With reduced motion on they become a short still line.",
      "The plan buttons open a form modal that only shows a confirmation. Connect it to your own checkout or sales form in plan-modal.tsx.",
      "The block fills the screen height, because it was built as a whole page. Put className=\"min-h-0\" on it to use it as a section.",
    ],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: "features-section",
    title: "Features Section",
    description:
      "A features block on a laptop-style screen. A floating dock below it swells under the cursor and switches between six screens. Each screen has its own layout and keeps moving on its own, with live things to click inside.",
    kind: "Block",
    previewHeight: 1180,
    centered: false,
    files: [
      "features-section.tsx",
      "mac-floating-dock.tsx",
      "feature-bento-screen.tsx",
      "feature-actions-screen.tsx",
      "feature-privacy-screen.tsx",
      "feature-search-screen.tsx",
      "feature-calendar-screen.tsx",
      "feature-digest-screen.tsx",
      "features-data.ts",
      "features-logic.ts",
      "features-section.css",
      "index.ts",
    ],
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    setup: [],
    usage: `import { FeaturesSection } from "@/components/veyl/features-section";

export default function Page() {
  return (
    <FeaturesSection
      appName="Cadence"
      menuItems={["File", "Transcripts", "Vault"]}
      title="Every conversation, turned into clear action."
      description="Switch through the six workspaces from the dock below."
    />
  );
}

// Swap one screen for your own:
// <FeaturesSection screens={{ search: <MySearchScreen /> }} />
//
// The text, numbers and sample data all live in features-data.ts. Edit them there.`,
    props: [
      {
        title: "FeaturesSection",
        rows: [
          { name: "features", type: "FeatureDefinition[]", description: "One dock icon and one screen each. Defaults to the six sample features in features-data.ts." },
          { name: "icons", type: "Record<string, LucideIcon>", description: "The dock icon for each feature id. Ids you leave out use the built-in icon." },
          { name: "screens", type: "Record<string, ReactNode>", description: "Your own screen for a feature id. It replaces the built-in screen with that id." },
          { name: "badge", type: "ReactNode | null", description: "The pill above the heading. Clicking it moves to the next feature. null hides it." },
          { name: "title", type: "ReactNode", description: "The big heading." },
          { name: "description", type: "ReactNode", description: "The line under the heading." },
          { name: "appName", type: "string", default: '"Cadence"', description: "The app name in the laptop's menu bar." },
          { name: "menuItems", type: "string[]", default: '["File", "Transcripts", "Vault"]', description: "The small menu words next to the app name." },
          { name: "deviceLabel", type: "string", default: '"MacBook Pro"', description: "The small label under the screen. An empty string hides it." },
          { name: "intro", type: "boolean", default: "true", description: "Play the opening intro. The lid opens when the laptop first scrolls into view, then the screen lights up and the contents appear. Set false to show the laptop already open." },
          { name: "autoTour", type: "boolean", default: "false", description: "Start with the automatic tour on. The visitor can turn it on and off from the menu bar." },
          { name: "tourInterval", type: "number", default: "6500", description: "Time on each feature during the tour, in ms." },
          { name: "activeId, onActiveChange", type: "string, (id) => void", description: "Make the block controlled: the id that is open, and a callback when it changes." },
          { name: "className", type: "string", description: "Style the outer wrapper." },
        ],
      },
      {
        title: "FeatureDefinition",
        rows: [
          { name: "id", type: "string", description: "A unique id. The six built-in ids are capture, actions, privacy, search, calendar and digest." },
          { name: "indexLabel, dockLabel", type: "string", description: "The number shown on the left, and the name shown above the dock icon." },
          { name: "title, subtitle, description", type: "string", description: "The text on the left of the screen." },
          { name: "layoutStyleLabel", type: "string", description: "The small label next to the number." },
          { name: "additionalTitle, additionalValue, additionalHint", type: "string", description: "The small card at the bottom left." },
          { name: "highlights", type: "{ label, detail }[]", description: "Two short rows under the paragraph." },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "motion and lucide-react, plus clsx and tailwind-merge." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      { need: "Tailwind", detail: "v4, with the class-based dark variant. Almost everything is Tailwind classes." },
      { need: "Styles", detail: "features-section.css is imported by the component. It only styles the thin scrollbars." },
      { need: "Fonts", detail: "The headings use a font-display class. Define --font-display in your Tailwind theme, or they use your normal font. The original pairs Plus Jakarta Sans with DM Sans." },
    ],
    notes: [
      "The six screens are separate files, so you can edit one without touching the others. Their sample text and data are in features-data.ts.",
      "The privacy screen has its own wording written into it. Edit feature-privacy-screen.tsx to change it.",
      "To add a seventh feature, add it to FEATURES, give it an icon with the icons prop, and pass a screen for it with the screens prop.",
      "The block follows your site's dark mode. It has no theme switch of its own.",
      "With reduced motion on, the animations hold still.",
      "The lid opens once, when the laptop first scrolls into view. With reduced motion turned on, it is shown open and nothing animates. Pass intro={false} to skip the intro.",
    ],
  },
  {
    slug: "team-section",
    title: "Team Section",
    description:
      "A string of hanging photo cards. Drag it and let go: it glides, and every card swings on its own pin. Point at the string and it dips under your cursor.",
    kind: "Block",
    previewHeight: 980,
    centered: false,
    files: ["team-section.tsx", "team-carousel.tsx", "team-data.ts", "index.ts"],
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    setup: [],
    usage: `import { TeamSection } from "@/components/veyl/team-section";

export default function Page() {
  return (
    <TeamSection
      badge="Our team"
      title="The people behind the product"
      buttonLabel="See open roles"
      buttonHref="/careers"
      members={[
        { name: "Anders Holm", role: "Engineering", image: "/team/anders.jpg" },
        { name: "Zuri Mensah", role: "Design", image: "/team/zuri.jpg" },
        // add as many as you like
      ]}
    />
  );
}`,
    props: [
      {
        title: "TeamSection",
        rows: [
          { name: "members", type: "TeamMember[]", default: "six sample people", description: "The people. Each one is { name, role, image }. The image is optional: without it a soft placeholder with initials is shown." },
          { name: "badge", type: "ReactNode | null", default: '"Our team"', description: "The small pill above the heading. Pass null to hide it." },
          { name: "title", type: "ReactNode", description: "The heading." },
          { name: "description", type: "ReactNode", description: "The paragraph under the cards." },
          { name: "buttonLabel", type: "ReactNode | null", default: '"See open roles"', description: "Text of the button. Pass null to hide it." },
          { name: "buttonHref", type: "string", default: '"#"', description: "Where the button goes." },
          { name: "speed", type: "number", default: "33", description: "Slow drift to the left, in px per second. It eases to a stop while the pointer is over the cards. 0 turns it off." },
          { name: "draggable", type: "boolean", default: "true", description: "Let people drag the cards." },
          { name: "className", type: "string", description: "Extra classes for the section." },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "motion and lucide-react, plus clsx and tailwind-merge." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      { need: "Tailwind", detail: "v4, with the class-based dark variant. Everything is Tailwind classes, there is no CSS file." },
      { need: "Photos", detail: "Portraits about 4:5, for example 450 x 560. The sample photos are in public/team/." },
    ],
    notes: [
      "Nothing here is a plain CSS animation. A small physics loop moves every card each frame, using motion values from motion/react, so a flick keeps its speed and fades out smoothly instead of stopping dead.",
      "The cards swing from their pins, each with its own stiffness, so they never move in step. How far they swing depends on how fast the strip is moving.",
      "The string is drawn through every pin, so it dips with the cards when the pointer is close.",
      "On touch screens vertical scrolling still works. Dragging sideways moves the cards.",
      "Click the strip and use the left and right arrow keys to move it without a mouse.",
      "With reduced motion on, the drift stops and the cards hang straight. Dragging still works.",
    ],
  },
  {
    slug: "logo-cloud",
    title: "Logo Cloud",
    description:
      "A cloud of real brand logos. On load they spring in from all sides, then float on their own. Move the pointer through them: nearby logos swell, drift away from it and turn into their brand colour.",
    kind: "Block",
    previewHeight: 760,
    centered: false,
    files: ["logo-cloud.tsx", "logo-field.tsx", "logo-data.ts", "index.ts"],
    dependencies: ["motion", "lucide-react", "clsx", "tailwind-merge"],
    setup: [],
    usage: `import { LogoCloud } from "@/components/veyl/logo-cloud";

export default function Page() {
  return (
    <LogoCloud
      badge="Integrations"
      title="Works with the tools you already use"
      buttonLabel="Explore integrations"
      buttonHref="/integrations"
    />
  );
}`,
    props: [
      {
        title: "LogoCloud",
        rows: [
          { name: "logos", type: "CloudLogo[]", default: "twenty well-known brands", description: "The logos. Each one is { name, color, path }: the name, the brand colour, and the logo as one SVG path in a 24 x 24 box." },
          { name: "badge", type: "ReactNode | null", default: '"Integrations"', description: "The small pill above the heading. Pass null to hide it." },
          { name: "title", type: "ReactNode", description: "The heading." },
          { name: "description", type: "ReactNode", description: "The short line under the heading." },
          { name: "buttonLabel", type: "ReactNode | null", default: '"Explore integrations"', description: "Text of the button. Pass null to hide it." },
          { name: "buttonHref", type: "string", default: '"#"', description: "Where the button goes." },
          { name: "hint", type: "string", default: '"Move your cursor through the cloud"', description: "Text under the cloud while no logo is close to the pointer." },
          { name: "className", type: "string", description: "Extra classes for the section." },
        ],
      },
    ],
    requirements: [
      { need: "Packages", detail: "motion and lucide-react, plus clsx and tailwind-merge." },
      { need: "Helper", detail: "cn() at @/lib/utils. See the installation page." },
      { need: "Tailwind", detail: "v4, with the class-based dark variant. Everything is Tailwind classes, there is no CSS file." },
      { need: "Logos", detail: "The sample logos are the official shapes and colours from the Simple Icons set. They are trademarks of their owners, so only show brands you work with." },
    ],
    notes: [
      "To use your own logos, give each one as an SVG path in a 24 x 24 box. Simple Icons (simpleicons.org) lists the path for most brands.",
      "Black and near-black logos switch to white in dark mode, so they stay visible.",
      "Three rows are made automatically: longer on the outside, shorter in the middle. With four logos or fewer they sit on one row.",
      "On small screens the whole cloud scales down to fit, and it keeps working with touch.",
      "The motion is one small physics loop, not CSS animations. Every tile floats with its own rhythm, and the push and swell are springs, so they never snap.",
      "With reduced motion on, the logos appear in place and stay still. Hovering still turns them into their brand colour.",
    ],
  },
];

export function getDoc(slug: string) {
  return componentDocs.find((doc) => doc.slug === slug);
}
