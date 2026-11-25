'use client';

import React, {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Calendar, ArrowRight, History, CheckCircle2} from 'lucide-react';
import {CALENDAR_SLOTS} from './features-data';

export default function FeatureCalendarScreen() {
  const [selectedId, setSelectedId] = useState<string>(CALENDAR_SLOTS[0].id);
  const [autoAdvance, setAutoAdvance] = useState(true);

  useEffect(() => {
    if (!autoAdvance) return;
    const interval = setInterval(() => {
      setSelectedId((prev) => {
        const idx = CALENDAR_SLOTS.findIndex((c) => c.id === prev);
        return CALENDAR_SLOTS[(idx + 1) % CALENDAR_SLOTS.length].id;
      });
    }, 3800);
    return () => clearInterval(interval);
  }, [autoAdvance]);

  const activeSlot =
    CALENDAR_SLOTS.find((c) => c.id === selectedId) ?? CALENDAR_SLOTS[0];

  return (
    <div
      data-testid="feature-screen-calendar"
      className="grid h-full grid-cols-1 gap-3.5 md:grid-cols-12"
    >
      {/* Left: Chronological Today Timeline */}
      <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111114] p-4 shadow-2xs dark:shadow-none md:col-span-5">
        <div>
          <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Today’s Schedule
              </span>
            </div>
            <span className="font-mono text-[11px] text-zinc-500">
              3 briefings
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-2.5">
            {CALENDAR_SLOTS.map((slot) => {
              const isSelected = slot.id === selectedId;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => {
                    setAutoAdvance(false);
                    setSelectedId(slot.id);
                  }}
                  className={`relative rounded-lg border p-3 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-orange-400/70 bg-orange-50/70 dark:border-orange-500/45 dark:bg-[#1B1B20]'
                      : 'border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/70 dark:bg-[#151518] hover:border-zinc-300 dark:hover:border-white/[0.14]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs tabular-nums text-orange-600 dark:text-orange-400">
                      {slot.time}
                    </span>
                    <span className="text-[11px] text-zinc-500">{slot.app}</span>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {slot.title}
                  </div>
                  <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                    {slot.attendees.join(' · ')}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0D0D10] px-3 py-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span>Pre-call brief trigger</span>
          <span className="font-mono text-zinc-800 dark:text-zinc-200">T-2m before start</span>
        </div>
      </div>

      {/* Right: Layered Pre-Meeting Context Dossier */}
      <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141417] p-5 shadow-2xs dark:shadow-none md:col-span-7">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlot.id}
            initial={{opacity: 0, x: 10}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: -10}}
            transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
            className="flex h-full flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                  Last met {activeSlot.lastMet}
                </span>
                <span className="font-mono tabular-nums text-zinc-500">
                  {activeSlot.time} · {activeSlot.app}
                </span>
              </div>

              <h4 className="mt-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                {activeSlot.title}
              </h4>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                With {activeSlot.attendees.join(' and ')}
              </p>

              {/* Carry-over Thread Callout */}
              <div className="mt-4 rounded-xl border border-orange-200 dark:border-orange-500/25 bg-orange-50/80 dark:bg-orange-500/[0.06] p-3.5">
                <span className="block text-[11px] font-medium text-orange-700 dark:text-orange-300">
                  Open Thread from Last Session
                </span>
                <p className="mt-1 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
                  {activeSlot.carryOver}
                </p>
              </div>

              {/* Prior Decisions */}
              <div className="mt-4">
                <span className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  Prior Decisions Referenced
                </span>
                <ul className="mt-2 flex flex-col gap-2">
                  {activeSlot.decisions.map((decision) => (
                    <li
                      key={decision}
                      className="flex items-start gap-2 rounded-lg border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0E0E11] px-3 py-2 text-xs text-zinc-700 dark:text-zinc-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>{decision}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-zinc-200/80 dark:border-white/[0.06] pt-3 text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">
                Ready before you click Join
              </span>
              <button
                type="button"
                onClick={() => {
                  setAutoAdvance(false);
                  const idx = CALENDAR_SLOTS.findIndex((c) => c.id === selectedId);
                  setSelectedId(
                    CALENDAR_SLOTS[(idx + 1) % CALENDAR_SLOTS.length].id
                  );
                }}
                className="inline-flex items-center gap-1 font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 cursor-pointer"
              >
                <span>Next meeting</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}