"use client";

import { useEffect, useState } from "react";
import { useBeamStep } from "./beam-step";

/* ------------------------------------------------------------------ */
/* 1. Orbit: small chips fan out around a waveform.                    */
/* ------------------------------------------------------------------ */

const GLYPHS = [
  <circle key="0" cx="12" cy="12" r="6" fill="currentColor" />,
  <rect key="1" x="6" y="6" width="12" height="12" rx="3" fill="currentColor" />,
  <path key="2" d="M12 5l7.5 13h-15z" fill="currentColor" />,
  <circle key="3" cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="3" />,
  <path key="4" d="M12 4l8 8-8 8-8-8z" fill="currentColor" />,
  <path key="5" d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />,
  <path key="6" d="M12 4l7 4v8l-7 4-7-4V8z" fill="currentColor" />,
  <path key="7" d="M13 3L5 14h6l-1 7 8-11h-6z" fill="currentColor" />,
];
const TINTS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#14b8a6", "#f97316", "#ec4899"];

export function BeamOrbit({ radiusX = 104, radiusY = 66 }: { radiusX?: number; radiusY?: number }) {
  const { reached } = useBeamStep();
  return (
    <div className="ba-orb" data-on={reached} aria-hidden>
      <div className="ba-wave text-neutral-900 dark:text-neutral-50">
        <i /> <i /> <i /> <i />
      </div>
      {GLYPHS.map((glyph, i) => {
        const a = (i / GLYPHS.length) * Math.PI * 2 - Math.PI / 2;
        return (
          <span
            key={i}
            className="ba-orb-chip"
            style={{
              ["--x" as string]: `${Math.round(Math.cos(a) * radiusX)}px`,
              ["--y" as string]: `${Math.round(Math.sin(a) * radiusY)}px`,
              ["--c" as string]: TINTS[i],
              ["--d" as string]: `${i * 90}ms`,
            }}
          >
            <svg viewBox="0 0 24 24" className="size-3.5">{glyph}</svg>
          </span>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Typing: a box types a line, then the send button presses.        */
/* ------------------------------------------------------------------ */

export function BeamTyping({
  placeholder,
  text,
  answer,
  mono = false,
}: {
  placeholder: string;
  text: string;
  answer?: string;
  /** Use a monospace font for the typed line, handy for commands. */
  mono?: boolean;
}) {
  const { reached, reduced } = useBeamStep();
  const [count, setCount] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      setSent(true);
      return;
    }
    if (!reached) {
      setCount(0);
      setSent(false);
      return;
    }
    let i = 0;
    let after: ReturnType<typeof setTimeout>;
    const start = setTimeout(() => {
      const timer = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) {
          clearInterval(timer);
          after = setTimeout(() => setSent(true), 280);
        }
      }, 55);
    }, 350);
    return () => {
      clearTimeout(start);
      clearTimeout(after);
    };
  }, [reached, reduced, text]);

  const typing = reached || reduced;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-5" aria-hidden>
      <div className="ba-input" data-active={typing && !sent}>
        <div className={mono ? "min-w-0 flex-1 truncate font-mono text-xs" : "min-w-0 flex-1 truncate text-sm"}>
          {typing ? (
            <>
              <span className="text-neutral-900 dark:text-neutral-50">{text.slice(0, count)}</span>
              {!sent && <span className="ba-caret" />}
            </>
          ) : (
            <span className="text-neutral-400 dark:text-neutral-500">{placeholder}</span>
          )}
        </div>
        <span className="ba-send" data-sent={sent}>
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" />
          </svg>
        </span>
      </div>
      {answer && (
        <div className="ba-answer" data-on={sent}>
          <svg viewBox="0 0 24 24" className="size-3.5 text-[var(--ba-accent)]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5l5 5L20 6.5" />
          </svg>
          {answer}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Checklist: rows tick off one after another.                      */
/* ------------------------------------------------------------------ */

export function BeamChecklist({ title, doneTitle, items }: { title: string; doneTitle: string; items: string[] }) {
  const { reached, reduced } = useBeamStep();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduced) {
      setCount(items.length);
      return;
    }
    if (!reached) {
      setCount(0);
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= items.length) clearInterval(timer);
      }, 600);
    }, 450);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [reached, reduced, items.length]);

  const done = count >= items.length;
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-5" aria-hidden>
      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <svg viewBox="0 0 24 24" className={`size-3.5 ${reached && !done ? "ba-spin" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {done ? <path d="M4 12.5l5 5L20 6.5" /> : <path d="M20 12a8 8 0 11-2.4-5.7M20 4v5h-5" />}
        </svg>
        {done ? doneTitle : title}
      </div>
      {items.map((item, i) => (
        <div key={item} className="ba-row" data-on={i < count}>
          <span className="ba-row-dot" />
          <span className="min-w-0 flex-1 truncate">{item}</span>
          <svg viewBox="0 0 24 24" className="ba-check size-3.5 text-[var(--ba-accent)]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12.5l5 5L20 6.5" pathLength={1} />
          </svg>
        </div>
      ))}
    </div>
  );
}