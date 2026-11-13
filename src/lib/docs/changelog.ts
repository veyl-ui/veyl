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