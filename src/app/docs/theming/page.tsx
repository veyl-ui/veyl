import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout, Code, DocsPage, P, Pager, Section, SimpleTable } from "@/components/docs/docs-ui";
import { ContrastMeters } from "@/components/docs/theming/contrast-meters";
import { DarkDemo } from "@/components/docs/theming/dark-demo";
import { FixList, Glow, HeroStage, Rise } from "@/components/docs/theming/motion";
import { ThemePlayground } from "@/components/docs/theming/playground";
import { RecipeCards } from "@/components/docs/theming/recipe-cards";
import { VariableTables } from "@/components/docs/theming/variable-tables";
import { WhatDemo } from "@/components/docs/theming/what-demo";
import { WhereCards } from "@/components/docs/theming/where-cards";
import { WhyCards } from "@/components/docs/theming/why-cards";

export const metadata: Metadata = { title: "Theming" };

const oneComponent = `<Faq
  className="[--fq-accent:#aa610e] dark:[--fq-accent:#f8a444]"
  items={items}
/>`;

const oneSection = `/* In your global CSS */
.pricing-theme .fq-root {
  --fq-accent: #aa610e;
}
.dark .pricing-theme .fq-root {
  --fq-accent: #f8a444;
}

/* In your page */
<div className="pricing-theme">
  <Faq items={items} />
</div>`;

const everywhere = `/* At the bottom of src/app/globals.css */
.fq-root {
  --fq-accent: #aa610e;
}
.dark .fq-root {
  --fq-accent: #f8a444;
}`;

const darkExample = `.fq-root {
  --fq-accent: #aa610e; /* light mode: deep enough to read on white */
}
.dark .fq-root {
  --fq-accent: #f8a444; /* dark mode: the same hue, but lighter */
}`;

const wontWork = `/* This does not work */
:root {
  --fq-accent: #aa610e;
}`;

/** Cells that light up on the grid: [column, row, delay in seconds]. */
const floorCells: [number, number, number][] = [
  [20, 1, 0], [24, 2, 1.1], [28, 1, 2.3], [17, 3, 3.4], [31, 3, 4.2], [22, 4, 0.7], [26, 5, 1.8], [19, 6, 2.9],
  [29, 6, 3.7], [23, 7, 4.8], [15, 8, 0.4], [33, 8, 1.5], [21, 9, 2.6], [27, 10, 3.1], [25, 3, 4.5], [18, 10, 5.1],
];
const ceilCells: [number, number, number][] = [
  [21, 1, 1.6], [26, 2, 3.0], [18, 3, 0.2], [30, 4, 2.1], [23, 5, 4.4], [16, 7, 3.6], [28, 8, 0.9], [24, 9, 5.0],
];

const facts = [
  { big: "Two minutes", small: "From idea to a finished theme" },
  { big: "One line", small: "No edits inside any component" },
  { big: "Light and dark", small: "Both handled for you" },
];

const fixes = [
  {
    q: "I changed a variable and nothing happened",
    a: (
      <>
        Check four things. The class name is spelled exactly as in the tables below. Your CSS is in your global stylesheet and not inside an{" "}
        <Code>@layer</Code>. You are not using <Code>:root</Code> on its own. You saved the file and refreshed. If you used a className, make sure it is
        on the component and not on a parent.
      </>
    ),
  },
  {
    q: "The text is hard to read",
    a: <>Your accent is too light for its background. Pick a darker colour for light mode, then check the contrast badge in the playground. Aim for 4.5:1 or more.</>,
  },
  {
    q: "Dark mode looks wrong",
    a: (
      <>
        You set the light value but not the dark one. Add a second rule that starts with <Code>.dark</Code> and use a lighter version of the same colour.
      </>
    ),
  },
  {
    q: "A component has no variables",
    a: (
      <>
        Flip Words has no colours of its own, since it takes its text colour from where you put it. The Bento Grid uses Tailwind classes such as{" "}
        <Code>bg-amber-500</Code> inside its files, so change those classes directly. The Illuminated Hero uses glow variables, described in the tables below.
      </>
    ),
  },
];

