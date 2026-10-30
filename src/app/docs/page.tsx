import type { Metadata } from "next";
import Link from "next/link";
import { componentDocs } from "@/lib/docs/components";
import { DocsPage, P, PageTitle, Pager, Section } from "@/components/docs/docs-ui";
import { ArrowRightIcon } from "@/components/docs/icons";

export const metadata: Metadata = { title: "Introduction" };

const principles = [
  {
    title: "You own the code",
    text: "Veyl is not a package you depend on. You copy a component into your project, and from then on it is yours to read, change and delete.",
  },
  {
    title: "Made for Next.js and Tailwind",
    text: "Every component is TypeScript, works with the App Router, and is styled with Tailwind v4 or its own scoped CSS. Nothing leaks into the rest of your site.",
  },
  {
    title: "Motion that is easy on people",
    text: "Animation is there to guide the eye, not to shout. The Illuminated Hero and Bento Grid stop moving for anyone who has turned on reduce motion.",
  },
];

export default function IntroductionPage() {
  return (
    <DocsPage
      toc={[
        { id: "principles", title: "How Veyl works" },
        { id: "components", title: "Components" },
        { id: "start", title: "Start here" },
      ]}
    >
      <PageTitle
        title="Introduction"
        description="Veyl is a small collection of animated React components for Next.js. Quietly alive, beautifully built."
      />

      <Section id="principles" title="How Veyl works">
        <div className="grid gap-4 sm:grid-cols-3">
          {principles.map((item) => (
            <div
              key={item.title}
              className="rounded-md border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="components" title="Components">
        <div className="grid gap-3 sm:grid-cols-2">
          {componentDocs.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/components/${doc.slug}`}
              className="group rounded-md border border-neutral-200 p-4 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-900/60 dark:focus-visible:outline-neutral-100"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{doc.title}</h3>
                <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-xs text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                  {doc.kind}
                </span>
              </div>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {doc.description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                View
                <ArrowRightIcon
                  width={14}
                  height={14}
                  className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="start" title="Start here">
        <P>
          New to Veyl? Follow the <Link className="font-medium text-neutral-900 underline underline-offset-4 dark:text-neutral-100" href="/docs/installation">installation guide</Link> once
          to set up your project. After that, adding a component takes three steps: install its
          packages, copy its files, and use it.
        </P>
      </Section>

      <Pager href="/docs" />
    </DocsPage>
  );
}
