import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/code-block";
import {
  Callout,
  Code,
  DocsPage,
  P,
  PageTitle,
  Pager,
  Section,
  SimpleTable,
  Step,
  Steps,
} from "@/components/docs/docs-ui";
import { InstallCommand } from "@/components/docs/install-command";

export const metadata: Metadata = { title: "Installation" };

const cnHelper = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

const darkVariant = `@import "tailwindcss";

/* Lets the dark: classes follow the .dark class on <html>. */
@custom-variant dark (&:is(.dark *));`;

export default function InstallationPage() {
  return (
    <DocsPage
      toc={[
        { id: "requirements", title: "Requirements" },
        { id: "setup", title: "Set up your project" },
        { id: "add", title: "Add a component" },
      ]}
    >
      <PageTitle
        title="Installation"
        description="Set up your project once. After that, every Veyl component is a copy and a paste."
      />

      <Section id="requirements" title="Requirements">
        <SimpleTable
          head={["Need", "Details"]}
          rows={[
            ["Node.js", "Version 20 or newer."],
            ["Next.js", "Version 15 or newer, with the App Router."],
            ["Tailwind CSS", "Version 4."],
            ["TypeScript", "All components are written in TypeScript."],
          ]}
        />
      </Section>

      <Section id="setup" title="Set up your project">
        <Steps>
          <Step number={1} title="Create a Next.js app">
            <P>
              Skip this if you already have one. Choose TypeScript, Tailwind CSS, the App Router
              and a <Code>src/</Code> folder when asked.
            </P>
            <CodeBlock lang="bash" code="npx create-next-app@latest my-app" />
          </Step>

          <Step number={2} title="Run the shadcn setup">
            <P>
              This is a quick way to get the <Code>cn()</Code> helper, the <Code>@/</Code> import
              alias and a light and dark theme. You do not need to use any shadcn components.
            </P>
            <CodeBlock lang="bash" code="npx shadcn@latest init" />
          </Step>

          <Step number={3} title="Check the cn() helper">
            <P>
              Open <Code>src/lib/utils.ts</Code>. It should contain exactly this. Veyl components
              use it to merge your <Code>className</Code> with their own.
            </P>
            <CodeBlock lang="ts" code={cnHelper} />
            <InstallCommand packages={["clsx", "tailwind-merge"]} />
          </Step>

          <Step number={4} title="Install motion">
            <P>
              Most components animate with <Code>motion</Code> (the new name of Framer Motion).
              Install it once. Always import from <Code>motion/react</Code>.
            </P>
            <InstallCommand packages={["motion"]} />
          </Step>

          <Step number={5} title="Turn on class-based dark mode">
            <P>
              Make sure your global CSS has this line. The shadcn setup usually adds it. Without
              it, the <Code>dark:</Code> classes follow the visitor&apos;s system setting instead of
              your toggle.
            </P>
            <CodeBlock lang="css" code={darkVariant} />
          </Step>
        </Steps>
      </Section>

      <Section id="add" title="Add a component">
        <P>
          Open any component page, such as the Illuminated Hero. Each page lists the packages to
          install and the files to copy, and shows the code for every file. A good place for the
          files is <Code>src/components/veyl/&lt;component-name&gt;/</Code>.
        </P>
        <Callout>
          Components import each other with relative paths, so you can put the folder anywhere. Only{" "}
          <Code>@/lib/utils</Code> needs the <Code>@/</Code> alias.
        </Callout>
      </Section>

      <Pager href="/docs/installation" />
    </DocsPage>
  );
}
