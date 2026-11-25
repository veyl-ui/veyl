'use client';

import React, {useRef, useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {
  Command,
  CheckSquare,
  ShieldCheck,
  Search,
  CalendarClock,
  Send,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type {FeatureDefinition, FeatureId} from './features-data';
import {getIsolatedDockTransform} from './features-logic';

interface MacFloatingDockProps {
  features: FeatureDefinition[];
  activeId: FeatureId;
  onSelect: (id: FeatureId) => void;
  /** Dock icon for each feature id. Ids that are not listed use the built-in icon, or a sparkle. */
  icons?: Partial<Record<FeatureId, LucideIcon>>;
}

export const defaultFeatureIcons: Record<string, LucideIcon> = {
  capture: Command,
  actions: CheckSquare,
  privacy: ShieldCheck,
  search: Search,
  calendar: CalendarClock,
  digest: Send,
};

export default function MacFloatingDock({
  features,
  activeId,
  onSelect,
  icons,
}: MacFloatingDockProps) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [hoveredId, setHoveredId] = useState<FeatureId | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (index + 1) % features.length;
      onSelect(features[nextIdx].id);
      itemRefs.current[nextIdx]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (index - 1 + features.length) % features.length;
      onSelect(features[prevIdx].id);
      itemRefs.current[prevIdx]?.focus();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center pt-5 pb-2 select-none">
      {/* Subtle ambient base reflection below dock */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1 h-9 w-[420px] max-w-full rounded-full bg-black/[0.06] dark:bg-white/[0.03] blur-xl"
      />

      <nav
        aria-label="Feature switcher dock"
        onMouseLeave={() => setHoveredId(null)}
        className="relative z-20 flex items-center gap-3 sm:gap-5 rounded-[28px] bg-white/90 dark:bg-[#161618]/95 px-4 sm:px-7 py-3 border border-zinc-200/90 dark:border-white/[0.09] shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_24px_54px_rgba(0,0,0,0.78),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl transition-colors"
      >
        {features.map((feature, index) => {
          const Icon = icons?.[feature.id] ?? defaultFeatureIcons[feature.id] ?? Sparkles;
          const isActive = feature.id === activeId;
          const isHovered = feature.id === hoveredId;

          const {scale, y} = getIsolatedDockTransform(isHovered, isActive);

          return (
            <div key={feature.id} className="relative flex flex-col items-center">
              {/* Floating Tooltip strictly for the single hovered/focused icon */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{opacity: 0, y: 6, scale: 0.92}}
                    animate={{opacity: 1, y: y - 12, scale: 1}}
                    exit={{opacity: 0, y: 4, scale: 0.94}}
                    transition={{duration: 0.14, ease: [0.16, 1, 0.3, 1]}}
                    className="pointer-events-none absolute -top-9 z-30 whitespace-nowrap rounded-lg bg-zinc-900 dark:bg-[#222226] px-2.5 py-1 text-[11px] font-medium tracking-tight text-white dark:text-zinc-100 border border-zinc-800 dark:border-white/[0.1] shadow-[0_8px_20px_rgba(0,0,0,0.25)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                  >
                    {feature.dockLabel}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                aria-label={`${feature.indexLabel} ${feature.dockLabel}`}
                aria-pressed={isActive}
                onClick={() => onSelect(feature.id)}
                onMouseEnter={() => setHoveredId(feature.id)}
                onMouseLeave={() =>
                  setHoveredId((prev) => (prev === feature.id ? null : prev))
                }
                onFocus={() => setHoveredId(feature.id)}
                onBlur={() =>
                  setHoveredId((prev) => (prev === feature.id ? null : prev))
                }
                onKeyDown={(e) => handleKeyDown(e, index)}
                animate={{scale, y}}
                whileTap={{scale: scale * 0.94}}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 28,
                  mass: 0.55,
                }}
                className={`relative flex h-11 w-11 sm:h-[52px] sm:w-[52px] items-center justify-center rounded-full border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-[0_10px_24px_rgba(0,0,0,0.22)] dark:bg-zinc-100 dark:text-zinc-950 dark:border-white/80 dark:shadow-[0_10px_24px_rgba(0,0,0,0.55)]'
                    : isHovered
                      ? 'bg-zinc-100 text-zinc-950 border-zinc-300 dark:bg-[#2E2E34] dark:text-white dark:border-white/20'
                      : 'bg-[#F1F1F4] text-zinc-700 border-zinc-200/80 dark:bg-[#232327] dark:text-zinc-300 dark:border-white/[0.06]'
                }`}
              >
                <Icon className="h-5 w-5 stroke-[1.9]" />
              </motion.button>

              {/* Subtle macOS Dock active dot indicator */}
              <span
                aria-hidden="true"
                className={`mt-1.5 h-1 w-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-orange-500 dark:bg-orange-400 scale-100 opacity-100' : 'bg-transparent scale-0 opacity-0'
                }`}
              />
            </div>
          );
        })}
      </nav>
    </div>
  );
}