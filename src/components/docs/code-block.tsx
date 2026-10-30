import { highlight, type Lang } from "@/lib/docs/source";
import { CopyButton } from "./copy-button";

/** A highlighted code box with a copy button. Highlighting happens on the server. */
export async function CodeBlock({ code, lang }: { code: string; lang: Lang }) {
  const html = await highlight(code, lang);
  return (
    <div className="docs-code relative overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <CopyButton text={code} className="absolute right-2.5 top-2.5" />
    </div>
  );
}
