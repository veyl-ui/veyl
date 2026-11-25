'use client';

import React, {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Check, RotateCcw, ArrowUpRight, Quote} from 'lucide-react';
import {INITIAL_TASKS} from './features-data';
import {getTaskProgress, type ActionTask} from './features-logic';

const TRANSCRIPT_LINES = [
  {
    timestamp: '14:59',
    speaker: 'Dana Ruiz',
    text: 'I will send the recap to the team right after we close this call.',
    linkedTaskId: 't1',
  },
  {
    timestamp: '18:12',
    speaker: 'Sam Okafor',
    text: 'Dock spring curves are feeling super crisp on 120Hz displays.',
    linkedTaskId: null,
  },
  {
    timestamp: '22:40',
    speaker: 'Priya Nair',
    text: 'I will share the draft roadmap before Thursday morning standup.',
    linkedTaskId: 't2',
  },
  {
    timestamp: '26:05',
    speaker: 'Dana Ruiz',
    text: 'Great, let us make sure the CoreAudio buffer notes are included.',
    linkedTaskId: null,
  },
  {
    timestamp: '30:05',
    speaker: 'Sam Okafor',
    text: 'I can book the design review for Monday so everyone can sign off.',
    linkedTaskId: 't3',
  },
];

export default function FeatureActionsScreen() {
  const [tasks, setTasks] = useState<ActionTask[]>(INITIAL_TASKS);
  const [activeTaskId, setActiveTaskId] = useState<string>('t3');
  const [autoScan, setAutoScan] = useState(true);

  const progress = getTaskProgress(tasks);

  useEffect(() => {
    if (!autoScan) return;
    const ids = tasks.map((t) => t.id);
    const interval = setInterval(() => {
      setActiveTaskId((current) => {
        const idx = ids.indexOf(current);
        return ids[(idx + 1) % ids.length];
      });
    }, 3200);
    return () => clearInterval(interval);
  }, [autoScan, tasks]);

  const toggleTask = (id: string) => {
    setAutoScan(false);
    setActiveTaskId(id);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? {...task, done: !task.done} : task))
    );
  };

  const selectTask = (id: string) => {
    setAutoScan(false);
    setActiveTaskId(id);
  };

  const resetTasks = () => {
    setTasks(INITIAL_TASKS);
    setActiveTaskId('t3');
    setAutoScan(true);
  };

  const activeTask = tasks.find((t) => t.id === activeTaskId) ?? tasks[0];

  return (
    <div
      data-testid="feature-screen-actions"
      className="flex h-full flex-col gap-3.5"
    >
      {/* Top Synchronized Pipeline Progress Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141417] px-4 py-3 shadow-2xs dark:shadow-none">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            Commitment Pipeline
          </span>
          <span className="text-zinc-400 dark:text-zinc-600" aria-hidden="true">
            ·
          </span>
          <span className="font-mono text-xs tabular-nums text-zinc-700 dark:text-zinc-300">
            {progress.done} of {progress.total} done
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/[0.07]">
            <motion.div
              className="h-full rounded-full bg-orange-500"
              animate={{width: `${progress.percent}%`}}
              transition={{type: 'spring', stiffness: 300, damping: 28}}
            />
          </div>
          <button
            type="button"
            onClick={resetTasks}
            aria-label="Reset action items"
            className="flex items-center gap-1 rounded-md border border-zinc-200 dark:border-white/[0.08] bg-zinc-50 dark:bg-white/[0.03] px-2 py-1 text-[11px] text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-white/[0.08] cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Synchronized Split View */}
      <div className="grid flex-1 grid-cols-1 gap-3.5 md:grid-cols-12 min-h-0">
        {/* Left: Live Transcript Stream */}
        <div className="flex flex-col rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111114] p-3.5 shadow-2xs dark:shadow-none md:col-span-6">
          <div className="mb-2.5 flex items-center justify-between border-b border-zinc-200/80 dark:border-white/[0.06] pb-2">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Source Transcript
            </span>
            <span className="font-mono text-[11px] text-zinc-500">
              Product Sync · 34m
            </span>
          </div>

          <div className="mac-scroll flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
            {TRANSCRIPT_LINES.map((line) => {
              const isLinked = line.linkedTaskId === activeTaskId;
              return (
                <button
                  key={line.timestamp}
                  type="button"
                  disabled={!line.linkedTaskId}
                  onClick={() => line.linkedTaskId && selectTask(line.linkedTaskId)}
                  className={`rounded-lg border p-2.5 text-left transition-all ${
                    isLinked
                      ? 'border-orange-400/70 bg-orange-50/90 dark:border-orange-500/45 dark:bg-orange-500/[0.08] cursor-pointer'
                      : line.linkedTaskId
                        ? 'border-zinc-200/80 bg-zinc-50/70 hover:border-zinc-300 dark:border-white/[0.05] dark:bg-[#16161A] dark:hover:border-white/[0.14] cursor-pointer'
                        : 'border-transparent bg-transparent opacity-60 cursor-default'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-zinc-900 dark:text-zinc-200">
                      {line.speaker}
                    </span>
                    <span className="font-mono tabular-nums text-orange-600 dark:text-orange-400">
                      {line.timestamp}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {line.text}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Extracted Action Items */}
        <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141417] p-3.5 shadow-2xs dark:shadow-none md:col-span-6">
          <div className="mb-2.5 flex items-center justify-between border-b border-zinc-200/80 dark:border-white/[0.06] pb-2">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Detected Owners & Deadlines
            </span>
            <span className="text-[11px] text-zinc-500">Click to toggle</span>
          </div>

          <div className="flex flex-1 flex-col gap-2.5">
            {tasks.map((task) => {
              const isSelected = task.id === activeTaskId;
              return (
                <div
                  key={task.id}
                  className={`relative rounded-lg border p-3 transition-all ${
                    isSelected
                      ? 'border-zinc-300 bg-zinc-50 dark:border-white/20 dark:bg-[#1B1B20]'
                      : 'border-zinc-200/75 bg-white dark:border-white/[0.06] dark:bg-[#0F0F12] hover:border-zinc-300 dark:hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      aria-label={`Mark "${task.title}" as ${task.done ? 'incomplete' : 'done'}`}
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors cursor-pointer ${
                        task.done
                          ? 'border-emerald-600 bg-emerald-500/15 text-emerald-600 dark:border-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400'
                          : 'border-zinc-300 dark:border-zinc-600 bg-transparent text-transparent hover:border-orange-500'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => selectTask(task.id)}
                      className="flex-1 text-left cursor-pointer"
                    >
                      <div
                        className={`text-xs font-medium transition-colors ${
                          task.done
                            ? 'text-zinc-400 line-through'
                            : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                          <span
                            className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-zinc-950"
                            style={{backgroundColor: task.accentColor}}
                          >
                            {task.initials}
                          </span>
                          <span>{task.owner}</span>
                          <span aria-hidden="true">·</span>
                          <span>{task.due}</span>
                        </div>
                        <span className="inline-flex items-center gap-0.5 font-mono tabular-nums text-orange-600 dark:text-orange-400">
                          {task.timestamp}
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTask.id}
              initial={{opacity: 0, y: 4}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -4}}
              transition={{duration: 0.16}}
              className="mt-3 flex items-start gap-2 rounded-lg border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0D0D10] p-2.5 text-xs text-zinc-700 dark:text-zinc-300"
            >
              <Quote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-600 dark:text-orange-400" />
              <span className="leading-relaxed">{activeTask.quote}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}