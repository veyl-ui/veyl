'use client';

import React, {useCallback, useEffect, useId, useRef, useState, type ReactNode} from 'react';
import {motion, AnimatePresence, MotionConfig} from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  SlidersHorizontal,
  Wifi,
  BatteryFull,
  type LucideIcon,
} from 'lucide-react';
import {cn} from '@/lib/utils';
import {FEATURES, type FeatureDefinition, type FeatureId} from './features-data';
import {stepFeatureIndex} from './features-logic';
import MacFloatingDock from './mac-floating-dock';
import FeatureBentoScreen from './feature-bento-screen';
import FeatureActionsScreen from './feature-actions-screen';
import FeaturePrivacyScreen from './feature-privacy-screen';
import FeatureSearchScreen from './feature-search-screen';
import FeatureCalendarScreen from './feature-calendar-screen';
import FeatureDigestScreen from './feature-digest-screen';
import './features-section.css';

export type FeaturesSectionProps = {
  /** The features. One dock icon and one screen each. Defaults to the six sample features. */
  features?: FeatureDefinition[];
  /** Dock icon for each feature id. Ids that are not listed use the built-in icon, or a sparkle. */
  icons?: Partial<Record<FeatureId, LucideIcon>>;
  /** Your own screen for a feature id. It replaces the built-in screen with that id. */
  screens?: Partial<Record<FeatureId, ReactNode>>;
  /** The pill above the heading. Clicking it moves to the next feature. Pass null to hide it. */
  badge?: ReactNode | null;
  /** The big heading. */
  title?: ReactNode;
  /** The line under the heading. */
  description?: ReactNode;
  /** The app name in the laptop's menu bar. */
  appName?: string;
  /** The small menu words next to the app name. */
  menuItems?: string[];
  /** The small label under the laptop screen. */
  deviceLabel?: string;
  /** Play the opening intro: the laptop lid opens, the screen lights up, then the contents appear. */
  intro?: boolean;
  /** Start with the automatic tour on. */
  autoTour?: boolean;
  /** Time on each feature during the tour, in ms. */
  tourInterval?: number;
  /** Make the block controlled: the feature id that is open. */
  activeId?: FeatureId;
  /** Called whenever the open feature changes. */
  onActiveChange?: (id: FeatureId) => void;
  className?: string;
};

