import { BeamAbout, BeamChecklist, BeamOrbit, BeamTyping } from "@/registry/veyl/beam-about";
import { ButtonLink } from "@/components/shared/button-link";
import { Reveal } from "@/components/shared/reveal";

export function About() {
  return (
    <div id="about" className="mx-auto w-full max-w-page scroll-mt-24 px-5 py-24 sm:px-8">
      <Reveal>
        <BeamAbout
          eyebrow="About Veyl"
          title="Animated components you copy and own"
          description="Veyl is a library of ready-made React components with smooth motion built in. Here's the short version."
          steps={[
            {
              title: "Choose",
              description: "Finished hero sections, navbars and grids. They already look good and already move well.",
              visual: <BeamOrbit />,
            },
            {
              title: "Add",
              description: "Run one command. The files land in your project, with no package to depend on.",
              visual: (
                <BeamTyping
                  mono
                  placeholder="Paste a command…"
                  text="npx shadcn add flip-words"
                  answer="3 files added"
                />
              ),
            },
            {
              title: "Make it yours",
              description: "Edit the code to match your brand. Dark mode and reduced motion come built in.",
              visual: (
                <BeamChecklist
                  title="Setting up"
                  doneTitle="Ready to ship"
                  items={["Matches your brand", "Dark mode included", "Edit any file"]}
                />
              ),
            },
          ]}
          actions={
            <>
              <ButtonLink href="/docs/components/drop-navbar">Browse components</ButtonLink>
              <ButtonLink href="/docs" variant="secondary">
                Read the docs
              </ButtonLink>
            </>
          }
        />
      </Reveal>
    </div>
  );
}