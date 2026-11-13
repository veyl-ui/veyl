import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/code-block";
import { Checklist, WaysToContribute } from "@/components/docs/contribute/contribute-cards";
import { ContributionGraph } from "@/components/docs/contribute/contribution-graph";
import { Code, DocsPage, P, Pager, Section, Step, Steps } from "@/components/docs/docs-ui";
import { Glow, Rise } from "@/components/docs/theming/motion";

export const metadata: Metadata = { title: "Contribute" };

const REPO = "https://github.com/veyl-ui/veyl";

const tree = `src/registry/veyl/<name>/
  <name>.tsx          the component
  <name>.css          its variables and styles
  index.ts            exports
  README.md           what it is and how to use it

src/components/docs/demos/    the demo on the docs page
src/lib/docs/components.ts    the entry in the docs list
registry.json                 the install entry`;

export default function ContributePage() {
  return (
    <DocsPage
      toc={[
        { id: "ways", title: "Ways to contribute" },
        { id: "setup", title: "Get set up" },
        { id: "component", title: "Add a component" },
        { id: "pull-request", title: "Before your pull request" },
        { id: "kind", title: "Be kind" },
      ]}
    >
      <div className="relative isolate">
        <ContributionGraph className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />

        <header className="flex min-h-[22rem] flex-col justify-center py-10 sm:min-h-[26rem]">
          <p className="tm-pop-in text-sm text-muted-foreground">Contribute</p>
          <h1 className="tm-title mt-4 text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Help shape Veyl.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-foreground/80 sm:text-xl sm:leading-9">
            Found a bug, have an idea, or want to build the next component? Everything starts on GitHub, and every
            contribution counts.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <a
              href={`${REPO}/fork`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-foreground bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Fork on GitHub
            </a>
            <a
              href={`${REPO}/issues/new`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border bg-background/70 px-4 py-2.5 text-sm font-medium text-foreground backdrop-blur transition-[transform,border-color] hover:-translate-y-0.5 hover:border-brand/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Open an issue
            </a>
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border bg-background/70 px-4 py-2.5 text-sm font-medium text-foreground backdrop-blur transition-[transform,border-color] hover:-translate-y-0.5 hover:border-brand/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Read the code
            </a>
          </div>
        </header>
      </div>

      <Section id="ways" title="Ways to contribute">
        <P>You don&apos;t need to write code to help.</P>
        <WaysToContribute />
      </Section>

      <Section id="setup" title="Get set up">
        <P>Five steps from a fork to a running docs site.</P>
        <Steps>
          <Step number={1} title="Fork and clone">
            <CodeBlock lang="bash" code={`git clone https://github.com/<your-name>/veyl.git\ncd veyl`} />
          </Step>
          <Step number={2} title="Install">
            <CodeBlock lang="bash" code="npm install" />
          </Step>
          <Step number={3} title="Start the docs site">
            <CodeBlock lang="bash" code="npm run dev" />
          </Step>
          <Step number={4} title="Make a branch">
            <CodeBlock lang="bash" code="git checkout -b feat/my-component" />
          </Step>
          <Step number={5} title="Check the build before you push">
            <CodeBlock lang="bash" code={`npm run build\nnpx shadcn@latest build`} />
          </Step>
        </Steps>
      </Section>

      <Section id="component" title="Add a component">
        <P>
          Every component lives in one folder, and four other places list it. Start by copying a small one, like FAQ.
        </P>
        <div className="grid gap-3 lg:grid-cols-[1.15fr_1fr]">
          <Rise soft className="min-w-0">
            <CodeBlock lang="bash" code={tree} />
          </Rise>
          <Rise soft i={1} className="min-w-0">
            <Glow className="h-full rounded-xl border border-border bg-surface p-5">
              <h3 className="mb-3 font-medium text-foreground">House rules</h3>
              <Checklist
                items={[
                  <>
                    Start every variable with a short prefix, like <Code>--fq-</Code>
                  </>,
                  <>
                    Put the defaults inside <Code>@layer components</Code> so users can override them
                  </>,
                  "Make it work in light and dark",
                  "Respect reduced motion",
                  "Take colours from variables, never hard-code them",
                ]}
              />
            </Glow>
          </Rise>
        </div>
      </Section>

      <Section id="pull-request" title="Before your pull request">
        <Checklist
          items={[
            <>
              The build passes with <Code>npm run build</Code>
            </>,
            "You tried it at phone width and desktop width",
            "You tested light and dark",
            "The pull request has a screenshot or a short screen recording",
            "It does one thing. Two ideas make two pull requests",
          ]}
        />
      </Section>

      <Section id="kind" title="Be kind">
        <P>
          Veyl is a small, friendly project. Be patient, be specific, and assume good intent. By contributing, you agree
          that your work is shared under the project&apos;s licence.
        </P>
      </Section>

      <Rise soft className="mt-14">
        <Glow className="rounded-2xl border border-border bg-surface px-6 py-9 text-center [background-image:radial-gradient(60%_90%_at_50%_130%,color-mix(in_srgb,var(--brand)_22%,transparent),transparent)]">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Ready? Pick something small.</h2>
          <p className="mt-2 text-muted-foreground">Look for issues labelled “good first issue”.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            <a
              href={`${REPO}/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-foreground bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Browse issues
            </a>
            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-[transform,border-color] hover:-translate-y-0.5 hover:border-brand/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Star the repo
            </a>
          </div>
        </Glow>
      </Rise>

      <Pager href="/docs/contribute" />
    </DocsPage>
  );
}