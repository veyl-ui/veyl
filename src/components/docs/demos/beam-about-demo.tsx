import { BeamAbout, BeamChecklist, BeamOrbit, BeamTyping } from "@/registry/veyl/beam-about";

export function BeamAboutDemo() {
  return (
    <div className="flex h-full items-center overflow-y-auto p-6 sm:p-10">
      <BeamAbout
        eyebrow="About us"
        title="What we do, in three steps"
        description="A short story with a light that moves through it."
        steps={[
          { title: "Choose", description: "Say what you offer in one plain sentence.", visual: <BeamOrbit /> },
          {
            title: "Ask",
            description: "Show how simple it is to use.",
            visual: <BeamTyping placeholder="Ask anything…" text="What did we decide on Friday?" answer="Found it in the notes" />,
          },
          {
            title: "Finish",
            description: "Explain what the visitor gains.",
            visual: <BeamChecklist title="Working" doneTitle="All done" items={["Step one", "Step two", "Step three"]} />,
          },
        ]}
      />
    </div>
  );
}