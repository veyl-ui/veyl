/**
 * The changelog. To add a release, put a new object in the list (any order, it is sorted for you).
 * Months, the "N updates" counts and the "Last update" date are worked out from this list.
 *
 * Pictures: save the files in `public/changelog/` and list their paths in `images`, for example ["/changelog/theming.png"].
 * A 16:9 picture (1600 x 900) looks best. Without images the entry shows a soft placeholder.
 * Wrap a word in `backticks` to show it as code.
 */
export type ChangeTag = "Added" | "Improved" | "Fixed" | "Docs";

export type ChangeEntry = {
  /** Year-month-day, like "2026-11-09". */
  date: string;
  title: string;
  tag?: ChangeTag;
  images?: string[];
  imageAlt?: string;
  /** One to three short lines. */
  description: string;
  /** Six or seven at most. */
  points: string[];
  /** One closing line. */
  conclusion?: string;
};

export const changelog: ChangeEntry[] = [
    {
    date: "2026-11-22",
    title: "Pricing Section",
    tag: "Added",
    imageAlt: "A three-plan pricing page with blue light running along the side lines",
    description: "A full pricing page on an architectural sheet, with product tabs, an annual discount and a plan modal.",
    points: [
      "Crosshair corners and hairline grid, with blue light pulses along the side lines",
      "An annual discount button that updates every price and shows the yearly saving",
      "Tabs that switch between product suites",
      "The middle card has a soft blue shade that rises from the bottom",
      "A plan modal with validation",
      "Light and dark mode",
    ],
    conclusion: "A pricing page that looks drawn, not templated.",
  },
  {
    date: "2026-11-21",
    title: "Workflow Canvas",
    tag: "Added",
    imageAlt: "A workflow being connected with coloured wires",
    description: "A canvas where visitors connect the steps of a workflow themselves, one coloured wire at a time.",
    points: [
      "Each stretch of wire has its own colour, with a beaded light running along it",
      "The box a wire reaches glows and shimmers in the wire's colour",
      "Drag any box around the canvas and its wires follow",
      "Checkpoints: connect, watch the wires draw, click +, connect again",
      "A cursor shows how after a few idle seconds",
      "Light and dark mode, reduced motion, and keyboard buttons for each step",
    ],
    conclusion: "Show how a thing works by letting people build it.",
  },
  {
    date: "2026-11-18",
    title: "Testimonial Bento",
    tag: "Added",
    description:
      "A bento grid of testimonials that keeps changing. Quotes flow in word by word, one box at a time.",
    points: [
      "An optional heading and description above the boxes",
      "A black hero card and four white cards, with a rating line and a portrait on each",
      "The black card changes first, then the last, then the middle, then the rest",
      "Each box runs on its own beat, and never two change at once",
      "Hover a box to pause it, and it pauses off screen too",
      "Follows dark mode and scales as one piece down to a phone",
      "No animation library, just clsx and tailwind-merge",
    ],
    conclusion: "Quotes that move, without the noise.",
  },
  {
    date: "2026-11-14",
    title: "Isometric Cards",
    tag: "Added",
    images: ["/changelog/Build with Blocks, Not Boilerplate.png"],
    imageAlt: "Three cards, each with an isometric block that opens on hover",
    description:
      "Feature cards with a small isometric block on each. Hover one and a face of the block slides away while labelled lines draw out from it.",
    points: [
      "A different face slides away on each card: left, top or right",
      "Up to three labels draw out from the block, one after another",
      "The block leans a little toward your pointer",
      "Tap a card on a touch screen to open it, tap again to close it",
      "Follows light and dark mode, or force one with `theme`",
      "Every colour is an `--iso-*` variable you can override",
      "Cards are focusable, and reduced motion is respected",
    ],
    conclusion: "Cards that show what is inside before you read a word.",
  },
  {
    date: "2026-11-14",
    title: "License page",
    tag: "Docs",
    images: ["/changelog/Open Source MIT License Showcase.png"],
    imageAlt: "The License page with the tilted MIT paper",
    description:
      "Veyl is MIT licensed, and the License page explains what that means in plain words, with the real text right beside it.",
    points: [
      "A tilted paper with a highlighter and a turning MIT seal",
      "Click the paper and it opens full size, ready to read",
      "A “Can I…?” checker: pick what you want to do and get a straight answer",
      "The license read line by line, each paragraph next to what it means",
      "A one-click button that copies the full license text",
      "A list of the work Veyl is built on, each with its own license",
      "A `LICENSE` file in the repo, the same text as the page",
    ],
    conclusion: "Free to use, free to change, and easy to understand.",
  },
  {
    date: "2026-11-13",
    title: "Contribute page",
    tag: "Docs",
    images: ["/changelog/Veyl Docs_ Help Shape Veyl.png"],
    imageAlt: "The Contribute page with its contribution-graph header",
    description: "A page that shows how to help, with a header that plays a small contribution-graph story.",
    points: [
      "A snake runs through a GitHub-style graph and the squares grow back with new shades",
      "Five steps from a fork to a running docs site",
      "The folder layout and house rules for a new component",
      "A checklist to run through before a pull request",
    ],
    conclusion: "Everything you need to add the next block.",
  },
  {
    date: "2026-11-13",
    title: "This changelog",
    tag: "Docs",
    images: ["/changelog/Veyl Changelog in a Warm Gradient Panel.png"],
    imageAlt: "The Veyl changelog page",
    description: "The whole journey in one place, from the first commit to today, newest first.",
    points: [
      "A timeline grouped by month, with a count for each month",
      "Click any picture to see it larger",
      "A month list on the right that follows your scroll",
      "The same 3D grid header as the Theming page",
    ],
    conclusion: "Every step of building Veyl, written down.",
  },
  {
    date: "2026-11-12",
    title: "Theming page and a new docs sidebar",
    tag: "Docs",
    images: ["/changelog/Veyl Theming Docs on Gradient Card.png"],
    imageAlt: "The Theming page with the live playground",
    description:
      "Pick one colour and every component follows. The new Theming page lets you try it live, and the docs got easier to move around in.",
    points: [
      "A live playground for FAQ, Glass CTA and Spotlight Footer",
      "`--gc-accent` makes the whole Glass CTA themable, cube included",
      "The big Spotlight Footer word now follows `--sf-accent`",
      "A collapsible docs sidebar with grouped sections",
      "An “On this page” list that stays lit on the part you are reading",
      "A 3D grid header that reacts to your pointer",
    ],
    conclusion: "Change one variable, restyle the whole component.",
  },
  {
    date: "2026-11-09",
    title: "Resources dropdown in the navbar",
    tag: "Improved",
    images: ["/changelog/Veyl UI Installation Menu.png"],
    imageAlt: "The Resources dropdown in the Drop Navbar",
    description: "The Drop Navbar learned a new trick: a menu with a live preview of each page beside it.",
    points: [
      "Installation, Theming, Changelog, License and Contribute in one menu",
      "A small preview changes as you move over each item",
      "Community links to GitHub, npm and issues at the bottom",
    ],
    conclusion: "Everything you need is one hover away.",
  },
  {
    date: "2026-11-09",
    title: "Spotlight Footer",
    tag: "Added",
    images: ["/changelog/Elegant Acme Gradient Footer Mockup.png"],
    imageAlt: "The Spotlight Footer with its big lit word",
    description: "A footer with a huge word that lights up under your pointer. Also the footer of the landing page.",
    points: [
      "A big wordmark that follows the pointer with a spotlight",
      "Link columns and a quiet bottom bar",
      "Colours set with `--sf-` variables",
      "Added to the docs and the registry",
    ],
    conclusion: "The last block of the landing page, and the eighth component.",
  },
  {
    date: "2026-11-09",
    title: "Glass CTA",
    tag: "Added",
    images: ["/changelog/Make Your Next Page Feel Alive.png"],
    imageAlt: "The Glass CTA with its 3D cube",
    description: "A call-to-action built around a glass cube. Also the call-to-action section of the landing page.",
    points: [
      "A 3D cube made of glass faces that reacts to hover and click",
      "Soft glow, orbit dot and pulse in the accent colour",
      "Light and dark both handled",
      "Added to the docs and the registry",
    ],
    conclusion: "One strong ask, beautifully framed.",
  },
  {
    date: "2026-11-07",
    title: "FAQ",
    tag: "Added",
    images: ["/changelog/Warm Gradient FAQ Interface.png"],
    imageAlt: "The FAQ block with one answer open",
    description: "An accordion for the questions people always ask. Also the FAQ section of the landing page.",
    points: [
      "Smooth open and close",
      "Highlight colour set with `--fq-accent`",
      "Small polish on the hero badge and buttons",
    ],
    conclusion: "Answers before anyone has to ask.",
  },
  {
    date: "2026-11-06",
    title: "Components section on the landing page",
    tag: "Added",
    images: ["/changelog/Interactive Component Preview Dashboard.png"],
    imageAlt: "The Components section with a live preview and a phone view",
    description: "Try a component right on the landing page before you install anything.",
    points: [
      "A live preview of each component",
      "A phone view to see how it looks on a small screen",
      "A code tab, so you can copy what you see",
    ],
    conclusion: "See it, try it, copy it.",
  },
  {
    date: "2026-11-05",
    title: "Beam About and the About section",
    tag: "Added",
    images: ["/changelog/Three Steps to Clarity Dashboard.png"],
    imageAlt: "The Beam About block with its orbit scene",
    description: "An about block that tells its story in three small animated scenes.",
    points: [
      "An orbit scene, a typing scene and a checklist scene",
      "Its own docs page with a live demo",
      "Added to the landing page as the About section",
    ],
    conclusion: "A section that explains itself while it moves.",
  },
  {
    date: "2026-11-05",
    title: "Drop Navbar and the landing page begins",
    tag: "Added",
    images: ["/changelog/Veyl UI on a Sunny Gradient.png"],
    imageAlt: "The Drop Navbar with a dropdown open",
    description: "The navbar with menus that drop down, and the first pieces of the landing page.",
    points: [
      "Drop Navbar, with its docs page and registry entry",
      "An animated Veyl logo",
      "The landing page navbar and hero",
    ],
    conclusion: "The front door of Veyl is open.",
  },
  {
    date: "2026-11-02",
    title: "Design system, Nunito and an animated favicon",
    tag: "Improved",
    images: ["/changelog/Warm Glow V App Icon.png"],
    imageAlt: "The Veyl brand mark and colours",
    description: "Veyl got its own look: colours, a brand mark and a font used on every page.",
    points: [
      "Veyl design tokens for colour and surfaces",
      "The Veyl brand mark",
      "Nunito as the font of the whole site",
      "An animated favicon",
    ],
    conclusion: "From a pile of components to something that looks like one product.",
  },
  {
    date: "2026-11-01",
    title: "Install with one command",
    tag: "Added",
    images: ["/changelog/Veyl Documentation Installation Guide.png"],
    imageAlt: "The install command on a component page",
    description: "A shadcn registry, so any component can be added to a project with a single command.",
    points: [
      "A registry for Illuminated Hero, Flip Words and Bento Grid",
      "An install command on every docs page",
      "Flip Words now inherits your page font and brings its own CSS",
    ],
    conclusion: "Copy-paste got a lot shorter.",
  },
  {
    date: "2026-10-30",
    title: "The docs site",
    tag: "Docs",
    images: ["/changelog/Veyl Docs Introduction Page.png"],
    imageAlt: "The first version of the Veyl docs",
    description: "A clean, neutral docs site where the code you read is the code in the repo.",
    points: [
      "Light and dark mode with `next-themes`",
      "Code highlighting with `shiki`",
      "A page for every component",
      "Fixed a Bento Grid crash caused by a negative loop time",
    ],
    conclusion: "Pull request #1, merged.",
  },
  {
    date: "2026-10-29",
    title: "Bento Grid",
    tag: "Added",
    images: ["/changelog/Mint Gradient Coffee Traceability Dashboard.png"],
    imageAlt: "The Bento Grid with animated cards",
    description: "A five-card bento layout with glass cards and small animated scenes inside.",
    points: [
      "Glass-effect cards with animated skeleton contents",
      "Hover effects on every card",
      "Illuminated Hero is now sized by its container, with text passed as props",
      "A README for every component",
    ],
    conclusion: "The third component, and the first one with a story inside each card.",
  },
  {
    date: "2026-10-28",
    title: "Flip Words",
    tag: "Added",
    images: ["/changelog/Create Dynamic Digital Experiences.png"],
    imageAlt: "Flip Words with one word mid-flip",
    description: "A headline where one word cycles, and every letter flips on its own.",
    points: [
      "Letters rotate 360 degrees one after another",
      "Moved Illuminated Hero into the Veyl folder structure",
      "Images from Unsplash allowed in previews",
    ],
    conclusion: "The second component.",
  },
  {
    date: "2026-10-27",
    title: "Day 1: Veyl begins",
    tag: "Added",
    images: ["/changelog/Illuminated Glow Text Card.png"],
    imageAlt: "The first Illuminated Hero",
    description: "A new Next.js project, and the first block ever built for Veyl.",
    points: [
      "Scaffolded with Next.js, Tailwind, shadcn and motion",
      "Illuminated Hero, the very first component",
    ],
    conclusion: "Every library starts with one commit.",
  },
];

export type ChangeMonth = { id: string; label: string; entries: ChangeEntry[] };

const parse = (date: string) => new Date(`${date}T00:00:00Z`);

export function formatDay(date: string) {
  return parse(date).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
export function formatYear(date: string) {
  return String(parse(date).getUTCFullYear());
}
export function formatLong(date: string) {
  return parse(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/** Newest first, grouped by month. */
export function getMonths(): ChangeMonth[] {
  const sorted = [...changelog].sort((a, b) => b.date.localeCompare(a.date));
  const months: ChangeMonth[] = [];
  for (const entry of sorted) {
    const id = entry.date.slice(0, 7);
    let month = months.find((m) => m.id === id);
    if (!month) {
      month = {
        id,
        label: parse(entry.date).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }),
        entries: [],
      };
      months.push(month);
    }
    month.entries.push(entry);
  }
  return months;
}