import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { demos } from "@/components/docs/demos";
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
import { PropsTable } from "@/components/docs/props-table";
import { componentDocs, getDoc } from "@/lib/docs/components";
import { highlight, langOf, readSource } from "@/lib/docs/source";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return componentDocs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  return doc ? { title: doc.title, description: doc.description } : {};
}

export default async function ComponentPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  // The Code tab shows the real files from src/registry/veyl/<slug>/.
  const files = await Promise.all(
    doc.files.map(async (name) => {
      const code = await readSource(doc.slug, name);
      return { name, code, html: await highlight(code, langOf(name)) };
    }),
  );

  const hasHelper = doc.dependencies.includes("clsx");
  let step = 0;

  return (
    <DocsPage
      toc={[
        { id: "installation", title: "Installation" },
        { id: "usage", title: "Usage" },
        { id: "props", title: "Props" },
        { id: "requirements", title: "Requirements" },
        { id: "notes", title: "Good to know" },
      ]}
    >
      <PageTitle title={doc.title} description={doc.description} />

      <ComponentPreview files={files} height={doc.previewHeight} centered={doc.centered}>
        {demos[doc.slug]}
      </ComponentPreview>

      <Section id="installation" title="Installation">
        <Steps>
          <Step number={++step} title="Install the packages">
            {doc.dependencies.length > 0 ? (
              <InstallCommand packages={doc.dependencies} />
            ) : (
              <P>This component needs no extra packages.</P>
            )}
          </Step>

          {hasHelper ? (
            <Step number={++step} title="Add the cn() helper">
              <P>
                The component imports <Code>cn</Code> from <Code>@/lib/utils</Code>. If your
                project does not have it yet, see the{" "}
                <a
                  href="/docs/installation"
                  className="font-medium text-neutral-900 underline underline-offset-4 dark:text-neutral-100"
                >
                  installation guide
                </a>
                .
              </P>
            </Step>
          ) : null}

          <Step number={++step} title="Copy the files">
            <P>
              Copy every file from the Code tab above into one folder, for example{" "}
              <Code>src/components/veyl/{doc.slug}/</Code>.
            </P>
            <ul className="space-y-1.5 text-sm">
              {doc.files.map((name) => (
                <li key={name}>
                  <Code>
                    {doc.slug}/{name}
                  </Code>
                </li>
              ))}
            </ul>
          </Step>

          {doc.setup.map((item) => (
            <SetupStepBlock key={item.title} number={++step} item={item} />
          ))}
        </Steps>
      </Section>

      <Section id="usage" title="Usage">
        <CodeBlock lang="tsx" code={doc.usage} />
      </Section>

      <Section id="props" title="Props">
        {doc.props.map((group) => (
          <div key={group.title} className="space-y-3">
            {doc.props.length > 1 ? (
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{group.title}</h3>
            ) : null}
            <PropsTable rows={group.rows} />
          </div>
        ))}
      </Section>

      <Section id="requirements" title="Requirements">
        <SimpleTable
          head={["Need", "Details"]}
          rows={doc.requirements.map((r) => [r.need, r.detail])}
        />
      </Section>

      <Section id="notes" title="Good to know">
        <ul className="list-disc space-y-2 pl-5 marker:text-neutral-400">
          {doc.notes.map((note) => (
            <li key={note} className="leading-7 text-neutral-600 dark:text-neutral-400">
              {note}
            </li>
          ))}
        </ul>
        <Callout>
          Something unclear or broken? Open an issue on{" "}
          <a
            href="https://github.com/veyl-ui/veyl/issues"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-neutral-900 underline underline-offset-4 dark:text-neutral-100"
          >
            GitHub
          </a>
          .
        </Callout>
      </Section>

      <Pager href={`/docs/components/${doc.slug}`} />
    </DocsPage>
  );
}

function SetupStepBlock({
  number,
  item,
}: {
  number: number;
  item: (typeof componentDocs)[number]["setup"][number];
}) {
  return (
    <Step number={number} title={item.title}>
      {item.description ? <P>{item.description}</P> : null}
      <CodeBlock lang={item.lang} code={item.code} />
    </Step>
  );
}
