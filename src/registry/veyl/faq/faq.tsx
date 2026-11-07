"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import "./faq.css";

export type FaqItem = {
  /** Optional. Items with the same category are grouped under one title. */
  category?: string;
  question: string;
  answer: ReactNode;
};

export type FaqProps = {
  items: FaqItem[];
  /** Small flowing label above the title. Leave out to hide it. */
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  /** Which question starts open. Use null to start with everything closed. */
  defaultOpen?: number | null;
  /** Show 01, 02, 03 before each question. */
  numbered?: boolean;
  className?: string;
};

/** Group items by category, keeping each item's global index so only one is open at a time. */
function groupByCategory(items: FaqItem[]) {
  const groups: { category?: string; entries: { item: FaqItem; index: number }[] }[] = [];
  items.forEach((item, index) => {
    const last = groups[groups.length - 1];
    // Same category joins its group. Items with no category join the previous uncategorised group.
    const group = item.category ? groups.find((g) => g.category === item.category) : last && !last.category ? last : undefined;
    if (group) group.entries.push({ item, index });
    else groups.push({ category: item.category, entries: [{ item, index }] });
  });
  return groups;
}

export function Faq({
  items,
  eyebrow,
  title,
  description,
  defaultOpen = 0,
  numbered = true,
  className,
}: FaqProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const groups = groupByCategory(items);

  return (
    <div className={cn("fq-root w-full", className)}>
      {(eyebrow || title || description) && (
        <div className="mb-12 text-center">
          {eyebrow && (
            <p className="mb-3 text-sm font-semibold">
              <span className="fq-eyebrow">{eyebrow}</span>
            </p>
          )}
          {title && <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>}
          {description && (
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed" style={{ color: "var(--fq-muted)" }}>
              {description}
            </p>
          )}
        </div>
      )}

      <div className="space-y-8">
        {groups.map(({ category, entries }, groupIndex) => (
          <div key={category ?? `group-${groupIndex}`}>
            {category && (
              <div className="fq-label">
                <h3 className="text-base font-medium">{category}</h3>
                <span className="font-mono text-[11px]" style={{ color: "var(--fq-muted)" }}>
                  {entries.length} {entries.length === 1 ? "question" : "questions"}
                </span>
              </div>
            )}

            <div className="grid gap-2">
              {entries.map(({ item, index }) => {
                const open = expandedIndex === index;
                const buttonId = `${baseId}-q-${index}`;
                const panelId = `${baseId}-a-${index}`;
                return (
                  <div key={index} data-open={open} className="fq-card">
                    <h4>
                      <button
                        id={buttonId}
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setExpandedIndex(open ? null : index)}
                        className="fq-button"
                      >
                        <span className="text-[15px] font-medium">
                          {numbered && <span className="fq-number">{String(index + 1).padStart(2, "0")}</span>}
                          {item.question}
                        </span>
                        <span aria-hidden className="fq-icon" />
                      </button>
                    </h4>
                    {/* inert keeps a closed answer's links out of the tab order */}
                    <div id={panelId} role="region" aria-labelledby={buttonId} className="fq-panel" inert={!open}>
                      <div>
                        <div className="fq-answer">{item.answer}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}