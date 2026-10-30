"use client";

import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

export type SourceFile = {
  /** File name, such as flip-words.tsx */
  name: string;
  /** The raw code, for the copy button. */
  code: string;
  /** The same code, already highlighted on the server. */
  html: string;
};

type Props = {
  /** The live demo. */
  children: ReactNode;
  files: SourceFile[];
  /** Height of the frame in pixels. */
  height: number;
  /** Centre the demo (for small things like a headline). */
  centered?: boolean;
};

/** A framed live demo with a Preview / Code switch. */
export function ComponentPreview({ children, files, height, centered = false }: Props) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [fileIndex, setFileIndex] = useState(0);
  const file = files[fileIndex] ?? files[0];

  return (
    <div className="mt-8">
      <div
        role="tablist"
        aria-label="Preview or code"
        className="inline-flex rounded-md bg-neutral-100 p-0.5 text-sm dark:bg-neutral-900"
      >
        {(["preview", "code"] as const).map((id) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "rounded-[5px] px-3.5 py-1.5 font-medium capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100",
              tab === id
                ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
            )}
          >
            {id}
          </button>
        ))}
      </div>

      {tab === "preview" ? (
        <div
          role="tabpanel"
          className="mt-3 rounded-md border border-neutral-200 bg-neutral-100 p-3 dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div
            style={{ height }}
            className={cn(
              "relative overflow-hidden rounded-md bg-white shadow-sm dark:bg-black",
              centered && "flex items-center justify-center p-6",
            )}
          >
            {children}
          </div>
        </div>
      ) : (
        <div
          role="tabpanel"
          className="mt-3 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800"
        >
          <div className="flex items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50 px-2 py-2 dark:border-neutral-800 dark:bg-neutral-900/60">
            <div className="flex min-w-0 gap-1 overflow-x-auto">
              {files.map((f, i) => (
                <button
                  key={f.name}
                  type="button"
                  onClick={() => setFileIndex(i)}
                  aria-pressed={i === fileIndex}
                  className={cn(
                    "shrink-0 rounded-md px-2.5 py-1 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100",
                    i === fileIndex
                      ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-neutral-100"
                      : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
                  )}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <CopyButton text={file.code} />
          </div>
          <div
            className="docs-code max-h-[32rem] overflow-auto bg-neutral-50 dark:bg-neutral-900/60"
            dangerouslySetInnerHTML={{ __html: file.html }}
          />
        </div>
      )}
    </div>
  );
}
