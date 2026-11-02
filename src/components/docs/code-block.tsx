import { highlight, type Lang } from "@/lib/docs/source";
import { CopyButton } from "./copy-button";

/** A highlighted code box with a copy button. Highlighting happens on the server. */
export async function CodeBlock({ code, lang }: { code: string; lang: Lang }) {
  const html = await highlight(code, lang);
  return (
    <div className="docs-code relative overflow-hidden rounded-md border border-border bg-surface">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <CopyButton text={code} className="absolute right-2.5 top-2.5" />
    </div>
  );
}
