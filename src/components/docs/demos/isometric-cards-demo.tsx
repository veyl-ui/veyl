import { IsometricCards } from "@/registry/veyl/isometric-cards";

const cards = [
  {
    face: "left" as const,
    title: "Modular by design",
    callouts: ["Tokens", "Tests", "Docs"] as [string, string, string],
    description: "Snap components together. Every block ships with its own tokens, tests, and docs.",
  },
  {
    face: "top" as const,
    title: "Open the lid on performance",
    callouts: ["Zero runtime", "Tree-shaking", "Typed API"] as [string, string, string],
    description: "Zero-runtime styles and tree-shaken exports keep your bundle small.",
  },
  {
    face: "right" as const,
    title: "Themes that travel",
    callouts: ["One token file", "Web + native", "Dark mode"] as [string, string, string],
    description: "One token file re-skins every block across web and native.",
  },
];

export function IsometricCardsDemo() {
  return (
    <div className="px-4 py-10">
      <IsometricCards
        cards={cards}
        heading="Build with blocks, not boilerplate"
        subheading="Hover each card, or tap on a touch screen. A different face of the block slides away every time."
      />
    </div>
  );
}