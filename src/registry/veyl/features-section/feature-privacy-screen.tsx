'use client';

import React, {useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Cpu, HardDrive, CloudOff, Lock, Share2, Mic} from 'lucide-react';

export default function FeaturePrivacyScreen() {
  const [shareMode, setShareMode] = useState<'local' | 'selective'>('local');

  const isLocalOnly = shareMode === 'local';

  return (
    <div
      data-testid="feature-screen-privacy"
      className="flex h-full flex-col justify-between gap-3.5"
    >
      {/* Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141417] px-4 py-3 shadow-2xs dark:shadow-none">
        <div>
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            Data Boundary Inspector
          </span>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Inspect how audio and transcripts move across your hardware.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-white/[0.08] bg-zinc-100 dark:bg-[#0D0D10] p-1">
          <button
            type="button"
            onClick={() => setShareMode('local')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              isLocalOnly
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Local-Only (Default)
          </button>
          <button
            type="button"
            onClick={() => setShareMode('selective')}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              !isLocalOnly
                ? 'bg-orange-500 text-white dark:text-zinc-950'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Selective Share
          </button>
        </div>
      </div>

      {/* Architectural Node & Conduit Diagram */}
      <div className="relative flex flex-1 flex-col justify-center overflow-hidden rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#111114] p-5 shadow-2xs dark:shadow-none">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-11">
          {/* Local Enclave Zone */}
          <div className="relative rounded-xl border border-emerald-500/35 dark:border-emerald-500/25 bg-emerald-50/50 dark:bg-[#15171A] p-4 md:col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                This Mac · Encrypted Enclave
              </span>
              <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                AES-256-GCM
              </span>
            </div>

            <div className="relative flex flex-col gap-3">
              {/* Node 1: CoreAudio */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0D0D10] px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Mic className="h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                  <div>
                    <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      CoreAudio Loopback
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      48kHz in-memory buffer
                    </div>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">RAM</span>
              </div>

              <div className="relative mx-auto h-5 w-px bg-emerald-500/25 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className="h-2.5 w-full bg-emerald-500 dark:bg-emerald-400"
                  animate={{y: [-10, 22]}}
                  transition={{duration: 1.1, repeat: Infinity, ease: 'linear'}}
                />
              </div>

              {/* Node 2: Neural Engine */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0D0D10] px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Cpu className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <div>
                    <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      Apple Neural Engine
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      Whisper + speaker diarization
                    </div>
                  </div>
                </div>
                <span className="font-mono text-[11px] text-orange-600 dark:text-orange-400">
                  100% Local
                </span>
              </div>

              <div className="relative mx-auto h-5 w-px bg-emerald-500/25 dark:bg-white/10 overflow-hidden">
                <motion.div
                  className="h-2.5 w-full bg-emerald-500 dark:bg-emerald-400"
                  animate={{y: [-10, 22]}}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 0.45,
                  }}
                />
              </div>

              {/* Node 3: SQLite Vault */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-200/80 dark:border-white/[0.07] bg-white dark:bg-[#0D0D10] px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <HardDrive className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                      Encrypted Local Vault
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      ~/Library/Application Support/Cadence
                    </div>
                  </div>
                </div>
                <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Air-Gap Gate */}
          <div className="flex flex-col items-center justify-center gap-2 md:col-span-1">
            <div className="relative flex h-12 w-full items-center justify-center">
              <div className="h-0.5 w-full bg-zinc-200 dark:bg-white/10" />
              {isLocalOnly ? (
                <motion.div
                  animate={{x: [-16, 0, -16]}}
                  transition={{duration: 2, repeat: Infinity, ease: 'easeInOut'}}
                  className="absolute h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400"
                />
              ) : (
                <motion.div
                  animate={{x: [-18, 18]}}
                  transition={{duration: 1.3, repeat: Infinity, ease: 'linear'}}
                  className="absolute h-2 w-2 rounded-full bg-orange-500 dark:bg-orange-400"
                />
              )}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
              {isLocalOnly ? 'Blocked' : 'E2EE'}
            </span>
          </div>

          {/* Cloud / External Zone */}
          <div
            className={`flex h-full flex-col justify-between rounded-xl border p-4 transition-colors md:col-span-3 ${
              isLocalOnly
                ? 'border-zinc-200/80 bg-zinc-50 dark:border-white/[0.06] dark:bg-[#0D0D10]'
                : 'border-orange-300 bg-orange-50/70 dark:border-orange-500/35 dark:bg-orange-500/[0.05]'
            }`}
          >
            <div className="flex items-center justify-between">
              {isLocalOnly ? (
                <CloudOff className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
              ) : (
                <Share2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              )}
              <span className="font-mono text-[10px] text-zinc-500">
                External
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={shareMode}
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -6}}
                transition={{duration: 0.18}}
                className="my-4"
              >
                <div className="font-mono text-xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
                  {isLocalOnly ? '0 bytes' : '4.2 KB'}
                </div>
                <div className="mt-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {isLocalOnly
                    ? 'Sent this month'
                    : 'Single summary payload'}
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
                  {isLocalOnly
                    ? 'Raw audio and transcripts never leave your drive.'
                    : 'Only the redacted Markdown recap leaves via signed link.'}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="border-t border-zinc-200/80 dark:border-white/[0.06] pt-2.5 font-mono text-[10px] text-zinc-500">
              {isLocalOnly ? 'Training opt-out: Enforced' : 'Audio stays on Mac'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Metric Strip */}
      <div className="grid grid-cols-3 gap-2.5 text-xs">
        <div className="rounded-lg border border-zinc-200/80 dark:border-white/[0.06] bg-white dark:bg-[#141417] px-3 py-2">
          <span className="block text-[11px] text-zinc-500">Audio Storage</span>
          <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">On-Disk Only</span>
        </div>
        <div className="rounded-lg border border-zinc-200/80 dark:border-white/[0.06] bg-white dark:bg-[#141417] px-3 py-2">
          <span className="block text-[11px] text-zinc-500">Cloud Bots</span>
          <span className="font-mono font-medium text-zinc-800 dark:text-zinc-200">0 Joined</span>
        </div>
        <div className="rounded-lg border border-zinc-200/80 dark:border-white/[0.06] bg-white dark:bg-[#141417] px-3 py-2">
          <span className="block text-[11px] text-zinc-500">Model Training</span>
          <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">Never Used</span>
        </div>
      </div>
    </div>
  );
}