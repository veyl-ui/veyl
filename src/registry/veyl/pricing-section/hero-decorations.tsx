'use client';

import React, { useId } from 'react';
import { AudioLines, Globe, Headphones, Mic, Terminal, Waves } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

const CHIP =
  'absolute w-[30px] h-[30px] rounded-[8px] bg-white border border-black/[0.07] shadow-[0_4px_12px_rgba(15,23,42,0.06)] flex items-center justify-center z-10 dark:bg-[#18181b] dark:border-white/10 dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)]';
const CHIP_ICON = 'w-[13px] h-[13px] text-[#374151] dark:text-[#d4d4d8]';
const HAIR = 'stroke-[rgba(11,13,16,0.06)] dark:stroke-white/10';
const HAIR_MAIN = 'stroke-[rgba(11,13,16,0.07)] dark:stroke-white/[0.11]';
const CROSS_BAR = 'absolute bg-[#374151]/45 dark:bg-[#a1a1aa]/45';

export function HeroDecorations() {
  const shouldReduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, '');
  const id = (name: string) => `${uid}-${name}`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none hidden lg:block absolute inset-x-0 top-[19px] h-[340px] overflow-hidden z-0"
    >
      {/* Subtle Upper Architectural Vertical Guides & Crosshairs */}
      <div className="max-w-[1040px] mx-auto relative h-full">
        <div className="absolute left-0 top-0 h-[110px] w-[1px] bg-gradient-to-b from-black/[0.06] dark:from-white/[0.08] to-transparent" />
        <div className="absolute right-0 top-0 h-[110px] w-[1px] bg-gradient-to-b from-black/[0.06] dark:from-white/[0.08] to-transparent" />
        <span className="absolute -left-[5px] -top-[5px] inline-flex w-[11px] h-[11px] items-center justify-center">
          <span className="relative w-full h-full">
            <span className={`${CROSS_BAR} left-1/2 top-0 -translate-x-1/2 w-[1px] h-full`} />
            <span className={`${CROSS_BAR} top-1/2 left-0 -translate-y-1/2 h-[1px] w-full`} />
          </span>
        </span>
        <span className="absolute -right-[5px] -top-[5px] inline-flex w-[11px] h-[11px] items-center justify-center">
          <span className="relative w-full h-full">
            <span className={`${CROSS_BAR} left-1/2 top-0 -translate-x-1/2 w-[1px] h-full`} />
            <span className={`${CROSS_BAR} top-1/2 left-0 -translate-y-1/2 h-[1px] w-full`} />
          </span>
        </span>
      </div>

      {/* Left Side Architectural Lines + Independent Flowing Blue Pulse */}
      <div className="absolute left-0 top-[16px] w-[280px] xl:w-[340px] h-[250px]">
        <svg
          viewBox="0 0 340 250"
          fill="none"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={id('l-main')} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
              <stop offset="45%" stopColor="#2563eb" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="1" />
            </linearGradient>
            <linearGradient id={id('l-top')} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Extra line, outer top-left: a short step at the very top */}
          <path d="M 75 0 L 75 18 A 22 22 0 0 1 53 40 L 0 40" className={HAIR} strokeWidth="1" />
          {!shouldReduceMotion && (
            <motion.path
              d="M 75 0 L 75 18 A 22 22 0 0 1 53 40 L 0 40"
              pathLength={100}
              stroke={`url(#${id('l-top')})`}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeDasharray="16 125"
              initial={{ strokeDashoffset: 19, opacity: 0 }}
              animate={{ strokeDashoffset: -103, opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                repeatDelay: 1.9,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.08, 0.9, 1],
                delay: 1.6,
              }}
            />
          )}

          {/* Upper-left stepped base hairline */}
          <path d="M 155 12 L 155 44 A 24 24 0 0 1 131 68 L 0 68" className={HAIR} strokeWidth="1" />

          {/* Upper-left flowing blue trace (top -> left edge) */}
          {!shouldReduceMotion && (
            <motion.path
              d="M 155 12 L 155 44 A 24 24 0 0 1 131 68 L 0 68"
              pathLength={100}
              stroke={`url(#${id('l-top')})`}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeDasharray="16 125"
              initial={{ strokeDashoffset: 19, opacity: 0 }}
              animate={{ strokeDashoffset: -103, opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                repeatDelay: 1.4,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.08, 0.9, 1],
                delay: 0.9,
              }}
            />
          )}

          {/* Main left base hairline */}
          <path d="M 0 100 L 236 100 A 32 32 0 0 1 268 132 L 268 226" className={HAIR_MAIN} strokeWidth="1" />

          {/* Main left flowing blue trace (left edge -> bottom endpoint) */}
          {shouldReduceMotion ? (
            <path d="M 268 190 L 268 212" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <motion.path
              d="M 0 100 L 236 100 A 32 32 0 0 1 268 132 L 268 226"
              pathLength={100}
              stroke={`url(#${id('l-main')})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="18 125"
              initial={{ strokeDashoffset: 21, opacity: 0 }}
              animate={{ strokeDashoffset: -103, opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 3.1,
                repeat: Infinity,
                repeatDelay: 0.9,
                ease: [0.25, 0.1, 0.25, 1],
                times: [0, 0.08, 0.9, 1],
                delay: 0.2,
              }}
            />
          )}

          {/* Extra line, inner lower-left: nested inside the main one */}
          <path d="M 0 148 L 196 148 A 28 28 0 0 1 224 176 L 224 236" className={HAIR_MAIN} strokeWidth="1" />
          {shouldReduceMotion ? (
            <path d="M 224 206 L 224 226" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <motion.path
              d="M 0 148 L 196 148 A 28 28 0 0 1 224 176 L 224 236"
              pathLength={100}
              stroke={`url(#${id('l-main')})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="18 125"
              initial={{ strokeDashoffset: 21, opacity: 0 }}
              animate={{ strokeDashoffset: -103, opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 3.0,
                repeat: Infinity,
                repeatDelay: 1.3,
                ease: [0.25, 0.1, 0.25, 1],
                times: [0, 0.08, 0.9, 1],
                delay: 2.1,
              }}
            />
          )}
        </svg>

        {/* Extra chip on the new top-left line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
          className={`${CHIP} left-[10px] xl:left-[15px] top-[25px]`}
        >
          <Headphones className={CHIP_ICON} strokeWidth={2} />
        </motion.div>

        {/* Floating waveform square chip sitting cleanly above left main line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          className={`${CHIP} left-[146px] xl:left-[182px] top-[85px]`}
        >
          <AudioLines className={CHIP_ICON} strokeWidth={2} />
        </motion.div>

        {/* Extra chip on the new lower-left line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
          className={`${CHIP} left-[84px] xl:left-[105px] top-[133px]`}
        >
          <Globe className={CHIP_ICON} strokeWidth={2} />
        </motion.div>
      </div>

      {/* Right Side Architectural Lines + Independent Flowing Blue Pulse */}
      <div className="absolute right-0 top-[16px] w-[280px] xl:w-[340px] h-[260px]">
        <svg
          viewBox="0 0 340 260"
          fill="none"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={id('r-top')} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="1" />
            </linearGradient>
            <linearGradient id={id('r-main')} x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
              <stop offset="45%" stopColor="#2563eb" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Extra line, outer top-right: a short step at the very top */}
          <path d="M 265 0 L 265 18 A 22 22 0 0 0 287 40 L 340 40" className={HAIR} strokeWidth="1" />
          {!shouldReduceMotion && (
            <motion.path
              d="M 265 0 L 265 18 A 22 22 0 0 0 287 40 L 340 40"
              pathLength={100}
              stroke={`url(#${id('r-top')})`}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeDasharray="16 125"
              initial={{ strokeDashoffset: 19, opacity: 0 }}
              animate={{ strokeDashoffset: -103, opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2.7,
                repeat: Infinity,
                repeatDelay: 1.7,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.08, 0.9, 1],
                delay: 1.1,
              }}
            />
          )}

          {/* Upper-right base hairline */}
          <path d="M 135 28 L 135 66 A 26 26 0 0 0 161 92 L 340 92" className={HAIR} strokeWidth="1" />

          {/* Upper-right flowing blue trace (top -> right edge) */}
          {!shouldReduceMotion && (
            <motion.path
              d="M 135 28 L 135 66 A 26 26 0 0 0 161 92 L 340 92"
              pathLength={100}
              stroke={`url(#${id('r-top')})`}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeDasharray="16 125"
              initial={{ strokeDashoffset: 19, opacity: 0 }}
              animate={{ strokeDashoffset: -103, opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 2.9,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: [0.22, 1, 0.36, 1],
                times: [0, 0.08, 0.9, 1],
                delay: 0.5,
              }}
            />
          )}

          {/* Main right base hairline */}
          <path d="M 340 160 L 112 160 A 32 32 0 0 0 80 192 L 80 250" className={HAIR_MAIN} strokeWidth="1" />

          {/* Main right flowing blue trace (right edge -> bottom endpoint) */}
          {shouldReduceMotion ? (
            <path d="M 140 160 L 160 160" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <motion.path
              d="M 340 160 L 112 160 A 32 32 0 0 0 80 192 L 80 250"
              pathLength={100}
              stroke={`url(#${id('r-main')})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="18 125"
              initial={{ strokeDashoffset: 21, opacity: 0 }}
              animate={{ strokeDashoffset: -103, opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 3.3,
                repeat: Infinity,
                repeatDelay: 1.1,
                ease: [0.25, 0.1, 0.25, 1],
                times: [0, 0.08, 0.9, 1],
                delay: 1.2,
              }}
            />
          )}

          {/* Extra line, inner lower-right: nested inside the main one */}
          <path d="M 340 208 L 144 208 A 28 28 0 0 0 116 236 L 116 258" className={HAIR_MAIN} strokeWidth="1" />
          {shouldReduceMotion ? (
            <path d="M 190 208 L 210 208" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <motion.path
              d="M 340 208 L 144 208 A 28 28 0 0 0 116 236 L 116 258"
              pathLength={100}
              stroke={`url(#${id('r-main')})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="18 125"
              initial={{ strokeDashoffset: 21, opacity: 0 }}
              animate={{ strokeDashoffset: -103, opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                repeatDelay: 1.0,
                ease: [0.25, 0.1, 0.25, 1],
                times: [0, 0.08, 0.9, 1],
                delay: 2.4,
              }}
            />
          )}
        </svg>

        {/* Extra chip on the new top-right line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          className={`${CHIP} right-[10px] xl:right-[15px] top-[25px]`}
        >
          <Waves className={CHIP_ICON} strokeWidth={2} />
        </motion.div>

        {/* Floating Mic square chip sitting cleanly above right upper line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className={`${CHIP} right-[112px] xl:right-[142px] top-[77px]`}
        >
          <Mic className={CHIP_ICON} strokeWidth={2} />
        </motion.div>

        {/* Floating serif 'A' square chip sitting cleanly above right main line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
          className={`${CHIP} right-[118px] xl:right-[152px] top-[145px]`}
        >
          <span className="font-serif text-[12px] font-semibold text-[#111827] dark:text-[#e4e4e7] leading-none">
            A
          </span>
        </motion.div>

        {/* Extra chip on the new lower-right line */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
          className={`${CHIP} right-[67px] xl:right-[85px] top-[193px]`}
        >
          <Terminal className={CHIP_ICON} strokeWidth={2} />
        </motion.div>
      </div>
    </div>
  );
}