export default function FeaturesSection({
  features = FEATURES,
  icons,
  screens,
  badge = 'Explore six local-first macOS capabilities',
  title = 'Every conversation, turned into clear action.',
  description = 'Switch through six distinct workspace layouts from the floating dock below—each crafted with live micro-interactions and continuous motion.',
  appName = 'Cadence',
  menuItems = ['File', 'Transcripts', 'Vault'],
  deviceLabel = 'MacBook Pro',
  intro = true,
  autoTour: autoTourStart = false,
  tourInterval = 6500,
  activeId: activeIdProp,
  onActiveChange,
  className,
}: FeaturesSectionProps) {
  const titleId = useId();
  const [innerId, setInnerId] = useState<FeatureId>(features[0]?.id ?? '');
  const [autoTour, setAutoTour] = useState(autoTourStart);
  const stageRef = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(!intro);

  // The lid opens once, when the laptop first comes into view.
  useEffect(() => {
    if (!intro) return;
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setOpened(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOpened(true);
          observer.disconnect();
        }
      },
      {rootMargin: '0px 0px -15% 0px'}
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [intro]);

  const activeId = activeIdProp ?? innerId;
  const activeIndex = Math.max(
    0,
    features.findIndex((f) => f.id === activeId)
  );
  const activeFeature = features[activeIndex];

  const onSelectActiveId = useCallback(
    (id: FeatureId) => {
      setInnerId(id);
      onActiveChange?.(id);
    },
    [onActiveChange]
  );

  useEffect(() => {
    if (!autoTour || !opened || features.length < 2) return;
    const timer = setInterval(() => {
      const nextIdx = stepFeatureIndex(activeIndex, 1, features.length);
      onSelectActiveId(features[nextIdx].id);
    }, tourInterval);
    return () => clearInterval(timer);
  }, [autoTour, opened, activeIndex, features, tourInterval, onSelectActiveId]);

  if (!activeFeature) return null;

  const handleStep = (delta: number) => {
    const nextIdx = stepFeatureIndex(activeIndex, delta, features.length);
    onSelectActiveId(features[nextIdx].id);
  };

  const renderScreenContent = (): ReactNode => {
    if (screens && screens[activeId] !== undefined) return screens[activeId];
    switch (activeId) {
      case 'capture':
        return <FeatureBentoScreen />;
      case 'actions':
        return <FeatureActionsScreen />;
      case 'privacy':
        return <FeaturePrivacyScreen />;
      case 'search':
        return <FeatureSearchScreen />;
      case 'calendar':
        return <FeatureCalendarScreen />;
      case 'digest':
        return <FeatureDigestScreen />;
      default:
        return null;
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby={titleId}
        className={cn(
          'relative mx-auto w-full max-w-[1240px] px-4 pt-6 pb-12 sm:px-6 lg:px-8',
          className
        )}
      >
        {/* Section Header with beveled announcement badge */}
        <div className="mx-auto max-w-2xl text-center">
          {badge ? (
            <button
              type="button"
              onClick={() => handleStep(1)}
              className="group inline-flex items-center gap-2 rounded-full border border-zinc-200/90 dark:border-white/[0.12] bg-gradient-to-b from-white to-[#F3F3F5] dark:from-[#1E1E22] dark:to-[#141417] px-4 py-1.5 text-[13px] font-medium text-zinc-800 dark:text-zinc-200 shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_-1px_0_rgba(0,0,0,0.06)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.6)] transition-all hover:border-zinc-300 dark:hover:border-white/25 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
            >
              <span>{badge}</span>
              <ChevronRight className="h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-zinc-800 dark:group-hover:text-zinc-200" />
            </button>
          ) : null}

          <h2
            id={titleId}
            className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-4xl [text-wrap:balance]"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-[15px] [text-wrap:balance]">
              {description}
            </p>
          ) : null}
        </div>

        {/* Realistic MacBook Pro Hardware Assembly (Silver in Light Mode, Space Black in Dark Mode) */}
        <div
          ref={stageRef}
          data-open={intro ? String(opened) : undefined}
          className="fs-stage relative mt-7"
        >
          {/* Outer Aluminum Lid Shell */}
          <div className="fs-lid relative rounded-t-[26px] rounded-b-[14px] bg-gradient-to-b from-[#D4D4D8] via-[#B4B4BC] to-[#9898A2] dark:from-[#3A3A42] dark:via-[#222228] dark:to-[#18181C] p-[2px] shadow-[0_28px_80px_rgba(0,0,0,0.16),0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_36px_100px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.05)]">
            {/* Inner Pure-Black Display Glass Bezel */}
            <div className="relative rounded-t-[24px] rounded-b-[12px] bg-[#0B0B0E] dark:bg-[#040406] p-2.5 sm:p-3.5">
              {/* Realistic Top Display Camera Notch */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-2.5 sm:top-3.5 left-1/2 z-30 hidden sm:flex h-[22px] w-36 -translate-x-1/2 items-center justify-center gap-2 rounded-b-[10px] bg-[#0B0B0E] dark:bg-[#040406] shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
              >
                <span className="relative flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#0C131C] ring-1 ring-white/10">
                  <span className="h-1 w-1 rounded-full bg-sky-400/50" />
                </span>
                <span className="h-1 w-1 rounded-full bg-zinc-700 dark:bg-zinc-800" />
              </div>

              {/* Inner Lit macOS Display Canvas */}
              <div className="fs-screen relative overflow-hidden rounded-[14px] border border-black/20 dark:border-white/[0.08] bg-white dark:bg-[#0B0B0E] transition-colors">
                {/* macOS Menu Bar + App Window Controls */}
                <div className="relative flex h-9 items-center justify-between border-b border-zinc-200/80 dark:border-white/[0.06] bg-[#F5F5F7]/95 dark:bg-[#121216]/95 px-3.5">
                  {/* Left: Traffic Lights + macOS App Menu */}
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center gap-1.5" aria-hidden="true">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57] ring-1 ring-black/10" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E] ring-1 ring-black/10" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#28C840] ring-1 ring-black/10" />
                    </div>
                    <div className="hidden md:flex items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                        {appName}
                      </span>
                      {menuItems.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Tour Controls + Subtle macOS Menu Bar Icons */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAutoTour((prev) => !prev)}
                      aria-pressed={autoTour}
                      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-white/[0.09] cursor-pointer whitespace-nowrap"
                    >
                      {autoTour ? (
                        <>
                          <Pause className="h-3 w-3 text-orange-500 dark:text-orange-400" />
                          <span>Pause Tour</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 text-zinc-700 dark:text-zinc-300" />
                          <span>Auto Tour</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStep(-1)}
                        aria-label="Previous feature"
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-white/[0.09] cursor-pointer"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStep(1)}
                        aria-label="Next feature"
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-white/[0.09] cursor-pointer"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div
                      aria-hidden="true"
                      className="hidden sm:flex items-center gap-2 border-l border-zinc-200 dark:border-white/[0.07] pl-2.5 text-zinc-600 dark:text-zinc-400"
                    >
                      <Wifi className="h-3.5 w-3.5" />
                      <BatteryFull className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Tall Laptop Inner Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[600px]">
                  {/* Left Feature Explanation Column */}
                  <div
                    style={{'--i': 0} as React.CSSProperties}
                    className="fs-rise flex flex-col justify-between border-b border-zinc-200/80 dark:border-white/[0.06] bg-[#FAFAFC] dark:bg-[#0F0F12] p-5 sm:p-6 lg:col-span-4 lg:border-b-0 lg:border-r"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeFeature.id}
                        initial={{opacity: 0, y: 8}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -8}}
                        transition={{duration: 0.2, ease: [0.16, 1, 0.3, 1]}}
                        className="flex flex-1 flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 text-xs text-zinc-500">
                            <span className="font-mono tabular-nums font-semibold text-orange-600 dark:text-orange-400 shrink-0">
                              {activeFeature.indexLabel} / {String(features.length).padStart(2, '0')}
                            </span>
                            <span className="truncate">{activeFeature.layoutStyleLabel}</span>
                          </div>

                          <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-2xl [text-wrap:balance]">
                            {activeFeature.title}
                          </h3>

                          <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                            {activeFeature.description}
                          </p>

                          {/* Clean unboxed highlights */}
                          <dl className="mt-5 space-y-2.5 border-t border-zinc-200/80 dark:border-white/[0.06] pt-4 text-xs">
                            {activeFeature.highlights.map((item) => (
                              <div
                                key={item.label}
                                className="flex items-baseline justify-between gap-3"
                              >
                                <dt className="font-medium text-zinc-900 dark:text-zinc-200 shrink-0">
                                  {item.label}
                                </dt>
                                <dd className="text-right text-zinc-600 dark:text-zinc-400">
                                  {item.detail}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>

                        {/* "Something additional" bottom-left anchor */}
                        <div className="mt-6 rounded-xl border border-zinc-200/90 dark:border-white/[0.08] bg-white dark:bg-[#151519] p-3.5 shadow-2xs dark:shadow-none">
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 shrink-0">
                              <SlidersHorizontal className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400 shrink-0" />
                              {activeFeature.additionalTitle}
                            </span>
                            <span className="font-mono text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                              {activeFeature.additionalValue}
                            </span>
                          </div>
                          <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                            {activeFeature.additionalHint}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Right Content Canvas (Distinct design per Feature) */}
                  <div
                    style={{'--i': 1} as React.CSSProperties}
                    className="fs-rise relative bg-[#F4F4F7] dark:bg-[#0B0B0E] p-4 sm:p-5 lg:col-span-8"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeId}
                        initial={{opacity: 0, y: 10, scale: 0.99}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: -8, scale: 0.99}}
                        transition={{duration: 0.22, ease: [0.16, 1, 0.3, 1]}}
                        className="h-full"
                      >
                        {renderScreenContent()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Subtle laptop chin bar below screen */}
              {deviceLabel ? (
                <div
                  aria-hidden="true"
                  className="flex h-3.5 items-center justify-center pt-1"
                >
                  <span className="text-[8px] font-medium tracking-[0.22em] text-zinc-500 dark:text-zinc-600 uppercase">
                    {deviceLabel}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Machined Aluminum Lower Deck / Hinge */}
          <div aria-hidden="true" className="relative mx-auto w-[104%] -ml-[2%]">
            <div className="mx-auto h-1 w-[94%] bg-zinc-400/50 dark:bg-black/80" />
            <div className="relative h-4 rounded-b-[16px] rounded-t-[3px] border-x border-b border-zinc-300 dark:border-white/[0.1] bg-gradient-to-b from-[#F4F4F6] via-[#D4D4DA] to-[#AEAEB6] dark:from-[#34343B] dark:via-[#222227] dark:to-[#121215] shadow-[0_14px_34px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.85)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.16)]">
              {/* Centered Thumb Opening Groove */}
              <div className="mx-auto h-2 w-28 rounded-b-lg border-x border-b border-zinc-400/50 dark:border-white/[0.06] bg-gradient-to-b from-[#C6C6CE] to-[#DCDCE2] dark:from-[#131317] dark:to-[#1C1C22] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.85)]" />
            </div>
            <div className="mx-auto flex w-[88%] justify-between px-6">
              <span className="h-1 w-10 rounded-b-md bg-zinc-400 dark:bg-zinc-900" />
              <span className="h-1 w-10 rounded-b-md bg-zinc-400 dark:bg-zinc-900" />
            </div>
          </div>

          {/* Floating macOS Dock positioned cleanly below the laptop base */}
          <div className="fs-dock relative mt-4 z-20">
            <MacFloatingDock
              features={features}
              activeId={activeId}
              onSelect={onSelectActiveId}
              icons={icons}
            />
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

export {FeaturesSection};