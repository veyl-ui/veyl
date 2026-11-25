'use client';

import React, {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Mic, Pause, Play, CalendarCheck2, Volume2} from 'lucide-react';
import {CONNECTED_APPS, SPEAKERS_DATA} from './features-data';
import {formatElapsedSeconds} from './features-logic';

const KEY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y'],
  ['A', 'S', 'D', 'F', 'G', 'H'],
];

const WAVE_BARS = [
  0.32, 0.58, 0.85, 0.45, 0.95, 0.62, 0.4, 0.78, 0.92, 0.54, 0.35, 0.72, 0.88,
  0.48, 0.64, 0.9, 0.42, 0.75, 0.52, 0.84, 0.46, 0.68, 0.36, 0.55,
];

export default function FeatureBentoScreen() {
  const [isRecording, setIsRecording] = useState(true);
  const [elapsedSec, setElapsedSec] = useState(21);
  const [activeKey, setActiveKey] = useState<string>('R');
  const [keyPulseTick, setKeyPulseTick] = useState(0);

  const [appIndex, setAppIndex] = useState(0);
  const [appLocked, setAppLocked] = useState(false);

  const [resolvedCount, setResolvedCount] = useState(3);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>('sp1');

  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    if (appLocked) return;
    const interval = setInterval(() => {
      setAppIndex((prev) => (prev + 1) % CONNECTED_APPS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [appLocked]);

  useEffect(() => {
    const cycle = setInterval(() => {
      setResolvedCount((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 2800);
    return () => clearInterval(cycle);
  }, []);

  const handleKeyPress = (key: string) => {
    setActiveKey(key);
    setKeyPulseTick((t) => t + 1);
    if (key === 'R' || key === 'SPACE') {
      setIsRecording((prev) => !prev);
    }
  };

  const currentApp = CONNECTED_APPS[appIndex];
  const selectedSpeaker =
    SPEAKERS_DATA.find((s) => s.id === selectedSpeakerId) ?? SPEAKERS_DATA[0];

  return (
    <div
      data-testid="feature-screen-capture"
      className="grid h-full grid-cols-1 gap-3.5 md:grid-cols-12"
    >
      {/* Left Stack: 2 Bento Cards */}
      <div className="flex flex-col gap-3.5 md:col-span-6">
        {/* BENTO 1: One Shortcut + Keyboard Visual */}
        <div className="group relative flex flex-1 flex-col justify-between rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141417] p-3.5 shadow-2xs dark:shadow-none transition-colors hover:border-zinc-300 dark:hover:border-white/[0.15]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRecording((r) => !r)}
                aria-label={isRecording ? 'Pause simulated recording' : 'Resume simulated recording'}
                className="flex h-7 items-center gap-1.5 rounded-md border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.04] px-2.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-colors hover:bg-zinc-100 dark:hover:bg-white/[0.09] cursor-pointer"
              >
                {isRecording ? (
                  <Pause className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                ) : (
                  <Play className="h-3 w-3 text-zinc-600 dark:text-zinc-300" />
                )}
                <span>{isRecording ? 'Recording' : 'Paused'}</span>
                <span className="font-mono text-[11px] tabular-nums text-orange-600 dark:text-orange-400">
                  {formatElapsedSeconds(elapsedSec)}
                </span>
              </button>
            </div>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Press <kbd className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{activeKey}</kbd>
            </span>
          </div>

          {/* Interactive Mini Keyboard */}
          <div className="my-2.5 flex flex-col gap-1.5 rounded-lg border border-zinc-200/80 dark:border-white/[0.05] bg-zinc-100/80 dark:bg-[#0D0D10] p-2">
            {KEY_ROWS.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className={`flex gap-1.5 ${rowIdx === 1 ? 'pl-3' : ''}`}
              >
                {row.map((key) => {
                  const isHighlighted = key === activeKey;
                  return (
                    <motion.button
                      key={key}
                      type="button"
                      onClick={() => handleKeyPress(key)}
                      animate={
                        isHighlighted && isRecording
                          ? {scale: [1, 0.94, 1]}
                          : {scale: 1}
                      }
                      transition={{
                        duration: 1.8,
                        repeat: isHighlighted && isRecording ? Infinity : 0,
                        ease: 'easeInOut',
                      }}
                      whileTap={{scale: 0.9, y: 1}}
                      className={`flex h-7 flex-1 items-center justify-center rounded-md border font-mono text-xs font-medium transition-colors cursor-pointer ${
                        isHighlighted
                          ? 'border-orange-500/60 bg-orange-500/15 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.18)]'
                          : 'border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#1A1A1F] text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      {key}
                    </motion.button>
                  );
                })}
              </div>
            ))}
            <div className="flex gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => handleKeyPress('⌘')}
                className={`flex h-6 w-14 items-center justify-center rounded-md border font-mono text-[11px] transition-colors cursor-pointer ${
                  activeKey === '⌘'
                    ? 'border-orange-500/60 bg-orange-500/15 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300'
                    : 'border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#1A1A1F] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                ⌘
              </button>
              <button
                type="button"
                onClick={() => handleKeyPress('SPACE')}
                className={`flex h-6 flex-1 items-center justify-center rounded-md border font-mono text-[11px] transition-colors cursor-pointer ${
                  activeKey === 'SPACE'
                    ? 'border-orange-500/60 bg-orange-500/15 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300'
                    : 'border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-[#1A1A1F] text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                space
              </button>
            </div>
          </div>

          <div className="flex items-end justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                One shortcut
              </h4>
              <p className="mt-0.5 text-xs leading-snug text-zinc-600 dark:text-zinc-400">
                Start from any key. No meeting bots or extra windows.
              </p>
            </div>
            <span
              key={keyPulseTick}
              className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap shrink-0"
            >
              Tap any key
            </span>
          </div>
        </div>

        {/* BENTO 2: Works with every app + Continuous Live Waveform */}
        <div className="flex flex-1 flex-col justify-between rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141417] p-3.5 shadow-2xs dark:shadow-none transition-colors hover:border-zinc-300 dark:hover:border-white/[0.15]">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="block text-[11px] text-zinc-500">Now connected</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentApp.id}
                  initial={{opacity: 0, y: 4}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: -4}}
                  transition={{duration: 0.18}}
                  className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  {currentApp.name}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Volume2 className="h-3.5 w-3.5" />
              <span>Live</span>
            </div>
          </div>

          {/* Continuous animated audio waveform */}
          <div
            aria-hidden="true"
            className="my-2.5 flex h-12 items-center justify-between gap-1 rounded-lg border border-zinc-200/80 dark:border-white/[0.05] bg-zinc-100/80 dark:bg-[#0D0D10] px-3"
          >
            {WAVE_BARS.map((baseHeight, idx) => (
              <motion.span
                key={idx}
                className="h-8 w-1 rounded-full origin-center"
                style={{backgroundColor: currentApp.color}}
                animate={
                  isRecording
                    ? {
                        scaleY: [
                          baseHeight * 0.4,
                          Math.min(1, baseHeight * 1.1),
                          baseHeight * 0.5,
                          baseHeight * 0.95,
                        ],
                        opacity: [0.65, 1, 0.72, 0.95],
                      }
                    : {scaleY: 0.18, opacity: 0.35}
                }
                transition={{
                  duration: 1.0 + (idx % 5) * 0.15,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                  delay: idx * 0.04,
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Works with every app
              </h4>
              <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                Click an app to test CoreAudio hook:
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5">
            {CONNECTED_APPS.map((app, idx) => {
              const selected = idx === appIndex;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    setAppIndex(idx);
                    setAppLocked(true);
                  }}
                  aria-label={`Switch audio source to ${app.name}`}
                  className={`flex h-7 flex-1 items-center justify-center rounded-md border font-mono text-[10px] font-semibold transition-all cursor-pointer ${
                    selected
                      ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white/25 dark:bg-white/10 dark:text-white'
                      : 'border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#1B1B20] text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/15 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  {app.short}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Tall Bento: Knows Who Is Who */}
      <div className="flex flex-col justify-between rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#141417] p-4 shadow-2xs dark:shadow-none md:col-span-6 transition-colors hover:border-zinc-300 dark:hover:border-white/[0.15]">
        <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-white/[0.06] pb-3">
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Knows who is who
            </h4>
            <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
              People are matched to your calendar automatically.
            </p>
          </div>
          <Mic className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0" />
        </div>

        <div className="my-3 flex flex-1 flex-col justify-center gap-2.5">
          {SPEAKERS_DATA.map((speaker, idx) => {
            const isResolved = idx < resolvedCount;
            const isSelected = speaker.id === selectedSpeakerId;
            return (
              <button
                key={speaker.id}
                type="button"
                onClick={() => {
                  setSelectedSpeakerId(speaker.id);
                  setResolvedCount(3);
                }}
                className={`w-full rounded-lg border p-3 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-orange-500/50 bg-orange-50/70 dark:border-orange-500/40 dark:bg-[#1B1B20]'
                    : 'border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50/80 dark:bg-[#0E0E11] hover:border-zinc-300 dark:hover:border-white/[0.14]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-zinc-950"
                      style={{
                        backgroundColor: isResolved ? speaker.color : '#A1A1AA',
                      }}
                    >
                      {isResolved ? speaker.initials : `S${idx + 1}`}
                    </div>
                    <div className="min-w-0">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isResolved ? speaker.name : speaker.rawLabel}
                          initial={{opacity: 0, y: 3}}
                          animate={{opacity: 1, y: 0}}
                          exit={{opacity: 0, y: -3}}
                          transition={{duration: 0.2}}
                          className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100"
                        >
                          {isResolved ? speaker.name : speaker.rawLabel}
                        </motion.div>
                      </AnimatePresence>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {isResolved ? speaker.role : 'Identifying voiceprint...'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex h-4 items-end gap-0.5" aria-hidden="true">
                      {[0.4, 0.9, 0.6, 0.8].map((h, bIdx) => (
                        <motion.span
                          key={bIdx}
                          className="w-0.5 rounded-full bg-zinc-500 dark:bg-zinc-400"
                          animate={
                            isRecording && isSelected
                              ? {height: ['4px', `${Math.round(h * 14)}px`, '5px']}
                              : {height: '4px'}
                          }
                          transition={{
                            duration: 0.8 + bIdx * 0.15,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[11px] tabular-nums text-zinc-600 dark:text-zinc-400">
                      {speaker.talkShare}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-zinc-200/80 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0D0D10] p-3">
          <div className="flex items-center justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1.5">
              <CalendarCheck2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Matched to your calendar
            </span>
            <span className="font-mono tabular-nums text-zinc-700 dark:text-zinc-400">
              {selectedSpeaker.name}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={selectedSpeaker.id}
              initial={{opacity: 0, y: 4}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -4}}
              transition={{duration: 0.16}}
              className="mt-1.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300"
            >
              “{selectedSpeaker.sampleQuote}”
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}