export default function ThemingPage() {
  return (
    <DocsPage
      toc={[
        { id: "what", title: "What theming means" },
        { id: "why", title: "Why it helps" },
        { id: "playground", title: "Try it" },
        { id: "where", title: "Where to put it" },
        { id: "dark", title: "Dark mode" },
        { id: "recipes", title: "Recipes" },
        { id: "variables", title: "Every variable" },
        { id: "contrast", title: "Contrast tips" },
        { id: "fix", title: "If something looks wrong" },
      ]}
    >
      <HeroStage className="tm-hero tm-stage">
        <div className="tm-grid" aria-hidden="true">
          <div className="tm-rig">
            <div className="tm-plane tm-floor">
              <div className="tm-cells">
                {floorCells.map(([c, r, d]) => (
                  <i key={`${c}-${r}`} style={{ "--c": c, "--r": r, "--d": `${d}s` } as React.CSSProperties} />
                ))}
              </div>
            </div>
            <div className="tm-plane tm-ceil">
              <div className="tm-cells">
                {ceilCells.map(([c, r, d]) => (
                  <i key={`${c}-${r}`} style={{ "--c": c, "--r": r, "--d": `${d}s` } as React.CSSProperties} />
                ))}
              </div>
            </div>
          </div>
          <div className="tm-spot" />
          <div className="tm-horizon" />
        </div>

        <div className="tm-d1 mx-auto max-w-3xl pb-4 pt-8 text-center sm:pt-12">
          <h1 className="tm-title mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Make Veyl yours.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
            Pick one colour and watch every component follow. Light, dark and all, in about two minutes.
          </p>
        </div>

        <div className="tm-d2 mx-auto mt-10 grid max-w-3xl gap-3 pb-6 sm:grid-cols-3">
          {facts.map((f, i) => (
            <Rise key={f.big} i={i + 1}>
              <Glow className="tm-lift h-full rounded-xl border border-border bg-surface px-4 py-4 text-center">
                <p className="text-lg font-semibold tracking-tight text-foreground">{f.big}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{f.small}</p>
              </Glow>
            </Rise>
          ))}
        </div>
      </HeroStage>

      <Section id="what" title="What theming means">
        <P>
          Each Veyl component keeps its colours in a few named settings. They are called CSS variables. For example, <Code>--fq-accent</Code> is the
          highlight colour of the FAQ. Give that setting a new value and the FAQ uses it.
        </P>
        <P>You never edit the component itself, so you can still update it later.</P>
        <WhatDemo />
      </Section>

      <Section id="why" title="Why it helps">
        <WhyCards />
        <P>Themes are useful on a landing page, a docs site, a dashboard, or a client project where the brand colour is not amber.</P>
      </Section>

      <Section id="playground" title="Try it">
        <P>This is a playground. Nothing you do here is saved, so play freely. Follow the four steps from top to bottom.</P>
        <Rise soft>
          <ThemePlayground />
        </Rise>
        <Callout>
          The light and dark button switches the whole page, just as your visitors would see it. Switch back any time with the sun and moon in the header.
        </Callout>
      </Section>

      <Section id="where" title="Where to put it">
        <P>The code from step 3 can go in three places. Pick one.</P>
        <WhereCards />
        <h3 className="pt-2 font-medium text-foreground">On one component</h3>
        <Rise soft>
          <CodeBlock lang="tsx" code={oneComponent} />
        </Rise>
        <h3 className="pt-2 font-medium text-foreground">On one section</h3>
        <Rise soft>
          <CodeBlock lang="tsx" code={oneSection} />
        </Rise>
        <h3 className="pt-2 font-medium text-foreground">Everywhere</h3>
        <Rise soft>
          <CodeBlock lang="css" code={everywhere} />
        </Rise>
        <Callout>
          It is tempting to write the variable on <Code>:root</Code>. That does not work, because every component sets its own default on its own
          element, and a value set on the element beats a value passed down from above. Always use the component&apos;s class, as in the examples.
        </Callout>
        <Rise soft>
          <CodeBlock lang="css" code={wontWork} />
        </Rise>
      </Section>

      <Section id="dark" title="Dark mode">
        <P>
          Veyl follows the <Code>dark</Code> class on your <Code>&lt;html&gt;</Code> tag. Every component already has one set of values for light
          and another for dark. To theme both, write two rules: one for light and one that starts with <Code>.dark</Code>.
        </P>
        <DarkDemo />
        <Rise soft>
          <CodeBlock lang="css" code={darkExample} />
        </Rise>
        <P>
          The dark colour is lighter than the light one. A deep colour that reads well on white disappears on near-black, so the same hue needs to
          be lifted. The playground does this for you, which is why its code has two colours.
        </P>
        <P>To test it, use the light and dark button in step 2, or the sun and moon in the header.</P>
      </Section>

      <Section id="recipes" title="Recipes">
        <P>Want a result now? Copy a ready-made theme. Each one is the global CSS from the &quot;Everywhere&quot; option, with both modes included.</P>
        <RecipeCards />
      </Section>

      <Section id="variables" title="Every variable">
        <P>
          These are all the colour variables, taken from the real code. The small square shows the colour. Click a value to copy it. Components set
          these on themselves, so reach each one through the class shown above its table.
        </P>
        <VariableTables />
      </Section>

      <Section id="contrast" title="Contrast tips">
        <P>
          Contrast is how different two colours look. If your text and its background are too close, people cannot read it. The usual rule is a
          ratio of 4.5 to 1 for text. The badge in the playground checks this for you.
        </P>
        <ContrastMeters />
        <SimpleTable
          head={["Where the colour is used", "Aim for"]}
          rows={[
            [<>Text, such as <Code>--fq-accent-ink</Code></>, "4.5 to 1 or more."],
            [<>Rings, bars and glows, such as <Code>--fq-accent</Code></>, "3 to 1 is enough."],
            ["Light mode", "Pick a deeper colour. Lower the lightness."],
            ["Dark mode", "Pick a lighter colour. Raise the lightness."],
          ]}
        />
        <Callout>
          In your browser, open developer tools and click a colour swatch. Most browsers show the contrast ratio right in the colour picker.
        </Callout>
      </Section>

      <Section id="fix" title="If something looks wrong">
        <FixList items={fixes} />
      </Section>

      <Pager href="/docs/theming" />
    </DocsPage>
  );
}