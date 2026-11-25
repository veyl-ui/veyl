'use client';

import React, {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Copy, Check, FileText} from 'lucide-react';
import {EXPORT_FORMATS} from './features-data';

type FormatId = (typeof EXPORT_FORMATS)[number]['id'];

export default function FeatureDigestScreen() {
  const [activeFormat, setActiveFormat] = useState<FormatId>('markdown');
  const [autoCycle, setAutoCycle] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!autoCycle) return;
    const interval = setInterval(() => {
      setActiveFormat((prev) => {
        const idx = EXPORT_FORMATS.findIndex((f) => f.id === prev);
        return EXPORT_FORMATS[(idx + 1) % EXPORT_FORMATS.length].id;
      });
    }, 3400);
    return () => clearInterval(interval);
  }, [autoCycle]);

  const currentDoc =
    EXPORT_FORMATS.find((f) => f.id === activeFormat) ?? EXPORT_FORMATS[0];

  const handleCopy = async () => {
    setAutoCycle(false);
    try {
      await navigator.clipboard?.writeText(currentDoc.content);
    } catch {
      // Clipboard API may be restricted in headless contexts
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      data-testid="feature-screen-digest"
      className="flex h-full flex-col gap-3.5"
    >
      {/* Top Format Selector + Copy Action */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141417] p-2.5 shadow-2xs dark:shadow-none">
        <div
          role="tablist"
          aria-label="Export target formats"
          className="flex items-center gap-1 rounded-lg bg-zinc-100 dark:bg-[#0D0D10] p-1"
        >
          {EXPORT_FORMATS.map((fmt) => {
            const isSelected = fmt.id === activeFormat;
            return (
              <button
                key={fmt.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setAutoCycle(false);
                  setActiveFormat(fmt.id);
                }}
                className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'text-white dark:text-zinc-950'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="digest-format-pill"
                    transition={{type: 'spring', stiffness: 420, damping: 32}}
                    className="absolute inset-0 rounded-md bg-zinc-900 dark:bg-zinc-100"
                  />
                )}
                <span className="relative z-10">{fmt.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Copy ${currentDoc.label} output`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.05] px-3 py-1.5 text-xs font-medium text-zinc-900 dark:text-zinc-100 transition-colors hover:bg-zinc-100 dark:hover:bg-white/[0.1] whitespace-nowrap cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
              <span>Copy Output</span>
            </>
          )}
        </button>
      </div>

      {/* Live Document Output Studio */}
      <div className="grid flex-1 grid-cols-1 gap-3.5 md:grid-cols-12 min-h-0">
        {/* Left Source Metadata Summary */}
        <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111114] p-4 shadow-2xs dark:shadow-none md:col-span-4">
          <div>
            <span className="text-[11px] font-medium text-zinc-500">
              Source Session
            </span>
            <h4 className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Product Sync · Aug 18
            </h4>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Raw 34-minute conversation distilled into clean, destination-ready structure.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-zinc-200/80 dark:border-white/[0.06] pt-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Decisions</span>
              <span className="font-mono tabular-nums text-zinc-800 dark:text-zinc-200">2 locked</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Action items</span>
              <span className="font-mono tabular-nums text-zinc-800 dark:text-zinc-200">3 assigned</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Target</span>
              <span className="font-mono text-orange-600 dark:text-orange-400">{currentDoc.label}</span>
            </div>
          </div>
        </div>

        {/* Right Formatted Output Preview */}
        <div className="flex flex-col overflow-hidden rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#0D0D10] shadow-2xs dark:shadow-none md:col-span-8">
          <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#141417] px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
              <FileText className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
              <span className="font-mono text-[11px]">{currentDoc.filename}</span>
            </div>
            <span className="text-[11px] text-zinc-500">Ready to paste</span>
          </div>

          <div className="mac-scroll flex-1 overflow-y-auto p-4">
            <AnimatePresence mode="wait">
              <motion.pre
                key={currentDoc.id}
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -6}}
                transition={{duration: 0.18}}
                className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200"
              >
                {currentDoc.content}
              </motion.pre>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}