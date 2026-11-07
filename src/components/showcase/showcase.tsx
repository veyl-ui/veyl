import { Reveal } from "@/components/shared/reveal";
import { highlight } from "@/lib/docs/source";
import { showcaseItems } from "./data";
import { ShowcaseStage } from "./showcase-stage";
import "./showcase.css";

/** The "Components" section: pick a component, watch it run, switch to its code. */
export async function Showcase() {
  const items = await Promise.all(
    showcaseItems.map(async (item) => ({ ...item, codeHtml: await highlight(item.code, "tsx") })),
  );

  return (
    <section id="components" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto w-full max-w-page px-5 py-24 sm:px-8">
        <Reveal className="mb-10 max-w-xl">
          <p className="mb-3 text-sm font-semibold">
            <span className="sc-eyebrow">Components</span>
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">See it move before you copy it</h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Pick one. The stage runs the real component, on desktop or on a phone. Switch to Code to see exactly what
            you get.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ShowcaseStage items={items} />
        </Reveal>
      </div>
    </section>
  );
}