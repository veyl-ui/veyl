'use client';

import React, {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Search, X, Users, Clock} from 'lucide-react';
import {MEETING_NOTES} from './features-data';
import {filterMeetingNotes} from './features-logic';

const DEMO_QUERIES = ['launch date', 'budget', 'latency'];

export default function FeatureSearchScreen() {
  const [query, setQuery] = useState('launch date');
  const [userEdited, setUserEdited] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string>('n1');

  useEffect(() => {
    if (userEdited) return;
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % DEMO_QUERIES.length;
      setQuery(DEMO_QUERIES[idx]);
    }, 3600);
    return () => clearInterval(interval);
  }, [userEdited]);

  const results = filterMeetingNotes(MEETING_NOTES, query);
  const activeNote =
    results.find((n) => n.id === selectedNoteId) ?? results[0] ?? null;

  const renderHighlightedSnippet = (snippet: string, term: string) => {
    const clean = term.trim();
    if (!clean) return snippet;
    const idx = snippet.toLowerCase().indexOf(clean.toLowerCase());
    if (idx === -1) return snippet;
    const before = snippet.slice(0, idx);
    const match = snippet.slice(idx, idx + clean.length);
    const after = snippet.slice(idx + clean.length);
    return (
      <>
        {before}
        <mark className="rounded bg-orange-100 dark:bg-orange-500/25 px-1 py-0.5 font-medium text-orange-800 dark:text-orange-200">
          {match}
        </mark>
        {after}
      </>
    );
  };

  return (
    <div
      data-testid="feature-screen-search"
      className="flex h-full flex-col gap-3.5"
    >
      {/* Spotlight Command Input Bar */}
      <div className="rounded-xl border border-zinc-200/90 dark:border-white/[0.1] bg-white dark:bg-[#141417] p-3 shadow-2xs dark:shadow-none">
        <div className="flex items-center gap-2.5">
          <Search className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0" />
          <label htmlFor="spotlight-search-input" className="sr-only">
            Search meeting transcripts
          </label>
          <input
            id="spotlight-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setUserEdited(true);
              setQuery(e.target.value);
            }}
            placeholder="Search decisions, budgets, people..."
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setUserEdited(true);
                setQuery('');
              }}
              aria-label="Clear search query"
              className="rounded p-1 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/[0.08] hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <span className="hidden sm:inline-block font-mono text-[11px] tabular-nums text-zinc-500 whitespace-nowrap">
            {results.length} results · 0.2s
          </span>
        </div>

        {/* Quick Query Presets */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 border-t border-zinc-200/80 dark:border-white/[0.06] pt-2.5">
          <span className="text-[11px] text-zinc-500 mr-1">Try:</span>
          {DEMO_QUERIES.map((preset) => {
            const isSelected = query.toLowerCase() === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setUserEdited(true);
                  setQuery(preset);
                }}
                className={`rounded-md border px-2 py-0.5 text-[11px] font-mono transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-orange-500/50 bg-orange-500/15 text-orange-700 dark:text-orange-300'
                    : 'border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#1B1B20] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results List + Context Preview Drawer */}
      <div className="grid flex-1 grid-cols-1 gap-3.5 md:grid-cols-12 min-h-0">
        {/* Left: Filtered Hits */}
        <div className="mac-scroll flex flex-col gap-2 overflow-y-auto rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111114] p-3 shadow-2xs dark:shadow-none md:col-span-6">
          {results.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                No matching segments for “{query}”
              </p>
              <button
                type="button"
                onClick={() => {
                  setUserEdited(true);
                  setQuery('launch date');
                }}
                className="mt-2 rounded-md border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.05] px-2.5 py-1 text-[11px] text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.1] cursor-pointer"
              >
                Reset to “launch date”
              </button>
            </div>
          ) : (
            results.map((note) => {
              const isSelected = activeNote?.id === note.id;
              return (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => {
                    setUserEdited(true);
                    setSelectedNoteId(note.id);
                  }}
                  className={`rounded-lg border p-2.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-orange-400/70 bg-orange-50/70 dark:border-orange-500/45 dark:bg-[#1B1B20]'
                      : 'border-zinc-200/80 dark:border-white/[0.05] bg-zinc-50/70 dark:bg-[#151518] hover:border-zinc-300 dark:hover:border-white/[0.14]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {note.title}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-500 shrink-0">
                      {note.date}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {renderHighlightedSnippet(note.snippet, query)}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Right: Context Drawer */}
        <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141417] p-4 shadow-2xs dark:shadow-none md:col-span-6">
          {activeNote ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNote.id}
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -6}}
                transition={{duration: 0.16}}
                className="flex h-full flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Selected Context</span>
                    <span className="font-mono tabular-nums text-orange-600 dark:text-orange-400">
                      {activeNote.matchCount} mentions
                    </span>
                  </div>
                  <h4 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {activeNote.title}
                  </h4>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activeNote.date} · {activeNote.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {activeNote.participants.length} attendees
                    </span>
                  </div>

                  <div className="mt-4 rounded-lg border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0D0D10] p-3 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
                    “{renderHighlightedSnippet(activeNote.snippet, query)}”
                  </div>
                </div>

                <div className="mt-4 border-t border-zinc-200/80 dark:border-white/[0.06] pt-3">
                  <span className="block text-[11px] text-zinc-500">
                    Participants
                  </span>
                  <div className="mt-1 text-xs text-zinc-700 dark:text-zinc-300">
                    {activeNote.participants.join(' · ')}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-1 items-center justify-center text-xs text-zinc-500">
              Select a matching meeting to inspect context.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}