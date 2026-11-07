export type ShowcaseItem = {
  slug: "flip-words" | "drop-navbar" | "beam-about";
  title: string;
  /** A short label shown on the right of the list row. */
  tag: string;
  description: string;
  /** The snippet shown on the Code tab. */
  code: string;
};

/** The three components shown in the section. Add or reorder here. */
export const showcaseItems: ShowcaseItem[] = [
  {
    slug: "flip-words",
    title: "Flip Words",
    tag: "TEXT",
    description: "A word that turns letter by letter, then gives way to the next.",
    code: `import { FlipWords } from "@/components/veyl/flip-words";

export function Headline() {
  return (
    <h1>
      Make it <FlipWords words={["smooth", "alive", "fluid"]} duration={2800} />
    </h1>
  );
}`,
  },
  {
    slug: "drop-navbar",
    title: "Drop Navbar",
    tag: "NAV",
    description: "Drops in like water from a leaf as you scroll.",
    code: `import Link from "next/link";
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
  },
  {
    slug: "beam-about",
    title: "Beam About",
    tag: "SECTION",
    description: "Tiles linked by a beam of light, each with its own scene.",
    code: `import { BeamAbout, BeamOrbit, BeamTyping } from "@/components/veyl/beam-about";

export function About() {
  return (
    <BeamAbout
      title="What we do, in three steps"
      steps={[
        { title: "Choose", description: "Say what you offer.", visual: <BeamOrbit /> },
        {
          title: "Add",
          description: "Show how it works.",
          visual: <BeamTyping placeholder="Paste a command…" text="npx add thing" answer="Done" />,
        },
      ]}
    />
  );
}`,
  },
];